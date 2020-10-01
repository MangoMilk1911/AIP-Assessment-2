import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Heading, Input, Container, Textarea, Grid, Button } from "@chakra-ui/core";
import RewardRow from "components/RewardRow";
import AddRewardModal from "components/AddRewardModal";

const CreateRequest: React.FC = () => {
  return (
    <>
      <Head>
        <title>Pinki | Create Request</title>
      </Head>
      <Link href="/">
        <a>Home</a>
      </Link>

      <Container maxW="40rem">
        <Heading as="h1" size="lg" my={5}>
          Create Request
        </Heading>
        <Heading as="h2" size="md" my={5}>
          Title
        </Heading>
        <Input placeholder="PURP" />

        <Heading as="h2" size="md" my={5}>
          Description
        </Heading>
        <Textarea placeholder="IM SO TURNT" />

        <Heading as="h2" size="md" my={5}>
          Rewards
        </Heading>
        <Grid>
          <RewardRow emoji="😎" />
          <RewardRow emoji="😤" />
          <RewardRow emoji="🤗" />
          <AddRewardModal />
        </Grid>
      </Container>
    </>
  );
};

export default CreateRequest;
