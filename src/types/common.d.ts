export interface LLMOptions {
	apiKey?: string
	model?: string
}

export interface RandomIntResponse {
	num?: number
	error?: string
}

export type RandomFloatResponse = RandomIntResponse

export interface RandomIntArrayResponse {
	nums?: number[]
	error?: string
}

export type RandomFloatArrayResponse = RandomIntArrayResponse

export interface IsPrimeResponse {
	is_prime?: boolean
	error?: string
}
