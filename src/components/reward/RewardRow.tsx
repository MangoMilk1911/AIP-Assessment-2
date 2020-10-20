import React from "react";
import { availableRewards } from "lib/availableRewards";
import { CloseButton, Grid, Heading, IconButton, Input } from "@chakra-ui/core";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { RewardsReducerAction } from "hooks/useRewardsReducer";

interface RewardRowProps {
  reward: string;
  quantity: number;
  dispatch: React.Dispatch<RewardsReducerAction>;
}

const RewardRow: React.FC<RewardRowProps> = ({ reward, quantity, dispatch }) => {
  return (
    <>
      <Grid templateColumns="15% 40% 35% 10%" py="2rem">
        <Heading textAlign="center">{reward}</Heading>
        <Heading textAlign="center" isTruncated>
          {availableRewards[reward]}
        </Heading>
        <Grid px="1rem" templateColumns="repeat(3,1fr)">
          <IconButton
            aria-label="Decrement reward"
            icon={<MinusIcon />}
            onClick={() =>
              dispatch({
                type: "set",
                payload: { reward, quantity: quantity === 0 ? 0 : quantity - 1 },
              })
            }
          />
          <Input
            value={quantity}
            type="number"
            min="0"
            onChange={(e) =>
              dispatch({
                type: "set",
                payload: { reward, quantity: Number(e.target.value) },
              })
            }
          />
          <IconButton
            aria-label="Increment reward"
            icon={<AddIcon />}
            onClick={() => dispatch({ type: "set", payload: { reward, quantity: quantity + 1 } })}
          />
        </Grid>
        <CloseButton onClick={() => dispatch({ type: "remove", payload: reward })} />
      </Grid>
    </>
  );
};

export default RewardRow;
