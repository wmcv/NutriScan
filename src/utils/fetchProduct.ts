export const fetchProduct = async (barcode: string) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      const data = await response.json();
  
      if (!data || data.status === 0) {
        console.error("product not found:", barcode);
        return null;
      }
  
      return data.product;
    } catch (error) {
      console.error("error fetching product:", error);
      return null;
    }
  };
  