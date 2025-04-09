import { Box, Divider, Flex, Stack, Tag, Text } from "@chakra-ui/react";
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
interface UserProfileTableProps {
  userProfileBadges: number[];
  userProfileScans: number;
  userCompleted: number;
}

const badgeDefinitions = [
  {
    id: 0,
    label: "Used NutriScan",
    icon: <FaStar color="purple" size="1.5em" />,
    color: "pink",
  },
  {
    id: 1,
    label: "Scanned 1 Item",
    icon: <FaBarcode color="brown" size="1.0em" />,
    color: "green",
  },
  {
    id: 2,
    label: "Scanned 5 Items",
    icon: <FaBarcode color="silver" size="1.0em" />,
    color: "green",
  },
  {
    id: 3,
    label: "Scanned 10 Items",
    icon: <FaBarcode color="yellow" size="1.0em" />,
    color: "green",
  },
  {
    id: 4,
    label: "Scanned 25 Items",
    icon: <FaBarcode color="blue" size="1.0em" />,
    color: "green",
  },
  {
    id: 5,
    label: "Scanned 50 Items",
    icon: <FaShoppingCart color="brown" size="1.0em" />,
    color: "blue",
  },
  {
    id: 6,
    label: "Scanned 75 Items",
    icon: <FaShoppingCart color="silver" size="1.0em" />,
    color: "blue",
  },
  {
    id: 7,
    label: "Scanned 100 Items",
    icon: <FaShoppingCart color="gold" size="1.0em" />,
    color: "blue",
  },
  {
    id: 8,
    label: "Scanned 150 Items",
    icon: <FaBox color="brown" size="1.0em" />,
    color: "purple",
  },
  {
    id: 9,
    label: "Scanned 200 Items",
    icon: <FaBox color="silver" size="1.0em" />,
    color: "purple",
  },
  {
    id: 10,
    label: "Scanned 250 Items",
    icon: <FaBox color="gold" size="1.0em" />,
    color: "purple",
  },
  {
    id: 11,
    label: "Scanned 500 Items",
    icon: <FaBoxes color="brown" size="1.0em" />,
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
    icon: <FaMedal color="brown" size="1.0em" />,
    color: "green",
  },
  {
    id: 14,
    label: "Completed 3 Challenges",
    icon: <FaMedal color="silver" size="1.0em" />,
    color: "green",
  },
  {
    id: 15,
    label: "Completed 5 Challenges",
    icon: <FaMedal color="gold" size="1.0em" />,
    color: "green",
  },
  {
    id: 16,
    label: "Completed 10 Challenges",
    icon: <FaTrophy color="silver" size="1.0em" />,
    color: "blue",
  },
  {
    id: 17,
    label: "Completed 15 Challenges",
    icon: <FaTrophy color="gold" size="1.0em" />,
    color: "blue",
  },
  {
    id: 18,
    label: "Completed 25 Challenges",
    icon: <FaCrown color="yellow" size="1.0em" />,
    color: "purple",
  },
  {
    id: 19,
    label: "Completed 50 Challenges",
    icon: <FaGem color="blue" size="1.0em" />,
    color: "red",
  },
];

const UserProfileTable: React.FC<UserProfileTableProps> = ({
  userProfileBadges,
  userProfileScans,
  userCompleted,
}) => {
  const userBadges = badgeDefinitions.filter((badge) =>
    userProfileBadges.includes(badge.id)
  );

  return (
    <Box>
      <Stack align="center" mb={3} spacing={0}>
        <Text fontFamily="Tahoma" fontSize="xl" fontWeight="bold" mb={0}>
          Profile Statistics
        </Text>
        <Text fontFamily="Lucida Console">
          Challenges Completed:{" "}
          <Text as="span" fontWeight="bold">
            {userCompleted}
          </Text>
        </Text>
        <Text fontFamily="Lucida Console">
          Badges Earned:{" "}
          <Text as="span" fontWeight="bold">
            {userProfileBadges.filter((badge) => badge !== null).length}
          </Text>
        </Text>
        <Text fontFamily="Lucida Console">
          Items Scanned:{" "}
          <Text as="span" fontWeight="bold">
            {userProfileScans}
          </Text>
        </Text>
      </Stack>

      <Divider />
      <Text
        align="center"
        fontFamily="Tahoma"
        fontSize="lg"
        fontWeight="bold"
        mb={2}
      >
        Badges Earned
      </Text>
      <Flex direction="column" gap={4}>
        {userBadges.map((badge, index) => {
          if (index % 2 === 0) {
            return (
              <Flex key={badge.id} gap={4}>
                <Tag size="lg" colorScheme={badge.color} width="50%">
                  {badge.icon}
                  <Text fontFamily="Lucida Console" ml={2} fontSize="sm">
                    {badge.label}
                  </Text>
                </Tag>
                {userBadges[index + 1] && (
                  <Tag
                    key={userBadges[index + 1].id}
                    size="lg"
                    colorScheme={userBadges[index + 1].color}
                    width="50%"
                  >
                    {userBadges[index + 1].icon}
                    <Text fontFamily="Lucida Console" ml={2} fontSize="sm">
                      {userBadges[index + 1].label}
                    </Text>
                  </Tag>
                )}
              </Flex>
            );
          }
          return null;
        })}
      </Flex>
    </Box>
  );
};

export default UserProfileTable;
