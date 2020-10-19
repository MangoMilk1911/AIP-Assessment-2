import React, { useReducer } from "react";
import { string } from "yup";
import Head from "next/head";
import Link from "next/link";
import RewardList from "@/components/reward/RewardList";
// import { Rewards } from "models/Contribution";
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/core";

export type RewardsReducerState = {
  rewards: Map<string, number>;
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
      throw new Error("No action provided for rewards reducer");
  }
}

const CreateFavour: React.FC = () => {
  const [state, dispatch] = useReducer(rewardsReducer, { rewards: {} });
  return (
    <>
      <Head>
        <title>Pinki | Create Favour</title>
      </Head>

      <Container maxW="40rem">
        <Heading as="h1" size="lg" my={5}>
          Create Favour
        </Heading>
        <Box>
          <FormControl>
            <FormLabel as="h2" size="md" my={5}>
              Debtor
            </FormLabel>
            <Input placeholder="MONKI" />
          </FormControl>

          <FormControl>
            <FormLabel as="h2" size="md" my={5}>
              Recipient
            </FormLabel>
            <Input placeholder="FLIP!!!" />
          </FormControl>

          <FormControl>
            <FormLabel as="h2" size="md" my={5}>
              Rewards
            </FormLabel>
            <Grid>
              <RewardList rewards={state.rewards} dispatch={dispatch} />{" "}
            </Grid>

            <Button type="submit" w="full" size="lg" colorScheme="primary" mb={4} onClick={}>
              <a>Create Favour</a>
            </Button>
          </FormControl>
        </Box>
      </Container>
    </>
  );
};

export default CreateFavour;
