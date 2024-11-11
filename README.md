# FUBBS
## Movie Night 

- [main branch](https://fubbs.vercel.app/)

movie night repo. runs in astro v.50 (beta), on vercel with remote db on turso. uses astro integration with astrodb and tailwind and probably a front end library???

if using pnpm, run 
`npm install sharp`
after install.

commands to use after installing:

- `pnpm astro run dev` -> runs the project and seeds local db with values from `db/data.ts`
  - **this is the current version of the ratings list as of 2024/10/12.**
- `pnpm run dev --remote`
  - uses a remote [turso db](https://turso.tech/)

to modify the remote db schema (as populated after running `astro run dev`):
>`pnpm astro db push --remote`

to seed the remote db contents from the dev seed:
> `pnpm astro db execute db/seed.ts --remote`

- @ me for clerk key

- 

