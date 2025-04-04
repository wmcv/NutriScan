import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { Option } from "@/types";

interface SelectableTableProps {
  options: Option[];
  selected: Option | null;
  onSelect: (selectedOption: Option) => void;
}

const DietOptionsTable: React.FC<SelectableTableProps> = ({
  options,
  selected,
  onSelect,
}) => {
  return (
    <RadioGroup value={selected?.name || ""}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Select</Th>
            <Th>Option</Th>
            <Th>Details</Th>
          </Tr>
        </Thead>
        <Tbody>
          {options.map((option) => (
            <Tr
              key={option.name}
              onClick={() => onSelect(option)}
              cursor="pointer"
            >
              <Td>
                <Radio
                  value={option.name}
                  isChecked={selected?.name === option.name}
                  onChange={() => onSelect(option)}
                />
              </Td>
              <Td>{option.name}</Td>
              <Td>{option.details.join(", ")}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </RadioGroup>
  );
};

export default DietOptionsTable;
