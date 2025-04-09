import { IconButton, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { StarIcon } from "@chakra-ui/icons";
import { isUserSignedIn } from "./GoogleAuth";
import { supabase } from "../supabaseClient";

interface ProfileBtnProps {
  toggleProfile: (isOpen: boolean) => void;
}

const ProfileBtn: React.FC<ProfileBtnProps> = ({ toggleProfile }) => {
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
    toggleProfile(!isOpen);
  };

  return (
    <Flex>
      <IconButton
        aria-label={"Open Menu"}
        size="sm"
        mr={2}
        mt={2}
        mb={2}
        icon={<StarIcon />}
        onClick={handleClick}
      />
    </Flex>
  );
};

export default ProfileBtn;
