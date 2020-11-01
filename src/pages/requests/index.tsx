import React, { useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Container,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Skeleton,
  Spacer,
  Stack,
  Text,
  Flex,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/core";
import { AddIcon, ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@chakra-ui/icons";
import Card from "components/request/Card";
import { useAuth } from "hooks/useAuth";
import { ApiError } from "lib/errorHandler";
import { RequestSchema } from "models/Request";
import useSWR from "swr";

interface PaginatedRequests {
  requests: RequestSchema[];
  currentPage: number;
  totalPages: number;
}

const RequestList: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const queryInputRef = useRef<HTMLInputElement>();
  function onQuerySubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(queryInputRef.current.value);
  }

  function clearSearch(e: React.FormEvent) {
    e.preventDefault();
    setQuery((queryInputRef.current.value = ""));
  }

  const [pageIndex, setPageIndex] = useState(1);
  const { data, mutate } = useSWR<PaginatedRequests, ApiError>(
    `/api/requests?page=${pageIndex}&q=${query}`
  );

  const prevDisabled = pageIndex === 1;
  const nextDisabled = pageIndex === data?.totalPages;

  const redirect = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/requests/create");
    }
  };

  return (
    <>
      <Head>
        <title> Pinki | Requests</title>
      </Head>

      <Container maxW="4xl">
        <Stack direction="row" align="center">
          <Heading size="xl" my="8">
            Requests
          </Heading>
        </Stack>

        <Stack as="form" onSubmit={onQuerySubmit} direction="row" spacing={0}>
          <InputGroup w={64} size="sm">
            <Input ref={queryInputRef} placeholder="Find a request" borderRightRadius={0} />
            <InputRightElement>
              <IconButton
                aria-label="clear"
                icon={<CloseIcon />}
                onClick={clearSearch}
                size="xs"
                variant="link"
              >
                clear
              </IconButton>
            </InputRightElement>
          </InputGroup>

          <Button type="submit" px={12} borderLeftRadius={0} size="sm">
            Search
          </Button>
          <Spacer />
          <Button onClick={redirect} rightIcon={<AddIcon />}>
            Add
          </Button>
        </Stack>

        <Stack as="form" direction="row" spacing={0} mx={2} mb={8} alignSelf="flex-start"></Stack>

        <Container centerContent>
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
              {data.requests.length == 0 ? (
                <>
                  <Text color="whiteAlpha.800" fontSize="3xl">
                    No Requests 😫
                  </Text>
                  <Text color="whiteAlpha.800" fontSize="xl">
                    Why not make one? 🤔
                  </Text>
                </>
              ) : (
                <>
                  <SimpleGrid columns={2} spacing="5">
                    {data.requests.map((request) => (
                      <Card request={request} key={request._id.toString()} />
                    ))}
                  </SimpleGrid>
                  <Stack direction="row" mt={8} spacing={16} align="center">
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
            </>
          )}
        </Container>
      </Container>
    </>
  );
};

export default RequestList;
