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

const CreateFavour: React.FC = () => {
  const [arrayOfRewards, setArrayOfRewards] = useState<string[]>([]);
  return (
    <>
      <Head>
        <title>Pinki | Create Favour</title>
      </Head>
      <Link href="/">
        <a>Home</a>
      </Link>

      <Container maxW="40rem">
        <Heading as="h1" size="lg" my={5}>
          Create Favour
        </Heading>
        <Box>
          <FormControl>
            <FormLabel as="h2" size="md" my={5}>
              Debtor
            </FormLabel>
            <Input placeholder="MONKI" />
          </FormControl>

          <FormControl>
            <FormLabel as="h2" size="md" my={5}>
              Recipient
            </FormLabel>
            <Input placeholder="FLIP!!!" />
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

export default CreateFavour;
