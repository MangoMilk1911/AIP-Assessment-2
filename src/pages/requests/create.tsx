import React, { useReducer } from "react";
import Head from "next/head";
import Link from "next/link";
import RewardList from "@/components/reward/RewardList";
import { Rewards } from "models/Contribution";
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/core";

export type RewardsReducerState = {
  rewards: Rewards;
};

export type RewardsReducerAction =
  | { type: "set"; payload: { reward: string; quantity: number } }
  | { type: "remove"; reward: string }
  | { type: "clear" };

function rewardsReducer(state: RewardsReducerState, action: RewardsReducerAction) {
  switch (action.type) {
    case "set":
      state.rewards[action.payload.reward] = action.payload.quantity;
      return { rewards: state.rewards };
    case "remove":
      delete state.rewards[action.reward];
      return { rewards: state.rewards };
    case "clear":
      return { rewards: {} };
    default:
      throw new Error("No action provided for rewards reducer.");
  }
}

const CreateRequest: React.FC = () => {
  const [state, dispatch] = useReducer(rewardsReducer, { rewards: {} });

  return (
    <>
      <Head>
        <title>Pinki | Create Request</title>
      </Head>
      <Link href="/">
        <a>Home</a>
      </Link>

      <Container maxW="40rem">
        <Heading as="h1" size="lg" my={5}>
          Create Request
        </Heading>
        <Box>
          <FormControl>
            <FormLabel as="h2" size="md" my={5}>
              Title
            </FormLabel>
            <Input placeholder="PURP" />
          </FormControl>

          <FormControl>
            <FormLabel as="h2" size="md" my={5}>
              Description
            </FormLabel>
            <Textarea placeholder="IM SO TURNT" />
          </FormControl>

          <FormControl>
            <FormLabel as="h2" size="md" my={5}>
              Rewards
            </FormLabel>
            <Grid>
              <RewardList rewards={state.rewards} dispatch={dispatch} />
            </Grid>
          </FormControl>
        </Box>
      </Container>
    </>
  );
};

export default CreateRequest;
