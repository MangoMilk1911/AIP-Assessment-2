import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import RewardList from "components/reward/RewardList";
import { useAuth } from "hooks/useAuth";
import { useRewardList } from "hooks/useRewardList";
import { isServerError } from "lib/errorHandler";
import fetcher from "lib/fetcher";
import { favourValidation } from "lib/validator/schemas";
import { Rewards, FavourSchema } from "models/Favour";
import { UserSchema } from "models/User";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SelectUser from "../SelectUser";

export interface OwingFormData {
  debtor: string;
  recipient: string;
  rewards: Rewards;
}

const OwingForm: React.FC = () => {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [selectedUser, setSelectedUser] = useState<UserSchema>(null);
  const { rewards } = useRewardList();

  // Form
  const { handleSubmit, register, errors: formErrors, formState } = useForm<OwingFormData>({
    resolver: yupResolver(favourValidation),
    context: { form: true, create: true },
  });

  async function createFavour({ debtor, recipient, rewards }: OwingFormData) {
    try {
      const { newFavour, party } = (await fetcher("/api/favours", accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debtor,
          recipient,
          rewards,
        }),
      })) as { newFavour: FavourSchema; party: UserSchema[] };

      toast({
        status: "success",
        title: "New favour created!",
      });

      if (party.length > 0) {
        toast({
          status: "info",
          title: "It's Party Time! 🥳",
          description: `Party detected between ${party.map((user) => user.displayName).join(", ")}`,
          duration: null,
          isClosable: true,
        });
      }

      router.push("/favours/" + newFavour._id);
    } catch (error) {
      const errMsg = isServerError(error) ? error.errors[0].message : error.message;
      toast({
        status: "error",
        title: errMsg || "Something went wrong...",
      });
    }
  }

  return (
    <Stack as="form" spacing={8} onSubmit={handleSubmit(createFavour)}>
      {/* Debtor */}
      <Input hidden readOnly value={user?.uid || ""} id="debtor" name="debtor" ref={register} />

      {/* Recipient */}
      <FormControl isInvalid={!!formErrors.recipient} mt="0 !important">
        <FormLabel htmlFor="recipient">Who do you owe?</FormLabel>
        <SelectUser onSelectUser={setSelectedUser} />
        <FormErrorMessage>{formErrors.recipient?.message}</FormErrorMessage>

        <Input
          readOnly
          hidden
          id="recipient"
          name="recipient"
          ref={register}
          value={selectedUser?._id || ""}
        />
      </FormControl>

      {/* Rewards */}
      <FormControl isInvalid={!!formErrors.rewards}>
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
      <Button type="submit" colorScheme="primary" size="lg" disabled={formState.isSubmitting}>
        Submit
      </Button>
    </Stack>
  );
};

export default OwingForm;
