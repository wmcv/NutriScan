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
  servingSize: string;
  productIngredients: string;
  productNutrients: Record<string, any>;
  productUnits: Record<string, any>;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  productName,
  servingSize,
  productIngredients,
  productNutrients,
  productUnits,
}) => {
  if (!productName) return <Text>No product scanned yet.</Text>;

  return (
    <Box p={6} bg="white" borderRadius="md" boxShadow="md">
      <Text
        fontFamily="Tahoma"
        fontSize="2xl"
        fontWeight="bold"
        mb={4}
        lineHeight="1.2"
      >
        {productName}
      </Text>
      <Text
        fontFamily="Tahoma"
        fontWeight="semibold"
        fontSize="lg"
        lineHeight="1.2"
      >
        Nutrient Facts
      </Text>
      <Text
        fontFamily="Lucida Console"
        fontSize="sm"
        mb={2}
        mt={0}
        lineHeight="1.2"
      >
        Per {servingSize}
      </Text>
      <Table size="sm" variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Nutrient</Th>
            <Th isNumeric>Amount</Th>
          </Tr>
        </Thead>
        <Tbody fontFamily="Lucida Console">
          {Object.entries(productNutrients).map(([key, value]) => {
            const formattedKey = key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());
            const unit = productUnits[key] || "";

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

      <Text
        fontFamily="Tahoma"
        fontWeight="semibold"
        fontSize="lg"
        mt={6}
        mb={2}
      >
        Ingredients
      </Text>
      <Wrap>
        {productIngredients.split(", ").map((ingredient, index) => (
          <Tag
            key={index}
            fontFamily="Lucida Console"
            colorScheme="sapphireBlue"
            size="md"
          >
            {ingredient}
          </Tag>
        ))}
      </Wrap>
    </Box>
  );
};

export default ProductInfo;
