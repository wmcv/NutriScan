import { Button } from "@chakra-ui/react";

interface SimpleToggleProps {
  setTrue: (val: boolean) => void;
  setFalse1: (val: boolean) => void;
  setFalse2: (val: boolean) => void;
  label?: string;
}

const TableSelectionBtn: React.FC<SimpleToggleProps> = ({
  setTrue,
  setFalse1,
  setFalse2,
  label = "Toggle",
}) => {
  const handleClick = () => {
    setTrue(true);
    setFalse1(false);
    setFalse2(false);
  };

  return <Button onClick={handleClick}>{label}</Button>;
};

export default TableSelectionBtn;
