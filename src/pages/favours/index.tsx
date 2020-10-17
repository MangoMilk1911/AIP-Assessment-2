import { Container, Heading, SimpleGrid, Skeleton, Stack, Wrap } from "@chakra-ui/core";
import Card from "components/favour/Card";
import { ApiError } from "lib/errorHandler";
import { FavourSchema } from "models/Favour";
import Head from "next/head";
import React from "react";
import useSWR from "swr";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { request } from "http";

TimeAgo.addLocale(en);

const RequestList: React.FC = () => {
  const { data: allFavours } = useSWR<FavourSchema[], ApiError>(
    "http://localhost:3000/api/favour"
  );

  return (
    <>
    <Head>
      <title> Pinki | Favours </title>
    </Head>
    <Container maxW="4x1" centerContent>
      <Heading size="x1" m="8">
        Favours
      </Heading>

      {!allFavours ? (
        <SimpleGrid columns={2} spacing="5">
          <Skeleton width="sm" height="40" />
          <Skeleton width="sm" height="40" />
          <Skeleton width="sm" height="40" />
          <Skeleton width="sm" height="40" />
          <Skeleton width="sm" height="40" />
          <Skeleton width="sm" height="40" />
          <Skeleton width="sm" height="40" />
          <Skeleton width="sm" height="40" />
        </SimpleGrid>
      ) : (
        <SimpleGrid columns={2} spacing="5">
          {allFavours.map((favour: FavourSchema) => (
            <Card key={favour._id.toString()} favour={favour}></Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
    </>
  )
}

export default RequestList