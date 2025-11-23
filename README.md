# number-ai

[![npm version](https://img.shields.io/npm/v/number-ai.svg)](https://www.npmjs.com/package/number-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AI-powered number operations using OpenAI, Groq, and other LLM providers.

## Install

```bash
npm install number-ai
```

## Usage

### OpenAI

```typescript
import { NumberAiWithOpenAi } from "number-ai";

const ai = new NumberAiWithOpenAi("your-openai-api-key");

// Generate random integer
const result = await ai.randomInt(1, 100);
console.log(result); // { num: 42, error: null }
```

### Groq

```typescript
import { NumberAiWithGroq } from "number-ai";

const ai = new NumberAiWithGroq("your-groq-api-key");

const result = await ai.randomInt(1, 100);
console.log(result); // { num: 87, error: null }
```

### With Environment Variables

```typescript
// Set OPENAI_API_KEY or GROQ_API_KEY in .env
const ai = new NumberAiWithOpenAi(); // uses process.env.OPENAI_API_KEY
```

### Custom Model

```typescript
// OpenAI with custom model
const ai = new NumberAiWithOpenAi("api-key", "gpt-4");

// Groq with custom model
const ai = new NumberAiWithGroq("api-key", "llama-3.1-70b-versatile");
```

## API

### `randomInt(min?, max?)`

Generate a random integer using AI.

**Parameters:**

-  `min` (optional) - Minimum value (inclusive)
-  `max` (optional) - Maximum value (inclusive)

**Returns:** `Promise<{ num: number | null, error: string | null }>`

**Examples:**

```typescript
// Between 1 and 100
await ai.randomInt(1, 100);
// { num: 42, error: null }

// Greater than or equal to 50
await ai.randomInt(50);
// { num: 73, error: null }

// Less than or equal to 20
await ai.randomInt(undefined, 20);
// { num: 15, error: null }

// Any random integer
await ai.randomInt();
// { num: -127, error: null }

// Error handling
const result = await ai.randomInt(1, 10);
if (result.error) {
	console.error("Error:", result.error);
} else {
	console.log("Number:", result.num);
}
```

### `randomFloat(min?, max?)`

Generate a random float using AI.

**Parameters:**

-  `min` (optional) - Minimum value (inclusive)
-  `max` (optional) - Maximum value (inclusive)

**Returns:** `Promise<{ num: number | null, error: string | null }>`

**Examples:**

```typescript
// Between 1 and 100
await ai.randomFloat(1, 100);
// { num: 42.50, error: null }

// Greater than or equal to 50
await ai.randomFloat(50);
// { num: 73.92, error: null }

// Less than or equal to 20
await ai.randomFloat(undefined, 20);
// { num: 15.64, error: null }

// Any random integer
await ai.randomFloat();
// { num: -127.65, error: null }

// Error handling
const result = await ai.randomFloat(1, 10);
if (result.error) {
	console.error("Error:", result.error);
} else {
	console.log("Number:", result.num);
}
```

## TypeScript

Full TypeScript support included:

```typescript
import type { RandomIntResponse } from "number-ai";

const result: RandomIntResponse = await ai.randomInt(1, 100);
```

## License

MIT
