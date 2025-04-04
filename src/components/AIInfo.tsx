import {
  Box,
  Text,
  Flex,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";

interface AIAnalysisProps {
  aiResponse: string;
}

const AIAnalysis: React.FC<AIAnalysisProps> = ({ aiResponse }) => {
  if (!aiResponse) return <Text>No analysis available.</Text>;

  const [ratingPart, ...responseParts] = aiResponse.split("#");
  const rating = parseInt(ratingPart, 10);
  const explanation = responseParts.join("#").trim(); 

  return (
    <Box p={6} bg="white" borderRadius="md" boxShadow="md">
      <Flex align="center" mb={4}>
        <CircularProgress
          value={(rating / 10) * 100}
          size="70px"
          color={
            rating >= 7 ? "green.400" : rating >= 4 ? "yellow.400" : "red.400"
          }
        >
          <CircularProgressLabel fontSize="lg" fontWeight="bold">
            {rating}/10
          </CircularProgressLabel>
        </CircularProgress>

        <Text fontSize="xl" fontWeight="bold" ml={4}>
          AI Rating
        </Text>
      </Flex>

      <Text fontWeight="semibold" fontSize="lg" mb={2}>
        Analysis
      </Text>
      <Text>{explanation}</Text>
    </Box>
  );
};

export default AIAnalysis;
