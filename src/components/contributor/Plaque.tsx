import { Center, Box, Image, Text, Spacer } from "@chakra-ui/core";
import { EmbeddedUserSchema } from "models/User";
import React from "react";

interface PlaqueProps {
  contributor: EmbeddedUserSchema;
}
const Plaque: React.FC<PlaqueProps> = ({ contributor }) => {
  return (
    <>
      <Box borderRadius="md" p="5" w="32" h="32" bg="whiteAlpha.200">
        <Box borderRadius="full" w="12" h="12" bg="white"></Box>
        <Text fontSize="xs">{contributor.displayName}</Text>
      </Box>
    </>
  );
};

export default Plaque;
