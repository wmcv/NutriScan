import { useState, useEffect } from "react";
import TableSelectionBtn from "./TableSelectionBtn";
import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, HStack, IconButton, Text, Divider } from "@chakra-ui/react";
import WeekChallenges from "./WeekChallenges";
import { Challenge } from "@/types";
import UserProfileTable from "./UserProfileTable";

interface NavBarProps {
  setProfileOpen: (isOpen: boolean) => void;
  userChallenge: number[];
  userCompleted: number;
  challenges: Challenge[];
  userProfileScans: number;
  userProfileBadges: number[];
}

const ProfileFrame: React.FC<NavBarProps> = ({
  setProfileOpen,
  userChallenge,
  userCompleted,
  challenges,
  userProfileScans,
  userProfileBadges,
}) => {
  const [isA, setA] = useState(true);
  const [isB, setB] = useState(false);
  const [isC, setC] = useState(false);
  {
    isC;
  }
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      w="100vw"
      h="100vh"
      bg="rgba(0, 0, 0, 0.6)"
      zIndex="overlay"
    >
      <Box
        w="90%"
        maxW="500px"
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        p={5}
        m="auto"
        maxH="90vh"
        overflowY="auto"
      >
        <Flex justify="space-between" align="center" mb={4}>
          <Box mr={5} />
          <Text
            align="center"
            fontFamily="Vagabondfed"
            fontSize="lg"
            fontWeight="bold"
            color="gray.700"
          >
            Profile Info
          </Text>
          <IconButton
            icon={<CloseIcon />}
            aria-label="Close menu"
            onClick={() => setProfileOpen(false)}
            size="sm"
            colorScheme="red"
          />
        </Flex>

        <Divider />

        <HStack spacing={3} justify="center" my={3}>
          <TableSelectionBtn
            setTrue={setA}
            setFalse1={setB}
            setFalse2={setC}
            label="Profile"
          />
          <TableSelectionBtn
            setTrue={setB}
            setFalse1={setA}
            setFalse2={setC}
            label="Challenges"
          />
        </HStack>

        <Divider />

        <Box mt={3}>
          {isA && (
            <UserProfileTable
              userProfileBadges={userProfileBadges}
              userProfileScans={userProfileScans}
              userCompleted={userCompleted}
            />
          )}

          {isB && (
            <WeekChallenges
              userChallenge={userChallenge}
              challenges={challenges}
            ></WeekChallenges>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default ProfileFrame;
