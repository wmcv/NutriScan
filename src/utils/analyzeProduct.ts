export const analyzeProduct = async (

    productName: string,
    productIngredients: string,
    productNutrients: Record<string, any>,
    userPreferences: Record<string, any>


  ) => {
    const res = await fetch("http://132.145.98.33:8080/analyze_product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: productName,
        product_ingredients :productIngredients,
        product_nutrients: productNutrients,
        user_preferences: userPreferences,
      }),
    });
  
    const data = await res.json();
    return data.message || "Could not get AI recommendation.";
  };
  