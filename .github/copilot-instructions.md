## number-ai — Copilot instructions for AI coding agents

This file gives focused, repository-specific guidance to AI coding assistants so they can be productive without human hand-holding.

-  Repo root: TypeScript + Bun. Primary sources live in `src/`.
-  Entry point: `src/index.ts` exports `NumberAiWithOpenAi` from `src/openai.ts`.

Key facts (quick skim)

-  Uses Bun as the runtime and task runner. Common commands in `package.json`:
   -  `bun run build` -> `bunup` (build/distribution step)
   -  `bun run dev` -> `bunup --watch` (dev watch)
   -  `bun run test` -> runs tests with Bun (`bun test`)
   -  `bun run lint` -> `biome check .` (biome linter)
   -  `bun run type-check` -> `tsc --noEmit`
-  Environment variables loaded with `dotenv` in `src/openai.ts`. Expect `OPENAI_API_KEY`.

Architecture and why

-  Small library that wraps OpenAI client logic. `NumberAiWithOpenAi` extends the official `openai` package to provide domain helpers (example: `randomInt`).
-  `src/openai.ts` contains most of the domain-specific behavior and is the main integration point with the OpenAI SDK. `src/index.ts` re-exports it for consumers.

Important patterns and conventions (do not break)

-  Runtime & packaging: repository targets Bun and outputs to a `dist` folder. The project uses ES modules (`type: "module"`). Keep imports/exports ESM-compatible.
-  Tests and CI: tests use `bun test`. When adding tests, prefer TypeScript test files in `test/` and run via `bun`.
-  Lint & pre-commit: `simple-git-hooks` runs `bun run lint && bun run type-check` on pre-commit. Avoid changes that cause type or linter failures.
-  Environment handling: `src/openai.ts` calls `dotenv.config()` and currently logs the API key to console (`console.log("API Key:", apiKey)`). This is likely for development/debugging — avoid leaving secrets logged in changes. If you change logging, ensure you do not print secrets in tests or CI.

Examples & file references

-  OpenAI wrapper: `src/openai.ts`

   -  Extends the `OpenAI` client and calls `this.chat.completions.create(...)` with model `gpt-4o-mini`.
   -  The `randomInt` method expects the assistant to return JSON like `{"random_integer": <value>}` and parses the chat response.
   -  If you modify how messages are formatted, update parsing logic accordingly and add tests that assert behavior on a signed-off chat response string.

-  Re-export & distribution: `src/index.ts` simply exports `NumberAiWithOpenAi`. When changing public API, update exports and update build artifacts and `types` entry in `package.json`.

Developer workflows (practical commands)

-  Install deps (Bun): `bun install`
-  Build: `bun run build` (uses `bunup` to produce `dist/`)
-  Dev watch: `bun run dev`
-  Tests: `bun run test` (or `bun run test:watch` during development)
-  Linting: `bun run lint` and autofix with `bun run lint:fix`
-  Typecheck: `bun run type-check`

Testing & expectations

-  Unit tests run under Bun. Tests in `test/` should be runnable with `bun test` and not rely on external network calls unless explicitly stubbed.
-  If a change introduces network calls to OpenAI, mock them in tests (do not rely on a real API key in CI).

Security & secrets

-  The repo currently references `OPENAI_API_KEY` via `dotenv`; the source prints it to console. When preparing PRs, remove or gate any plaintext logging of keys.
-  Do not commit API keys or .env files.

When editing the OpenAI integration

-  Keep message templates and expected JSON shapes in sync. Example: `randomInt` instructs the model to output strict JSON: `{"random_integer": <value>}`. If you change the schema, add/modify parsing and tests.
-  Prefer strong validation of AI responses. The current code does `JSON.parse` and falls back to an error. For production changes, add schema checks and clearer error messages.

What to look for in PR reviews (quick checklist)

-  Type errors: run `bun run type-check` locally.
-  Lint: run `bun run lint` and `bun run lint:fix` as needed.
-  Tests: run `bun run test` and ensure no network dependency.
-  Secrets: ensure no secrets are logged or committed.
-  API shape changes: update `src/openai.ts` docs and tests.

If anything here is unclear or you want the agent to follow additional project-specific rules (naming, test styles, release process), tell me which areas to expand and I'll update this file.

---

Files referenced in these instructions:

-  `src/openai.ts` — main OpenAI wrapper and domain logic (randomInt example).
-  `src/index.ts` — public export surface.
-  `package.json` — scripts, runtime, and build instructions.
-  `test/` — tests run with Bun.
