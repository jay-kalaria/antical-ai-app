/**
 * Calculates the meal analysis including score, grade, and key factors
 * @param {Object} meal - The meal data object
 * @returns {Object} Analysis with score, grade, and driverReasons
 */
export function calculateMealAnalysis(meal) {
    if (!meal) return { score: 60, grade: "C", driverReasons: [] };

    let score = 60; // Start with neutral score
    const driverReasons = [];

    // Apply rules
    if (meal.fiber >= 5) {
        score += 10;
        driverReasons.push("High fiber");
    } else if (meal.fiber >= 3) {
        driverReasons.push("Moderate fiber");
    }

    if (meal.protein >= 20) {
        score += 10;
        driverReasons.push("High protein");
    }

    if (meal.addedSugar > 15) {
        score -= 15;
        driverReasons.push("High added sugar");
    } else if (meal.addedSugar >= 5) {
        score -= 5;
        driverReasons.push("Moderate added sugar");
    }

    if (meal.saturatedFat > 10) {
        score -= 10;
        driverReasons.push("High saturated fat");
    }

    if (meal.sodium > 800) {
        score -= 10;
        driverReasons.push("High sodium");
    }

    if (meal.ultraProcessedPercentage > 50) {
        score -= 20;
        driverReasons.push("Ultra-processed");
    }

    // Clamp score between 0-100
    score = Math.max(0, Math.min(100, score));

    // Determine grade
    let grade;
    if (score >= 85) grade = "A";
    else if (score >= 70) grade = "B";
    else if (score >= 50) grade = "C";
    else if (score >= 30) grade = "D";
    else grade = "E";

    return {
        score,
        grade,
        driverReasons,
    };
}

/**
 * Maps a grade letter to a display color
 * @param {string} grade - The grade letter (A-E)
 * @returns {string} Hex color code
 */
export function getGradeColor(grade) {
    switch (grade) {
        case "A":
            return "#24C08B"; // Green
        case "B":
            return "#8BC34A"; // Light green
        case "C":
            return "#FFC107"; // Amber
        case "D":
            return "#FF9800"; // Orange
        case "E":
            return "#F44336"; // Red
        default:
            return "#757575"; // Gray
    }
}

/**
 * Maps grades to score ranges for display purposes
 * @param {string} grade - The grade letter (A-E)
 * @returns {number} A representative score value for the grade
 */
export function getScoreForGrade(grade) {
    const scoreRanges = {
        A: 90,
        B: 75,
        C: 60,
        D: 40,
        E: 20,
    };

    return scoreRanges[grade] || 60;
}
