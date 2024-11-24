import OpenAI from "openai";

async function generateRecipe(ingredients: string[]) {
	const ai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
	});

	try {
		const response = await ai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "user",
					content: `
					Generate a single recipe using the following ingredients: ${ingredients.join(", ")}.
					I need the response as a JSON object using the following schema:
					{
						// The ingredients used in the recipe
						"ingredients": string[],
						// How to cook the recipe. This string should be in Markdown syntax.
						"method": string
						// In minutes for the total recipe
						"time": number
					}
					The recipe ideally should only use the ingredients provided. If this is not
					possible then please use the minimum number of additional ingredients, but mention the fact
					that there’s extra inside the method.
					`
				}
			]
		});

		if (!response.choices?.[0].message?.content) throw new Error("No acceptable response from OpenAI");

		return response.choices[0].message.content;
	} catch (error) {
		console.error("Error fetching recipe:", error);
		throw error;
	}
}

export {
	generateRecipe
};
