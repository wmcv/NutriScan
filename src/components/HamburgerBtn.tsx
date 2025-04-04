import { IconButton, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { isUserSignedIn } from "./GoogleAuth"; 
import { supabase } from "../supabaseClient";

interface HamburgerBtnProps {
  toggleMenu: (isOpen: boolean) => void;
}

const HamburgerBtn: React.FC<HamburgerBtnProps> = ({ toggleMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    const signedIn = await isUserSignedIn();
    if (!signedIn) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        console.error("Login error:", error.message);
      }
      return;
    }

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
