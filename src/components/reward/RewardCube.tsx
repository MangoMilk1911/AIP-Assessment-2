import React from "react";
import { Text, SimpleGrid } from "@chakra-ui/core";

interface RewardCubeProps {
  rewardName: string;
  rewardNumber: string;
}

const RewardCube: React.FC<RewardCubeProps> = ({ rewardName, rewardNumber }) => {
  return (
    <SimpleGrid columns={2} spacing={2} borderRadius="md" bg="whiteAlpha.200" w="40" p={3} m={2}>
      <Text>{rewardName}:</Text>
      <Text>{rewardNumber}</Text>
    </SimpleGrid>
  );
};

export default RewardCube;
