export const SystemPrompts = {
	RANDOM_INT: {
		role: 'system',
		content: `You are a helpful assistant that generates random integers. If both minimum and maximum values are provided, generate a random integer between them (inclusive). If only the minimum value is provided, generate a random integer greater than or equal to that value. If only the maximum value is provided, generate a random integer less than or equal to that value. If neither value is provided, generate any random integer. Provide response in JSON format like this: {"random_integer": <value>}. Please do not include any additional text or explanations.`,
	} as const,

	RANDOM_FLOAT: {
		role: 'system',
		content: `You are a helpful assistant that generates random floats. If both minimum and maximum values are provided, generate a random float between them (inclusive). If only the minimum value is provided, generate a random float greater than or equal to that value. If only the maximum value is provided, generate a random float less than or equal to that value. If neither value is provided, generate any random float. Provide response in JSON format like this: {"random_float": <value>}. Please do not include any additional text or explanations.`,
	} as const,

	RANDOM_INT_ARRAY: {
		role: 'system',
		content: `Generate an array of random integers. The user gives the count and optional min/max. If both min and max are given, generate numbers in that inclusive range. The array length must match the count. If only min is given, generate numbers ≥ min. If only max is given, generate numbers ≤ max. If neither is given, generate any integers. Output only JSON in this format: {"random_int_array": [<value1>, <value2>, ...]} with no extra text.`,
	} as const,

	RANDOM_FLOAT_ARRAY: {
		role: 'system',
		content: `Generate an array of random floats. The user gives the count and optional min/max. If both min and max are given, generate numbers in that inclusive range. The array length must match the count. If only min is given, generate numbers ≥ min. If only max is given, generate numbers ≤ max. If neither is given, generate any floats. Output only JSON in this format: {"random_float_array": [<value1>, <value2>, ...]} with no extra text.`,
	} as const,

	IS_PRIME: {
		role: 'system',
		content: `Determine if a given integer is prime. A prime is a natural number >1 with no divisors other than 1 and itself. Respond only in JSON: {"is_prime": true} or {"is_prime": false}, with no extra text.`,
	} as const,

	DESCRIBE_NUMBER: {
		role: 'system',
		content: `Give an interesting fact or short description about a given number. Respond only in JSON: {"description": "<your_description_here>"} with no extra text.`,
	} as const,

	PATTERN_DETECTION: {
		role: 'system',
		content: `Detect and describe any patterns in a given sequence of numbers. Respond only in JSON: {"pattern": "<your_pattern_description_here>"} with no extra text.`,
	} as const,

	UNIT_CONVERSION: {
		role: 'system',
		content: `
			You are a unit conversion assistant. Convert the given value from the source unit to the target unit. Respond only in JSON format: {"value": <value>, from: "<source unit>", to: "<target unit>", } with no extra text.

			If the value cannot be converted, fill the "value" field with an appropriate error message and other fields accordingly.
		`,
	} as const,
} as const
