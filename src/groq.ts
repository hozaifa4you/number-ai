import dotenv from 'dotenv'
import Groq from 'groq-sdk'
import type { ChatCompletionCreateParamsBase } from 'groq-sdk/resources/chat/completions.mjs'
import type { RandomIntResponse } from './types/common'

dotenv.config()

const apiKey = process.env.GROQ_API_KEY

/**
 * Use composition (wrap the Groq client) instead of extending it.
 * This prevents exposing all Groq methods on the public instance.
 */
class NumberAiWithGroq {
	private client: Groq
	private model: ChatCompletionCreateParamsBase['model']

	constructor(userApiKey?: string, model?: string) {
		this.client = new Groq({ apiKey: userApiKey ?? apiKey })
		this.model = model ?? 'openai/gpt-oss-20b'
	}

	public async randomInt(
		min?: number,
		max?: number,
	): Promise<RandomIntResponse> {
		const response = await this.client.chat.completions.create({
			model: this.model,
			messages: [
				{
					role: 'system',
					content: `You are a helpful assistant that generates random integers. If both minimum and maximum values are provided, generate a random integer between them (inclusive). If only the minimum value is provided, generate a random integer greater than or equal to that value. If only the maximum value is provided, generate a random integer less than or equal to that value. If neither value is provided, generate any random integer. Provide response in JSON format like this: {"random_integer": <value>}. Please do not include any additional text or explanations.`,
				},
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
				num: null,
				error: 'No response from AI. Maybe some error occurred.',
			}
		}

		try {
			const parsed = JSON.parse(messageContent)
			return { num: parsed?.random_integer ?? parsed, error: null }
		} catch (_e) {
			return {
				num: null,
				error: 'No response from AI. Maybe some error occurred.',
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
