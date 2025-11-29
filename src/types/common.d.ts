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

export interface DescribeNumberResponse {
	description?: string
	error?: string
}

export interface PatternDetectionResponse {
	pattern?: string
	error?: string
}

export interface UnitConversionResponse {
	value?: number | string
	from?: string
	to?: string
	error?: string
}

export interface PatternGenerator {
	sequence?: number[] | string[]
	error?: string
}
