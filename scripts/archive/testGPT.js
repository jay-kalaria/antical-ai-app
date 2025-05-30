import "dotenv/config";
import { writeFileSync } from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const getNutritionFromGPT = async (dish) => {
    const prompt = `
Give me the nutritional information for one serving (about 200g) of "${dish}".
Respond ONLY in this JSON format:
{
  "calories": number,
  "protein_g": number,
  "fat_g": number,
  "carbohydrates_g": number,
  "fiber_g": number,
  "sugar_g": number,
  "sodium_mg": number
}
`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o", // or "gpt-4" or "gpt-3.5-turbo"
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
    });

    // Extract JSON from the response
    const text = response.choices[0].message.content;
    try {
        // Find the first { ... } block and parse it
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in response");
        return JSON.parse(jsonMatch[0]);
    } catch (err) {
        console.error("Failed to parse JSON:", err, "\nRaw response:", text);
        return null;
    }
};

const main = async () => {
    const dish = "paneer tikka masala";
    const nutrition = await getNutritionFromGPT(dish);

    if (nutrition) {
        // Save to a JSON file
        writeFileSync(
            "nutrition_paneer_tikka_masala.json",
            JSON.stringify(nutrition, null, 2)
        );
        console.log("Nutrition info saved:", nutrition);
    }
};

main();
