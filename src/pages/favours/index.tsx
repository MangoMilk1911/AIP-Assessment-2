import React, { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  Button,
  Container,
  Heading,
  IconButton,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/core";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import Card from "components/favour/Card";
import { useAuth } from "lib/auth";
import { ApiError } from "lib/errorHandler";
import { FavourSchema } from "models/Favour";
import useSWR from "swr";

interface PaginatedFavours {
  favours: FavourSchema[];
  currentPage: number;
  totalPages: number;
}

const FavourList: React.FC = () => {
  const { accessToken } = useAuth();
  const [pageIndex, setPageIndex] = useState(1);
  const { data } = useSWR<PaginatedFavours, ApiError>(
    accessToken ? [`/api/favours?page=${pageIndex}&q=owe`, accessToken] : null
  );

  const prevDisabled = pageIndex === 1;
  const nextDisabled = pageIndex === data?.totalPages;

  return (
    <>
      <Head>
        <title> Pinki | Favours </title>
      </Head>

      <Container maxW="lg">
        <Stack spacing={8} w="full">
          <Stack direction="row" justify="space-between" align="center" mb={4}>
            <Heading>Favours</Heading>

            <NextLink href="favours/create">
              <Button rightIcon={<AddIcon mb="2px" />}>Add</Button>
            </NextLink>
          </Stack>

          {!data ? (
            <SimpleGrid columns={2} spacing={8}>
              {[...Array(6)].map((_, i) => (
                <Skeleton h={40} key={i} />
              ))}
            </SimpleGrid>
          ) : (
            <>
              {/* Favours */}
              <SimpleGrid columns={2} spacing={8}>
                {data.favours.map((favour) => (
                  <Card favour={favour} key={favour._id.toString()}></Card>
                ))}
              </SimpleGrid>

              {/* Navigation */}
              <Stack alignSelf="center" direction="row" align="center" spacing={16}>
                <IconButton
                  disabled={prevDisabled}
                  onClick={() => {
                    if (data.currentPage > 1) setPageIndex(pageIndex - 1);
                  }}
                  aria-label="Previous"
                  icon={<ArrowLeftIcon />}
                />

                <Text bg="whiteAlpha.200" px={4} py={2} borderRadius="full" fontWeight="bold">
                  {data.currentPage}{" "}
                  <Text as="span" fontWeight="normal">
                    of
                  </Text>{" "}
                  {data.totalPages}
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
        </Stack>
      </Container>
    </>
  );
};

export default FavourList;
