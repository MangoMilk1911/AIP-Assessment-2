import RewardList from "@/components/reward/RewardList";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { requestValidation } from "lib/validator/schemas";
import { Rewards } from "models/Request";
import Head from "next/head";
import React, { useReducer } from "react";
import { useForm } from "react-hook-form";

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
  const { register, handleSubmit, errors: formErrors } = useForm<RequestFormData>({
    resolver: yupResolver(requestValidation),
    context: { form: true, create: true },
  });

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
          <FormControl isInvalid={!!formErrors.title}>
            <FormLabel htmlFor="title" as="h2" size="md" my={5}>
              Title
            </FormLabel>
            <Input type="text" name="title" id="name" placeholder="What to do" ref={register()} />
            <FormErrorMessage>{formErrors.title?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.description}>
            <FormLabel htmlFor="description" as="h2" size="md" my={5}>
              Description
            </FormLabel>
            <Textarea
              name="description"
              id="description"
              placeholder="Add Additional Information"
              ref={register()}
            />
            <FormErrorMessage>{formErrors.description?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.rewards}>
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
              readOnly
              type="text"
              name="rewards"
              id="rewards"
              value={JSON.stringify(state.rewards)}
              ref={register()}
            ></Input>
            <FormErrorMessage>{formErrors.rewards?.message}</FormErrorMessage>
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
