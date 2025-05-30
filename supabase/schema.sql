-- Schema for MealGrade Supabase Database

-- Meal Logs Table
CREATE TABLE public.meal_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_name TEXT NOT NULL,
  meal_description TEXT,
  meal_grade TEXT NOT NULL CHECK (meal_grade IN ('A', 'B', 'C', 'D', 'E')),
  meal_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meal_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Meal Ingredients Table
CREATE TABLE public.meal_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID NOT NULL REFERENCES public.meal_logs(id) ON DELETE CASCADE,
  food_id UUID,
  food_name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  calories NUMERIC,
  nutrients JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Meal Nutrition Summary
CREATE TABLE public.meal_nutrition (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meal_id UUID NOT NULL REFERENCES public.meal_logs(id) ON DELETE CASCADE UNIQUE,
  calories NUMERIC NOT NULL,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  sugar NUMERIC,
  fiber NUMERIC,
  sodium NUMERIC,
  additional_nutrients JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS (Row Level Security) but make everything public for now
ALTER TABLE public.meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_nutrition ENABLE ROW LEVEL SECURITY;

-- Simple policies that allow all operations for everyone (no user authentication yet)
CREATE POLICY "Allow all operations on meals" 
  ON public.meal_logs 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all operations on meal ingredients" 
  ON public.meal_ingredients 
  FOR ALL 
  USING (true);

CREATE POLICY "Allow all operations on meal nutrition" 
  ON public.meal_nutrition 
  FOR ALL 
  USING (true);

-- Create functions

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to call the function
CREATE TRIGGER set_meal_logs_updated_at
BEFORE UPDATE ON public.meal_logs
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_meal_nutrition_updated_at
BEFORE UPDATE ON public.meal_nutrition
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at(); 