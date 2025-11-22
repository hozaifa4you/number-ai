import { describe, expect, it, mock } from 'bun:test'
import { NumberAiWithGroq } from '../src/groq'

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
		const client = new NumberAiWithGroq('test-key')
		expect(client).toBeDefined()
	})

	it('should return random integer with valid response', async () => {
		const client = new NumberAiWithGroq('test-key')

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
		expect(result.error).toBeNull()
	})

	it('should handle missing response', async () => {
		const client = new NumberAiWithGroq('test-key')

		const internal = (
			client as unknown as { _internalClient: InternalClientForTest }
		)._internalClient
		internal.chat.completions.create = mock(() =>
			Promise.resolve({
				choices: [],
			}),
		)

		const result = await client.randomInt()
		expect(result.num).toBeNull()
		expect(result.error).toBe('No response from AI. Maybe some error occurred.')
	})

	it('should handle invalid JSON', async () => {
		const client = new NumberAiWithGroq('test-key')

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
		expect(result.num).toBeNull()
		expect(result.error).toBe('No response from AI. Maybe some error occurred.')
	})
})
