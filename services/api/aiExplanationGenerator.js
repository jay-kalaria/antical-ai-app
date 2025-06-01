import { supabase } from "@/utils/supabase";
import Constants from "expo-constants";
import OpenAI from "openai";

const OPENAI_API_KEY =
    Constants.expoConfig?.extra?.openaiApiKey || process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

/**
 * Generate and store AI explanation for a completed day
 */
export async function generateAndStoreAIExplanation(date) {
    try {
        const dateString = new Date(date).toISOString().split("T")[0];

        // Get daily grade
        const { data: dailyGrade, error } = await supabase
            .from("daily_grades")
            .select("*")
            .eq("date", dateString)
            .single();

        if (error || !dailyGrade) {
            console.log(`No daily grade found for ${dateString}`);
            return null;
        }

        // Skip if explanation already exists
        if (dailyGrade.ai_explanation) {
            console.log(`Explanation already exists for ${dateString}`);
            return dailyGrade;
        }

        // Get meals for context
        const { data: meals } = await supabase
            .from("meal_logs")
            .select("meal_name, meal_grade")
            .gte("meal_date", `${dateString}T00:00:00`)
            .lt("meal_date", `${dateString}T23:59:59`);

        // Generate AI explanation
        const explanation = await generateAIExplanation(
            dailyGrade,
            meals || []
        );

        // Store in database
        const { data: updatedGrade, error: updateError } = await supabase
            .from("daily_grades")
            .update({
                ai_explanation: explanation.statement,
                ai_key_factors: explanation.keyFactors,
                explanation_generated_at: new Date().toISOString(),
                explanation_source: explanation.source,
            })
            .eq("date", dateString)
            .select()
            .single();

        if (updateError) throw updateError;

        console.log(`✅ AI explanation stored for ${dateString}`);
        return updatedGrade;
    } catch (error) {
        console.error(`❌ Error:`, error);
        return null;
    }
}

async function generateAIExplanation(dailyGrade, meals) {
    if (!OPENAI_API_KEY) {
        return {
            statement:
                "Your nutrition journey continues — keep building healthy habits!",
            keyFactors: [],
            source: "fallback",
        };
    }

    try {
        const {
            average_grade,
            total_calories,
            total_protein,
            total_fiber,
            total_sugar,
        } = dailyGrade;
        const mealNames = meals
            .map((m) => m.meal_name)
            .filter(Boolean)
            .slice(0, 3);

        const prompt = `Analyze this ${average_grade}-grade day:
Nutrition: ${Math.round(total_calories)} cal, ${Math.round(
            total_protein
        )}g protein, ${Math.round(total_fiber)}g fiber, ${Math.round(
            total_sugar
        )}g sugar
${mealNames.length > 0 ? `Meals: ${mealNames.join(", ")}` : ""}

Write a very brief, encouraging note (max 15 words) about this day's nutrition. Reference specific foods if possible.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a friendly nutrition coach. Write very short, encouraging notes under 15 words. Reference foods when possible.",
                },
                { role: "user", content: prompt },
            ],
            max_tokens: 30,
            temperature: 0.7,
        });

        const aiText = response.choices[0]?.message?.content?.trim();

        return {
            statement: aiText || "Great job tracking your meals!",
            keyFactors: extractKeyFactors(dailyGrade),
            source: "ai",
        };
    } catch (error) {
        console.error("AI generation failed:", error);
        return {
            statement: generateFallbackStatement(dailyGrade.average_grade),
            keyFactors: extractKeyFactors(dailyGrade),
            source: "fallback",
        };
    }
}

function extractKeyFactors(dailyGrade) {
    const factors = [];

    if (dailyGrade.total_fiber >= 20) {
        factors.push({ text: "excellent fiber", type: "positive" });
    } else if (dailyGrade.total_fiber < 10) {
        factors.push({ text: "low fiber", type: "negative" });
    }

    if (dailyGrade.total_protein >= 80) {
        factors.push({ text: "high protein", type: "positive" });
    }

    if (dailyGrade.total_sugar > 50) {
        factors.push({ text: "high sugar", type: "negative" });
    }

    return factors.slice(0, 2);
}

function generateFallbackStatement(grade) {
    const statements = {
        A: "Outstanding choices — keep it up!",
        B: "Great progress — almost there!",
        C: "Good effort — add more veggies!",
        D: "Let's focus on whole foods!",
        E: "Fresh start tomorrow!",
    };
    return statements[grade] || statements["C"];
}

/**
 * Batch generate explanations for multiple days
 * Useful for backfilling or processing multiple days
 */
export async function batchGenerateExplanations(days = 7) {
    const results = [];
    const today = new Date();

    for (let i = 1; i <= days; i++) {
        // Skip today, start from yesterday
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        try {
            const result = await generateAndStoreAIExplanation(date);
            results.push({
                date: date.toISOString().split("T")[0],
                success: true,
                result,
            });

            // Small delay to respect rate limits
            await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
            results.push({
                date: date.toISOString().split("T")[0],
                success: false,
                error: error.message,
            });
        }
    }

    return results;
}
