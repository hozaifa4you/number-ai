import dotenv from "dotenv";
import OpenAI from "openai";
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.mjs";
import { SystemPrompts } from "../common/system";
import type { RandomIntResponse } from "../types/common";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

class NumberAiWithOpenAi {
	private client: OpenAI;
	private model: ChatCompletionCreateParamsBase["model"];

	constructor(
		userApiKey?: string,
		model?: ChatCompletionCreateParamsBase["model"]
	) {
		const key = userApiKey ?? apiKey;
		if (!key) {
			throw new Error(
				"API key is required for OpenAI client initialization."
			);
		}

		this.client = new OpenAI({ apiKey: key });
		this.model = model ?? "gpt-4o-mini";
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
		max?: number
	): Promise<RandomIntResponse> {
		const response = await this.client.chat.completions.create({
			model: this.model,
			messages: [
				SystemPrompts.RANDOM_INT,
				{
					role: "user",
					content: `MIN: ${min ?? "not provided"}, MAX: ${
						max ?? "not provided"
					}. Please provide a random integer based on the given constraints.`,
				},
			],
		});

		const messageContent = response.choices?.[0]?.message?.content;
		if (!messageContent) {
			return {
				num: null,
				error: "No response from AI. Maybe some error occurred.",
			};
		}

		try {
			const parsed = JSON.parse(messageContent);
			return { num: parsed?.random_integer ?? parsed, error: null };
		} catch (_e) {
			return {
				num: null,
				error: "No response from AI. Maybe some error occurred.",
			};
		}
	}

	/**
	 * Generate a random float using the OpenAI model.
	 * If min or max are omitted, the model may choose an appropriate range.
	 *
	 * @param min - Optional minimum (inclusive)
	 * @param max - Optional maximum (inclusive)
	 * @returns Promise resolving to RandomIntResponse containing the number or an error message.
	 */
	public async randomFloat(
		min?: number,
		max?: number
	): Promise<RandomIntResponse> {
		const response = await this.client.chat.completions.create({
			model: this.model,
			messages: [
				SystemPrompts.RANDOM_FLOAT,
				{
					role: "user",
					content: `MIN: ${min ?? "not provided"}, MAX: ${
						max ?? "not provided"
					}. Please provide a random float based on the given constraints.`,
				},
			],
		});

		const messageContent = response.choices?.[0]?.message?.content;
		if (!messageContent) {
			return {
				num: null,
				error: "No response from AI. Maybe some error occurred.",
			};
		}

		try {
			const parsed = JSON.parse(messageContent);
			return { num: parsed?.random_float ?? parsed, error: null };
		} catch (_e) {
			return {
				num: null,
				error: "No response from AI. Maybe some error occurred.",
			};
		}
	}

	// Expose the internal client for advanced use in a controlled way (testing/debugging).
	public get _internalClient(): OpenAI {
		return this.client;
	}
}

export { NumberAiWithOpenAi };
