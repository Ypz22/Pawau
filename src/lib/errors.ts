export interface ErrorDetails {
  message: string;
  errors?: Record<string, string>;
}

export class AppError extends Error {
  errors?: Record<string, string>;

  constructor(message: string, options?: { errors?: Record<string, string> }) {
    super(message);
    this.name = 'AppError';
    this.errors = options?.errors;
  }
}

export function toErrorDetails(error: unknown, fallbackMessage: string): ErrorDetails {
  if (error instanceof AppError) {
    return {
      message: error.message,
      errors: error.errors,
    };
  }

  if (error instanceof Error && error.message) {
    return { message: error.message };
  }

  if (typeof error === 'object' && error !== null) {
    const payload = error as Partial<ErrorDetails>;

    if (typeof payload.message === 'string') {
      return {
        message: payload.message,
        errors: payload.errors,
      };
    }
  }

  return { message: fallbackMessage };
}
