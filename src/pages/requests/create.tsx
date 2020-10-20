import React, { useReducer } from "react";
import Head from "next/head";
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Heading,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import RewardList from "components/reward/RewardList";
import { requestValidation } from "lib/validator/schemas";
import { Rewards } from "models/Request";
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
  const { register, handleSubmit, errors: formErrors, formState } = useForm<RequestFormData>({
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
        <Heading size="lg" my={6}>
          Create Request
        </Heading>

        <Stack as="form" onSubmit={handleSubmit(createRequest)} spacing={8} align="start">
          <FormControl isInvalid={!!formErrors.title}>
            <FormLabel htmlFor="title">Title</FormLabel>
            <Input name="title" id="title" placeholder="What to do" ref={register} />
            <FormErrorMessage>{formErrors.title?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.description}>
            <FormLabel htmlFor="description">Description</FormLabel>
            <Textarea
              name="description"
              id="description"
              placeholder="Add Additional Information"
              ref={register}
            />
            <FormErrorMessage>{formErrors.description?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.rewards}>
            <FormLabel htmlFor="rewards">Rewards</FormLabel>
            <Input
              hidden
              name="rewards"
              id="rewards"
              value={JSON.stringify(state.rewards)}
              ref={register}
            ></Input>
            <FormErrorMessage>{formErrors.rewards?.message}</FormErrorMessage>
          </FormControl>
          <Grid>
            <RewardList rewards={state.rewards} dispatch={dispatch} />
          </Grid>

          <Button type="submit" isLoading={formState.isSubmitting}>
            Create
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default CreateRequest;
