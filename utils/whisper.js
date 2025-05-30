import Constants from "expo-constants";
import OpenAI from "openai";

// Get the API key from environment variables
const OPENAI_API_KEY =
    Constants.expoConfig?.extra?.openaiApiKey || process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error(
        "OpenAI API key is missing. Please add it to your .env file or app.config.js"
    );
}

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export const transcribeAudio = async (audioUri) => {
    try {
        if (!OPENAI_API_KEY) {
            throw new Error("OpenAI API key is missing");
        }

        // Create form data
        const formData = new FormData();
        formData.append("file", {
            uri: audioUri,
            type: "audio/m4a",
            name: "recording.m4a",
        });
        formData.append("model", "whisper-1");
        formData.append("language", "en"); // Specify English language
        formData.append("response_format", "json"); // Request JSON response

        console.log("Sending audio for transcription...");

        // Make the API request
        const response = await fetch(
            "https://api.openai.com/v1/audio/transcriptions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error("API Error:", errorData);
            throw new Error(
                `API request failed with status ${response.status}`
            );
        }

        const data = await response.json();
        console.log("Transcription response:", data);

        if (!data.text) {
            throw new Error("No transcription text in response");
        }

        return data.text;
    } catch (error) {
        console.error("Error transcribing audio:", error);
        throw error;
    }
};
