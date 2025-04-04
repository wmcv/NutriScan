import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Input,
  Box,
} from "@chakra-ui/react";
import { NutrientLimit } from "@/types";

interface NutrientLimitsTableProps {
  limits: NutrientLimit[];
  setLimits: (limits: NutrientLimit[]) => void;
}

const DietLimitTable: React.FC<NutrientLimitsTableProps> = ({
  limits,
  setLimits,
}) => {
  const handleChange = (
    index: number,
    field: keyof NutrientLimit,
    value: any
  ) => {
    const newLimits = [...limits];
    newLimits[index] = { ...newLimits[index], [field]: value };
    setLimits(newLimits);
  };

  return (
    <Box overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th w="120px">Nutrient</Th>
            <Th w="80px" textAlign="center">
              Effect
            </Th>
            <Th w="110px" textAlign="center">
              Limit
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {limits.map((item, index) => (
            <Tr key={item.name}>
              <Td fontSize="sm">{item.name}</Td>
              <Td textAlign="center">
                <Select
                  value={item.effect}
                  onChange={(e) =>
                    handleChange(index, "effect", e.target.value)
                  }
                  w="80px"
                  fontSize="sm"
                >
                  <option value="Ignore">Ignore</option>
                  <option value="Above">Above</option>
                  <option value="Below">Below</option>
                </Select>
              </Td>
              <Td textAlign="center">
                <Box display="flex" alignItems="center">
                  <Input
                    type="number"
                    value={item.limit}
                    step="0.1"
                    min="0"
                    onChange={(e) =>
                      handleChange(
                        index,
                        "limit",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    width="60px"
                    fontSize="sm"
                    textAlign="center"
                  />
                  <Box ml="1" fontSize="sm">
                    {item.unit}
                  </Box>
                </Box>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DietLimitTable;
