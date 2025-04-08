import React, { useEffect, useState } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import "../popup.css";

interface TempPopupProps {
  message: string;
  onClose: () => void;
  index: number;
  countPre: number;
  countPost: number;
  countTotal: number;
}

const TempPopup: React.FC<TempPopupProps> = ({
  message,
  onClose,
  index,
  countPre,
  countPost,
  countTotal,
}) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    const removePopupTimer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removePopupTimer);
    };
  }, [onClose]);

  return (
    <Box
      className={`popup ${isFadingOut ? "popup-fade-out" : ""}`}
      position="absolute"
      top={`${index * 60}px`}
      left="50%"
      width="80%"
      maxWidth="400px"
      transform="translateX(-50%)"
      backgroundColor="teal.500"
      color="white"
      p={4}
      borderRadius="md"
      boxShadow="md"
    >
      <VStack spacing={2}>
        <Text fontWeight="bold" fontSize="lg">
          {message} {countPre} {countPost} {countTotal}
        </Text>
      </VStack>
    </Box>
  );
};

export default TempPopup;
