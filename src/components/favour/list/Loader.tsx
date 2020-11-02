import React from "react";
import { SimpleGrid, Skeleton } from "@chakra-ui/core";
import { motion } from "framer-motion";

const ListLoader: React.FC = () => (
  <SimpleGrid
    as={motion.div}
    columns={2}
    spacing={8}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { delay: 1 } }}
  >
    {[...Array(6)].map((_, i) => (
      <Skeleton h={44} borderRadius="lg" key={i} />
    ))}
  </SimpleGrid>
);

export default ListLoader;
