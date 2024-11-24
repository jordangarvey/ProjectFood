import { NextRequest, NextResponse } from "next/server";

import { analyseImage } from "@/lib/analyse";
import { generateRecipe } from "@/lib/recipegen";

async function POST(req: NextRequest) {
	const formData = await req.formData();
	const file = formData.get("file") as File;

	if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	try {
		const ingredients = await analyseImage(buffer);
		const recipe = await generateRecipe(ingredients);

		return NextResponse.json({ recipe });
	} catch (error) {
		console.error("Error analysing image:", error);
		return NextResponse.json({ error: "Unable to analyse image" }, { status: 500 });
	}
}

export {
	POST
};
