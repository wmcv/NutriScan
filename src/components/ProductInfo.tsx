import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tag,
  Wrap,
} from "@chakra-ui/react";

interface ProductInfoProps {
  productName: string;
  productIngredients: string;
  productNutrients: Record<string, any>;
}

const nutrientUnits: Record<string, string> = {
  energy_kcal: "kcal",
  fat: "g",
  saturated_fat: "g",
  trans_fat: "g",
  cholesterol: "mg",
  carbohydrates: "g",
  sugars: "g",
  fiber: "g",
  proteins: "g",
  salt: "g",
  sodium: "mg",
  iron: "mg",
  calcium: "mg",
};

const ProductInfo: React.FC<ProductInfoProps> = ({
  productName,
  productIngredients,
  productNutrients,
}) => {
  if (!productName) return <Text>No product scanned yet.</Text>;

  return (
    <Box p={6} bg="white" borderRadius="md" boxShadow="md">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {productName}
      </Text>

      <Text fontWeight="semibold" fontSize="lg" mb={2}>
        Nutrient Facts
      </Text>
      <Table size="sm" variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Nutrient</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.entries(productNutrients).map(([key, value]) => {
            const formattedKey = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase()); // Convert to Title Case
            const unit = nutrientUnits[key] || ""; // Get unit or empty string if not found

            return (
              <Tr key={key}>
                <Td>
                  {formattedKey}{" "}
                  <Text as="span" fontWeight="bold">
                    ({unit})
                  </Text>
                </Td>
                <Td fontWeight="bold" isNumeric>
                  {value}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <Text fontWeight="semibold" fontSize="lg" mt={6} mb={2}>
        Ingredients
      </Text>
      <Wrap>
        {productIngredients.split(", ").map((ingredient, index) => (
          <Tag key={index} colorScheme="blue" size="md">
            {ingredient}
          </Tag>
        ))}
      </Wrap>
    </Box>
  );
};

export default ProductInfo;
