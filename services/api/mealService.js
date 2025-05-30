import { supabase } from "../../utils/supabase";

// Meals API
export async function createMeal(meal) {
    const { data, error } = await supabase
        .from("meal_logs")
        .insert([meal])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

// Meal Ingredients API
export async function createMealIngredient(ingredient) {
    const { data, error } = await supabase
        .from("meal_ingredients")
        .insert([ingredient])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getMealIngredients(mealId) {
    const { data, error } = await supabase
        .from("meal_ingredients")
        .select("*")
        .eq("meal_id", mealId);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

// Meal Nutrition API
export async function createMealNutrition(nutrition) {
    const { data, error } = await supabase
        .from("meal_nutrition")
        .insert([nutrition])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getMealNutrition(mealId) {
    const { data, error } = await supabase
        .from("meal_nutrition")
        .select("*")
        .eq("meal_id", mealId)
        .single();

    if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" error
        throw new Error(error.message);
    }

    return data;
}

export async function saveBasicMeal(mealData) {
    try {
        const createdMeal = await createMeal(mealData);
        return createdMeal;
    } catch (error) {
        console.error("Error saving basic meal:", error);
        throw error;
    }
}
