import { fetchDailyGrade } from "./gradeService";
import { getMeals } from "./mealService";

/**
 * Generate insights based on daily grade and recent meal data
 * @param {Date} date - The date to generate insights for (defaults to today)
 * @returns {Array} Array of insight objects in the Tip format
 */
export async function generateInsights(date = new Date()) {
    try {
        const insights = [];

        // Get daily grade data (includes pre-calculated nutrition totals)
        const dailyGrade = await fetchDailyGrade(date);

        // Get recent meals for pattern analysis (last 7 days)
        const recentMeals = await getMeals();
        const sevenDaysAgo = new Date(date);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const mealsLastWeek = recentMeals.filter((meal) => {
            const mealDate = new Date(meal.meal_date);
            return mealDate >= sevenDaysAgo && mealDate <= date;
        });

        // Generate insights based on different scenarios
        insights.push(...generateGradeBasedInsights(dailyGrade));
        insights.push(...generateNutritionInsights(dailyGrade)); // Now uses dailyGrade nutrition totals
        insights.push(...generatePatternInsights(mealsLastWeek));
        insights.push(
            ...generateMotivationalInsights(dailyGrade, mealsLastWeek)
        );

        // Return the top 3-4 most relevant insights
        return prioritizeInsights(insights).slice(0, 4);
    } catch (error) {
        console.error("Error generating insights:", error);
        // Return fallback insights if there's an error
        return getFallbackInsights();
    }
}

/**
 * Generate insights based on current daily grade
 */
function generateGradeBasedInsights(dailyGrade) {
    const insights = [];

    if (!dailyGrade) {
        insights.push({
            id: "start-tracking",
            emoji: "🚀",
            title: "Start your journey",
            description:
                "Log your first meal today to get personalized insights!",
            actionable: true,
            category: "lifestyle",
            priority: 8,
        });
        return insights;
    }

    const grade = dailyGrade.average_grade;
    const mealCount = dailyGrade.meal_count;

    if (grade === "A") {
        insights.push({
            id: "maintain-excellence",
            emoji: "🌟",
            title: "Excellent choices today!",
            description:
                "You're crushing it with an A-grade day. Keep up the amazing work!",
            actionable: false,
            category: "nutrition",
            priority: 9,
        });
    } else if (grade === "B") {
        insights.push({
            id: "push-to-a",
            emoji: "💪",
            title: "So close to an A!",
            description:
                "Add more fiber-rich foods to your next meal to reach A-grade.",
            actionable: true,
            category: "nutrition",
            priority: 8,
        });
    } else if (grade === "C") {
        insights.push({
            id: "improve-grade",
            emoji: "🥗",
            title: "Room for improvement",
            description:
                "Try adding more vegetables and lean protein to boost your grade.",
            actionable: true,
            category: "nutrition",
            priority: 7,
        });
    } else if (grade === "D" || grade === "E") {
        insights.push({
            id: "course-correction",
            emoji: "🔄",
            title: "Let's turn this around",
            description:
                "Focus on whole foods and vegetables for your next meal.",
            actionable: true,
            category: "nutrition",
            priority: 9,
        });
    }

    // Meal frequency insights
    if (mealCount === 1) {
        insights.push({
            id: "meal-frequency",
            emoji: "⏰",
            title: "Plan your next meal",
            description:
                "Regular meals help maintain steady energy and better choices.",
            actionable: true,
            category: "lifestyle",
            priority: 6,
        });
    } else if (mealCount >= 4) {
        insights.push({
            id: "frequent-eating",
            emoji: "🍽️",
            title: "Mindful eating",
            description:
                "You've logged several meals. Consider meal sizes and hunger cues.",
            actionable: true,
            category: "health",
            priority: 5,
        });
    }

    return insights;
}

/**
 * Generate insights based on nutritional analysis using pre-calculated daily totals
 */
function generateNutritionInsights(dailyGrade) {
    const insights = [];

    if (!dailyGrade || !dailyGrade.meal_count || dailyGrade.meal_count === 0) {
        return insights;
    }

    // Use the pre-calculated nutrition totals from daily_grades table
    const totalFiber = dailyGrade.total_fiber || 0;
    const totalProtein = dailyGrade.total_protein || 0;
    const totalSugar = dailyGrade.total_sugar || 0;
    const totalSodium = dailyGrade.total_sodium || 0;
    const totalCarbs = dailyGrade.total_carbs || 0;
    const totalFat = dailyGrade.total_fat || 0;
    const totalCalories = dailyGrade.total_calories || 0;

    // Fiber insights
    if (totalFiber < 5) {
        insights.push({
            id: "low-fiber",
            emoji: "🥦",
            title: "Boost your fiber",
            description:
                "Add beans, vegetables, or whole grains to reach your fiber goals.",
            actionable: true,
            category: "nutrition",
            priority: 8,
        });
    } else if (totalFiber >= 25) {
        insights.push({
            id: "high-fiber",
            emoji: "🌾",
            title: "Fiber champion!",
            description:
                "Great job getting plenty of fiber today. Your gut health will thank you!",
            actionable: false,
            category: "nutrition",
            priority: 7,
        });
    }

    // Protein insights
    if (totalProtein < 50) {
        insights.push({
            id: "low-protein",
            emoji: "🍳",
            title: "More protein needed",
            description:
                "Add eggs, fish, or legumes to support your muscle health.",
            actionable: true,
            category: "nutrition",
            priority: 7,
        });
    } else if (totalProtein >= 100) {
        insights.push({
            id: "good-protein",
            emoji: "💪",
            title: "Protein powerhouse",
            description:
                "Excellent protein intake today! Perfect for muscle maintenance.",
            actionable: false,
            category: "nutrition",
            priority: 6,
        });
    }

    // Carbs insights
    if (totalCarbs < 100) {
        insights.push({
            id: "low-carbs",
            emoji: "🍠",
            title: "Energy boost needed",
            description:
                "Consider adding complex carbs like sweet potatoes or quinoa for sustained energy.",
            actionable: true,
            category: "nutrition",
            priority: 6,
        });
    } else if (totalCarbs > 300) {
        insights.push({
            id: "high-carbs",
            emoji: "🌾",
            title: "Carb balance",
            description:
                "Focus on complex carbs and consider pairing with protein to balance blood sugar.",
            actionable: true,
            category: "nutrition",
            priority: 7,
        });
    }

    // Fat insights
    if (totalFat < 30) {
        insights.push({
            id: "low-fat",
            emoji: "🥑",
            title: "Healthy fats needed",
            description:
                "Add avocado, nuts, or olive oil for hormone health and nutrient absorption.",
            actionable: true,
            category: "nutrition",
            priority: 7,
        });
    } else if (totalFat > 100) {
        insights.push({
            id: "high-fat",
            emoji: "⚖️",
            title: "Fat balance",
            description:
                "Consider lighter cooking methods and focus on lean proteins for balance.",
            actionable: true,
            category: "nutrition",
            priority: 6,
        });
    }

    // Sugar insights
    if (totalSugar > 50) {
        insights.push({
            id: "high-sugar",
            emoji: "🍯",
            title: "Watch the sugar",
            description:
                "Consider reducing added sugars and opt for natural sweetness from fruits.",
            actionable: true,
            category: "nutrition",
            priority: 8,
        });
    }

    // Sodium insights
    if (totalSodium > 2300) {
        insights.push({
            id: "high-sodium",
            emoji: "🧂",
            title: "Sodium check",
            description:
                "Try fresh herbs and spices instead of salt for flavor.",
            actionable: true,
            category: "nutrition",
            priority: 7,
        });
    }

    // Calorie insights (optional - based on general healthy ranges)
    if (totalCalories > 0) {
        if (totalCalories < 1200) {
            insights.push({
                id: "low-calories",
                emoji: "⚡",
                title: "Fuel your body",
                description:
                    "Consider adding nutrient-dense foods to meet your energy needs.",
                actionable: true,
                category: "nutrition",
                priority: 8,
            });
        } else if (totalCalories > 3000) {
            insights.push({
                id: "high-calories",
                emoji: "🎯",
                title: "Mindful portions",
                description:
                    "Focus on nutrient-dense, lower-calorie foods like vegetables and lean proteins.",
                actionable: true,
                category: "nutrition",
                priority: 6,
            });
        }
    }

    return insights;
}

/**
 * Generate insights based on eating patterns
 */
function generatePatternInsights(weeklyMeals) {
    const insights = [];

    if (weeklyMeals.length < 3) {
        return insights;
    }

    // Grade trend analysis
    const recentGrades = weeklyMeals.slice(0, 5).map((meal) => meal.meal_grade);
    const gradeValues = { A: 5, B: 4, C: 3, D: 2, E: 1 };
    const avgRecentGrade =
        recentGrades.reduce((sum, grade) => sum + gradeValues[grade], 0) /
        recentGrades.length;

    const olderGrades = weeklyMeals.slice(5, 10).map((meal) => meal.meal_grade);
    if (olderGrades.length > 0) {
        const avgOlderGrade =
            olderGrades.reduce((sum, grade) => sum + gradeValues[grade], 0) /
            olderGrades.length;

        if (avgRecentGrade > avgOlderGrade + 0.5) {
            insights.push({
                id: "improving-trend",
                emoji: "📈",
                title: "Trending upward!",
                description:
                    "Your meal quality has improved this week. Keep up the momentum!",
                actionable: false,
                category: "health",
                priority: 8,
            });
        } else if (avgRecentGrade < avgOlderGrade - 0.5) {
            insights.push({
                id: "declining-trend",
                emoji: "📉",
                title: "Let's refocus",
                description:
                    "Your recent meals could use some attention. Back to basics with whole foods.",
                actionable: true,
                category: "health",
                priority: 9,
            });
        }
    }

    // Consistency insights
    const uniqueGrades = [...new Set(recentGrades)];
    if (uniqueGrades.length === 1 && uniqueGrades[0] === "A") {
        insights.push({
            id: "consistency-champion",
            emoji: "🏆",
            title: "Consistency champion",
            description:
                "Amazing! You've maintained A-grade meals consistently.",
            actionable: false,
            category: "health",
            priority: 9,
        });
    }

    // Time-based patterns
    const mealTimes = weeklyMeals.map((meal) =>
        new Date(meal.meal_date).getHours()
    );
    const lateMeals = mealTimes.filter((hour) => hour >= 22).length;

    if (lateMeals >= 3) {
        insights.push({
            id: "late-eating",
            emoji: "🌙",
            title: "Earlier dinner timing",
            description:
                "Try eating dinner earlier for better sleep and digestion.",
            actionable: true,
            category: "lifestyle",
            priority: 6,
        });
    }

    return insights;
}

/**
 * Generate motivational and behavioral insights
 */
function generateMotivationalInsights(dailyGrade, weeklyMeals) {
    const insights = [];

    // Weekly progress
    if (weeklyMeals.length >= 7) {
        const weeklyGrades = weeklyMeals
            .slice(0, 7)
            .map((meal) => meal.meal_grade);
        const aGrades = weeklyGrades.filter((grade) => grade === "A").length;
        const bGrades = weeklyGrades.filter((grade) => grade === "B").length;

        if (aGrades >= 4) {
            insights.push({
                id: "weekly-winner",
                emoji: "🎯",
                title: "Weekly winner!",
                description: `${aGrades} A-grade days this week! You\'re building healthy habits.`,
                actionable: false,
                category: "health",
                priority: 8,
            });
        } else if (aGrades + bGrades >= 5) {
            insights.push({
                id: "solid-week",
                emoji: "✨",
                title: "Solid week",
                description:
                    "Most of your meals this week were B-grade or better. Great progress!",
                actionable: false,
                category: "health",
                priority: 7,
            });
        }
    }

    // Hydration reminder (time-based)
    const currentHour = new Date().getHours();
    if (currentHour >= 14 && currentHour <= 16) {
        insights.push({
            id: "hydration-reminder",
            emoji: "💧",
            title: "Hydration check",
            description:
                "Mid-afternoon is perfect for a water break. Stay hydrated!",
            actionable: true,
            category: "lifestyle",
            priority: 5,
        });
    }

    // Weekend vs weekday insights
    const today = new Date();
    const isWeekend = today.getDay() === 0 || today.getDay() === 6;

    if (isWeekend && dailyGrade?.average_grade <= "C") {
        insights.push({
            id: "weekend-planning",
            emoji: "📅",
            title: "Weekend meal prep",
            description:
                "Use weekend time to prep healthy meals for the busy week ahead.",
            actionable: true,
            category: "lifestyle",
            priority: 6,
        });
    }

    return insights;
}

/**
 * Prioritize insights based on relevance and actionability
 */
function prioritizeInsights(insights) {
    return insights.sort((a, b) => {
        // Sort by priority (higher number = higher priority)
        if (a.priority !== b.priority) {
            return b.priority - a.priority;
        }
        // Actionable insights get slight preference
        if (a.actionable !== b.actionable) {
            return a.actionable ? -1 : 1;
        }
        return 0;
    });
}

/**
 * Fallback insights when data is unavailable
 */
function getFallbackInsights() {
    return [
        {
            id: "general-tip-1",
            emoji: "🥬",
            title: "Eat the rainbow",
            description:
                "Include colorful vegetables in your meals for diverse nutrients.",
            actionable: true,
            category: "nutrition",
            priority: 7,
        },
        {
            id: "general-tip-2",
            emoji: "💧",
            title: "Stay hydrated",
            description:
                "Drink water throughout the day to support overall health.",
            actionable: true,
            category: "lifestyle",
            priority: 6,
        },
        {
            id: "general-tip-3",
            emoji: "🏃",
            title: "Move after meals",
            description: "A short walk after eating can help with digestion.",
            actionable: true,
            category: "health",
            priority: 5,
        },
    ];
}
