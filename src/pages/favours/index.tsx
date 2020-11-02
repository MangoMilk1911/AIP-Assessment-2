import React, { useState } from "react";
import NextLink from "next/link";
import { Button, Heading, Stack, Tab, TabList, Tabs } from "@chakra-ui/core";
import { AddIcon } from "@chakra-ui/icons";
import FavoursList from "components/favour/list/List";
import Layout from "components/layout/Layout";
import WithAuth from "components/WithAuth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "hooks/useAuth";
import { ApiError } from "lib/errorHandler";
import { FavourSchema } from "models/Favour";
import useSWR from "swr";
import ListLoader from "components/favour/list/Loader";

dayjs.extend(relativeTime);

export interface PaginatedFavours {
  favours: FavourSchema[];
  currentPage: number;
  totalPages: number;
}

type FilterQuery = "owing" | "owed";

const FavourList: React.FC = () => {
  const { accessToken } = useAuth();

  const [filterQuery, setFilterQuery] = useState<FilterQuery>("owed");
  const [pageIndex, setPageIndex] = useState(1);
  const { data } = useSWR<PaginatedFavours, ApiError>(
    accessToken ? [`/api/favours?page=${pageIndex}&q=${filterQuery}`, accessToken] : null
  );

  return (
    <Layout title="Favours" maxW="56rem">
      {/* Heading */}
      <Stack direction="row" justify="space-between" align="center" mb={6}>
        <Heading size="2xl">Favours</Heading>

        <NextLink href={`favours/create?type=${filterQuery}`}>
          <Button rightIcon={<AddIcon mb="2px" />}>Add</Button>
        </NextLink>
      </Stack>

      {/* Tabs */}
      <Tabs
        onChange={(i) => {
          setPageIndex(1);
          setFilterQuery(i === 0 ? "owed" : "owing");
        }}
        colorScheme="primary"
        isFitted
        mb={6}
      >
        <TabList>
          <Tab>Owed</Tab>
          <Tab>Owing</Tab>
        </TabList>
      </Tabs>

      {/* Favours */}
      {!data ? (
        <ListLoader />
      ) : data.favours.length === 0 ? (
        <Heading size="2xl" textAlign="center" my="4rem !important">
          You're all square 😝
        </Heading>
      ) : (
        <FavoursList data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
      )}
    </Layout>
  );
};

export default WithAuth(FavourList);
