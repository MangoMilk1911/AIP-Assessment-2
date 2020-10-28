import React, { useCallback, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Container,
  Image,
  Stack,
  Text,
  useToast,
  Wrap,
} from "@chakra-ui/core";
import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons";
import RewardCube from "components/reward/RewardCube";
import { useAuth } from "hooks/useAuth";
import fetcher from "lib/fetcher";
import { firebaseAdmin } from "lib/firebase/admin";
import { firebase } from "lib/firebase/client";
import Favour, { FavourSchema } from "models/Favour";
import { EmbeddedUserSchema } from "models/User";
import nookies from "nookies";
import { ServerError } from "lib/errorHandler";
import useSWR from "swr";
import { isValidObjectId } from "mongoose";

/**
 * User Preview
 */

interface UserPreviewProps {
  user: EmbeddedUserSchema;
}

const UserPreview: React.FC<UserPreviewProps> = ({ user }) => (
  <Stack direction="row" align="center" spacing={4}>
    <Avatar src={user.photoURL} name={user.displayName} />
    <Text fontSize="xl" fontWeight="bold">
      {user.displayName}
    </Text>
  </Stack>
);

/**
 * Favour Details Page
 */

interface FavourDetailsProps {
  initFavour: FavourSchema;
}

const FavourDetails: React.FC<FavourDetailsProps> = ({ initFavour }) => {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const { data: favour, mutate } = useSWR<FavourSchema, ServerError>(
    [`/api/favours/${initFavour._id}`, accessToken],
    {
      initialData: initFavour,
    }
  );
  const { _id, debtor, recipient, rewards, initialEvidence, evidence } = favour;

  // Delete Favour
  const canDelete = user?.uid === recipient._id || (user?.uid === debtor._id && evidence);
  const deleteFavour = useCallback(async () => {
    try {
      await fetcher(`/api/favours/${_id}`, accessToken, { method: "DELETE" });

      toast({
        status: "success",
        title: "Favour deleted!",
      });

      router.push("/favours");
    } catch (fetchError) {
      const { errors } = fetchError as ServerError;

      toast({
        status: "error",
        title: "Unable to delete favour 😭",
        description: errors[0].message,
      });
    }
  }, [_id, accessToken]);

  // Upload Evidence
  const canUploadEvidence = user?.uid === debtor._id && !initFavour.evidence;
  const uploadEvidence: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const evidence = e.target.files[0];

    try {
      const timestamp = new Date().toISOString();
      const path = `favours/${debtor._id}_${recipient._id}_${timestamp}/evidence.png`;
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(path);
      await fileRef.put(evidence);

      await fetcher(`/api/favours/${initFavour._id}/evidence`, accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidence: path,
        }),
      });

      mutate({
        ...favour,
        evidence: path,
      });

      toast({
        status: "success",
        title: "Evidence submitted! 🥳",
      });
    } catch (error) {
      // Todo
    }
  };

  // Image
  const [initEvidenceURL, setinitEvidenceURL] = useState("");
  const [evidenceURL, setEvidenceURL] = useState("");
  useEffect(() => {
    if (initialEvidence) {
      firebase.storage().ref(initialEvidence).getDownloadURL().then(setinitEvidenceURL);
    }

    if (evidence) {
      firebase.storage().ref(evidence).getDownloadURL().then(setEvidenceURL);
    }
  }, [initialEvidence, evidence]);

  return (
    <>
      <Head>
        <title>Pink | Favour</title>
      </Head>

      <Container maxW="sm" mt={16}>
        <Button
          variant="link"
          color="inherit"
          fontWeight="normal"
          size="lg"
          mb={6}
          leftIcon={<ArrowBackIcon />}
        >
          <NextLink href="/favours">Back</NextLink>
        </Button>

        <Stack spacing={8} align="center">
          {/* Involved Users */}
          <Stack
            direction="row"
            spacing={4}
            align="center"
            justify="center"
            w="full"
            p={8}
            bg="whiteAlpha.200"
            borderRadius="lg"
          >
            <UserPreview user={debtor} />
            <Text color="primary.200">Promised</Text>
            <UserPreview user={recipient} />
          </Stack>

          {/* Reward Pool */}
          <Wrap justify="center" w="28rem">
            {Object.keys(rewards).map((reward) => (
              <Box bg="whiteAlpha.200" borderRadius="lg" px={4} py={3} key={reward}>
                <RewardCube reward={reward} quantity={rewards[reward]} />
              </Box>
            ))}
          </Wrap>

          {initEvidenceURL && (
            <Box>
              <Text textAlign="center">Initial Evidence</Text>
              <Image boxSize="xs" src={initEvidenceURL} />
            </Box>
          )}
          {evidenceURL && (
            <Box>
              <Text textAlign="center">Debtor Evidence</Text>
              <Image boxSize="xs" src={evidenceURL} />
            </Box>
          )}

          {/* Actions */}
          <Stack direction="row" justify="space-between" w="full">
            <Button
              onClick={deleteFavour}
              isDisabled={!canDelete}
              variant="ghost"
              colorScheme="red"
              rightIcon={<DeleteIcon />}
            >
              Delete
            </Button>

            {canUploadEvidence && <input type="file" onChange={uploadEvidence} />}
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (!isValidObjectId(ctx.query.id)) {
    ctx.res.writeHead(302, { location: "/favours" });
    ctx.res.end();
  }

  try {
    const { "pinky-auth": accessToken } = nookies.get(ctx);
    await firebaseAdmin.auth().verifyIdToken(accessToken);

    const initFavour = await Favour.findById(ctx.query.id).lean();

    return { props: { initFavour } };
  } catch (error) {
    // User isn't authenticated, send to login
    ctx.res.writeHead(302, { location: "/login" });
    ctx.res.end();

    return { props: {} as never };
  }
};

export default FavourDetails;
