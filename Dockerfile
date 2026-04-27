FROM node:20-bookworm AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-bookworm AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --build-from-source && npm rebuild sqlite3 --build-from-source && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server

RUN mkdir -p /app/server/data && chown -R node:node /app

USER node

EXPOSE 3001

CMD ["npm", "start"]