import dotenv from "dotenv";
import Groq from "groq-sdk";
import type { ChatCompletionCreateParamsBase } from "groq-sdk/resources/chat/completions.mjs";
import { SystemPrompts } from "../common/system";
import type { RandomIntResponse } from "../types/common";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;

class NumberAiWithGroq {
	private client: Groq;
	private model: ChatCompletionCreateParamsBase["model"];

	constructor(userApiKey?: string, model?: string) {
		const key = userApiKey ?? apiKey;
		if (!key) {
			throw new Error("API key is required for Groq client initialization.");
		}

		this.client = new Groq({ apiKey: key });
		this.model = model ?? "openai/gpt-oss-20b";
	}

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

	// Provide a way to access the underlying client for advanced scenarios
	// but keep it intentionally non-enumerable to avoid accidental usage.
	public get _internalClient(): Groq {
		return this.client;
	}
}

export { NumberAiWithGroq };
