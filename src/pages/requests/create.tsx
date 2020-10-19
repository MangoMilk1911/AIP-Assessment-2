import RewardList from "@/components/reward/RewardList";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/core";
import { Rewards } from "models/Request";
import Head from "next/head";
import React, { useReducer } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { requestValidation } from "models/Request";
import createValidator from "lib/validator";

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

interface RequestFormData {
  title: string;
  description: string;
  rewards: Rewards;
}

const CreateRequest: React.FC = () => {
  const [state, dispatch] = useReducer(rewardsReducer, { rewards: {} });
  const { register, handleSubmit } = useForm<RequestFormData>();

  const createRequest = ({ title, description, rewards }: RequestFormData) => {
    console.log(rewards);
  };
  return (
    <>
      <Head>
        <title>Pinki | Create Request</title>
      </Head>

      <Container maxW="4xl">
        <Heading as="h1" size="lg" my={5}>
          Create Request
        </Heading>

        <Box as="form" onSubmit={handleSubmit(createRequest)}>
          <FormControl>
            <FormLabel htmlFor="title" as="h2" size="md" my={5}>
              Title
            </FormLabel>
            <Input type="text" name="title" id="name" placeholder="What to do" ref={register()} />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="description" as="h2" size="md" my={5}>
              Description
            </FormLabel>
            <Textarea
              name="description"
              id="description"
              placeholder="Add Additional Information"
              ref={register()}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="rewards" as="h2" size="md" my={5}>
              Rewards
            </FormLabel>
            <Box>
              {Object.keys(state.rewards).map((reward) => (
                <Box>
                  {reward} {state.rewards[reward]}
                </Box>
              ))}
            </Box>
            <Grid>
              <RewardList rewards={state.rewards} dispatch={dispatch} />
            </Grid>

            <Input
              type="text"
              name="rewards"
              id="rewards"
              value={JSON.stringify(state.rewards)}
              ref={register()}
            ></Input>
          </FormControl>
          <Box>
            <Button type="submit">Create</Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default CreateRequest;
