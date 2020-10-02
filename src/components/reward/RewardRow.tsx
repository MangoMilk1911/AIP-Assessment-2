import React from "react";
import { Box, Center, Heading, CloseButton, Input, IconButton, Grid } from "@chakra-ui/core";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import getEmojiName from "utils/getEmojiName";

interface RewardRowProps {
  emoji: string;
}

const RewardRow: React.FC<RewardRowProps> = ({ emoji }) => {
  return (
    <Grid templateColumns="15% 40% 35% 10%" py="2rem">
      <Heading textAlign="center">{emoji}</Heading>
      <Heading textAlign="center" isTruncated>
        {getEmojiName(emoji)}
      </Heading>
      <Grid px="1rem" templateColumns="repeat(3,1fr)">
        <IconButton aria-label="Increment reward" icon={<MinusIcon />} />
        <Input />
        <IconButton aria-label="Increment reward" icon={<AddIcon />} />
      </Grid>
      <CloseButton />
    </Grid>
  );
};

export default RewardRow;
