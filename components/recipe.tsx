import React from "react";
import Markdown from "react-markdown";

import recipe from "@/models/recipe";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Recipes(props: { recipe: recipe; }) {
	const { recipe } = props;

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>{recipe.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<h4 className="font-semibold">Ingredients:</h4>
						<ul className="list-disc pl-4">
							{recipe.ingredients.map((ingredient, i) => (
								<li key={i}>{ingredient}</li>
							))}
						</ul>

						<h4 className="font-semibold">Instructions:</h4>
						<Markdown className="whitespace-pre-line">{recipe.method}</Markdown>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default Recipes;
