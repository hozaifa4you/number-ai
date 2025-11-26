import dotenv from 'dotenv'
import Groq from 'groq-sdk'
import type { ChatCompletionCreateParamsBase } from 'groq-sdk/resources/chat/completions.mjs'
import { SystemPrompts } from '../common/system'
import type {
	IsPrimeResponse,
	LLMOptions,
	RandomFloatArrayResponse,
	RandomFloatResponse,
	RandomIntArrayResponse,
	RandomIntResponse,
} from '../types/common'

dotenv.config()

const apiKey = process.env.GROQ_API_KEY

class NumberAiWithGroq {
	private client: Groq
	private model: ChatCompletionCreateParamsBase['model']

	constructor(options: LLMOptions) {
		const key = options.apiKey ?? apiKey
		if (!key) {
			throw new Error('API key is required for Groq client initialization.')
		}

		this.client = new Groq({ apiKey: key })
		this.model = options.model ?? 'openai/gpt-oss-20b'
	}

	/**
	 * Generate a random integer using the OpenAI model.
	 * If min or max are omitted, the model may choose an appropriate range.
	 *
	 * @param min - Optional minimum (inclusive)
	 * @param max - Optional maximum (inclusive)
	 * @returns Promise resolving to RandomIntResponse containing the number or an error message.
	 */
	public async randomInt(
		min?: number,
		max?: number,
	): Promise<RandomIntResponse> {
		const response = await this.client.chat.completions.create({
			model: this.model,
			response_format: { type: 'json_object' },
			messages: [
				SystemPrompts.RANDOM_INT,
				{
					role: 'user',
					content: `MIN: ${min ?? 'not provided'}, MAX: ${
						max ?? 'not provided'
					}. Please provide a random integer based on the given constraints.`,
				},
			],
		})

		const messageContent = response.choices?.[0]?.message?.content
		if (!messageContent) {
			return {
				error: 'No response from AI. Maybe some error occurred.',
			}
		}

		try {
			const parsed = JSON.parse(messageContent)
			return { num: parsed?.random_integer ?? parsed }
		} catch (_e) {
			return {
				error: 'No response from AI. Maybe some error occurred.',
			}
		}
	}

	/**
	 * Generate a random float using the Groq model.
	 * If min or max are omitted, the model may choose an appropriate range.
	 *
	 * @param min - Optional minimum (inclusive)
	 * @param max - Optional maximum (inclusive)
	 * @returns Promise resolving to RandomFloatResponse containing the number or an error message.
	 */
	public async randomFloat(
		min?: number,
		max?: number,
	): Promise<RandomFloatResponse> {
		const response = await this.client.chat.completions.create({
			model: this.model,
			response_format: { type: 'json_object' },
			messages: [
				SystemPrompts.RANDOM_FLOAT,
				{
					role: 'user',
					content: `MIN: ${min ?? 'not provided'}, MAX: ${
						max ?? 'not provided'
					}. Please provide a random float based on the given constraints.`,
				},
			],
		})

		const messageContent = response.choices?.[0]?.message?.content
		if (!messageContent) {
			return {
				error: 'No response from AI. Maybe some error occurred.',
			}
		}

		try {
			const parsed = JSON.parse(messageContent)
			return { num: parsed?.random_float ?? parsed }
		} catch (_e) {
			return {
				error: 'No response from AI. Maybe some error occurred.',
			}
		}
	}

	/**
	 * Generate an array of random integers using the Groq model.
	 * Must provide count parameter. Min and max are optional.
	 *
	 * @param count - Required array length
	 * @param min - Optional min (inclusive)
	 * @param max - Optional max (inclusive)
	 * @returns Promise resolving to RandomIntArrayResponse containing the array or an error message.
	 */
	public async randomIntArray(
		count: number,
		min?: number,
		max?: number,
	): Promise<RandomIntArrayResponse> {
		if (!count) {
			return { error: 'Count parameter is required.' }
		}

		try {
			const response = await this.client.chat.completions.create({
				model: this.model,
				response_format: { type: 'json_object' },
				messages: [
					SystemPrompts.RANDOM_INT_ARRAY,
					{
						role: 'user',
						content: `
							COUNT: ${count},
							MIN: ${min ?? 'not provided'},
							MAX: ${max ?? 'not provided'}.
							Please provide an array of random integers based on the given constraints.
						`,
					},
				],
			})
			const messageContent = response.choices?.[0]?.message?.content
			if (!messageContent) {
				return {
					error: 'No response from AI. Maybe some error occurred.',
				}
			}

			const parsed = JSON.parse(messageContent)
			return { nums: parsed?.random_int_array ?? parsed }
		} catch (error) {
			return {
				error: (error as Error).message ?? ' An unknown error occurred.',
			}
		}
	}

	/**
	 * Generate an array of random floats using the Groq model.
	 * Must provide count parameter. Min and max are optional.
	 *
	 * @param count - Required array length
	 * @param min - Optional min (inclusive)
	 * @param max - Optional max (inclusive)
	 * @returns Promise resolving to RandomIntArrayResponse containing the array or an error message.
	 */
	public async randomFloatArray(
		count: number,
		min?: number,
		max?: number,
	): Promise<RandomFloatArrayResponse> {
		if (!count) {
			return { error: 'Count parameter is required.' }
		}

		try {
			const response = await this.client.chat.completions.create({
				model: this.model,
				response_format: { type: 'json_object' },
				messages: [
					SystemPrompts.RANDOM_FLOAT_ARRAY,
					{
						role: 'user',
						content: `
							COUNT: ${count},
							MIN: ${min ?? 'not provided'},
							MAX: ${max ?? 'not provided'}.
							Please provide an array of random floats based on the given constraints.
						`,
					},
				],
			})
			const messageContent = response.choices?.[0]?.message?.content
			if (!messageContent) {
				return {
					error: 'No response from AI. Maybe some error occurred.',
				}
			}

			const parsed = JSON.parse(messageContent)
			return { nums: parsed?.random_float_array ?? parsed }
		} catch (error) {
			return {
				error: (error as Error).message ?? ' An unknown error occurred.',
			}
		}
	}

	/**
	 * @description Check if a number is prime using the Groq model.
	 * @param n Required - number to check for primality
	 * @returns Promise resolving to IsPrimeResponse containing the result or an error message.
	 */
	public async isPrime(n: number): Promise<IsPrimeResponse> {
		try {
			const response = await this.client.chat.completions.create({
				model: this.model,
				response_format: { type: 'json_object' },
				messages: [
					SystemPrompts.IS_PRIME,
					{
						role: 'user',
						content: `NUMBER: ${n}`,
					},
				],
			})

			const messageContent = response.choices?.[0]?.message?.content
			if (!messageContent) {
				return {
					error: 'No response from AI. Maybe some error occurred.',
				}
			}

			const parsed = JSON.parse(messageContent)
			return { is_prime: parsed?.is_prime ?? parsed }
		} catch (error) {
			return {
				error: (error as Error).message ?? ' An unknown error occurred.',
			}
		}
	}

	// Provide a way to access the underlying client for advanced scenarios
	// but keep it intentionally non-enumerable to avoid accidental usage.
	public get _internalClient(): Groq {
		return this.client
	}
}

export { NumberAiWithGroq }
