import React, { useRef, useState, useEffect } from "react";
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
import RequestCard from "components/request/Card";
import { useAuth } from "hooks/useAuth";
import { ApiError } from "lib/errorHandler";
import { RequestSchema } from "models/Request";
import useSWR from "swr";
import useDebounce from "hooks/useDebounce";
import Layout from "components/layout/Layout";
//import Card from "components/list/Card";

interface PaginatedRequests {
  requests: RequestSchema[];
  currentPage: number;
  totalPages: number;
}

const RequestList: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  //Pagination influenced by: https://medium.com/javascript-in-plain-english/simple-pagination-with-node-js-mongoose-and-express-4942af479ab2
  const [pageIndex, setPageIndex] = useState(1);
  const { data, mutate } = useSWR<PaginatedRequests, ApiError>(
    `/api/requests?page=${pageIndex}&q=${debouncedQuery}`
  );

  const prevDisabled = pageIndex === 1;
  const nextDisabled = pageIndex === data?.totalPages;

  useEffect(() => {
    setPageIndex(1);
  }, [debouncedQuery]);

  const redirect = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/requests/create");
    }
  };

  return (
    <Layout title="Requests" maxW="56rem">
      <Heading size="2xl" mb="8">
        Requests
      </Heading>

      <Stack direction="row" justify="space-between" align="center" mb={4}>
        <InputGroup w={64} size="sm">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a request"
            borderRightRadius={0}
          />
          <InputRightElement>
            <IconButton
              aria-label="clear"
              icon={<CloseIcon />}
              onClick={() => setQuery("")}
              size="xs"
              variant="link"
            >
              clear
            </IconButton>
          </InputRightElement>
        </InputGroup>

        <Button onClick={redirect} rightIcon={<AddIcon />}>
          Add
        </Button>
      </Stack>

      {!data ? (
        <SimpleGrid columns={2} spacing="5">
          {[...Array(6)].map((_, i) => (
            <Skeleton h="12rem" borderRadius="lg" key={i} />
          ))}
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
                  <RequestCard request={request} key={request._id.toString()} />
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
    </Layout>
  );
};

export default RequestList;
