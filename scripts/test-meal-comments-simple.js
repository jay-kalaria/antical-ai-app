import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Define nutrition fields
const NUTRITION_FIELDS = {
    calories: { type: "number" },
    protein_g: { type: "number" },
    fat_g: { type: "number" },
    carbohydrates_g: { type: "number" },
    fiber_g: { type: "number" },
    sugar_g: { type: "number" },
    sodium_mg: { type: "number" },
};

// Function schema for meal parsing with AI comments
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
                    "A personalized, encouraging comment about the meal's nutritional quality. Should be specific to the foods mentioned and highlight positive aspects while giving constructive feedback. Keep it under 50 words and reference actual foods when possible.",
            },
        },
        required: ["dishes", "totalNutrition", "gradeComment"],
    },
};

async function testMealComments() {
    const testMeals = [
        "I had grilled salmon with quinoa and steamed broccoli",
        "Two slices of pepperoni pizza and a coke",
        "Greek yogurt with berries and granola",
    ];

    console.log("🧪 Testing AI-generated meal comments...\n");

    for (const meal of testMeals) {
        try {
            console.log(`📝 Testing: "${meal}"`);

            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: `You are a meal parser that returns food items in JSON format. Be precise and consistent in your parsing.
                        First, validate if the input is related to food or meals. If it's not food-related, return a JSON with an error message.
                        
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
                        - "Your veggie stir-fry is packed with nutrients! The high fiber (12g) and moderate calories make this a nutritious choice."`,
                    },
                    {
                        role: "user",
                        content: meal,
                    },
                ],
                functions: [mealParserSchema],
                function_call: { name: "extract_foods" },
                temperature: 0,
            });

            const functionCall = response.choices[0].message.function_call;
            const parsedMeal = JSON.parse(functionCall.arguments);

            console.log(`   ✅ Comment: "${parsedMeal.gradeComment}"`);
            console.log(
                `   📊 Nutrition: ${parsedMeal.totalNutrition.calories} cal, ${parsedMeal.totalNutrition.protein_g}g protein, ${parsedMeal.totalNutrition.fiber_g}g fiber`
            );
            console.log("");
        } catch (error) {
            console.error(`❌ Error testing "${meal}":`, error.message);
            console.log("");
        }
    }
}

testMealComments().catch(console.error);
