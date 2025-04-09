import React, { useEffect, useState } from "react";
import { Box, Circle, Divider, HStack, Text, VStack } from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
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
  const [showPre, setShowPre] = useState(true);

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

  useEffect(() => {
    const timer = setTimeout(() => setShowPre(false), 1000);
    return () => clearTimeout(timer);
  }, [countPre, countPost, countTotal]);

  return (
    <Box
      className={`popup ${isFadingOut ? "popup-fade-out" : ""}`}
      position="absolute"
      top={`${index * 60}px`}
      left="50%"
      width="80%"
      maxWidth="400px"
      transform="translateX(-50%)"
      backgroundColor="#09367a"
      color="white"
      px={2}
      borderRadius="md"
      boxShadow="md"
    >
      <VStack spacing={2} align="start">
        <div>
          <HStack>
            <Circle size="12px" bg="gray.400" />
            <Text fontFamily="Tahoma" fontWeight="bold" fontSize="md" ml={2}>
              {message}
            </Text>

            <Divider orientation="vertical" height="35px" ml={5} mr={2} />

            <Text fontFamily="Tahoma" fontWeight="bold" mr={2} fontSize="md">
              {showPre ? (
                `${countPre}/${countTotal}`
              ) : countPost === countTotal ? (
                <Box
                  display="inline-block"
                  width="25px"
                  height="25px"
                  border="2px solid white"
                  borderRadius="4px"
                  textAlign="center"
                  lineHeight="18px"
                  backgroundColor="#055c3b"
                  color="white"
                >
                  <CheckIcon boxSize={4} color="white" />
                </Box>
              ) : (
                `${countPost}/${countTotal}`
              )}
            </Text>
          </HStack>
        </div>
      </VStack>
    </Box>
  );
};

export default TempPopup;
