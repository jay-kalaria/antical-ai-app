import { supabase } from "../../utils/supabase";

// Meals API
export async function getMeals() {
    const { data, error } = await supabase
        .from("meal_logs")
        .select("*")
        .order("meal_date", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getMealById(id) {
    const { data, error } = await supabase
        .from("meal_logs")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function updateMeal(id, updates) {
    const { data, error } = await supabase
        .from("meal_logs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function deleteMeal(id) {
    const { error } = await supabase.from("meal_logs").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return { success: true };
}

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

export async function updateMealIngredient(id, updates) {
    const { data, error } = await supabase
        .from("meal_ingredients")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function deleteMealIngredient(id) {
    const { error } = await supabase
        .from("meal_ingredients")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return { success: true };
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

export async function updateMealNutrition(id, updates) {
    const { data, error } = await supabase
        .from("meal_nutrition")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function deleteMealNutrition(id) {
    const { error } = await supabase
        .from("meal_nutrition")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return { success: true };
}
