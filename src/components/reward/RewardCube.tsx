import React from "react";
import { Text, HStack } from "@chakra-ui/core";

interface RewardCubeProps {
  rewardName: string;
  rewardNumber: string;
}

const RewardCube: React.FC<RewardCubeProps> = ({ rewardName, rewardNumber }) => {
  return (
    <HStack spacing={4} borderRadius="md" bg="whiteAlpha.200" w="24" p={3}>
      <Text>{rewardName}</Text>
      <Text>{rewardNumber}</Text>
    </HStack>
  );
};

export default RewardCube;
