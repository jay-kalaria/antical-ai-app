import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Supabase client
const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Test real-time functionality for a specific table
 * @param {string} tableName - Name of the table to monitor
 * @param {number} duration - How long to monitor (in seconds)
 */
async function testRealtimeConnection(tableName = "meal_logs", duration = 60) {
    console.log(
        `🧪 Testing Supabase real-time connection for table: ${tableName}`
    );

    // Check if environment variables are loaded
    if (
        !process.env.EXPO_PUBLIC_SUPABASE_URL ||
        !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    ) {
        console.error("❌ Missing Supabase environment variables!");
        console.log(
            "Make sure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set"
        );
        process.exit(1);
    }

    console.log("✅ Environment variables loaded");
    console.log("📡 Supabase URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);

    const testChannel = supabase
        .channel(`test_channel_${tableName}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: tableName,
            },
            (payload) => {
                const timestamp = new Date().toLocaleTimeString();
                console.log(`\n🎯 [${timestamp}] Real-time event detected!`);
                console.log(`📋 Table: ${tableName}`);
                console.log(`🔄 Event: ${payload.eventType}`);

                if (payload.eventType === "INSERT") {
                    console.log(`✨ New record:`, payload.new);
                } else if (payload.eventType === "UPDATE") {
                    console.log(`📝 Updated record:`, payload.new);
                    console.log(`📝 Previous values:`, payload.old);
                } else if (payload.eventType === "DELETE") {
                    console.log(`🗑️  Deleted record:`, payload.old);
                }

                console.log(
                    `📄 Full payload:`,
                    JSON.stringify(payload, null, 2)
                );
                console.log("─".repeat(60));
            }
        )
        .subscribe((status, err) => {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`🔗 [${timestamp}] Real-time status: ${status}`);

            if (status === "SUBSCRIBED") {
                console.log(
                    "✅ Real-time connection established successfully!"
                );
                console.log(
                    `👂 Now listening for changes to ${tableName} table...`
                );
                console.log(
                    "💡 You can test by adding/editing/deleting records in your app"
                );
                console.log("─".repeat(60));
            } else if (status === "CHANNEL_ERROR") {
                console.error("❌ Channel error:", err);
            } else if (status === "TIMED_OUT") {
                console.error("❌ Connection timed out");
            } else if (status === "CLOSED") {
                console.log("📪 Connection closed");
            }
        });

    console.log(`⏱️  Test will run for ${duration} seconds...`);
    console.log(`🔍 Monitoring all events on ${tableName} table...`);

    setTimeout(() => {
        testChannel.unsubscribe();
        console.log("\n🧪 Real-time test completed");
        process.exit(0);
    }, duration * 1000);

    return testChannel;
}

/**
 * Test multiple tables at once
 */
async function testMultipleTable() {
    const tables = [
        "meal_logs",
        "meal_ingredients",
        "meal_nutrition",
        "daily_grades",
    ];

    console.log("🚀 Testing real-time for all meal-related tables...");

    tables.forEach((table) => {
        const channel = supabase
            .channel(`multi_test_${table}`)
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table },
                (payload) => {
                    console.log(
                        `📡 [${table}] ${payload.eventType}:`,
                        payload.new || payload.old
                    );
                }
            )
            .subscribe();
    });

    setTimeout(() => {
        console.log("🧪 Multi-table test completed");
        process.exit(0);
    }, 120000); // 2 minutes
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0] || "single";

if (command === "multi") {
    testMultipleTable();
} else {
    const tableName = args[0] || "meal_logs";
    const duration = parseInt(args[1]) || 60;
    testRealtimeConnection(tableName, duration);
}

console.log("\n💡 Usage:");
console.log(
    "  node scripts/test-realtime.js                    # Test meal_logs for 60s"
);
console.log(
    "  node scripts/test-realtime.js meal_ingredients   # Test specific table"
);
console.log(
    "  node scripts/test-realtime.js meal_logs 120      # Test for 2 minutes"
);
console.log(
    "  node scripts/test-realtime.js multi              # Test all tables"
);
