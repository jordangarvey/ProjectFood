"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Camera, Upload, ChefHat, Loader2 } from "lucide-react";

import recipe from "@/models/recipe";

import AlertBox from "@/components/alertbox";
import Recipe from "@/components/recipe";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function Home() {
	const [image, setImage] = useState<File>();
	const [isLoading, setIsLoading] = useState(false);
	const [recipeData, setRecipeData] = useState<recipe>();
	const [error, setError] = useState<string>();
	const [isCameraOpen, setIsCameraOpen] = useState(false);

	const videoRef = useRef<any>(null);
	const streamRef = useRef<any>(null);

	useEffect(() => {
		if (isCameraOpen && streamRef.current) {
			videoRef.current.srcObject = streamRef.current;
		}
	}, [isCameraOpen]);

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			streamRef.current = stream;

			setIsCameraOpen(true);
			setError(undefined);
		} catch (error) {
			console.error(error);
			setError("Unable to access camera. Please make sure you have granted camera permissions.");
		}
	};

	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track: any) => track.stop());
		}

		setIsCameraOpen(false);
	};

	const capturePhoto = () => {
		const video = videoRef.current;
		const canvas = document.createElement("canvas");

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		canvas.getContext("2d")?.drawImage(video, 0, 0);

		canvas.toBlob((blob) => {
			if (blob) {
				setImage(blob as File);
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
			const response = await fetch(
				"/api/image/analyse",
				{
					method: "POST",
					body: formData
				}
			);

			const jsonResponse = await response.json();

			if (!jsonResponse.recipe) throw new Error("No recipe data returned");

			setRecipeData(jsonResponse.recipe);
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
					{error && <AlertBox alert={error}/>}

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

					{recipeData && <Recipe recipe={recipeData}/>}
				</CardContent>
			</Card>
		</div>
	);
}

export default Home;
