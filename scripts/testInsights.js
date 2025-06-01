/**
 * Test function to demonstrate insights generation with mock data
 * This can be used for testing and development purposes
 */
export async function testInsightsGeneration() {
    console.log("=== Testing Insights Generation ===");

    // Mock data for testing
    const mockDailyGrade = {
        date: "2024-01-15",
        average_grade: "B",
        meal_count: 2,
        grade_score: 75,
        source: "calculated",
    };

    const mockMeals = [
        {
            id: "1",
            meal_name: "Oatmeal with berries",
            meal_grade: "A",
            meal_date: "2024-01-15T08:00:00Z",
            protein: 12,
            fiber: 8,
            sugar: 15,
            sodium: 200,
            calories: 350,
        },
        {
            id: "2",
            meal_name: "Chicken sandwich",
            meal_grade: "C",
            meal_date: "2024-01-15T13:00:00Z",
            protein: 25,
            fiber: 3,
            sugar: 8,
            sodium: 800,
            calories: 450,
        },
        {
            id: "3",
            meal_name: "Salad with quinoa",
            meal_grade: "A",
            meal_date: "2024-01-14T19:00:00Z",
            protein: 18,
            fiber: 12,
            sugar: 5,
            sodium: 300,
            calories: 400,
        },
    ];

    // Temporarily mock the API functions for testing
    const originalFetch = global.fetch;

    // Mock fetchDailyGrade
    const mockFetchDailyGrade = () => Promise.resolve(mockDailyGrade);

    // Mock getMeals
    const mockGetMeals = () => Promise.resolve(mockMeals);

    try {
        // Replace the imports temporarily for testing
        const { generateInsights: testGenerateInsights } = await import(
            "../services/api/insightsService"
        );

        // Generate insights with mock data
        const insights = await testGenerateInsights();

        console.log("Generated Insights:");
        insights.forEach((insight, index) => {
            console.log(`${index + 1}. ${insight.emoji} ${insight.title}`);
            console.log(`   ${insight.description}`);
            console.log(
                `   Category: ${insight.category}, Priority: ${insight.priority}, Actionable: ${insight.actionable}`
            );
            console.log("");
        });

        return insights;
    } catch (error) {
        console.error("Error testing insights generation:", error);
        return [];
    } finally {
        global.fetch = originalFetch;
    }
}

/**
 * Test specific scenarios for insights generation
 */
export function testInsightScenarios() {
    console.log("=== Testing Different Insight Scenarios ===");

    const scenarios = [
        {
            name: "New User (No meals)",
            dailyGrade: null,
            meals: [],
        },
        {
            name: "A-Grade Day",
            dailyGrade: { average_grade: "A", meal_count: 3 },
            meals: [
                { meal_grade: "A", protein: 25, fiber: 10, sugar: 5 },
                { meal_grade: "A", protein: 20, fiber: 8, sugar: 3 },
                { meal_grade: "A", protein: 18, fiber: 12, sugar: 7 },
            ],
        },
        {
            name: "Low Fiber Day",
            dailyGrade: { average_grade: "C", meal_count: 2 },
            meals: [
                { meal_grade: "C", protein: 15, fiber: 2, sugar: 25 },
                { meal_grade: "C", protein: 20, fiber: 1, sugar: 18 },
            ],
        },
        {
            name: "High Sodium Day",
            dailyGrade: { average_grade: "D", meal_count: 3 },
            meals: [
                { meal_grade: "D", protein: 20, fiber: 5, sodium: 2000 },
                { meal_grade: "D", protein: 15, fiber: 3, sodium: 1800 },
                { meal_grade: "C", protein: 18, fiber: 6, sodium: 1200 },
            ],
        },
    ];

    scenarios.forEach((scenario) => {
        console.log(`\n--- ${scenario.name} ---`);

        // This would normally call the actual insight generation functions
        // For now, we'll just show what insights would be generated
        if (!scenario.dailyGrade) {
            console.log("🚀 Start your journey - Log your first meal today!");
        } else if (scenario.dailyGrade.average_grade === "A") {
            console.log("🌟 Excellent choices today!");
        } else if (scenario.dailyGrade.average_grade === "D") {
            console.log("🔄 Let's turn this around - Focus on whole foods");
        }

        // Check for nutrition-specific insights
        if (scenario.meals.length > 0) {
            const avgFiber =
                scenario.meals.reduce(
                    (sum, meal) => sum + (meal.fiber || 0),
                    0
                ) / scenario.meals.length;
            const avgSodium =
                scenario.meals.reduce(
                    (sum, meal) => sum + (meal.sodium || 0),
                    0
                ) / scenario.meals.length;

            if (avgFiber < 5) {
                console.log(
                    "🥦 Boost your fiber - Add more vegetables and whole grains"
                );
            }
            if (avgSodium > 1500) {
                console.log(
                    "🧂 Sodium check - Try fresh herbs instead of salt"
                );
            }
        }
    });
}

// Export for console testing
if (typeof window !== "undefined") {
    window.testInsights = testInsightsGeneration;
    window.testInsightScenarios = testInsightScenarios;
}
