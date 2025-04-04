import { HStack, Box, Flex } from "@chakra-ui/react";
import HamburgerBtn from "./HamburgerBtn";
import GoogleAuth from "./GoogleAuth";

interface NavBarProps {
  toggleSettings: (isOpen: boolean) => void;
  settingsOpen: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ toggleSettings, settingsOpen }) => {
  return (
    <HStack width="100%" justifyContent="space-between">
      <Flex ml={0} mt={1}>
        <GoogleAuth />
      </Flex>
      <Box>
        <HamburgerBtn toggleMenu={() => toggleSettings(!settingsOpen)} />
      </Box>
    </HStack>
  );
};

export default NavBar;
