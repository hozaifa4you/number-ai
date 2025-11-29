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
import { NumberAiWithOpenAi } from 'number-ai'

const ai = new NumberAiWithOpenAi()

// Generate random integer
const result = await ai.randomInt(1, 100)
console.log(result) // { num: 42 }
```

### Groq

```typescript
import { NumberAiWithGroq } from 'number-ai'

const ai = new NumberAiWithGroq()

const result = await ai.randomInt(1, 100)
console.log(result) // { num: 87 }
```

### With Environment Variables

```typescript
// Set OPENAI_API_KEY or GROQ_API_KEY in .env
const ai = new NumberAiWithOpenAi() // uses process.env.OPENAI_API_KEY
```

### Custom Model & pass api key

```typescript
// OpenAI with custom model
const ai = new NumberAiWithOpenAi({
	apiKey: '<your api key>',
	model: '<model>', // default: gpt-4o-mini
})

// Groq with custom model
const ai = new NumberAiWithGroq({
	apiKey: '<your api key>',
	model: '<model>', // default: openai/gpt-oss-20b
})
```

## APIs

### `randomInt(min?, max?)`

Generate a random integer using AI.

**Parameters:**

- `min` (optional) - Minimum value (inclusive)
- `max` (optional) - Maximum value (inclusive)

**Returns:** `Promise<{ num?: number, error?: string }>`

**Examples:**

```typescript
// Between 1 and 100
await ai.randomInt(1, 100)
// { num: 42 }

// Greater than or equal to 50
await ai.randomInt(50)
// { num: 73 }

// Less than or equal to 20
await ai.randomInt(undefined, 20)
// { num: 15 }

// Any random integer
await ai.randomInt()
// { num: -127 }

// Error handling
const result = await ai.randomInt(1, 10)
if (result.error) {
	console.error('Error:', result.error)
} else {
	console.log('Number:', result.num)
}
```

### `randomFloat(min?, max?)`

Generate a random float using AI.

**Parameters:**

- `min` (optional) - Minimum value (inclusive)
- `max` (optional) - Maximum value (inclusive)

**Returns:** `Promise<{ num?: number, error?: string }>`

**Examples:**

```typescript
// Between 1 and 100
await ai.randomFloat(1, 100)
// { num: 42.50 }

// Greater than or equal to 50
await ai.randomFloat(50)
// { num: 73.92 }

// Less than or equal to 20
await ai.randomFloat(undefined, 20)
// { num: 15.64 }

// Any random float
await ai.randomFloat()
// { num: -127.65 }

// Error handling
const result = await ai.randomFloat(1, 10)
if (result.error) {
	console.error('Error:', result.error)
} else {
	console.log('Number:', result.num)
}
```

### `randomIntArray(count!, min?, max?)`

Generate a random array integer.

**Parameters:**

- `count` (required) - Count/length of array
- `min` (optional) - Minimum value (inclusive)
- `max` (optional) - Maximum value (inclusive)

**Returns:** `Promise<{ nums?: [number], error?: string }>`

**Examples:**

```typescript
// Between 1 and 100
await ai.randomIntArray(5, 1, 100)
// { nums: [42, 10, 1, 5, 11] }

// Greater than or equal to 50
await ai.randomIntArray(6, 50)
// { nums: [73, 60, 69, 99, 954, 847727432] }

// Less than or equal to 20
await ai.randomIntArray(10, undefined, 20)
// { nums: [15, 1, 2, 4, 9, 19, 6, 11, 18, 14]}

// Any random integer
await ai.randomIntArray(3)
// { nums: [93764362, 9133, 9]}

// Error handling
const result = await ai.randomIntArray(10, 1, 10)
if (result.error) {
	console.error('Error:', result.error)
} else {
	console.log('Number:', result.nums)
}
```

### `randomFloatArray(count!, min?, max?)`

Generate a random array float.

**Parameters:**

- `count` (required) - Count/length of array
- `min` (optional) - Minimum value (inclusive)
- `max` (optional) - Maximum value (inclusive)

**Returns:** `Promise<{ nums?: [number], error?: string }>`

**Examples:**

```typescript
// Between 1 and 100
await ai.randomFloatArray(5, 1, 100)
// { nums: [42.85, 10.85, 1.875, 5.85, 11.85] }

// Greater than or equal to 50
await ai.randomFloatArray(6, 50)
// { nums: [73.74, 60.10, 69.82, 99.04, 954.84, 847727432.19] }

// Less than or equal to 20
await ai.randomFloatArray(10, undefined, 20)
// { nums: [15.31, 1.10, 2.84, 4.95, 9.30, 19.95, 6.20, 11.65, 18.82, 14.45]}

// Any random integer
await ai.randomFloatArray(3)
// { nums: [93764362.84, 9133.34, 9.01]}

// Error handling
const result = await ai.randomFloatArray(10, 1, 10)
if (result.error) {
	console.error('Error:', result.error)
} else {
	console.log('Number:', result.nums)
}
```

### `isPrime(n!)`

Check is the integer is prime number or not.

**Parameters:**

- `n` (required) - Which number want to check

**Returns:** `Promise<{ is_prime?: number, error?: string }>`

**Examples:**

```typescript
// Is prime
await ai.isPrime(10)
// { is_prime: true }

// Is not prime
await ai.isPrime(5)
// { is_prime: false }

// Error handling
const result = await ai.isPrime(10)
if (result.error) {
	console.error('Error:', result.error)
} else {
	console.log('Number:', result.is_prime)
}
```

### `describeNumber(n!)`

User gives a number → get a human-readable description

**Parameters:**

- `n` (required) - Which number want to describe

**Returns:** `Promise<{ description?: string, error?: string }>`

**Examples:**

```typescript
// Is prime
await ai.describeNumber(19)
// { description: "<details about 19>" }

// Error handling
const result = await ai.describeNumber(19)
if (result.error) {
	console.error('Error:', result.error)
} else {
	console.log('Number:', result.description)
}
```

### `patternDetection(pattern!)`

User gives a number → get a human-readable description

**Parameters:**

- `pattern: number[] | string[]` - (required) - Pattern you want to detect

**Returns:** `Promise<{ pattern?: string, error?: string }>`

**Examples:**

```typescript
// Is prime
await ai.patternDetection([1, 3, 4, 5, 7])
// { pattern: "<details about the given pattern>" }

// Error handling
const result = await ai.patternDetection([2, 4, 6])
if (result.error) {
	console.error('Error:', result.error)
} else {
	console.log('Number:', result.pattern)
}
```

### `unitConversion(value!, from!, to!)`

User gives a number → get a human-readable description

**Parameters:**

- `value`: `number | string` - (Required) The numeric value to convert.
- `from`: `string` - (Required) The unit to convert from.
- `to`: `string` - (Required) The unit to convert to.

**Returns:** `Promise<{ value?: string, from?: string, to?:string, error?: string }>`

**Examples:**

```typescript
// Possible unit conversion
await ai.unitConversion(100, 'cm', 'meter')
// { value: 1, from: "cm", to: "meter" }

// Impossible unit conversion
await ai.unitConversion(100, 'kg', 'meter')
// { value: "<AI error message>", from: "kg", to: "meter" }

// Error handling
const result = await ai.unitConversion(10, 'cm', 'inch')
if (result.error) {
	console.error('Error:', result.error)
} else {
	console.log('Number:', result.value, 'From:', result.from, 'To:', result.to)
}
```

## TypeScript

Full TypeScript support included:

```typescript
import type {
	RandomIntResponse,
	IsPrimeResponse,
	LLMOptions,
	RandomFloatArrayResponse,
	RandomFloatResponse,
	RandomIntArrayResponse,
	RandomIntResponse,
} from 'number-ai'

const result: RandomIntResponse = await ai.randomInt(1, 100)
```

## License

MIT
