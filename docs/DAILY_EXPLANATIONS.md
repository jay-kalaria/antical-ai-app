# Daily Explanations Feature

## Overview

The Daily Explanations feature provides personalized, AI-generated insights for each day based on a user's meal data and nutritional intake. It transforms the history page from a simple meal log into an engaging, educational experience that helps users understand their eating patterns.

## Architecture

### Core Components

1. **`dailyExplanationService.js`** - Generates personalized explanations based on daily nutritional data
2. **`dailyGradeUpdater.js`** - Maintains the `daily_grades` table with aggregated nutrition totals
3. **`useDailyExplanations.js`** - React hooks for fetching explanations
4. **Updated History Page** - Beautiful UI displaying grades and explanations

### Database Schema

The feature relies on the existing `daily_grades` table which stores:

-   `total_calories`, `total_protein`, `total_carbs`, `total_fat`
-   `total_sugar`, `total_fiber`, `total_sodium`
-   `average_grade`, `grade_score`, `meal_count`
-   `date`, `created_at`, `updated_at`

## How It Works

### 1. Data Collection

When meals are added/updated/deleted:

-   The `dailyGradeUpdater` automatically recalculates daily totals
-   Nutritional data is aggregated from all meals for that day
-   Average grade and grade score are computed

### 2. Explanation Generation

The `generateDailyExplanation()` function:

-   Analyzes nutritional totals (fiber, protein, sugar, sodium, etc.)
-   Categorizes factors as positive, negative, or neutral
-   Generates grade-specific statements with personalized language
-   Returns key factors that influenced the grade

### 3. UI Display

The History page shows:

-   Daily grade with color-coded badges
-   Personalized explanation statements
-   Key factors as colored chips (green for positive, red for negative)
-   Loading states and error handling
-   Pull-to-refresh functionality

## Example Explanations

### A-Grade Day

```
"Outstanding day with excellent fiber intake and adequate protein — keep it up!"
Key factors: excellent fiber intake, adequate protein, low sugar intake
```

### C-Grade Day

```
"Mixed day with low fiber and insufficient protein — room for improvement."
Key factors: low fiber, insufficient protein, high sugar intake
```

### B-Grade Day

```
"Good day overall! Your good fiber intake was great, but watch the frequent eating."
Key factors: good fiber intake, adequate protein, frequent eating
```

## Customization

### Adding New Analysis Rules

To add new nutritional analysis rules, edit the `analyzeNutrition()` function in `dailyExplanationService.js`:

```javascript
// Example: Add vitamin analysis
if (total_vitamin_c >= 90) {
    positiveFactors.push({
        text: "excellent vitamin C",
        type: "positive",
        value: `${total_vitamin_c}mg vitamin C`,
    });
}
```

### Modifying Statement Generation

Update the `generateGradeStatement()` function to change how explanations are generated:

```javascript
// Example: Add time-based context
if (grade === "A" && isWeekend) {
    return "Amazing weekend choices! You're proving healthy eating fits any lifestyle.";
}
```

## Performance Considerations

### Caching Strategy

-   Daily explanations are cached for 5 minutes
-   History explanations are cached for 5 minutes
-   Automatic invalidation when meals change

### Database Optimization

-   Daily grades are pre-calculated and stored
-   Indexed on `date` and `grade_score` for fast queries
-   Batch updates available for historical data

## Testing

Run the test suite:

```bash
node scripts/testDailyExplanations.js
```

This tests the explanation generation with various grade scenarios and nutritional profiles.

## Integration Points

### Meal Operations

All meal CRUD operations automatically trigger:

1. Daily grade recalculation
2. Query invalidation for affected dates
3. History page refresh

### Query Dependencies

The feature integrates with:

-   `useDailyGrade()` - For individual day grades
-   `useMeals()` - For meal data
-   `useInsights()` - For complementary insights

## Future Enhancements

### Potential Features

1. **Streak tracking** - "5 days of A-grades in a row!"
2. **Comparative analysis** - "Better than last Monday"
3. **Goal-based messaging** - Tied to user's health goals
4. **Seasonal recommendations** - Context-aware suggestions
5. **Social features** - Share achievements

### Technical Improvements

1. **ML-based insights** - More sophisticated analysis
2. **Real-time updates** - WebSocket integration
3. **Offline support** - Local caching for explanations
4. **A/B testing** - Different explanation styles

## Maintenance

### Regular Tasks

1. Monitor explanation quality and user feedback
2. Update nutritional thresholds based on guidelines
3. Add new statement variations to avoid repetition
4. Performance monitoring of database queries

### Troubleshooting

-   Check daily grade calculations if explanations seem incorrect
-   Verify meal data integrity for accurate totals
-   Monitor cache invalidation if updates aren't appearing

## API Reference

### `generateDailyExplanation(date)`

Generates explanation for a specific date.

**Returns:**

```javascript
{
    statement: "Personalized explanation string",
    keyFactors: [
        { text: "factor name", type: "positive|negative|neutral", value: "display value" }
    ],
    grade: "A|B|C|D|E",
    nutritionTotals: { total_calories, total_protein, ... }
}
```

### `getDailyExplanationsHistory(days)`

Fetches explanations for multiple days.

**Returns:** Array of daily explanations with date and dayName.
