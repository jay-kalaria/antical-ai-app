import { parse } from "csv-parse";
import "dotenv/config";
import { createReadStream } from "fs";
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
            match_threshold: 0.7,
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

const processSampleData = async () => {
    try {
        console.log("Processing sample food data...");

        const fileStream = createReadStream(
            "en.openfoodfacts.org.products.csv"
        );
        const parser = parse({
            columns: true,
            skip_empty_lines: true,
            delimiter: "\t",
            quote: '"',
            escape: '"',
            relax_quotes: true,
        });

        let count = 0;
        const batch = [];

        // Process only 100 records
        for await (const record of fileStream.pipe(parser)) {
            if (count >= 100) break; // Stop after 100 records

            // Skip if no product name
            if (!record.product_name) continue;

            // Get embedding for the product name
            const embedding = await getEmbedding(record.product_name);

            // Create food record
            const foodRecord = {
                name: record.product_name,
                embedding,
                calories: parseFloat(record.energy_100g) || 0,
                protein: parseFloat(record.proteins_100g) || 0,
                fat: parseFloat(record.fat_100g) || 0,
                saturated_fat: parseFloat(record["saturated-fat_100g"]) || 0,
                carbohydrates: parseFloat(record.carbohydrates_100g) || 0,
                fiber: parseFloat(record.fiber_100g) || 0,
                sugar: parseFloat(record.sugars_100g) || 0,
                sodium: parseFloat(record.sodium_100g) || 0,
                german_name: record.product_name_de,
                barcode: record.code,
                image_url: record.image_url,
            };

            batch.push(foodRecord);
            count++;

            console.log(`Processed ${count} records...`);
        }

        // Upload the batch to Supabase in smaller chunks
        console.log("Uploading to Supabase...");
        const BATCH_SIZE = 10;
        for (let i = 0; i < batch.length; i += BATCH_SIZE) {
            const chunk = batch.slice(i, i + BATCH_SIZE);
            const { data, error } = await supabase.from("foods").insert(chunk);
            if (error) throw error;
        }

        console.log("Successfully uploaded 100 records!");

        // Test the matching with some example queries
        console.log("\nTesting food matching...");
        await testFoodMatching("bread");
        await testFoodMatching("apple juice");
        await testFoodMatching("chocolate bar");
    } catch (error) {
        console.error("Error processing sample data:", error);
    }
};

// Run the test
processSampleData();
