## number-ai — Copilot instructions for AI coding agents

This file gives focused, repository-specific guidance to AI coding assistants so they can be productive without human hand-holding.

- Repo root: TypeScript + Bun. Primary sources live in `src/`.
- Entry point: `src/index.ts` exports provider-specific classes from `src/llms/openai.ts`, `src/llms/groq.ts`, etc.

Key facts (quick skim)

- Uses Bun as the runtime and task runner. Common commands in `package.json`:
   - `bun run build` -> `bunup` (build/distribution step)
   - `bun run dev` -> `bunup --watch` (dev watch)
   - `bun run test` -> runs tests with Bun (`bun test`)
   - `bun run test:coverage` -> runs tests with coverage report
   - `bun run test:watch` -> runs tests in watch mode
   - `bun run lint` -> `biome check .` (biome linter)
   - `bun run lint:fix` -> `biome check --write .` (autofix linter issues)
   - `bun run format` -> `prettier . --check` (check formatting)
   - `bun run format:fix` -> `prettier . --write` (autofix formatting)
   - `bun run type-check` -> `tsc --noEmit`
   - `bun run release` -> `bumpp --commit --push --tag` (version bump and release)
- Environment variables loaded with `dotenv`. Current providers expect `OPENAI_API_KEY` and `GROQ_API_KEY`.
- Current version: `0.2.4` (published on npm)

Architecture and why

- **npm package for AI-powered number operations**: This library provides AI-based methods for working with numbers (pattern discovery, predictions, math operations, random generation, unit conversion, etc.).
- **Multi-LLM support**: Architecture supports multiple AI providers (OpenAI, Groq, and future providers). Each provider has its own wrapper class using **composition pattern** (not inheritance).
   - `NumberAiWithOpenAi` in `src/llms/openai.ts` — wraps OpenAI SDK with private `client` property
   - `NumberAiWithGroq` in `src/llms/groq.ts` — wraps Groq SDK with private `client` property
   - Future providers follow the same composition pattern
- **Shared types**: Common types like `RandomIntResponse`, `IsPrimeResponse`, etc. live in `src/types/common.d.ts` to ensure consistent return shapes across providers.
- **Provider-agnostic method signatures**: Each provider class implements the same methods with identical signatures and return types for consistent API.
- **Shared system prompts**: All AI prompts centralized in `src/common/system.ts` (SystemPrompts object) for consistency and maintainability.
- **Validation utilities**: Zod schemas and formatters in `src/common/validation.ts` for input/output validation.
- **Constructor pattern**: All providers use `LLMOptions` interface for initialization:
   ```typescript
   constructor(options: LLMOptions) {
     const key = options.apiKey ?? apiKey
     if (!key) {
       throw new Error('API key is required...')
     }
     this.client = new Provider({ apiKey: key })
     this.model = options.model ?? 'default-model'
   }
   ```

Important patterns and conventions (do not break)

- **Runtime & packaging**: repository targets Bun and outputs to a `dist` folder. The project uses ES modules (`type: "module"`). Keep imports/exports ESM-compatible.
- **Composition over inheritance**: Provider classes **wrap** the SDK client internally (private `client` property) instead of extending it. This prevents exposing all SDK methods on the public instance. Each provider exposes a controlled `_internalClient` getter for testing/debugging only.
- **API key validation**: Constructors **must** validate that an API key is available (from parameter or environment). If not, throw an error with a clear message.
- **Tests and CI**: tests use `bun test`. When adding tests, prefer TypeScript test files in `test/` and run via `bun`.
   - Each provider has its own test file (e.g., `test/openai.test.ts`, `test/groq.test.ts`)
   - Mock AI SDK calls using typed `InternalClientForTest` helper to avoid `@ts-expect-error` and `any`
   - Example mock pattern:
      ```typescript
      type InternalClientForTest = {
        chat: {
          completions: {
            create: (...args: unknown[]) => Promise<unknown>
          }
        }
      }
      const internal = (client as unknown as { _internalClient: InternalClientForTest })._internalClient
      internal.chat.completions.create = mock(() => Promise.resolve({...}))
      ```
   - Never rely on real API keys in tests
- **Lint & pre-commit**: `simple-git-hooks` runs `bun run lint && bun run type-check` on pre-commit. Avoid changes that cause type or linter failures. Use `bun run lint:fix` to autofix.
- **Environment handling**: Provider files call `dotenv.config()`. Avoid logging secrets in production code.
- **Error responses**: Methods return discriminated unions (e.g., `{ num?: number, error?: string }`). Never throw errors from public methods—return error objects instead.
- **Response parsing**: Use `JSON.parse` with try/catch. Check for `messageContent` presence before parsing. Return appropriate error object if parsing fails.
- **System prompts**: All AI prompts live in `src/common/system.ts` as `SystemPrompts` constant. When adding methods, add corresponding prompt there.
- **Adding new LLM providers**:
   1. Create `src/llms/<provider>.ts` with a class using composition (private `client` property)
   2. Implement constructor accepting `LLMOptions` with API key validation
   3. Implement all existing methods with matching signatures
   4. Use shared types from `src/types/common.d.ts`
   5. Use shared prompts from `src/common/system.ts`
   6. Export from `src/index.ts`
   7. Add corresponding test file in `test/<provider>.test.ts`
   8. Update this file to document the new provider
- **Adding new number methods**:
   1. Design the method signature and return type first (add to `src/types/common.d.ts`)
   2. Add system prompt to `src/common/system.ts`
   3. Implement in all existing providers with consistent prompts and parsing
   4. Add tests for each provider
   5. Ensure method works consistently across all providers
   6. Export new types from `src/index.ts`

Examples & file references

- **Provider implementations**:
   - `src/llms/openai.ts` — `NumberAiWithOpenAi` wraps OpenAI SDK, uses `gpt-4o-mini` by default
   - `src/llms/groq.ts` — `NumberAiWithGroq` wraps Groq SDK, uses `openai/gpt-oss-20b` by default
   - Both accept custom models via constructor: `new NumberAiWithOpenAi({ apiKey: 'key', model: 'gpt-4' })`

- **Available methods** (all providers implement these consistently):
   - `randomInt(min?, max?)` — Generate random integer
   - `randomFloat(min?, max?)` — Generate random float
   - `randomIntArray(count, min?, max?)` — Generate array of random integers
   - `randomFloatArray(count, min?, max?)` — Generate array of random floats
   - `isPrime(n)` — Check if number is prime
   - `describeNumber(n)` — Get interesting fact about a number
   - `patternDetection(sequence)` — Detect patterns in number sequence
   - `unitConversion(value, from, to)` — Convert between units
   - `patternGenerator(pattern, from?, to?)` — Generate number sequence from pattern

- **Method pattern** (example: `randomInt`):
   - Constructs system + user messages using `SystemPrompts.RANDOM_INT`
   - Expects AI response: `{"random_integer": <value>}`
   - Parses response and returns `RandomIntResponse` type
   - Handles errors gracefully (missing response, invalid JSON)
   - When adding methods, follow this pattern: use SystemPrompt → JSON response → typed return → error handling

- **Shared types**: `src/types/common.d.ts`
   - `LLMOptions` — constructor options (`{ apiKey?: string, model?: string }`)
   - `RandomIntResponse`, `RandomFloatResponse` — `{ num?: number, error?: string }`
   - `RandomIntArrayResponse`, `RandomFloatArrayResponse` — `{ nums?: number[], error?: string }`
   - `IsPrimeResponse` — `{ is_prime?: boolean, error?: string }`
   - `DescribeNumberResponse` — `{ description?: string, error?: string }`
   - `PatternDetectionResponse` — `{ pattern?: string, error?: string }`
   - `UnitConversionResponse` — `{ value?: number | string, from?: string, to?: string, error?: string }`
   - `PatternGenerator` — `{ sequence?: number[] | string[], error?: string }`
   - Add new method return types here to ensure consistency across providers

- **Shared utilities**:
   - `src/common/system.ts` — `SystemPrompts` object with all AI prompts
   - `src/common/validation.ts` — Zod schemas and `formatErrors` utility
   - `src/common/constant.ts` — Arithmetic operators and constants

- **Public API**: `src/index.ts` exports all provider classes and types. When adding providers or changing API surface, update exports here.

Developer workflows (practical commands)

- Install deps (Bun): `bun install`
- Build: `bun run build` (uses `bunup` to produce `dist/`)
- Dev watch: `bun run dev`
- Tests: `bun run test` (or `bun run test:watch` during development)
- Linting: `bun run lint` and autofix with `bun run lint:fix`
- Typecheck: `bun run type-check`

Testing & expectations

- Unit tests run under Bun. Tests in `test/` should be runnable with `bun test` and not rely on external network calls.
- **Each provider has dedicated tests**: `test/openai.test.ts`, `test/groq.test.ts`, `test/types.test.ts`
- **Test structure for each method**:
   1. Initialization test (constructor works)
   2. Success case (valid AI response returns expected data)
   3. Missing response (empty choices array)
   4. Invalid JSON (malformed response)
- **Mocking pattern**: Use typed `InternalClientForTest` helper to avoid unsafe type directives
   ```typescript
   type InternalClientForTest = {
   	chat: {
   		completions: {
   			create: (...args: unknown[]) => Promise<unknown>
   		}
   	}
   }
   const internal = (client as unknown as { _internalClient: InternalClientForTest })
   	._internalClient
   internal.chat.completions.create = mock(() =>
   	Promise.resolve({
   		choices: [{ message: { content: '{"random_integer": 42}' } }],
   	}),
   )
   ```
- When adding new providers or methods, replicate the test structure from existing provider tests.

Security & secrets

- Multiple API keys supported: `OPENAI_API_KEY`, `GROQ_API_KEY`, and future provider keys via `dotenv`.
- Never log API keys to console in production code or tests.
- Do not commit API keys or .env files.
- Users can pass API keys directly to constructors instead of relying on environment variables.

When editing AI integrations

- **Consistency across providers**: All providers must implement the same methods with identical signatures and return types.
- **Message templates**: Keep system/user prompts clear and specific. Always request JSON output with explicit schema.
- **Response parsing**: Current pattern uses `JSON.parse` with try/catch. For production features, consider adding schema validation (e.g., zod).
- **Error handling**: Return discriminated unions (`{ num: number, error: null } | { num: null, error: string }`) instead of throwing errors.
- **Adding new methods across providers**:
   1. Design the method signature and return type first (add to `src/types/common.d.ts`)
   2. Add system prompt to `src/common/system.ts`
   3. Implement in all existing providers with consistent prompts and parsing
   4. Add tests for each provider
   5. Update documentation

What to look for in PR reviews (quick checklist)

- **Type errors**: run `bun run type-check` locally.
- **Lint**: run `bun run lint` and `bun run lint:fix` as needed.
- **Tests**: run `bun run test` and ensure all 10+ tests pass with no network dependency.
- **Secrets**: ensure no secrets are logged or committed.
- **Cross-provider consistency**: If adding/modifying methods, ensure all providers have matching implementations.
- **Type consistency**: Verify return types match across providers and use shared types from `src/types/common.d.ts`.
- **Export updates**: Check that `src/index.ts` exports new providers or methods.
- **Test coverage**: New providers need 4+ tests (init, success, missing response, invalid JSON). New methods need tests in all provider test files.

Future roadmap notes

- **More LLM providers**: Plan to add Anthropic, Cohere, local models, etc. Follow the same wrapper pattern.
- **More number methods**: Future methods may include pattern detection, sequence prediction, statistical analysis, number validation, etc.
- **Shared utilities**: Consider extracting common prompt building and response parsing into shared utilities as the codebase grows.

If anything here is unclear or you want the agent to follow additional project-specific rules (naming, test styles, release process), tell me which areas to expand and I'll update this file.

---

Files referenced in these instructions:

- `src/llms/openai.ts` — OpenAI provider wrapper (all methods implemented)
- `src/llms/groq.ts` — Groq provider wrapper (all methods implemented)
- `src/types/common.d.ts` — shared types for consistent return shapes
- `src/common/system.ts` — centralized AI prompts (SystemPrompts)
- `src/common/validation.ts` — Zod schemas and error formatting
- `src/common/constant.ts` — Arithmetic operators constants
- `src/index.ts` — public export surface for all providers
- `package.json` — scripts, runtime, and build instructions
- `test/openai.test.ts`, `test/groq.test.ts`, `test/types.test.ts` — provider-specific and type tests
