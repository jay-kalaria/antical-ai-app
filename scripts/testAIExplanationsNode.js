import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials in .env file");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

/**
 * Generate and store AI explanation for a completed day
 */
async function generateAndStoreAIExplanation(date) {
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
    if (!openai) {
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

async function testAIExplanations() {
    console.log("🧪 Testing AI Explanation Generation (Short Format)\n");

    try {
        // Test specific date: May 28th, 2025
        const testDate = new Date("2025-05-26");
        const dateString = testDate.toISOString().split("T")[0];

        console.log(`📅 Testing specific date: ${dateString}`);
        const result = await generateAndStoreAIExplanation(testDate);

        if (result) {
            console.log("✅ Success!");
            console.log(`   Statement: "${result.ai_explanation}"`);
            console.log(
                `   Length: ${result.ai_explanation.length} characters`
            );
            console.log(`   Grade: ${result.average_grade}`);
            console.log(`   Source: ${result.explanation_source}`);
            console.log(
                `   Key Factors: ${JSON.stringify(result.ai_key_factors)}\n`
            );
        } else {
            console.log(
                "⚠️  No data found for 2025-05-28 or explanation already exists\n"
            );
        }

        // Check database for recent explanations
        console.log("📊 Checking recent explanations in database...");
        const { data: recentExplanations } = await supabase
            .from("daily_grades")
            .select("date, ai_explanation, explanation_source, average_grade")
            .not("ai_explanation", "is", null)
            .order("date", { ascending: false })
            .limit(5);

        if (recentExplanations && recentExplanations.length > 0) {
            console.log("   Recent explanations:");
            recentExplanations.forEach((exp) => {
                console.log(
                    `   ${exp.date} (${exp.average_grade}): "${exp.ai_explanation}" [${exp.explanation_source}] (${exp.ai_explanation.length} chars)`
                );
            });
        } else {
            console.log("   No explanations found in database");
        }
    } catch (error) {
        console.error("❌ Test failed:", error.message);
    }
}

testAIExplanations();
