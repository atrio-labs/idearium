# Idearium Web (Astro SSR, @astrojs/node standalone) — production image
# Build: docker build -f apps/web/Dockerfile -t idearium-web .
# Context esperado: raiz do monorepo
# Run:   docker run --rm -p 4321:4321 idearium-web   (PUBLIC_API_URL é build arg: --build-arg PUBLIC_API_URL=...)

FROM node:22-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci --workspace=@idearium/web --include-workspace-root

FROM node:22-alpine AS builder
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY package.json tsconfig.base.json ./
COPY apps/web ./apps/web
# PUBLIC_* é inlinado no bundle em build time: informe a URL pública da API
# no build (--build-arg PUBLIC_API_URL=...). Sem ela, o default é localhost:3000.
ARG PUBLIC_API_URL
ENV PUBLIC_API_URL=${PUBLIC_API_URL}
RUN npm run build -w @idearium/web

FROM node:22-alpine AS prod-deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
RUN npm ci --workspace=@idearium/web --include-workspace-root --omit=dev

FROM node:22-alpine AS runner
ENV NODE_ENV=production HOST=0.0.0.0 PORT=4321
WORKDIR /repo
COPY --from=prod-deps /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/web/dist ./apps/web/dist
COPY apps/web/package.json ./apps/web/package.json
USER node
EXPOSE 4321
CMD ["node", "apps/web/dist/server/entry.mjs"]
