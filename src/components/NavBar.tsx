import { HStack, Box, Flex, Text } from "@chakra-ui/react";
import HamburgerBtn from "./HamburgerBtn";
import GoogleAuth from "./GoogleAuth";
import ProfileBtn from "./ProfileBtn";

interface NavBarProps {
  toggleSettings: (isOpen: boolean) => void;
  settingsOpen: boolean;
  toggleProfile: (isOpen: boolean) => void;
  profileOpen: boolean;
}

const NavBar: React.FC<NavBarProps> = ({
  toggleSettings,
  settingsOpen,
  toggleProfile,
  profileOpen,
}) => {
  return (
    <HStack width="100%" justifyContent="space-between">
      <Flex ml={1} mt={1}>
        <GoogleAuth />
      </Flex>
      <Text fontFamily="Lucida Console" fontWeight="bold" fontSize={30} ml={12}>
        NutriScan
      </Text>
      <Box>
        <HStack>
          <ProfileBtn toggleProfile={() => toggleProfile(!profileOpen)} />
          <HamburgerBtn toggleMenu={() => toggleSettings(!settingsOpen)} />
        </HStack>
      </Box>
    </HStack>
  );
};

export default NavBar;
