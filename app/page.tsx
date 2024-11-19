"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Upload, ChefHat, Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type recipe = {
	name: string;
	instructions: string;
	ingredients: string[];
};

function Home() {
	const [image, setImage] = useState<Blob>();
	const [isLoading, setIsLoading] = useState(false);
	const [recipes, setRecipes] = useState<recipe[]>();
	const [error, setError] = useState<string>();
	const [isCameraOpen, setIsCameraOpen] = useState(false);

	const videoRef = useRef<any>(null);
	const streamRef = useRef<any>(null);

	// TODO: need to get this working
	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			videoRef.current.srcObject = stream;
			streamRef.current = stream;
			setIsCameraOpen(true);
			setError(undefined);
		} catch {
			setError("Unable to access camera. Please make sure you have granted camera permissions.");
		}
	};

	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track: any) => track.stop());
			setIsCameraOpen(false);
		}
	};

	const capturePhoto = () => {
		const video = videoRef.current;
		const canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		canvas.getContext("2d")?.drawImage(video, 0, 0);

		canvas.toBlob((blob) => {
			if (blob) {
				setImage(blob);
				stopCamera();
			}
		}, "image/jpeg");
	};

	const handleFileUpload = (event: any) => {
		const file = event.target.files[0];
		if (file) {
			setImage(file);
		}
	};

	const generateRecipes = async () => {
		if (isLoading) return;

		setIsLoading(true);
		setError(undefined);

		const formData = new FormData();
		formData.append("file", image!, "food.png");

		try {
			fetch(
				"/api/image/analyse",
				{
					method: "POST",
					body: formData
				}
			);

			// This is where you would implement the actual API call to OpenAI
			// For demonstration, we'll simulate a response
			const mockRecipes = [
				{
					name: "Vegetable Stir Fry",
					ingredients: ["carrots", "broccoli", "bell peppers"],
					instructions: "1. Chop vegetables\n2. Heat oil in pan\n3. Stir fry vegetables"
				},
				{
					name: "Garden Salad",
					ingredients: ["lettuce", "tomatoes", "cucumber"],
					instructions: "1. Wash vegetables\n2. Chop ingredients\n3. Mix in bowl"
				}
			];

			await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
			setRecipes(mockRecipes);
		} catch {
			setError("Failed to generate recipes. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-4 space-y-4">
			<Card>
				<CardHeader>
					<CardTitle>AI Recipe Generator</CardTitle>
					<CardDescription>
						Take a photo or upload an image of your ingredients to get recipe ideas
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div className="flex gap-2">
						<Button onClick={isCameraOpen ? stopCamera : startCamera}>
							<Camera className="mr-2 h-4 w-4" />
							{isCameraOpen ? "Close Camera" : "Open Camera"}
						</Button>

						<Button variant="outline" onClick={() => document.getElementById("file-upload")?.click()}>
							<Upload className="mr-2 h-4 w-4" />
							Upload Photo
						</Button>
						<input
							id="file-upload"
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleFileUpload}
						/>
					</div>

					{isCameraOpen && (
						<div className="relative">
							<video
								ref={videoRef}
								autoPlay
								playsInline
								className="w-full rounded-lg"
							/>
							<Button
								className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
								onClick={capturePhoto}
							>
                Take Photo
							</Button>
						</div>
					)}

					{image && !isCameraOpen && (
						<div className="space-y-4">
							<Image
								src={URL.createObjectURL(image)}
								alt="Captured ingredients"
								className="w-full rounded-lg"
								height={500}
								width={500}
							/>
							<Button
								className="w-full"
								onClick={generateRecipes}
								disabled={isLoading}
							>
								{isLoading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recipes...
									</>
								) : (
									<>
										<ChefHat className="mr-2 h-4 w-4" />
										Generate Recipes
									</>
								)}
							</Button>
						</div>
					)}

					{recipes && (
						<div className="space-y-4">
							{recipes.map((recipe, index) => (
								<Card key={index}>
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
											<p className="whitespace-pre-line">{recipe.instructions}</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

export default Home;
