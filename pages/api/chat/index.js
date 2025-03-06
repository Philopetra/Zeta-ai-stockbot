import { convertToCoreMessages, smoothStream, streamText } from "ai";
import { createMistral } from "@ai-sdk/mistral";
import { createGroq } from "@ai-sdk/groq";


const groq = createGroq({
	apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});


const mistral = createMistral({
	apiKey: process.env.NEXT_PUBLIC_MISTRAL_API_KEY,
});

export const dynamic = "force-dynamic";

function selectModel(model) {
	const models = {
		groq: "llama3-8b-8192",
		mistral: "mistral-large-latest",
	};
	const modelName = models[model];
	let modelProvider;
	switch (model) {
		case "groq":
			modelProvider = groq(modelName);
			break;
		case "mistral":
			modelProvider = mistral(modelName);
			break;
		default:
			modelProvider = groq(modelName);
	}
	return modelProvider;
}

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method Not Allowed" });
	}

	try {
		const { messages, model, temperature } = req.body;
		// let modelProvider = selectModel(model); // use in the production
		let modelProvider = selectModel(model); // use the selected model provider
		const result = streamText({
			model: groq("llama3-8b-8192"), // change to use the dynamically selected model provider
			system: "You are a helpful assistant.",
			messages: convertToCoreMessages(messages),
			maxSteps: 5,
			temperature,
			experimental_transform: smoothStream({ chunking: "word" }),
		});
		for await (const chunk of result.textStream) {
			res.write(chunk);
		}
		res.end();
	} catch (error) {
		console.error("API Error:", error);
		return res
			.status(500)
			.json({ error: "Internal Server Error", details: error.message });
	}
}
