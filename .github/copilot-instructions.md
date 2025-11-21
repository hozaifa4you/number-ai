## number-ai — Copilot instructions for AI coding agents

This file gives focused, repository-specific guidance to AI coding assistants so they can be productive without human hand-holding.

-  Repo root: TypeScript + Bun. Primary sources live in `src/`.
-  Entry point: `src/index.ts` exports provider-specific classes from `src/openai.ts`, `src/groq.ts`, etc.

Key facts (quick skim)

-  Uses Bun as the runtime and task runner. Common commands in `package.json`:
   -  `bun run build` -> `bunup` (build/distribution step)
   -  `bun run dev` -> `bunup --watch` (dev watch)
   -  `bun run test` -> runs tests with Bun (`bun test`)
   -  `bun run lint` -> `biome check .` (biome linter)
   -  `bun run type-check` -> `tsc --noEmit`
-  Environment variables loaded with `dotenv`. Current providers expect `OPENAI_API_KEY` and `GROQ_API_KEY`.

Architecture and why

-  **npm package for AI-powered number operations**: This library provides AI-based methods for working with numbers (pattern discovery, predictions, math operations, random generation, etc.).
-  **Multi-LLM support**: Architecture supports multiple AI providers (OpenAI, Groq, and future providers). Each provider has its own wrapper class that extends the official SDK.
   -  `NumberAiWithOpenAi` in `src/openai.ts` — extends OpenAI SDK
   -  `NumberAiWithGroq` in `src/groq.ts` — extends Groq SDK
   -  Future providers follow the same pattern
-  **Shared types**: Common types like `RandomIntResponse` live in `src/types/common.d.ts` to ensure consistent return shapes across providers.
-  **Provider-agnostic method signatures**: Each provider class implements the same methods (e.g., `randomInt`) with identical signatures and return types for consistent API.

Important patterns and conventions (do not break)

-  **Runtime & packaging**: repository targets Bun and outputs to a `dist` folder. The project uses ES modules (`type: "module"`). Keep imports/exports ESM-compatible.
-  **Tests and CI**: tests use `bun test`. When adding tests, prefer TypeScript test files in `test/` and run via `bun`.
   -  Each provider has its own test file (e.g., `test/openai.test.ts`, `test/groq.test.ts`)
   -  Mock AI SDK calls using `@ts-expect-error` comments to bypass type checking
   -  Never rely on real API keys in tests
-  **Lint & pre-commit**: `simple-git-hooks` runs `bun run lint && bun run type-check` on pre-commit. Avoid changes that cause type or linter failures.
-  **Environment handling**: Provider files call `dotenv.config()`. Avoid logging secrets in production code.
-  **Adding new LLM providers**:
   1. Create `src/<provider>.ts` with a class extending the provider's SDK
   2. Implement all existing methods (e.g., `randomInt`) with matching signatures
   3. Use shared types from `src/types/common.d.ts`
   4. Export from `src/index.ts`
   5. Add corresponding test file in `test/<provider>.test.ts`
   6. Update this file to document the new provider
-  **Adding new number methods**:
   1. Add method to all provider classes with identical signatures
   2. Define shared return types in `src/types/common.d.ts`
   3. Add tests for each provider
   4. Ensure method works consistently across all providers

Examples & file references

-  **Provider implementations**:

   -  `src/openai.ts` — `NumberAiWithOpenAi` extends OpenAI SDK, uses `gpt-4o-mini` by default
   -  `src/groq.ts` — `NumberAiWithGroq` extends Groq SDK, uses `openai/gpt-oss-20b` by default
   -  Both accept custom models via constructor: `new NumberAiWithOpenAi('api-key', 'gpt-4')`

-  **Method pattern** (example: `randomInt`):

   -  Constructs system + user messages with clear instructions for JSON output format
   -  Expects AI response: `{"random_integer": <value>}`
   -  Parses response and returns `RandomIntResponse` type
   -  Handles errors gracefully (missing response, invalid JSON)
   -  When adding methods, follow this pattern: clear prompt → JSON response → typed return

-  **Shared types**: `src/types/common.d.ts`

   -  `RandomIntResponse` — discriminated union for success/error states
   -  Add new method return types here to ensure consistency across providers

-  **Public API**: `src/index.ts` exports all provider classes. When adding providers or changing API surface, update exports here.

Developer workflows (practical commands)

-  Install deps (Bun): `bun install`
-  Build: `bun run build` (uses `bunup` to produce `dist/`)
-  Dev watch: `bun run dev`
-  Tests: `bun run test` (or `bun run test:watch` during development)
-  Linting: `bun run lint` and autofix with `bun run lint:fix`
-  Typecheck: `bun run type-check`

Testing & expectations

-  Unit tests run under Bun. Tests in `test/` should be runnable with `bun test` and not rely on external network calls.
-  **Each provider has dedicated tests**: `test/openai.test.ts`, `test/groq.test.ts`, `test/types.test.ts`
-  **Test structure for each method**:
   1. Initialization test (constructor works)
   2. Success case (valid AI response returns expected data)
   3. Missing response (empty choices array)
   4. Invalid JSON (malformed response)
-  **Mocking pattern**: Use `@ts-expect-error` to mock `client.chat.completions.create` without type conflicts
-  When adding new providers or methods, replicate the test structure from existing provider tests.

Security & secrets

-  Multiple API keys supported: `OPENAI_API_KEY`, `GROQ_API_KEY`, and future provider keys via `dotenv`.
-  Never log API keys to console in production code or tests.
-  Do not commit API keys or .env files.
-  Users can pass API keys directly to constructors instead of relying on environment variables.

When editing AI integrations

-  **Consistency across providers**: All providers must implement the same methods with identical signatures and return types.
-  **Message templates**: Keep system/user prompts clear and specific. Always request JSON output with explicit schema.
-  **Response parsing**: Current pattern uses `JSON.parse` with try/catch. For production features, consider adding schema validation (e.g., zod).
-  **Error handling**: Return discriminated unions (`{ num: number, error: null } | { num: null, error: string }`) instead of throwing errors.
-  **Adding new methods across providers**:
   1. Design the method signature and return type first (add to `src/types/common.d.ts`)
   2. Implement in all existing providers with consistent prompts and parsing
   3. Add tests for each provider
   4. Update documentation

What to look for in PR reviews (quick checklist)

-  **Type errors**: run `bun run type-check` locally.
-  **Lint**: run `bun run lint` and `bun run lint:fix` as needed.
-  **Tests**: run `bun run test` and ensure all 10+ tests pass with no network dependency.
-  **Secrets**: ensure no secrets are logged or committed.
-  **Cross-provider consistency**: If adding/modifying methods, ensure all providers have matching implementations.
-  **Type consistency**: Verify return types match across providers and use shared types from `src/types/common.d.ts`.
-  **Export updates**: Check that `src/index.ts` exports new providers or methods.
-  **Test coverage**: New providers need 4+ tests (init, success, missing response, invalid JSON). New methods need tests in all provider test files.

Future roadmap notes

-  **More LLM providers**: Plan to add Anthropic, Cohere, local models, etc. Follow the same wrapper pattern.
-  **More number methods**: Future methods may include pattern detection, sequence prediction, statistical analysis, number validation, etc.
-  **Shared utilities**: Consider extracting common prompt building and response parsing into shared utilities as the codebase grows.

If anything here is unclear or you want the agent to follow additional project-specific rules (naming, test styles, release process), tell me which areas to expand and I'll update this file.

---

Files referenced in these instructions:

-  `src/openai.ts` — OpenAI provider wrapper (randomInt implementation)
-  `src/groq.ts` — Groq provider wrapper (randomInt implementation)
-  `src/types/common.d.ts` — shared types for consistent return shapes
-  `src/index.ts` — public export surface for all providers
-  `package.json` — scripts, runtime, and build instructions
-  `test/openai.test.ts`, `test/groq.test.ts`, `test/types.test.ts` — provider-specific and type tests
