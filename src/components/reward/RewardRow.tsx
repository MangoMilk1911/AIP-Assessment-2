import React from "react";
import { Box, Center, Heading, CloseButton, Input, IconButton, Grid } from "@chakra-ui/core";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import getEmojiName from "utils/getEmojiName";
import { useState } from "react";

interface RewardRowProps {
  emoji: string;
}

const RewardRow: React.FC<RewardRowProps> = ({ emoji }) => {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);

  return (
    <>
      {visible && (
        <Grid templateColumns="15% 40% 35% 10%" py="2rem">
          <Heading textAlign="center">{emoji}</Heading>
          <Heading textAlign="center" isTruncated>
            {getEmojiName(emoji)}
          </Heading>
          <Grid px="1rem" templateColumns="repeat(3,1fr)">
            <IconButton
              onClick={() => {
                if (count > 0) {
                  setCount(count - 1);
                }
              }}
              aria-label="Decrement reward"
              icon={<MinusIcon />}
            />
            <Input value={count} />
            <IconButton
              onClick={() => {
                setCount(count + 1);
              }}
              aria-label="Increment reward"
              icon={<AddIcon />}
            />
          </Grid>
          <CloseButton
            onClick={() => {
              setVisible(false);
            }}
          />
        </Grid>
      )}
    </>
  );
};

export default RewardRow;
