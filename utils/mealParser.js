import Constants from "expo-constants";
import OpenAI from "openai";
import { calculateMealAnalysis } from "./mealGradeCalculator.js";

const OPENAI_API_KEY =
    Constants.expoConfig?.extra?.openaiApiKey || process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

// Define nutrition fields once
const NUTRITION_FIELDS = {
    calories: { type: "number" },
    protein_g: { type: "number" },
    fat_g: { type: "number" },
    carbohydrates_g: { type: "number" },
    fiber_g: { type: "number" },
    sugar_g: { type: "number" },
    sodium_mg: { type: "number" },
};

// Function schema for meal parsing
const mealParserSchema = {
    name: "extract_foods",
    description:
        "Extracts food items, quantities, and units from user meal descriptions. Be precise and consistent in your parsing. Seperate each dish",
    parameters: {
        type: "object",
        properties: {
            dishes: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Name of the food or dish.",
                        },
                        quantity: {
                            type: "number",
                            description: "Quantity as a number.",
                        },
                        unit: {
                            type: "string",
                            description: "Unit like slices, cups, glass, etc.",
                        },
                        isEstimated: {
                            type: "boolean",
                            description:
                                "Whether the portion was explicitly specified or estimated",
                        },
                        nutrition: {
                            type: "object",
                            properties: NUTRITION_FIELDS,
                            required: Object.keys(NUTRITION_FIELDS),
                        },
                    },
                    required: [
                        "name",
                        "quantity",
                        "unit",
                        "isEstimated",
                        "nutrition",
                    ],
                },
            },
            totalNutrition: {
                type: "object",
                properties: NUTRITION_FIELDS,
                required: Object.keys(NUTRITION_FIELDS),
            },
            gradeComment: {
                type: "string",
                description:
                    "A personalized, encouraging comment about the meal's nutritional quality. Should be specific to the foods mentioned and highlight positive aspects while giving constructive feedback. Keep it under 15 words and reference actual foods when possible.",
            },
        },
        required: ["dishes", "totalNutrition", "gradeComment"],
    },
};

// Helper function to validate nutrition fields
const validateNutritionFields = (nutrition, context) => {
    if (!nutrition) {
        throw new Error(`Missing nutrition in ${context}`);
    }

    Object.entries(NUTRITION_FIELDS).forEach(([field, { type }]) => {
        if (typeof nutrition[field] !== type) {
            throw new Error(
                `Missing or invalid nutrition field: ${field} in ${context}`
            );
        }
    });
};

// Function to parse meal description using GPT-4
export async function parseMealDescription(
    description,
    includeNutrition = false
) {
    try {
        if (!OPENAI_API_KEY) {
            throw new Error("OpenAI API key is missing");
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: `You are a meal parser that returns food items in JSON format. Be precise and consistent in your parsing.
                    First, validate if the input is related to food or meals. If it's not food-related, return a JSON with an error message.
                    ${
                        includeNutrition
                            ? `
                    When analyzing nutrition:
                    1. If a specific amount is mentioned (e.g., "150g paneer"), use that exact amount
                    2. If no amount is specified, estimate based on common serving sizes
                    3. Break down multi-component meals into individual items
                    4. Calculate nutrition for each component separately
                    5. Provide accurate nutritional information based on standard food databases
                    6. Return a strictly formatted JSON response with all components and total nutrition
                    
                    For the gradeComment field:
                    - Analyze the total nutrition to determine what grade this meal would likely receive (A=excellent, B=good, C=average, D=poor, E=very poor)
                    - Write a personalized, encouraging comment that:
                      * References specific foods from the meal when possible
                      * Highlights nutritional positives (high protein, fiber, vitamins, etc.)
                      * Gives constructive feedback for improvement if needed
                      * Maintains an encouraging, friendly tone
                      * Stays under 50 words
                      * Uses grade-appropriate language:
                        - A grade: "Excellent choice!" "Fantastic nutrition!"
                        - B grade: "Great meal!" "Well balanced!"
                        - C grade: "Good start!" "Nice balance, could be improved with..."
                        - D grade: "Consider adding..." "Try balancing with..."
                        - E grade: "Small changes can make a big difference, try..."
                    
                    Examples:
                    - "Great choice! Your salmon and quinoa combo provides excellent protein (28g) and fiber. The sweet potato adds valuable vitamins too!"
                    - "Good start with the chicken salad! Consider adding nuts or avocado next time to boost healthy fats and make it more filling."
                    - "Your veggie stir-fry is packed with nutrients! The high fiber (12g) and moderate calories make this a nutritious choice."`
                            : ""
                    }`,
                },
                {
                    role: "user",
                    content: description,
                },
            ],
            functions: [mealParserSchema],
            function_call: { name: "extract_foods" },
            temperature: 0,
        });

        // Extract the function call arguments
        const functionCall = response.choices[0].message.function_call;
        if (!functionCall || functionCall.name !== "extract_foods") {
            throw new Error("Invalid response format from GPT");
        }

        // Parse the JSON string into an object
        const parsedMeal = JSON.parse(functionCall.arguments);

        // Check if the response indicates non-food input
        if (parsedMeal.error) {
            throw new Error(parsedMeal.error);
        }

        // Validate the response structure
        if (!parsedMeal.dishes || !Array.isArray(parsedMeal.dishes)) {
            throw new Error("Invalid response structure");
        }

        // Validate each dish
        parsedMeal.dishes.forEach((dish, index) => {
            if (!dish.name || typeof dish.quantity !== "number" || !dish.unit) {
                throw new Error(`Invalid dish structure at index ${index}`);
            }

            if (includeNutrition) {
                if (typeof dish.isEstimated !== "boolean") {
                    throw new Error(
                        `Missing isEstimated field in dish at index ${index}`
                    );
                }
                validateNutritionFields(
                    dish.nutrition,
                    `dish at index ${index}`
                );
            }
        });

        // Validate total nutrition if included
        if (includeNutrition) {
            validateNutritionFields(
                parsedMeal.totalNutrition,
                "total nutrition"
            );

            // Validate gradeComment field
            if (
                !parsedMeal.gradeComment ||
                typeof parsedMeal.gradeComment !== "string"
            ) {
                throw new Error("Missing or invalid gradeComment field");
            }
        }

        return parsedMeal;
    } catch (error) {
        console.error("Error parsing meal description:", error);
        throw error;
    }
}

export async function parseAndAnalyzeMeal(description) {
    try {
        // Parse the meal description with nutrition data
        const parsedMeal = await parseMealDescription(description, true);

        // Calculate the meal grade based on nutritional content
        const mealAnalysis = calculateMealAnalysis({
            calories: parsedMeal.totalNutrition.calories,
            protein: parsedMeal.totalNutrition.protein_g,
            carbs: parsedMeal.totalNutrition.carbohydrates_g,
            fat: parsedMeal.totalNutrition.fat_g,
            sugar: parsedMeal.totalNutrition.sugar_g,
            fiber: parsedMeal.totalNutrition.fiber_g,
            sodium: parsedMeal.totalNutrition.sodium_mg,
        });

        // Add the calculated grade to the parsed meal
        parsedMeal.mealGrade = mealAnalysis.grade;

        return {
            parsedMeal,
            mealAnalysis,
            gradeComment: parsedMeal.gradeComment,
            description,
        };
    } catch (error) {
        console.error("Error parsing meal:", error);
        throw error;
    }
}

// Example usage:
// Basic parsing:
// const meal = await parseMealDescription("I had two slices of pepperoni pizza and a glass of orange juice");
// console.log(meal);
// Output:
// {
//   dishes: [
//     { name: "pepperoni pizza", quantity: 2, unit: "slices" },
//     { name: "orange juice", quantity: 1, unit: "glass" }
//   ]
// }
//
// With nutrition:
// const mealWithNutrition = await parseMealDescription("I had 150g paneer tikka with 2 rotis", true);
// console.log(mealWithNutrition);
// Output:
// {
//   dishes: [
//     {
//       name: "paneer tikka",
//       quantity: 150,
//       unit: "g",
//       isEstimated: false,
//       nutrition: {
//         calories: 350,
//         protein_g: 25,
//         fat_g: 28,
//         carbohydrates_g: 5,
//         fiber_g: 0,
//         sugar_g: 2,
//         sodium_mg: 600
//       }
//     },
//     {
//       name: "roti",
//       quantity: 2,
//       unit: "piece",
//       isEstimated: false,
//       nutrition: {
//         calories: 160,
//         protein_g: 4,
//         fat_g: 2,
//         carbohydrates_g: 30,
//         fiber_g: 2,
//         sugar_g: 0,
//         sodium_mg: 200
//       }
//     }
//   ],
//   totalNutrition: {
//     calories: 510,
//     protein_g: 29,
//     fat_g: 30,
//     carbohydrates_g: 35,
//     fiber_g: 2,
//     sugar_g: 2,
//     sodium_mg: 800
//   }
// }
