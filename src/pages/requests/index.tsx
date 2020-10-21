import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/core";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import Card from "components/request/Card";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { ApiError } from "lib/errorHandler";
import { RequestSchema } from "models/Request";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import useSWR from "swr";

TimeAgo.addLocale(en);

interface PaginatedRequests {
  requests: RequestSchema[];
  currentPage: number;
  totalPages: number;
}

const RequestList: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const { data, mutate } = useSWR<PaginatedRequests, ApiError>(`/api/requests?page=${pageIndex}`);

  const prevDisabled = pageIndex === 1;
  const nextDisabled = pageIndex === data?.totalPages;

  return (
    <>
      <Head>
        <title> Pinki | Requests</title>
      </Head>

      <Container maxW="4xl" centerContent>
        <Flex align="center" w="4xl" px={16}>
          <Heading size="xl" my="8">
            Requests
          </Heading>
          <Spacer />
          <Link href="/requests/create">
            <IconButton aria-label="Add" icon={<AddIcon />} />
          </Link>
        </Flex>

        {!data ? (
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
          <>
            <SimpleGrid columns={2} spacing="5">
              {data.requests.map((request) => (
                <Card request={request} key={request._id.toString()} />
              ))}
            </SimpleGrid>
            <Stack direction="row" mt={4} spacing={16} align="center">
              <IconButton
                disabled={prevDisabled}
                onClick={() => {
                  if (data.currentPage > 1) setPageIndex(pageIndex - 1);
                }}
                aria-label="Previous"
                icon={<ArrowLeftIcon />}
              />
              <Text bg="whiteAlpha.200" px={4} py={2} borderRadius="full" fontWeight="bold">
                {data.currentPage}
              </Text>
              <IconButton
                disabled={nextDisabled}
                onClick={() => {
                  if (data.currentPage < data.totalPages) setPageIndex(pageIndex + 1);
                }}
                aria-label="Next"
                icon={<ArrowRightIcon />}
              />
            </Stack>
          </>
        )}
      </Container>
    </>
  );
};

export default RequestList;
