import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
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
import { firebase } from "lib/firebase/client";
import { favourValidation } from "lib/validator/schemas";
import { FavourSchema } from "models/Favour";
import { UserSchema } from "models/User";
import { useForm } from "react-hook-form";
import SelectUser from "../SelectUser";
import { OwingFormData } from "./OwingFormContent";
import { useDropzone } from "react-dropzone";
import { AttachmentIcon } from "@chakra-ui/icons";

interface OweFormData extends OwingFormData {
  initEvidence: FileList;
}

const OweForm: React.FC = () => {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [selectedUser, setSelectedUser] = useState<UserSchema>(null);
  const { rewards } = useRewardList();

  // Form
  const { handleSubmit, register, errors: formErrors, formState } = useForm<OweFormData>({
    resolver: yupResolver(favourValidation),
    context: { form: true, create: true },
  });

  // Initial Evidence Upload
  const uploadState = useDropzone();

  async function createFavour({ debtor, recipient, rewards }: OweFormData) {
    try {
      // Upload evidence to firebase storage
      const initEvidencePath = `favours/${debtor}_${recipient}_${new Date().toISOString()}/initialEvidence.png`;
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(initEvidencePath);
      await fileRef.put(uploadState.acceptedFiles[0]);

      // Add favour via API
      const { newFavour, party } = (await fetcher("/api/favours", accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          debtor,
          recipient,
          rewards,
          initialEvidence: initEvidencePath,
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
      {/* Recipient */}
      <Input
        hidden
        readOnly
        value={user?.uid || ""}
        id="recipient"
        name="recipient"
        ref={register}
      />

      {/* Debtor */}
      <FormControl isInvalid={!!formErrors.debtor} mt="0 !important">
        <FormLabel htmlFor="debtor">Who owes you?</FormLabel>
        <SelectUser onSelectUser={setSelectedUser} />
        <FormErrorMessage>{formErrors.debtor?.message}</FormErrorMessage>

        <Input
          readOnly
          hidden
          id="debtor"
          name="debtor"
          ref={register}
          value={selectedUser?._id || ""}
        />
      </FormControl>

      {/* Rewards */}
      <FormControl isInvalid={!!formErrors.rewards}>
        <FormLabel htmlFor="rewards">What do they owe you?</FormLabel>
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

      <FormControl isRequired isInvalid={!!formErrors.initEvidence}>
        <FormLabel>Initial Evidence</FormLabel>
        <Button
          w="full"
          py={12}
          variant="outline"
          colorScheme="teal"
          rightIcon={<AttachmentIcon mb="2px" />}
          borderRadius="md"
          {...uploadState.getRootProps()}
        >
          <input name="initEvidence" {...uploadState.getInputProps()} />
          Drag File or Click to Upload
        </Button>
      </FormControl>

      {uploadState.acceptedFiles[0] && (
        <Image
          src={URL.createObjectURL(uploadState.acceptedFiles[0])}
          boxSize="sm"
          alignSelf="center"
          fit="cover"
          borderRadius="md"
        />
      )}

      {/* Submit */}
      <Button
        type="submit"
        colorScheme="primary"
        size="lg"
        isDisabled={uploadState.acceptedFiles.length === 0}
        isLoading={formState.isSubmitting}
      >
        Submit
      </Button>
    </Stack>
  );
};

export default OweForm;
