# Insights Generation Algorithm

## Overview

The insights generation algorithm analyzes a user's meal data and daily grades to provide personalized, actionable tips for improving their nutrition. The algorithm uses pre-calculated daily nutrition totals for efficiency and accuracy.

## How It Works

### Data Sources

1. **Daily Grade Data** - From `daily_grades` table including:
    - Current day's average grade, meal count, and grade score
    - **Pre-calculated nutrition totals**: total_protein, total_fiber, total_sugar, total_sodium, etc.
2. **Recent Meals** - Last 7 days of meal logs for pattern analysis
3. **No individual meal calculation** - Uses aggregated daily totals for efficiency

### Insight Categories

#### 1. Grade-Based Insights

-   **A Grade**: Celebrate excellence and encourage maintenance
-   **B Grade**: Motivate to reach A-grade with specific suggestions
-   **C Grade**: Provide improvement tips focused on vegetables and protein
-   **D/E Grade**: Offer course correction with focus on whole foods
-   **No Data**: Welcome new users and encourage first meal logging

#### 2. Nutritional Insights

Uses **pre-calculated daily totals** from `daily_grades` table:

-   **Fiber**: Encourages fiber-rich foods if below 5g daily, celebrates if above 25g daily
-   **Protein**: Suggests protein sources if below 50g daily, celebrates if above 100g daily
-   **Carbs**: Suggests complex carbs if below 100g daily, recommends balance if above 300g daily
-   **Fat**: Encourages healthy fats if below 30g daily, suggests balance if above 100g daily
-   **Sugar**: Warns about high sugar (>50g daily) and suggests natural alternatives
-   **Sodium**: Alerts for high sodium (>2300mg daily) and suggests herbs/spices
-   **Calories**: Encourages adequate intake if below 1200 daily, suggests mindful portions if above 3000 daily

#### 3. Pattern Insights

Identifies trends and behaviors from recent meals:

-   **Grade Trends**: Detects improving or declining meal quality over time
-   **Consistency**: Recognizes consistent A-grade performance
-   **Timing Patterns**: Identifies late eating habits (meals after 10 PM)

#### 4. Motivational Insights

Provides encouragement and lifestyle tips:

-   **Weekly Progress**: Celebrates multiple A-grade days per week
-   **Time-Based**: Hydration reminders during afternoon hours
-   **Weekend Planning**: Meal prep suggestions for weekend preparation

### Prioritization System

Insights are ranked by priority (1-9) and actionability:

1. **Priority Scoring**: Higher numbers indicate more important insights
2. **Actionable Preference**: Tips that users can act on immediately
3. **Relevance**: Based on current grade and nutrition totals

### Fallback System

If data is unavailable or API calls fail, the system provides general nutrition tips:

-   Eat colorful vegetables
-   Stay hydrated
-   Move after meals

## Technical Implementation

### Key Functions

-   `generateInsights(date)` - Main entry point for insight generation
-   `generateGradeBasedInsights()` - Creates insights based on daily grade
-   `generateNutritionInsights(dailyGrade)` - Uses pre-calculated nutrition totals
-   `generatePatternInsights()` - Identifies behavioral patterns from recent meals
-   `prioritizeInsights()` - Sorts insights by relevance and priority

### Data Flow

1. **Fetch daily grade** with nutrition totals from `daily_grades` table
2. **Fetch recent meals** for pattern analysis (last 7 days)
3. **Generate insights** using pre-calculated totals (no manual calculation)
4. **Prioritize and limit** to top 3-4 insights
5. **Cache results** for 15 minutes to reduce API calls

### Database Efficiency

The algorithm leverages the `daily_grades` table structure:

```sql
total_calories, total_protein, total_carbs, total_fat,
total_sugar, total_fiber, total_sodium, meal_count,
average_grade, grade_score
```

This eliminates the need to:

-   Fetch individual meals for nutrition calculation
-   Perform aggregation in the application layer
-   Process multiple database queries per insight generation

### React Integration

-   `useInsights()` hook provides React Query integration
-   Automatic invalidation when new meals are added
-   Loading states and error handling in UI components
-   Real-time updates when meal data changes

## Examples

### Sample Insights for Different Scenarios

**New User (No Daily Grade)**

```
🚀 Start your journey
Log your first meal today to get personalized insights!
```

**B-Grade Day with Low Fiber**

```
💪 So close to an A!
Add more fiber-rich foods to your next meal to reach A-grade.

🥦 Boost your fiber
Add beans, vegetables, or whole grains to reach your fiber goals.
```

**High Sodium Day (>2300mg)**

```
🧂 Sodium check
Try fresh herbs and spices instead of salt for flavor.
```

**Improving Trend**

```
📈 Trending upward!
Your meal quality has improved this week. Keep up the momentum!
```

## Nutrition Thresholds

Based on daily totals (not per meal):

-   **Fiber**: Low <5g, High ≥25g daily
-   **Protein**: Low <50g, High ≥100g daily
-   **Carbs**: Low <100g, High >300g daily
-   **Fat**: Low <30g, High >100g daily
-   **Sugar**: High >50g daily
-   **Sodium**: High >2300mg daily
-   **Calories**: Low <1200, High >3000 daily

## Future Enhancements

-   Machine learning for more personalized recommendations
-   Integration with user preferences and dietary restrictions
-   Seasonal and cultural food suggestions
-   Social comparison insights (anonymized)
-   Integration with fitness tracking for activity-based nutrition tips
