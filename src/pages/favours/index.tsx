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
  Link,
} from "@chakra-ui/core";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import Card from "components/favour/Card";
import { ApiError } from "lib/errorHandler";
import { FavourSchema } from "models/Favour";
import Head from "next/head";
import React, { useState } from "react";
import useSWR from "swr";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useAuth } from "lib/auth";

TimeAgo.addLocale(en);

interface PaginatedFavours {
  userDebtorFavours: FavourSchema[];
  userRecipientFavours: FavourSchema[];
  currentPage: number;
  totalPages: number;
}

const FavourList: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const { accessToken } = useAuth();
  const { data } = useSWR<PaginatedFavours, ApiError>(
    accessToken ? [`/api/favour?page=${pageIndex}`, accessToken] : null
  );

  const prevDisabled = pageIndex === 1;
  const nextDisabled = pageIndex === data?.totalPages;

  console.log(data); // Delete when finish :)

  return (
    <>
      <Head>
        <title> Pinki | Favours </title>
      </Head>
      <Container maxW="4x1" centerContent>
        <Heading size="x1" m="8">
          Favours
        </Heading>

        <Button type="submit" w="4x1" size="lg" colorScheme="primary" mb={4}>
          <Link href="favours/create">
            <a>Create</a>
          </Link>
        </Button>

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
              {data.userDebtorFavours.map((favour) => (
                <Card favour={favour} key={favour._id.toString()}></Card>
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

export default FavourList;
