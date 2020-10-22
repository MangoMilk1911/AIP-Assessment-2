import React from "react";
import { NextPage } from "next";
import { FavourSchema } from "models/Favour";
import fetcher from "lib/fetcher";
import nookies from "nookies";
import Head from "next/head";
import { Avatar, Box, Container, Flex, Stack, Text } from "@chakra-ui/core";
import { EmbeddedUserSchema } from "models/User";

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
  favour: FavourSchema;
}

const FavourDetails: NextPage<FavourDetailsProps> = ({ favour }) => {
  const { debtor, recipient, rewards } = favour;

  return (
    <>
      <Head>
        <title>Pink | Favour</title>
      </Head>

      <Container maxW="lg" mt={16}>
        <Stack spacing={8} align="center">
          <Stack
            direction="row"
            spacing={4}
            align="center"
            p={8}
            bg="whiteAlpha.200"
            borderRadius="lg"
          >
            <UserPreview user={debtor} />
            <Text color="primary.300">Promised</Text>
            <UserPreview user={recipient} />
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

FavourDetails.getInitialProps = async (ctx) => {
  const { "pinky-auth": accessToken } = nookies.get(ctx);
  const favour = await fetcher(
    `${process.env.NEXT_PUBLIC_APIURL}/api/favours/${ctx.query.id}`,
    accessToken
  );

  return { favour };
};

export default FavourDetails;
