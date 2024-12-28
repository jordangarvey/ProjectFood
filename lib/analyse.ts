import { RekognitionClient, DetectLabelsCommand, Label } from "@aws-sdk/client-rekognition";

const rekognitionClient = new RekognitionClient({ region: process.env.AWS_REGION });

const ignoredLabels = [
	"Food", "Brunch", "Produce", "Meal", "Dish", "Lunch",
	"Breakfast", "Supper", "Dinner", "Cuisine", "Snack"
];

function selectFoodLabels(labels: Label[]) {
	const ingredients: string[] = [];

	for (const label of labels) {
		const categoryName = label.Categories?.[0]?.Name;

		if (!label.Name || !categoryName || !label.Confidence) {
			console.warn("Unable to process label as missing required data", label);
			continue;
		}

		// Only consider food labels with a confidence of 70% or higher
		if (categoryName?.toLowerCase().includes("food") && label.Confidence > 50) {
			// Filter out some generic labels
			if (ignoredLabels.includes(label.Name)) {
				console.warn(`Ignoring generic label: ${label.Name}`);
				continue;
			}

			ingredients.push(label.Name);
		}
	}

	if (!ingredients.length) throw new Error("No food labels detected in image");
	return ingredients;
}

async function analyseImage(imageBuffer: Buffer) {
	try {
		const params = {
			Image: {
				Bytes: imageBuffer,
			},
			MaxLabels: 10,
		};

		const command = new DetectLabelsCommand(params);
		const response = await rekognitionClient.send(command);

		if (!response.Labels) {
			throw new Error("No labels detected in image");
		}

		const ingredients = selectFoodLabels(response.Labels);

		console.debug("Detected ingredients:", ingredients);

		return ingredients;
	} catch (error) {
		console.error("Rekognition Error:", error);
		throw error;
	}
};

export {
	analyseImage
};
