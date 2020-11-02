import React, { useState } from "react";
import NextLink from "next/link";
import {
  Badge,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  SimpleGridProps,
  Skeleton,
  Spacer,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
} from "@chakra-ui/core";
import { AddIcon } from "@chakra-ui/icons";
import Card from "components/list/Card";
import { useAuth } from "hooks/useAuth";
import { ApiError } from "lib/errorHandler";
import { FavourSchema } from "models/Favour";
import useSWR from "swr";
import Layout from "components/layout/Layout";
import WithAuth from "components/WithAuth";
import PageNavigation from "components/list/PageNavigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserSchema } from "models/User";
import { AnimatePresence, motion, Variants } from "framer-motion";

dayjs.extend(relativeTime);

interface PaginatedFavours {
  favours: FavourSchema[];
  currentPage: number;
  totalPages: number;
}

const listVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Favour Card Title
 */

interface FavourCardTitleProps {
  debtor: UserSchema;
  recipient: UserSchema;
}

const FavourCardTitle: React.FC<FavourCardTitleProps> = ({ debtor, recipient }) => {
  const { user } = useAuth();
  const isDebtor = user?.uid === debtor._id;

  return (
    <Text fontSize="xl" fontWeight="bold" isTruncated>
      {isDebtor ? "You" : debtor.displayName}{" "}
      <Text as="span" fontWeight="normal" fontSize="md">
        promised
      </Text>{" "}
      {!isDebtor ? "You" : recipient.displayName}
    </Text>
  );
};

/**
 * Favour Card
 */

interface FavourCardprops {
  favour: FavourSchema;
}

const FavourCard: React.FC<FavourCardprops> = ({ favour }) => (
  <Card href={`/favours/${favour._id}`} h={44}>
    {/* Title */}
    <FavourCardTitle debtor={favour.debtor} recipient={favour.recipient} />

    {/* Rewards */}
    <Text mt={1} fontSize="3xl">
      {Object.keys(favour.rewards).map((reward) => (
        <span key={reward}>{reward}</span>
      ))}
    </Text>

    <Spacer />

    {/* Bottom */}
    <Flex align="center" justify="space-between">
      <Text>{dayjs(favour.createdAt).from(new Date())}</Text>
      {favour.evidence && (
        <Badge colorScheme="green" border="1px solid">
          Claimed
        </Badge>
      )}
    </Flex>
  </Card>
);

/**
 * Favour List
 */

const ListLoader: React.FC = () => (
  <SimpleGrid
    as={motion.div}
    columns={2}
    spacing={8}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { delay: 1 } }}
  >
    {[...Array(6)].map((_, i) => (
      <Skeleton h={44} borderRadius="lg" key={i} />
    ))}
  </SimpleGrid>
);

interface ListContentProps extends Omit<SimpleGridProps, "transition"> {
  data: PaginatedFavours;
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ListContent: React.FC<ListContentProps> = ({
  data,
  pageIndex,
  setPageIndex,
  ...restProps
}) => {
  const { favours, ...pageData } = data;

  return (
    <Stack spacing={8}>
      <AnimatePresence exitBeforeEnter>
        <SimpleGrid
          as={motion.div}
          columns={2}
          spacing={8}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={listVariants}
          {...restProps}
          key={pageIndex} // So the animation replays whenever the page changes
        >
          {favours.map((favour) => (
            <FavourCard favour={favour} key={favour._id.toString()} />
          ))}
        </SimpleGrid>
      </AnimatePresence>

      <PageNavigation {...pageData} pageIndex={pageIndex} setPageIndex={setPageIndex} />
    </Stack>
  );
};

/**
 * Favours Page
 */

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
        <ListContent data={data} pageIndex={pageIndex} setPageIndex={setPageIndex} />
      )}
    </Layout>
  );
};

export default WithAuth(FavourList);
