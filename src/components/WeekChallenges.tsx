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
    <Grid templateAreas={`"total"`} gap={4} mt={6} mb={10}>
      <GridItem area="total">
        <HStack align="start" spacing={4}>
          <VStack align="start" w="full" spacing={1}>
            <Text ml={4} fontWeight="bold">
              WEEKLY CHALLENGES
            </Text>

            <HStack justify="space-between" w="85%" align="center">
              <Box flex="1">
                <Progress
                  value={
                    userChallenge.filter((progress) => progress > 0).length
                  }
                  max={5}
                  size="lg"
                  colorScheme="teal"
                  borderRadius="md"
                  mt={0}
                  ml={4}
                />
              </Box>
              <Text
                fontSize="sm"
                fontWeight="bold"
                color="gray.500"
                minW="40px"
                textAlign="left"
                mb={0}
              >
                {Math.min(
                  userChallenge.filter((progress) => progress > 0).length,
                  challenges.length
                )}
                /{challenges.length}
              </Text>
            </HStack>
          </VStack>
        </HStack>
        <Divider my={5} borderColor="gray.300" />
      </GridItem>
      {challenges.map((challenge, index) => {
        const [countString, displayName] = challenge.name.split("#");
        const totalCount = parseInt(countString) || 1;
        return (
          <GridItem key={challenge.id || index}>
            <HStack align="start" spacing={4}>
              <Circle size="12px" bg="gray.400" mt={5} />

              <VStack align="start" w="full" spacing={1}>
                <Text fontWeight="bold">{displayName}</Text>

                <HStack justify="space-between" w="70%" align="center">
                  <Box flex="1">
                    <Progress
                      value={userChallenge[index] || 0}
                      max={totalCount}
                      size="sm"
                      colorScheme="teal"
                      borderRadius="md"
                      mt={0}
                    />
                  </Box>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color="gray.500"
                    minW="40px"
                    textAlign="left"
                    mb={0}
                  >
                    {Math.min(userChallenge[index], totalCount) || 0}/
                    {totalCount}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            {index < challenges.length && (
              <Divider my={5} borderColor="gray.300" />
            )}
          </GridItem>
        );
      })}
    </Grid>
  );
}

export default WeekChallenges;
