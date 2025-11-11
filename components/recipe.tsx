import React from "react";
import dynamic from "next/dynamic";

import recipe from "@/models/recipe";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dynamically import Markdown component to reduce initial bundle size
const Markdown = dynamic(() => import("react-markdown"), {
	loading: () => <div className="animate-pulse h-4 bg-gray-200 rounded"></div>,
	ssr: false,
});

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

// Memoize component to prevent unnecessary re-renders when parent re-renders
export default React.memo(Recipes);
