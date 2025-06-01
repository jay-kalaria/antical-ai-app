# Real-Time Data Synchronization

This directory contains the implementation for real-time data synchronization using Supabase's real-time capabilities.

## How It Works

### Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Query   │◄──►│ RealtimeManager  │◄──►│   Supabase DB   │
│   (Cache)       │    │ (Sync Manager)   │    │ (Real-time)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Key Components

1. **RealtimeManager**: Centralized subscription manager that:

    - Maintains a single WebSocket connection to Supabase
    - Listens for changes across all tables
    - Intelligently invalidates React Query caches
    - Handles reconnection and error recovery

2. **useRealtime Hook**: React hook that:

    - Initializes the RealtimeManager
    - Manages connection lifecycle
    - Handles app state changes (background/foreground)

3. **Optimistic Updates**: Enhanced mutations that:
    - Immediately update the UI
    - Fall back to real-time sync for final state

## Usage

### Automatic Setup

The real-time system is automatically initialized in your app root (`app/_layout.jsx`):

```jsx
function AppContent() {
    const realtimeStatus = useRealtime({
        pauseOnBackground: true,
        autoConnect: true,
    });

    // Your app content
}
```

### Using in Components

Your existing hooks work exactly the same, but now get real-time updates:

```jsx
function MealsScreen() {
    const { data: meals, isLoading } = useMeals();
    // ✨ Now automatically syncs in real-time!

    return <MealsList meals={meals} />;
}
```

### Connection Status

Check real-time connection status anywhere in your app:

```jsx
import { useRealtimeStatus } from "@/hooks/useRealtime";

function StatusIndicator() {
    const status = useRealtimeStatus();
    return <Text>Status: {status}</Text>;
}
```

## Tables Monitored

The RealtimeManager automatically monitors these tables:

-   `meal_logs` → Invalidates `meals`, `meal`, `dailyGrade`, `insights` queries
-   `meal_ingredients` → Invalidates `mealIngredients`, `meal` queries
-   `meal_nutrition` → Invalidates `mealNutrition`, `meal` queries
-   `daily_grades` → Invalidates `dailyGrade`, `insights` queries

## Benefits

### Performance

-   ✅ **Single WebSocket connection** (not one per table)
-   ✅ **Smart cache invalidation** (only affected queries)
-   ✅ **Optimistic updates** (instant UI feedback)
-   ✅ **Automatic background/foreground handling**

### User Experience

-   ✅ **Live data** across all connected devices
-   ✅ **Instant feedback** on user actions
-   ✅ **Automatic sync** when returning to app
-   ✅ **No manual refresh needed**

### Developer Experience

-   ✅ **Zero changes to existing hooks**
-   ✅ **Automatic error recovery**
-   ✅ **Built-in debugging tools**
-   ✅ **Production-ready**

## Testing

Test the real-time connection:

```bash
# Test basic realtime functionality
node scripts/test-realtime.js

# Test specific table for 2 minutes
node scripts/test-realtime.js meal_logs 120

# Test all tables simultaneously
node scripts/test-realtime.js multi
```

## Debugging

### Connection Issues

1. Check console for RealtimeManager logs
2. Verify Supabase environment variables
3. Ensure database has RLS policies set up correctly

### Status Indicator

Add the debug status component (development only):

```jsx
import { RealtimeStatus } from "@/components/RealtimeStatus";

<RealtimeStatus visible={__DEV__} />;
```

## Configuration

### App State Management

By default, real-time pauses when app is backgrounded to save battery:

```jsx
useRealtime({
    pauseOnBackground: true, // Pause when app backgrounds
    autoConnect: true, // Auto-connect on startup
});
```

### Custom Invalidation Rules

Modify invalidation rules in `services/realtime/index.js`:

```javascript
export const getInvalidationRules = (table, payload) => {
    // Add your custom rules here
};
```

## Migration Notes

### From Manual Invalidation

Old pattern (removed):

```javascript
onSuccess: () => {
    queryClient.invalidateQueries(["meals"]);
    // Manual invalidation everywhere 😵
};
```

New pattern (automatic):

```javascript
onSettled: () => {
    // RealtimeManager handles everything ✨
};
```

### Optimistic Updates

Your mutations now use optimistic updates for better UX while still getting real-time sync for accuracy.

## Troubleshooting

### Real-time not working?

1. Check Supabase project has real-time enabled
2. Verify table policies allow subscriptions
3. Check network connection
4. Look for RealtimeManager logs in console

### Performance issues?

1. Monitor number of active subscriptions
2. Check invalidation frequency
3. Verify cache sizes are reasonable

### Data inconsistencies?

Real-time handles eventual consistency - optimistic updates may briefly show incorrect state before real-time sync corrects it.
