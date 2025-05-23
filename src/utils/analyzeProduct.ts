export const analyzeProduct = async (

    productName: string,
    productIngredients: string,
    ecoscoreGrade: string,
    foodGroups: string,
    productNutrients: Record<string, any>,
    userPreferences: Record<string, any>


  ) => {
    const res = await fetch("https://boulevard-r-silly-knit.trycloudflare.com/analyze_product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: productName,
        product_ingredients :productIngredients,
        ecoscore_grade : ecoscoreGrade,
        food_groups : foodGroups,
        product_nutrients: productNutrients,
        user_preferences: userPreferences,
      }),
    });
  
    const data = await res.json();
    return data.message || "Could not get AI recommendation.";
  };
  