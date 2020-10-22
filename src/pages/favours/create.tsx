import React, { useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Select,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/core";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import { UserSchema } from "models/User";
import { RewardListProvider, useRewardList } from "hooks/useRewardList";
import RewardList from "@/components/reward/RewardList";
import { yupResolver } from "@hookform/resolvers/yup";
import { favourValidation } from "lib/validator/schemas";
import { useAuth } from "lib/auth";
import fetcher, { FetcherError } from "lib/fetcher";
import { Rewards } from "models/Favour";
import SelectUser from "@/components/favour/SelectUser";

const useSelectUser = () => {
  // Selected User
  const [selectedUser, setSelectedUser] = useState<UserSchema>(null);
  const [showUsers, setShowUsers] = useState(false);

  // User Query
  const userQueryInput = useRef<HTMLInputElement>();
  const [userQuery, setUserQuery] = useState("");
  const { data: users } = useSWR<UserQueryData>(
    userQuery.length >= 2 && `/api/users?q=${userQuery}`
  );

  const searchUsers: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (userQueryInput.current.value.length < 2) return;

    setUserQuery(userQueryInput.current.value);
    setShowUsers(true);
  };

  const selectUser = (user: UserSchema) => {
    setSelectedUser(user);
    setShowUsers(false);
    userQueryInput.current.value = user.displayName;
  };

  return {
    users,
    showUsers,
    selectUser,
    setShowUsers,
    userQueryInput,
    searchUsers,
    selectedUser,
  };
};

/**
 * Owing Form
 */

type UserQueryData = UserSchema[];

interface OwingFormData {
  debtor: string;
  recipient: string;
  rewards: Rewards;
}

const OwingForm: React.FC = () => {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const toast = useToast();

  // Rewards
  const { rewards } = useRewardList();

  // Select User Hook
  const {
    users,
    showUsers,
    selectUser,
    setShowUsers,
    userQueryInput,
    searchUsers,
    selectedUser,
  } = useSelectUser();

  // Form
  const { handleSubmit, register, errors: formErrors } = useForm<OwingFormData>({
    resolver: yupResolver(favourValidation),
    context: { form: true, create: true },
  });

  const createFavour = async ({ debtor, recipient, rewards }: OwingFormData) => {
    try {
      await fetcher("/api/favours", accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debtor,
          recipient,
          rewards,
        }),
      });

      toast({
        status: "success",
        title: "New Favour Created!",
      });
      router.push("/favours");
    } catch (error) {
      (error as FetcherError).details?.errors.forEach((err) => {
        toast({
          status: "error",
          title: "Uh oh...",
          description: err.message,
        });
      });
    }
  };

  return (
    <Stack as="form" spacing={8} onSubmit={handleSubmit(createFavour)}>
      {/* Debtor */}
      <Input hidden readOnly value={user?.uid || ""} id="debtor" name="debtor" ref={register} />

      {/* Recipient */}
      <FormControl isInvalid={!!formErrors.recipient} mt="0 !important">
        <FormLabel htmlFor="recipient">Who do you owe?</FormLabel>
        <Flex>
          <Input ref={userQueryInput} flexGrow={1} borderRightRadius={0} />
          <Button onClick={searchUsers} px={12} borderLeftRadius={0}>
            Search
          </Button>
        </Flex>
        <FormHelperText>Search must be more than 2 characters.</FormHelperText>

        <Input
          readOnly
          hidden
          id="recipient"
          name="recipient"
          ref={register}
          value={selectedUser?._id || ""}
        />
        <FormErrorMessage>{formErrors.recipient?.message}</FormErrorMessage>
      </FormControl>

      {/* Select User */}
      <SelectUser
        users={users}
        showUsers={showUsers}
        selectUser={selectUser}
        setShowUsers={setShowUsers}
      />

      {/* Rewards */}
      <FormControl mt="0 !important" isInvalid={!!formErrors.rewards}>
        <FormLabel htmlFor="rewards">What do you owe them?</FormLabel>
        <RewardList />
        {Object.keys(rewards).map((reward) => (
          <Input
            hidden
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

      {/* Submit */}
      <Button type="submit" colorScheme="primary" size="lg">
        Submit
      </Button>
    </Stack>
  );
};

const OweForm: React.FC = () => {
  const router = useRouter();

  return (
    <p>
      <span
        onClick={() => {
          router.push({
            query: { type: "owing" },
          });
        }}
      >
        Owe
      </span>
    </p>
  );
};

const Create: React.FC = () => {
  const router = useRouter();
  const { type: formType } = router.query;

  const changeFormType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push({
      query: { type: e.target.value },
    });
  };

  return (
    <>
      <Head>
        <title>Pink | Create Favour</title>
      </Head>

      <Container maxW="sm" mt={16}>
        <Stack spacing={8}>
          <Heading>Create Favour</Heading>

          {/* Change Form Type */}
          <Stack spacing={4}>
            <Text>Type of Favour</Text>

            <Select value={formType} onChange={changeFormType}>
              <option value="owing">You Owe Someone 😥</option>
              <option value="owed">Someone Owes You 😁</option>
            </Select>
          </Stack>

          <RewardListProvider>
            {formType === "owing" ? <OwingForm /> : <OweForm />}
          </RewardListProvider>
        </Stack>
      </Container>
    </>
  );
};

export default Create;
