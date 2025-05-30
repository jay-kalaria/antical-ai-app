import "dotenv/config";
import OpenAI from "openai";
import { supabase } from "../../utils/supabase.js";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to get embeddings for a food name
const getEmbedding = async (text) => {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
            encoding_format: "float",
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error("Error getting embedding:", error);
        throw error;
    }
};

// Function to test food matching
const testFoodMatching = async (foodName) => {
    try {
        // Get embedding for the search query
        const queryEmbedding = await getEmbedding(foodName);

        // Search for similar foods
        const { data, error } = await supabase.rpc("match_foods", {
            query_embedding: queryEmbedding,
            match_threshold: 0.5,
            match_count: 5,
        });

        if (error) throw error;

        console.log(`\nSearch results for "${foodName}":`);
        data.forEach((match, index) => {
            console.log(
                `${index + 1}. ${match.name} (German: ${
                    match.german_name || "N/A"
                })`
            );
            console.log(
                `   Similarity: ${(match.similarity * 100).toFixed(2)}%`
            );
            console.log(`   Calories: ${match.calories}`);
            console.log("---");
        });

        return data;
    } catch (error) {
        console.error("Error testing food matching:", error);
    }
};

// Run the test with example queries
const runTests = async () => {
    await testFoodMatching("bread with olives");
};

runTests();
