import React, { useEffect, useState } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import "../popup.css";
import {
  FaStar,
  FaMedal,
  FaCrown,
  FaTrophy,
  FaBarcode,
  FaBox,
  FaBoxes,
  FaShoppingCart,
  FaGem,
} from "react-icons/fa";

interface BadgePopupProps {
  id: number;
  onClose: () => void;
  index: number;
}

const badgeDefinitions = [
  {
    id: 0,
    label: "Used NutriScan",
    icon: <FaStar color="purple" size="2.5em" />,
    color: "pink",
  },
  {
    id: 1,
    label: "Scanned 1 Item",
    icon: <FaBarcode color="brown" size="2.0em" />,
    color: "green",
  },
  {
    id: 2,
    label: "Scanned 5 Items",
    icon: <FaBarcode color="silver" size="2.0em" />,
    color: "green",
  },
  {
    id: 3,
    label: "Scanned 10 Items",
    icon: <FaBarcode color="yellow" size="2.0em" />,
    color: "green",
  },
  {
    id: 4,
    label: "Scanned 25 Items",
    icon: <FaBarcode color="blue" size="2.0em" />,
    color: "green",
  },
  {
    id: 5,
    label: "Scanned 50 Items",
    icon: <FaShoppingCart color="brown" size="2.0em" />,
    color: "blue",
  },
  {
    id: 6,
    label: "Scanned 75 Items",
    icon: <FaShoppingCart color="silver" size="2.0em" />,
    color: "blue",
  },
  {
    id: 7,
    label: "Scanned 100 Items",
    icon: <FaShoppingCart color="gold" size="2.0em" />,
    color: "blue",
  },
  {
    id: 8,
    label: "Scanned 150 Items",
    icon: <FaBox color="brown" size="2.0em" />,
    color: "purple",
  },
  {
    id: 9,
    label: "Scanned 200 Items",
    icon: <FaBox color="silver" size="2.0em" />,
    color: "purple",
  },
  {
    id: 10,
    label: "Scanned 250 Items",
    icon: <FaBox color="gold" size="2.0em" />,
    color: "purple",
  },
  {
    id: 11,
    label: "Scanned 500 Items",
    icon: <FaBoxes color="brown" size="2.0em" />,
    color: "red",
  },
  {
    id: 12,
    label: "Scanned 1000 Items",
    icon: <FaBoxes color="black" size="1.0em" />,
    color: "red",
  },
  {
    id: 13,
    label: "Completed 1 Challenge",
    icon: <FaMedal color="brown" size="2.0em" />,
    color: "green",
  },
  {
    id: 14,
    label: "Completed 3 Challenges",
    icon: <FaMedal color="silver" size="2.0em" />,
    color: "green",
  },
  {
    id: 15,
    label: "Completed 5 Challenges",
    icon: <FaMedal color="gold" size="2.0em" />,
    color: "green",
  },
  {
    id: 16,
    label: "Completed 10 Challenges",
    icon: <FaTrophy color="silver" size="2.0em" />,
    color: "blue",
  },
  {
    id: 17,
    label: "Completed 15 Challenges",
    icon: <FaTrophy color="gold" size="2.0em" />,
    color: "blue",
  },
  {
    id: 18,
    label: "Completed 25 Challenges",
    icon: <FaCrown color="yellow" size="2.0em" />,
    color: "purple",
  },
  {
    id: 19,
    label: "Completed 50 Challenges",
    icon: <FaGem color="blue" size="2.0em" />,
    color: "red",
  },
];

const getBadgeById = (id: number) => {
  const badge = badgeDefinitions.find((badge) => badge.id === id);
  return badge
    ? { label: badge.label, icon: badge.icon, color: badge.color }
    : { label: "null", icon: "null", color: "blue" };
};

const BadgePopup: React.FC<BadgePopupProps> = ({ id, onClose, index }) => {
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

  const userBadge = getBadgeById(id);

  return (
    <Box
      className={`popup ${isFadingOut ? "popup-fade-out" : ""}`}
      position="absolute"
      top={`${index * 60}px`}
      left="50%"
      width="80%"
      maxWidth="400px"
      transform="translateX(-50%)"
      backgroundColor={userBadge.color}
      color="white"
      px={2}
      borderRadius="md"
      boxShadow="md"
      zIndex="9999"
    >
      <VStack spacing={2} align="start">
        <div>
          <HStack ml={3}>
            {userBadge.icon}
            <Text
              fontFamily="Tahoma"
              fontWeight="bold"
              fontSize="lg"
              mt={3}
              mb={3}
              ml={2}
            >
              {userBadge.label}
            </Text>
          </HStack>
        </div>
      </VStack>
    </Box>
  );
};

export default BadgePopup;
