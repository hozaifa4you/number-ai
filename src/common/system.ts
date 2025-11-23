export const SystemPrompts = {
	RANDOM_INT: {
		role: "system",
		content: `You are a helpful assistant that generates random integers...`,
	},

	RANDOM_FLOAT: {
		role: "system",
		content: `You are a helpful assistant that generates random floats...`,
	},
} as const;
