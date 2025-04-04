export const analyzeProduct = async (

    productName: string,
    productIngredients: string,
    productNutrients: Record<string, any>,
    userPreferences: Record<string, any>


  ) => {
    const res = await fetch("http://localhost:5001/analyze_product", {
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
  