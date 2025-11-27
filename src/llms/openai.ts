import dotenv from 'dotenv'
import OpenAI from 'openai'
import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions.mjs'
import { SystemPrompts } from '../common/system'
import { formatErrors, PatternDetectionSchema } from '../common/validation'
import type {
	DescribeNumberResponse,
	IsPrimeResponse,
	LLMOptions,
	PatternDetectionResponse,
	RandomFloatArrayResponse,
	RandomFloatResponse,
	RandomIntArrayResponse,
	RandomIntResponse,
} from '../types/common'

dotenv.config()

const apiKey = process.env.OPENAI_API_KEY

class NumberAiWithOpenAi {
	private client: OpenAI
	private model: ChatCompletionCreateParamsBase['model']

	constructor(options: LLMOptions) {
		const key = options.apiKey ?? apiKey
		if (!key) {
			throw new Error('API key is required for OpenAI client initialization.')
		}

		this.client = new OpenAI({ apiKey: key })
		this.model = options.model ?? 'gpt-4o-mini'
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
	 * Generate a random float using the OpenAI model.
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
	 * Generate an array of random integers using the OpenAI model.
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
	 * Generate an array of random floats using the OpenAI model.
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
	 * @description Check if a number is prime using the OpenAI model.
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

	/**
	 * @description Get a description or interesting fact about a number using the Groq model.
	 * @param n Required - number to describe
	 * @returns Promise resolving to DescribeNumberResponse containing the description or an error message.
	 */
	public async describeNumber(n: number): Promise<DescribeNumberResponse> {
		if (!n) {
			return { error: 'Number parameter is required.' }
		}

		try {
			const response = await this.client.chat.completions.create({
				model: this.model,
				response_format: { type: 'json_object' },
				messages: [
					SystemPrompts.DESCRIBE_NUMBER,
					{ role: 'user', content: `NUMBER: ${n}` },
				],
			})
			const messageContent = response.choices?.[0]?.message?.content
			if (!messageContent) {
				return { error: 'No response from AI. Maybe some error occurred.' }
			}

			const parsed = JSON.parse(messageContent)
			return { description: parsed?.description ?? parsed }
		} catch (error) {
			return {
				error: (error as Error).message ?? ' An unknown error occurred.',
			}
		}
	}

	/**
	 * @description Detect patterns in a sequence of numbers using the Groq model.
	 * @param sequence - Required - array of numbers or strings representing the sequence
	 * @returns Promise resolving to PatternDetectionResponse containing the detected pattern or an error message.
	 */
	public async patternDetection(
		sequence: number[] | string[],
	): Promise<PatternDetectionResponse> {
		const validation = PatternDetectionSchema.safeParse(sequence)
		if (!validation.success) {
			const errors = formatErrors(validation.error)

			return {
				error: errors.join(', ') || 'Invalid sequence input.',
			}
		}

		try {
			const response = await this.client.chat.completions.create({
				model: this.model,
				response_format: { type: 'json_object' },
				messages: [
					SystemPrompts.PATTERN_DETECTION,
					{
						role: 'user',
						content: `SEQUENCE: [${sequence.join(', ')}]`,
					},
				],
			})

			const messageContent = response.choices?.[0]?.message?.content
			if (!messageContent) {
				return { error: 'No response from AI. Maybe some error occurred.' }
			}

			const parsed = JSON.parse(messageContent)
			return { pattern: parsed?.pattern ?? parsed }
		} catch (error) {
			return {
				error: (error as Error).message ?? ' An unknown error occurred.',
			}
		}
	}

	// Expose the internal client for advanced use in a controlled way (testing/debugging).
	public get _internalClient(): OpenAI {
		return this.client
	}
}

export { NumberAiWithOpenAi }
