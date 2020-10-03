import RewardList from "@/components/reward/RewardList";
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/core";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useState } from "react";

const CreateRequest: React.FC = () => {
  const [arrayOfRewards, setArrayOfRewards] = useState<string[]>([]);
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
        <Box>
          <FormControl>
            <FormLabel as="h2" size="md" my={5}>
              Title
            </FormLabel>
            <Input placeholder="PURP" />
          </FormControl>

          <FormControl>
            <FormLabel as="h2" size="md" my={5}>
              Description
            </FormLabel>
            <Textarea placeholder="IM SO TURNT" />
          </FormControl>

          <FormControl>
            <FormLabel as="h2" size="md" my={5}>
              Rewards
            </FormLabel>
            <Grid>
              <RewardList setArrayOfRewards={setArrayOfRewards} arrayOfRewards={arrayOfRewards} />
            </Grid>
          </FormControl>
        </Box>
      </Container>
    </>
  );
};

export default CreateRequest;
