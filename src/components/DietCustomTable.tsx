import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Input,
} from "@chakra-ui/react";
import { CloseIcon, AddIcon } from "@chakra-ui/icons";

interface Props {
  ingredients: string[];
  setIngredients: (newIngredients: string[]) => void;
}

const DietCustomTable: React.FC<Props> = ({ ingredients, setIngredients }) => {
  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Ingredient</Th>
          <Th textAlign="right">Action</Th>
        </Tr>
      </Thead>
      <Tbody>
        {ingredients.map((ingredient, index) => (
          <Tr key={index}>
            <Td>
              <Input
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
                placeholder="Enter ingredient name"
              />
            </Td>
            <Td textAlign="right">
              <IconButton
                aria-label="Remove ingredient"
                icon={<CloseIcon />}
                colorScheme="red"
                size="sm"
                onClick={() => removeIngredient(index)}
              />
            </Td>
          </Tr>
        ))}
        <Tr>
          <Td colSpan={2} textAlign="center">
            <IconButton
              aria-label="Add ingredient"
              icon={<AddIcon />}
              colorScheme="red"
              size="sm"
              onClick={addIngredient}
            />
          </Td>
        </Tr>
      </Tbody>
    </Table>
  );
};

export default DietCustomTable;
