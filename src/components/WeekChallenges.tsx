import {
  Box,
  Divider,
  Grid,
  GridItem,
  HStack,
  Progress,
  Text,
  VStack,
  Circle,
} from "@chakra-ui/react";
import { Challenge } from "@/types";

interface WeekChallengesProps {
  userChallenge: number[];
  challenges: Challenge[];
}

function WeekChallenges({ userChallenge, challenges }: WeekChallengesProps) {
  return (
    <Grid gap={4} mt={6}>
      {challenges.map((challenge, index) => {
        const [countString, displayName] = challenge.name.split("#");
        const totalCount = parseInt(countString) || 1; // default to 1 if not valid

        return (
          <GridItem key={challenge.id || index}>
            <HStack align="start" spacing={4}>
              <Circle size="12px" bg="gray.400" mt={5} />

              <VStack align="start" w="full" spacing={1}>
                <Text fontWeight="bold">{displayName}</Text>

                <HStack justify="space-between" w="75%" align="center">
                  <Box flex="1">
                    <Progress
                      value={userChallenge[index] || 0} // You can update this dynamically later
                      max={totalCount}
                      size="sm"
                      colorScheme="teal"
                      borderRadius="md"
                      mt={0}
                    />
                  </Box>
                  <Text
                    fontSize="sm"
                    color="gray.500"
                    minW="40px"
                    textAlign="left"
                    mb={0}
                  >
                    {userChallenge[index] || 0}/{totalCount}
                  </Text>
                </HStack>
              </VStack>
            </HStack>

            {/* Divider below each challenge except the last one */}
            {index < challenges.length - 1 && (
              <Divider my={4} borderColor="gray.300" />
            )}
          </GridItem>
        );
      })}
    </Grid>
  );
}

export default WeekChallenges;
