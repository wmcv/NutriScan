import { supabase } from "../supabaseClient";

const effectMap: { [key: number]: "Ignore" | "Below" | "Above" } = {
  0: "Ignore",
  1: "Below",
  2: "Above",
};

export const getUserPreferences = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    console.error("No user found or Supabase error:", error);
    return null;
  }

  const userId = user.id;

  const { data: dietOptions } = await supabase
    .from("DietOptions")
    .select("*")
    .eq("user_id", userId);

  const { data: customIngredients } = await supabase
    .from("DietCustomAddons")
    .select("*")
    .eq("user_id", userId);

  const { data: nutrientLimits } = await supabase
    .from("DietNutrientLimits")
    .select("*")
    .eq("user_id", userId);

  return {
    diet: dietOptions?.[0] || null,
    ingredients: customIngredients?.[0]?.ingredients || [],
    limits:
      nutrientLimits?.map((item) => ({
        name: item.nutrient_name,
        effect: effectMap[item.effect],
        limit: item.limit_value,
        unit: "mg",
      })) || [],
  };
};
