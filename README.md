# Overview

A small side project that allows a photo to be taken & uploaded to the Next server, which uses AWS rekognition to extract label data and then uses these with the ChatGPT API to generate a recipe idea.

## Local dev

To start run `npm run dev`.

## Envionment variables
* `OPENAI_API_KEY` — from the OpenAI dashboard.
* AWS variables — set from the CLI tool locally, set by AWS in prod.
