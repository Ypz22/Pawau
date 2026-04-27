import cors from 'cors';
import crypto from 'node:crypto';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT ?? 3001);
const DB_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'appointments.db');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@pawau.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? 'admin1234';
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? 'pawau-admin-secret';

const PET_TYPES = ['perro', 'gato', 'otro'];
const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];
const SERVICES = [
  {
    id: 'grooming',
    name: 'Grooming Completo',
    description: 'Corte, bano, limpieza de oidos y unas.',
    duration: 120,
    price: 45,
  },
  {
    id: 'bath',
    name: 'Bano Spa',
    description: 'Bano relajante con secado y cepillado.',
    duration: 90,
    price: 25,
  },
  {
    id: 'nails',
    name: 'Solo Unas',
    description: 'Corte de unas y retoque higienico rapido.',
    duration: 45,
    price: 15,
  },
];

const SETTINGS = {
  openingHour: 9,
  closingHour: 18,
  slotIntervalMinutes: 30,
  maxAppointmentsPerSlot: 1,
  closedWeekdays: [0],
};

function toDateTimeParts(date, time) {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return { year, month, day, hours, minutes };
}

function createLocalDate(date, time = '00:00') {
  const { year, month, day, hours, minutes } = toDateTimeParts(date, time);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function toIso(date, time) {
  return createLocalDate(date, time).toISOString();
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60_000);
}

function formatTime(date) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function isClosedDay(dateString) {
  return SETTINGS.closedWeekdays.includes(createLocalDate(dateString).getDay());
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

function signAdminPayload(payload) {
  return crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payload)
    .digest('hex');
}

function createAdminToken(email) {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    })
  ).toString('base64url');

  const signature = signAdminPayload(payload);
  return `${payload}.${signature}`;
}

function verifyAdminToken(token) {
  const [payload, signature] = token.split('.');

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = signAdminPayload(payload);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));

    if (!parsed?.email || !parsed?.exp || parsed.exp < Date.now()) {
      return null;
    }

    return {
      email: parsed.email,
      exp: parsed.exp,
    };
  } catch {
    return null;
  }
}

function getAuthToken(req) {
  const authorization = req.headers.authorization ?? '';

  if (!authorization.startsWith('Bearer ')) {
    return '';
  }

  return authorization.slice(7);
}

function requireAdmin(req, res, next) {
  const token = getAuthToken(req);
  const session = verifyAdminToken(token);

  if (!token || !session) {
    return res.status(401).json({ message: 'No autorizado.' });
  }

  req.adminSession = session;
  return next();
}

async function getDatabase() {
  fs.mkdirSync(DB_DIR, { recursive: true });

  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_name TEXT NOT NULL,
      owner_phone TEXT NOT NULL,
      owner_email TEXT NOT NULL,
      pet_name TEXT NOT NULL,
      pet_type TEXT NOT NULL,
      service_id TEXT NOT NULL,
      appointment_date TEXT NOT NULL,
      appointment_time TEXT NOT NULL,
      start_at TEXT NOT NULL,
      end_at TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  return db;
}

function validateAppointmentPayload(payload) {
  const errors = {};

  if (!payload.ownerName?.trim()) errors.ownerName = 'Ingresa el nombre del cliente.';
  if (!payload.ownerPhone?.trim()) errors.ownerPhone = 'Ingresa un telefono de contacto.';
  if (!payload.ownerEmail?.trim()) errors.ownerEmail = 'Ingresa un correo electronico.';
  if (!payload.petName?.trim()) errors.petName = 'Ingresa el nombre de la mascota.';
  if (!PET_TYPES.includes(payload.petType)) errors.petType = 'Selecciona un tipo de mascota valido.';
  if (!payload.serviceId) errors.serviceId = 'Selecciona un servicio.';
  if (!payload.date) errors.date = 'Selecciona una fecha.';
  if (!payload.time) errors.time = 'Selecciona una hora.';

  const service = SERVICES.find((item) => item.id === payload.serviceId);
  if (!service) errors.serviceId = 'El servicio seleccionado no existe.';

  if (payload.date && payload.time) {
    const now = new Date();
    const selectedDate = createLocalDate(payload.date, payload.time);

    if (Number.isNaN(selectedDate.getTime())) {
      errors.date = 'La fecha u hora no es valida.';
    } else if (selectedDate <= now) {
      errors.time = 'La cita debe programarse en el futuro.';
    } else if (isClosedDay(payload.date)) {
      errors.date = 'No atendemos en la fecha seleccionada.';
    }
  }

  return { errors, service };
}

async function loadAppointmentsByDate(db, date) {
  return db.all(
    `SELECT * FROM appointments
     WHERE appointment_date = ?
       AND status IN ('pending', 'confirmed')
     ORDER BY appointment_time ASC`,
    date
  );
}

function buildAvailableSlots(existingAppointments, date, service) {
  if (!date || !service || isClosedDay(date)) {
    return [];
  }

  const startOfDay = createLocalDate(date, `${String(SETTINGS.openingHour).padStart(2, '0')}:00`);
  const endOfDay = createLocalDate(date, `${String(SETTINGS.closingHour).padStart(2, '0')}:00`);
  const now = new Date();
  const slots = [];

  for (
    let slotStart = new Date(startOfDay);
    addMinutes(slotStart, service.duration) <= endOfDay;
    slotStart = addMinutes(slotStart, SETTINGS.slotIntervalMinutes)
  ) {
    const slotEnd = addMinutes(slotStart, service.duration);
    const isPast = slotStart <= now;

    const conflicts = existingAppointments.filter((appointment) =>
      overlaps(slotStart, slotEnd, new Date(appointment.start_at), new Date(appointment.end_at))
    );

    if (!isPast && conflicts.length < SETTINGS.maxAppointmentsPerSlot) {
      slots.push(formatTime(slotStart));
    }
  }

  return slots;
}

function serializeAppointmentWithService(appointment) {
  const service = SERVICES.find((item) => item.id === appointment.service_id);

  return {
    ...appointment,
    service_name: service?.name ?? appointment.service_id,
    service_duration: service?.duration ?? null,
    service_price: service?.price ?? null,
  };
}

function getStatusSummary(appointments) {
  return {
    pending: appointments.filter((appointment) => appointment.status === 'pending').length,
    confirmed: appointments.filter((appointment) => appointment.status === 'confirmed').length,
    cancelled: appointments.filter((appointment) => appointment.status === 'cancelled').length,
    completed: appointments.filter((appointment) => appointment.status === 'completed').length,
    total: appointments.length,
  };
}

async function loadAppointmentById(id) {
  return db.get('SELECT * FROM appointments WHERE id = ?', id);
}

const db = await getDatabase();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/services', (_req, res) => {
  res.json({
    services: SERVICES,
    settings: SETTINGS,
  });
});

app.post('/api/admin/login', (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase();
  const password = String(req.body?.password ?? '');

  if (email !== ADMIN_EMAIL.toLowerCase() || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Credenciales inválidas.' });
  }

  const token = createAdminToken(ADMIN_EMAIL);

  return res.json({
    token,
    admin: {
      email: ADMIN_EMAIL,
    },
  });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  res.json({
    admin: req.adminSession,
  });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  res.json({ ok: true });
});

app.get('/api/availability', async (req, res) => {
  const date = String(req.query.date ?? '');
  const serviceId = String(req.query.serviceId ?? '');
  const service = SERVICES.find((item) => item.id === serviceId);

  if (!date || !service) {
    return res.status(400).json({ message: 'Fecha y servicio son obligatorios.' });
  }

  const appointments = await loadAppointmentsByDate(db, date);
  const slots = buildAvailableSlots(appointments, date, service);

  return res.json({ slots });
});

app.get('/api/appointments', async (req, res) => {
  const date = String(req.query.date ?? '').trim();
  const status = String(req.query.status ?? '').trim();

  let query = `
    SELECT * FROM appointments
    WHERE 1 = 1
  `;
  const values = [];

  if (date) {
    query += ' AND appointment_date = ?';
    values.push(date);
  }

  if (status && APPOINTMENT_STATUSES.includes(status)) {
    query += ' AND status = ?';
    values.push(status);
  }

  query += ' ORDER BY appointment_date ASC, appointment_time ASC, created_at DESC';

  const appointments = await db.all(query, values);
  return res.json({ appointments });
});

app.get('/api/admin/appointments', requireAdmin, async (req, res) => {
  const date = String(req.query.date ?? '').trim();
  const status = String(req.query.status ?? '').trim();

  let query = `
    SELECT * FROM appointments
    WHERE 1 = 1
  `;
  const values = [];

  if (date) {
    query += ' AND appointment_date = ?';
    values.push(date);
  }

  if (status && APPOINTMENT_STATUSES.includes(status)) {
    query += ' AND status = ?';
    values.push(status);
  }

  query += ' ORDER BY appointment_date ASC, appointment_time ASC, created_at DESC';

  const appointments = await db.all(query, values);

  res.json({
    appointments: appointments.map(serializeAppointmentWithService),
    summary: getStatusSummary(appointments),
  });
});

app.get('/api/admin/overview', requireAdmin, async (_req, res) => {
  const appointments = await db.all(
    `SELECT * FROM appointments
     ORDER BY appointment_date ASC, appointment_time ASC, created_at DESC`
  );
  const upcoming = appointments
    .filter((appointment) => new Date(appointment.start_at) >= new Date())
    .slice(0, 5)
    .map(serializeAppointmentWithService);

  res.json({
    summary: getStatusSummary(appointments),
    upcoming,
  });
});

app.post('/api/appointments', async (req, res) => {
  const payload = req.body ?? {};
  const { errors, service } = validateAppointmentPayload(payload);

  if (Object.keys(errors).length > 0 || !service) {
    return res.status(400).json({ message: 'Revisa los datos ingresados.', errors });
  }

  const appointments = await loadAppointmentsByDate(db, payload.date);
  const availableSlots = buildAvailableSlots(appointments, payload.date, service);

  if (!availableSlots.includes(payload.time)) {
    return res.status(409).json({
      message: 'La hora seleccionada ya no esta disponible. Elige otra opcion.',
    });
  }

  const startAt = toIso(payload.date, payload.time);
  const endAt = addMinutes(createLocalDate(payload.date, payload.time), service.duration).toISOString();

  const result = await db.run(
    `INSERT INTO appointments (
      owner_name,
      owner_phone,
      owner_email,
      pet_name,
      pet_type,
      service_id,
      appointment_date,
      appointment_time,
      start_at,
      end_at,
      notes,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      payload.ownerName.trim(),
      payload.ownerPhone.trim(),
      payload.ownerEmail.trim(),
      payload.petName.trim(),
      payload.petType,
      payload.serviceId,
      payload.date,
      payload.time,
      startAt,
      endAt,
      payload.notes?.trim() ?? '',
    ]
  );

  const appointment = await db.get('SELECT * FROM appointments WHERE id = ?', result.lastID);
  return res.status(201).json({
    message: 'Cita creada correctamente.',
    appointment,
  });
});

app.patch('/api/appointments/:id/status', async (req, res) => {
  const id = Number(req.params.id);
  const status = String(req.body?.status ?? '');

  if (!Number.isInteger(id) || !APPOINTMENT_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Solicitud invalida.' });
  }

  const result = await db.run('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);

  if (result.changes === 0) {
    return res.status(404).json({ message: 'No se encontro la cita.' });
  }

  const appointment = await db.get('SELECT * FROM appointments WHERE id = ?', id);
  return res.json({
    message: 'Estado actualizado.',
    appointment,
  });
});

app.patch('/api/admin/appointments/:id/status', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const status = String(req.body?.status ?? '');

  if (!Number.isInteger(id) || !APPOINTMENT_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Solicitud invalida.' });
  }

  const result = await db.run('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);

  if (result.changes === 0) {
    return res.status(404).json({ message: 'No se encontro la cita.' });
  }

  const appointment = await loadAppointmentById(id);

  res.json({
    message: 'Estado actualizado.',
    appointment: serializeAppointmentWithService(appointment),
  });
});

app.patch('/api/admin/appointments/:id/reschedule', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const date = String(req.body?.date ?? '').trim();
  const time = String(req.body?.time ?? '').trim();

  if (!Number.isInteger(id) || !date || !time) {
    return res.status(400).json({ message: 'Fecha y hora son obligatorias.' });
  }

  const appointment = await loadAppointmentById(id);

  if (!appointment) {
    return res.status(404).json({ message: 'No se encontro la cita.' });
  }

  const service = SERVICES.find((item) => item.id === appointment.service_id);

  if (!service) {
    return res.status(400).json({ message: 'El servicio de la cita no es valido.' });
  }

  if (isClosedDay(date)) {
    return res.status(400).json({ message: 'No atendemos en la fecha seleccionada.' });
  }

  const selectedDate = createLocalDate(date, time);

  if (Number.isNaN(selectedDate.getTime())) {
    return res.status(400).json({ message: 'La fecha u hora no es valida.' });
  }

  const dayAppointments = await db.all(
    `SELECT * FROM appointments
     WHERE appointment_date = ?
       AND status IN ('pending', 'confirmed')
       AND id != ?`,
    [date, id]
  );

  const availableSlots = buildAvailableSlots(dayAppointments, date, service);

  if (!availableSlots.includes(time)) {
    return res.status(409).json({ message: 'Ese horario no esta disponible para reprogramar.' });
  }

  const startAt = toIso(date, time);
  const endAt = addMinutes(createLocalDate(date, time), service.duration).toISOString();

  await db.run(
    `UPDATE appointments
     SET appointment_date = ?, appointment_time = ?, start_at = ?, end_at = ?, status = 'confirmed'
     WHERE id = ?`,
    [date, time, startAt, endAt, id]
  );

  const updatedAppointment = await loadAppointmentById(id);

  res.json({
    message: 'Cita reprogramada correctamente.',
    appointment: serializeAppointmentWithService(updatedAppointment),
  });
});

const CLIENT_DIST = path.resolve(__dirname, '..', 'dist');

if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));

  app.get('/*', (_req, res) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Appointment API running on http://localhost:${PORT}`);
});
