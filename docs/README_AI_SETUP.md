# AI Daily Explanations Setup Guide

## Overview

This feature generates personalized AI explanations for daily nutrition grades using OpenAI GPT and stores them in the database for efficient retrieval.

## 🧪 Testing the Implementation

1. **Run the test script:**

```bash
node scripts/testAIExplanations.js
```

2. **Check the database:**

```sql
SELECT date, ai_explanation, ai_key_factors, explanation_source
FROM daily_grades
WHERE ai_explanation IS NOT NULL
ORDER BY date DESC;
```

## 🔄 How It Works

1. **Data Flow:**

    - `generateAndStoreAIExplanation()` processes completed days
    - Fetches daily grade + meal context from database
    - Generates AI explanation using OpenAI GPT-4o-mini
    - Stores result in `daily_grades` table

2. **History Page:**
    - `useStoredExplanations.js` fetches stored explanations
    - Displays instantly with no API calls
    - Falls back to "Processing your day..." for pending explanations

## 📊 Example Generated Explanation

For a B-grade day with meals like "Quinoa bowl, Greek salad":

> "Great job with the quinoa bowl and Greek salad — you're getting excellent fiber and plant-based nutrition!"

## 🔧 Key Features

-   **Cost Efficient:** Generate once, read many times (99% cost reduction)
-   **Fast Loading:** Instant display from database
-   **Personalized:** References actual meals eaten
-   **Fallback Safe:** Works without OpenAI API key
-   **Automatic:** Can run as daily background job

## 🚀 Production Setup

For production, set up a daily cron job to run:

```javascript
import { batchGenerateExplanations } from "./services/api/aiExplanationGenerator.js";
await batchGenerateExplanations(1); // Process yesterday
```
