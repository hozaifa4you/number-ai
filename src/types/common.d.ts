export interface RandomIntResponse {
	num: number | null
	error: string | null
}

export type RandomFloatResponse = RandomIntResponse

export interface LLMOptions {
	apiKey?: string
	model?: string
}
