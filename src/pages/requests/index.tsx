import { Container, Heading, SimpleGrid, Skeleton, Stack, Wrap } from "@chakra-ui/core";
import Card from "components/request/Card";
import { ApiError } from "lib/errorHandler";
import { RequestSchema } from "models/Request";
import Head from "next/head";
import React from "react";
import useSWR from "swr";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(en);

const RequestList: React.FC = () => {
  const { data: allRequests } = useSWR<RequestSchema[], ApiError>(
    "http://localhost:3000/api/requests"
  );

  return (
    <>
      <Head>
        <title> Pinki | Requests</title>
      </Head>
      <Container maxW="4xl" centerContent>
        <Heading as="h1" size="lg" m="8">
          Requests
        </Heading>

        {!allRequests ? (
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
            {allRequests.map((request: RequestSchema) => (
              <Card key={request.title} request={request}></Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </>
  );
};

export default RequestList;
