export interface LLMOptions {
	apiKey?: string
	model?: string
}

export interface RandomIntResponse {
	num: number | null
	error: string | null
}

export type RandomFloatResponse = RandomIntResponse

export interface RandomIntArrayResponse {
	nums?: number[]
	error?: string
}

export type RandomFloatArrayResponse = RandomIntArrayResponse
