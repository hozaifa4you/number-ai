import dotenv from 'dotenv'
import OpenAI from 'openai'
import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions.mjs'
import type { RandomIntResponse } from './types/common'

dotenv.config()

const apiKey = process.env.OPENAI_API_KEY

class NumberAiWithOpenAi {
	private client: OpenAI
	private model: ChatCompletionCreateParamsBase['model']

	constructor(
		userApiKey?: string,
		model?: ChatCompletionCreateParamsBase['model'],
	) {
		const key = userApiKey ?? apiKey
		if (!key) {
			throw new Error('API key is required for OpenAI client initialization.')
		}

		this.client = new OpenAI({ apiKey: key })
		this.model = model ?? 'gpt-4o-mini'
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

	// Expose the internal client for advanced use in a controlled way (testing/debugging).
	public get _internalClient(): OpenAI {
		return this.client
	}
}

export { NumberAiWithOpenAi }
