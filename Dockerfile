# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.10.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile --dangerously-allow-all-builds

FROM deps AS build
ARG NUXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
ARG NUXT_PUBLIC_USE_MOCK_API=false
ARG NUXT_PUBLIC_REQUEST_TIMEOUT_MS=15000
ENV NUXT_PUBLIC_API_BASE_URL=$NUXT_PUBLIC_API_BASE_URL \
    NUXT_PUBLIC_USE_MOCK_API=$NUXT_PUBLIC_USE_MOCK_API \
    NUXT_PUBLIC_REQUEST_TIMEOUT_MS=$NUXT_PUBLIC_REQUEST_TIMEOUT_MS
COPY . .
RUN pnpm exec nuxt prepare && pnpm run build

FROM nginx:1.27-alpine AS production
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.output/public/ /usr/share/nginx/html/
EXPOSE 80
