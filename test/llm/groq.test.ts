import { describe, expect, it, mock } from 'bun:test'
import { NumberAiWithGroq } from '../../src/llms/groq'

// Minimal typed shape for the internal client used in tests.
type InternalClientForTest = {
	chat: {
		completions: {
			create: (...args: unknown[]) => Promise<unknown>
		}
	}
}

describe('NumberAiWithGroq', () => {
	it('should initialize with default model', () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })
		expect(client).toBeDefined()
	})

	it('should return random integer with valid response', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		// Mock the internal chat.completions.create method on the wrapped client
		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [
					{
						message: {
							content: '{"random_integer": 99}',
						},
					},
				],
			}),
		)

		const result = await client.randomInt(50, 100)
		expect(result.num).toBe(99)
		expect(result.error).toBeUndefined()
	})

	it('should handle missing response', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [],
			}),
		)

		const result = await client.randomInt()
		expect(result.num).toBeUndefined()
		expect(result.error).toBe('No response from AI. Maybe some error occurred.')
	})

	it('should handle invalid JSON', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [
					{
						message: {
							content: 'invalid response',
						},
					},
				],
			}),
		)

		const result = await client.randomInt()
		expect(result.num).toBeUndefined()
		expect(result.error).toBe('No response from AI. Maybe some error occurred.')
	})
})

describe('NumberAiWithGroq - randomFloat', () => {
	it('should return random float with valid response', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [
					{
						message: {
							content: '{"random_float": 42.5}',
						},
					},
				],
			}),
		)

		const result = await client.randomFloat(1, 100)
		expect(result.num).toBe(42.5)
		expect(result.error).toBeUndefined()
	})

	it('should handle error', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [],
			}),
		)

		const result = await client.randomFloat()
		expect(result.num).toBeUndefined()
		expect(result.error).toBe('No response from AI. Maybe some error occurred.')
	})
})

describe('NumberAiWithGroq - randomIntArray', () => {
	it('should return random int array with valid response', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [
					{
						message: {
							content: '{"random_int_array": [1, 2, 3, 4, 5]}',
						},
					},
				],
			}),
		)

		const result = await client.randomIntArray(5, 1, 10)
		expect(result.nums).toEqual([1, 2, 3, 4, 5])
		expect(result.error).toBeUndefined()
	})

	it('should handle missing count parameter', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })
		const result = await client.randomIntArray(0)
		expect(result.nums).toBeUndefined()
		expect(result.error).toBe('Count parameter is required.')
	})
})

describe('NumberAiWithGroq - randomFloatArray', () => {
	it('should return random float array with valid response', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [
					{
						message: {
							content: '{"random_float_array": [1.5, 2.3, 3.7]}',
						},
					},
				],
			}),
		)

		const result = await client.randomFloatArray(3, 1, 10)
		expect(result.nums).toEqual([1.5, 2.3, 3.7])
		expect(result.error).toBeUndefined()
	})

	it('should handle missing count parameter', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })
		const result = await client.randomFloatArray(0)
		expect(result.nums).toBeUndefined()
		expect(result.error).toBe('Count parameter is required.')
	})
})

describe('NumberAiWithGroq - isPrime', () => {
	it('should return true for prime number', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [
					{
						message: {
							content: '{"is_prime": true}',
						},
					},
				],
			}),
		)

		const result = await client.isPrime(7)
		expect(result.is_prime).toBe(true)
		expect(result.error).toBeUndefined()
	})

	it('should handle error', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [],
			}),
		)

		const result = await client.isPrime(7)
		expect(result.is_prime).toBeUndefined()
		expect(result.error).toBe('No response from AI. Maybe some error occurred.')
	})
})

describe('NumberAiWithGroq - describeNumber', () => {
	it('should return description for a number', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [
					{
						message: {
							content: '{"description": "Seven is a prime number"}',
						},
					},
				],
			}),
		)

		const result = await client.describeNumber(7)
		expect(result.description).toBe('Seven is a prime number')
		expect(result.error).toBeUndefined()
	})

	it('should handle error', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [],
			}),
		)

		const result = await client.describeNumber(7)
		expect(result.description).toBeUndefined()
		expect(result.error).toBe('No response from AI. Maybe some error occurred.')
	})
})

describe('NumberAiWithGroq - patternDetection', () => {
	it('should detect pattern in sequence', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [
					{
						message: {
							content: '{"pattern": "Fibonacci sequence"}',
						},
					},
				],
			}),
		)

		const result = await client.patternDetection([1, 1, 2, 3, 5, 8])
		expect(result.pattern).toBe('Fibonacci sequence')
		expect(result.error).toBeUndefined()
	})

	it('should handle error', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [],
			}),
		)

		const result = await client.patternDetection([1, 2, 3])
		expect(result.pattern).toBeUndefined()
		expect(result.error).toBe('No response from AI. Maybe some error occurred.')
	})
})

describe('NumberAiWithGroq - unitConversion', () => {
	it('should convert units successfully', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [
					{
						message: {
							content: '{"value": 100, "from": "m", "to": "cm"}',
						},
					},
				],
			}),
		)

		const result = await client.unitConversion(1, 'm', 'cm')
		expect(result.value).toBe(100)
		expect(result.from).toBe('m')
		expect(result.to).toBe('cm')
		expect(result.error).toBeUndefined()
	})

	it('should handle error', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [],
			}),
		)

		const result = await client.unitConversion(1, 'm', 'cm')
		expect(result.error).toBe('No response from AI. Maybe some error occurred.')
	})
})

describe('NumberAiWithGroq - patternGenerator', () => {
	it('should generate pattern sequence', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [
					{
						message: {
							content: '{"sequence": [2, 4, 6, 8, 10]}',
						},
					},
				],
			}),
		)

		const result = await client.patternGenerator('even numbers', 2, 10)
		expect(result.sequence).toEqual([2, 4, 6, 8, 10])
		expect(result.error).toBeUndefined()
	})

	it('should handle error', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [],
			}),
		)

		const result = await client.patternGenerator('even numbers')
		expect(result.sequence).toBeUndefined()
		expect(result.error).toBe('No response from AI. Maybe some error occurred.')
	})
})

describe('NumberAiWithGroq - arithmeticOperation', () => {
	it('should perform arithmetic operation', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [
					{
						message: {
							content: '{"result": 15}',
						},
					},
				],
			}),
		)

		const result = await client.arithmeticOperation(10, '+', 5)
		expect(result.result).toBe(15)
		expect(result.error).toBeUndefined()
	})

	it('should handle error', async () => {
		const client = new NumberAiWithGroq({ apiKey: 'test-key' })

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [],
			}),
		)

		const result = await client.arithmeticOperation(10, '+', 5)
		expect(result.result).toBeUndefined()
		expect(result.error).toBe('No response from AI. Maybe some error occurred.')
	})
})
