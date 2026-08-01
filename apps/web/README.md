# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Rodar com a API

As páginas públicas são pré-renderizadas, então **a API precisa estar no ar
durante `dev` e durante `build`** — é dela que saem as rotas de `/rfcs/:slug`,
`/labs/:slug` e `/users/:username`.

```bash
# 1. banco
docker run -d --name idearium-postgres \
  -e POSTGRES_DB=idearium -e POSTGRES_USER=idearium -e POSTGRES_PASSWORD=idearium_dev \
  -p 5432:5432 -v idearium_postgres_data:/var/lib/postgresql/data postgres:16-alpine

# 2. api
cp apps/api/.env.example apps/api/.env      # gerar JWT_ACCESS_SECRET
cd apps/api && npx prisma generate && npx prisma migrate deploy && npx prisma db seed
npm run dev:api                              # :3000

# 3. web
npm run dev:web                              # :4321
```

Apontar para outra API: `PUBLIC_API_URL=http://host:porta npm run build:web`.

Com a API fora do ar o build **não quebra**: as páginas saem com aviso e o log
avisa quais rotas deixaram de ser geradas. Confira esse aviso antes de publicar.
