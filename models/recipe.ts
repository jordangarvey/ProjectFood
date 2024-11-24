type recipe = {
	name: string;
	/** Array of ingredients required to make */
	ingredients: string[];
	/** Recipe method, in Markdown format */
	method: string;
	/** Duration to make, in minutes */
	time: number;
};

export default recipe;
