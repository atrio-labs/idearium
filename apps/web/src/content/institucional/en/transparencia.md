---
titulo: "Transparency"
descricao: "How Idearium is funded, what it never does with money, and what we do with your data."
rascunho: true
atualizado: 2026-10-10
---

<!-- fonte: VISAO §11 -->
## The money never comes from the people who use it

Idearium is free forever. Free means free: not freemium, not "free with limits". There is no premium tier and there are no ads.

## How the project is funded

The plan has three phases.

**Launch (0 to 6 months).** No revenue. The VISAO estimate for total cost is US$ 20 to 30 per month (managed Postgres, app hosting, domain and transactional email), paid out of pocket by the maintainers.

**Supporters (6 to 12 months).** A public support page, through OpenCollective or Liberapay, with costs in the open. The VISAO goal is to cover infrastructure comfortably with a few dozen individual supporters.

**Institutional (from 12 months).** Applications for small grants: open source support programs, Lusophone foundations with a civic tech agenda, and university extension calls.

The figures above are VISAO estimates, not results.

## Actual costs

The actual monthly infrastructure cost will be published here. **Status: to be published.**

## What we will never do

- Charge the people who use it.
- Take a percentage of transactions.
- Sell data or ads.
- Create a premium tier.
- Accept sponsorship that compromises editorial neutrality.

## No financial mediation

The platform does not touch money between people: no fees, no revenue share, no brokered bounties. People who build here are volunteers. Whoever wants to be paid arranges that outside Idearium.

## Privacy and data

*This section is a draft for the maintainers to review. It describes what the code does today and must be reviewed with every change.*

**What we ask to create an account.** Only three things: email, username (`@username`) and password. We do not ask for ID, phone number or any required link to outside networks. Full name and bio are optional, and only appear if you fill them in.

**Pseudonymous by default.** The `@username` is what appears everywhere.

**Password.** We store only a hash of the password, never the password itself.

**Cookies.** We use three, all to keep you signed in, none to track you:

- `id_acesso`: proves the session is yours. Not readable by JavaScript (`httpOnly`) and lasts a few minutes.
- `id_renova`: renews access without asking for the password again. Also `httpOnly`, and lasts up to 30 days. When you sign out, it is revoked on the server.
- `id_quem`: holds only your `@username`, which is already public. The menu uses it to show that you are signed in. This one is readable by JavaScript, on purpose.

We use no advertising cookies and no visit analytics tools.

**Fonts.** Inter, Newsreader and Departure Mono are served from our own server. No page requests anything from Google Fonts, so your IP address does not go there just because you opened Idearium.

**Selling data.** We do not sell data. This is one of the project's principles, listed in the anti-models above.

**What is public.** RFCs, comments, enrollments (including leaving) and version history are public by design, under CC BY-SA 4.0. Do not write anything there that you do not want to be public.
