# Scripts Directory

This directory contains utility scripts for development, testing, and maintenance tasks.

## Available Scripts

### 🔄 Real-time Testing

**`test-realtime.js`** - Test Supabase real-time functionality

```bash
# Test meal_logs table for 60 seconds (default)
node scripts/test-realtime.js

# Test specific table
node scripts/test-realtime.js meal_ingredients

# Test for custom duration (in seconds)
node scripts/test-realtime.js meal_logs 120

# Test all meal-related tables simultaneously
node scripts/test-realtime.js multi
```

**What it does:**

-   Connects to Supabase real-time
-   Monitors database changes (INSERT, UPDATE, DELETE)
-   Shows detailed event information
-   Perfect for debugging real-time issues

**Use cases:**

-   ✅ Verify real-time is enabled in Supabase
-   ✅ Test specific table subscriptions
-   ✅ Debug RealtimeManager issues
-   ✅ Monitor database activity during development

### 🤖 AI Testing

**`testAIExplanationsNode.js`** - Test AI explanation generation

**`generateDailyExplanations.js`** - Generate daily nutrition explanations

## Usage Tips

### Before Running Scripts

Make sure your environment variables are set:

```bash
# Required for realtime testing
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Common Scenarios

**Test if realtime is working:**

```bash
node scripts/test-realtime.js
# Then add/edit/delete a meal in your app
```

**Debug specific table issues:**

```bash
node scripts/test-realtime.js meal_nutrition 300
# Monitor for 5 minutes
```

**Monitor all tables during testing:**

```bash
node scripts/test-realtime.js multi
# Watch all meal-related tables
```

## Development Notes

-   All scripts are designed to be safe for production databases
-   Real-time tests only listen, they don't modify data
-   Scripts will timeout automatically to prevent hanging processes
-   Use these during development to verify functionality before deploying
