import React from "react";
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
  Text,
} from "@chakra-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import RewardList from "components/reward/RewardList";
import { requestValidation } from "lib/validator/schemas";
import { Rewards } from "models/Request";
import { useForm } from "react-hook-form";
import useRewardList from "hooks/useRewardsReducer";
import { useAuth } from "lib/auth";
import fetcher from "lib/fetcher";
import { Router, useRouter } from "next/router";

interface RequestFormData {
  title: string;
  description: string;
  rewards: Rewards;
}

const CreateRequest: React.FC = () => {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { rewards, dispatch } = useRewardList();
  const { register, handleSubmit, errors: formErrors, formState } = useForm<RequestFormData>({
    resolver: yupResolver(requestValidation),
    context: { form: true, create: true },
  });

  const createRequest = async ({ title, description, rewards }: RequestFormData) => {
    await fetcher("/api/requests/", accessToken, {
      method: "POST",
      body: JSON.stringify({
        title: title,
        description: description,
        rewards: rewards,
      }),
      headers: { "Content-type": "application/json" },
    });
    router.push("/requests");
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
            {Object.keys(rewards).map((reward) => (
              <Input
                key={reward}
                readOnly
                name={`rewards.${reward}`}
                id={`rewards.${reward}`}
                value={rewards[reward]}
                ref={register}
              />
            ))}
            <FormErrorMessage>{formErrors.rewards?.message}</FormErrorMessage>
          </FormControl>
          <Grid>
            <RewardList rewards={rewards} dispatch={dispatch} />
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
