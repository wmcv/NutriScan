import { IconButton, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";

interface HamburgerBtnProps {
  toggleMenu: (isOpen: boolean) => void;
}

const HamburgerBtn: React.FC<HamburgerBtnProps> = ({ toggleMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    toggleMenu(!isOpen);
  };

  return (
    <Flex>
      <IconButton
        aria-label={"Open Menu"}
        size="sm"
        mr={2}
        mt={2}
        mb={2}
        icon={<HamburgerIcon />}
        onClick={handleClick}
      />
    </Flex>
  );
};

export default HamburgerBtn;
