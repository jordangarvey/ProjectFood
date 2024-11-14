import { NextResponse, NextRequest } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import formidable, { File } from "formidable";
import fs from "fs";
import { Readable } from "stream";

export const config = {
	api: { bodyParser: false },
};

// Convert a Next.js ReadableStream into a Node.js-readable buffer
async function streamToBuffer(stream: ReadableStream): Promise<Buffer> {
	const reader = stream.getReader();
	const chunks: Uint8Array[] = [];

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		chunks.push(value);
	}

	return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
	const buffer = await streamToBuffer(req.body as ReadableStream);

	const form = formidable({ multiples: false });

	return new Promise((resolve) => {
		// Use `parse` on a simulated incoming request with the Buffer
		form.parse(Readable.from(buffer) as any, async (err: Error | null, fields: formidable.Fields, files: formidable.Files) => {
			if (err) {
				console.error("Error parsing file:", err);
				resolve(NextResponse.json({ error: "File parsing failed" }, { status: 500 }));
				return;
			}

			const file = files.file as File;
			const imagePath = file.filepath;
			const imageStream = fs.createReadStream(imagePath);

			try {
				const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
				const openai = new OpenAIApi(configuration);

				const response = await openai.createImageEdit({
					file: imageStream,
					prompt: "Analyze this image",
				});

				resolve(NextResponse.json(response.data, { status: 200 }));
			} catch (error) {
				console.error("OpenAI API request failed:", error);
				resolve(NextResponse.json({ error: "Failed to analyze image" }, { status: 500 }));
			}
		});
	});
}
