import React, { useEffect } from "react";
import { Box, Text, VStack } from "@chakra-ui/react";

interface TempPopupProps {
  message: string;
  onClose: () => void;
}

const TempPopup: React.FC<TempPopupProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Box
      position="absolute"
      top="10px"
      left="50%"
      transform="translateX(-50%)"
      width="80%"
      maxWidth="400px"
      backgroundColor="teal.500"
      color="white"
      p={4}
      borderRadius="md"
      boxShadow="md"
    >
      <VStack spacing={2}>
        <Text fontWeight="bold" fontSize="lg">
          {message}
        </Text>
      </VStack>
    </Box>
  );
};

export default TempPopup;
