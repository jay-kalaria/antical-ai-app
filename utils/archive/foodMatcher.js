import { createClient } from "@supabase/supabase-js";
import * as tf from "@tensorflow/tfjs";
import { parseMealDescription } from "../mealParser";
import { supabase } from "../supabase";


// Load the Universal Sentence Encoder model
let model;
const loadModel = async () => {
    if (!model) {
        model = await tf.loadGraphModel(
            "https://tfhub.dev/tensorflow/tfjs-model/universal-sentence-encoder-lite/1/default/1"
        );
    }
    return model;
};

// Function to get embeddings for a food name
const getEmbedding = async (text) => {
    const model = await loadModel();
    const embedding = await model.predict(tf.tensor([text]));
    return embedding.arraySync()[0];
};

// Function to find closest matches in USDA database
const findClosestMatches = async (foodName, limit = 5) => {
    try {
        const embedding = await getEmbedding(foodName);

        // Query the vector database
        const { data, error } = await supabase.rpc("match_foods", {
            query_embedding: embedding,
            match_threshold: 0.7,
            match_count: limit,
        });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error("Error finding matches:", error);
        throw error;
    }
};

// Function to calculate nutritional score_old for database
const calculateNutritionalScore = (foodData) => {
    // Basic scoring system (can be expanded)
    let score = 100;

    // Penalize high sugar
    if (foodData.sugar > 10) {
        score -= (foodData.sugar - 10) * 2;
    }

    // Penalize high saturated fat
    if (foodData.saturated_fat > 5) {
        score -= (foodData.saturated_fat - 5) * 3;
    }

    // Reward high fiber
    if (foodData.fiber > 5) {
        score += foodData.fiber;
    }

    // Reward high protein
    if (foodData.protein > 10) {
        score += foodData.protein * 0.5;
    }

    return Math.max(0, Math.min(100, score));
};

// Main function to process a meal description
export const processMeal = async (description) => {
    try {
        // Parse the meal description
        const parsedMeal = await parseMealDescription(description);

        // Process each dish
        const processedDishes = await Promise.all(
            parsedMeal.dishes.map(async (dish) => {
                // Find closest matches in USDA database
                const matches = await findClosestMatches(dish.name);

                // Get the best match
                const bestMatch = matches[0];

                // Calculate nutritional score
                const score = calculateNutritionalScore(bestMatch);

                return {
                    ...dish,
                    usdaMatch: bestMatch,
                    nutritionalScore: score,
                    alternatives: matches.slice(1),
                };
            })
        );

        // Calculate overall meal score
        const overallScore =
            processedDishes.reduce(
                (acc, dish) => acc + dish.nutritionalScore,
                0
            ) / processedDishes.length;

        return {
            dishes: processedDishes,
            overallScore,
            servingStyle: parsedMeal.servingStyle,
        };
    } catch (error) {
        console.error("Error processing meal:", error);
        throw error;
    }
};
