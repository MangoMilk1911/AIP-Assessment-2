import { Box, Flex, Text } from "@chakra-ui/core";
import React from "react";

interface PlaqueProps {
  contributor: string;
}
const Plaque: React.FC<PlaqueProps> = ({ contributor }) => {
  return (
    <>
      <Flex direction="column" borderRadius="md" p="5" w="32" h="32" bg="whiteAlpha.200">
        <Text>{contributor}</Text>
      </Flex>
    </>
  );
};

export default Plaque;
