---
titulo: "Privacy policy"
descricao: "Which data Idearium keeps, what for, for how long, and how you exercise your rights."
rascunho: false
atualizado: 2026-10-10
---

*Version of 10 October 2026. This text describes what the code does today and is reviewed with every change.*

## Who is responsible for the data

Idearium is run by a volunteer team. The data controller and the data protection officer (DPO), with the contact details that Brazil’s LGPD requires, will be published here before launch. Until then, send any request about your data to [mantenedores@idearium.example](mailto:mantenedores@idearium.example).

## What we ask for

To create an account, only three things: email, username (`@username`) and password. We do not ask for ID or a phone number, and no outside network is required. Full name, bio, photo, hand profile and preferred language are optional and only appear if you fill them in.

If you sign in with GitHub or Google, we use that login only to sign in. Name and photo from there do not come here.

## What we use it for

- **Email:** signing in, password recovery, email confirmation and notices about the account itself.
- **Password:** we store only a hash, never the password itself.
- **Optional profile:** to show what you chose to show.
- **What you publish:** to display ideas, versions, comments and enrollments.

We do not sell data, we do not hand it over for advertising and we use no third-party analytics tools.

## Pseudonym

The `@username` is the only identity shown on the site. Email and password never appear. Pick a name you are comfortable seeing tied to what you write.

## Cookies

We use four, all so the site works, none to track you:

- `id_acesso`: proves the session is yours. `httpOnly` (JavaScript cannot read it) and lasts a few minutes.
- `id_renova`: renews access without asking for the password again. `httpOnly`, lasts up to 30 days and is revoked on the server when you sign out.
- `idioma_sugestao`: remembers that you dismissed the invitation to read in another language. Lasts one year.
- `id_oauth`: exists only while you sign in with GitHub or Google, to protect the return from the login. Lasts a few minutes.

We use no advertising cookies. The Inter typeface is served from our own server, so your IP address does not go to Google Fonts.

## What is public

RFCs, versions, comments and enrollments (including leaving) are public by design and published under CC BY-SA 4.0. Do not write anything there that you do not want to be public. The license details are in the [terms of use](/en/termos).

## How long we keep it

Account data stays as long as the account exists. When you delete the account, personal data goes away. What you published stays in the history, anonymized as “[conta removida]”. Retention periods for logs and backups will be published here before launch.

## Your rights

Under the LGPD (art. 18) you can:

- confirm that we process data about you and access it;
- correct incomplete or wrong data;
- ask for portability: in your profile, in the “your data” section, there is a button to download everything as JSON;
- ask for your personal data to be erased: at `/excluir-conta`;
- ask who we share data with (today, no one besides the host of the service);
- revoke consents and complain to Brazil’s data protection authority (ANPD).

If any of these buttons is not available yet, or if you prefer, write to [mantenedores@idearium.example](mailto:mantenedores@idearium.example). We answer within the legal deadlines.

## Changes

Changes to this text go through public proposal, like the rest of the project. The date at the top says which version is in force.
