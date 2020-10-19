import {
  Container,
  Heading,
  SimpleGrid,
  Skeleton,
  Stack,
  Wrap,
  Button,
  Link,
} from "@chakra-ui/core";
import Card from "components/favour/Card";
import { ApiError } from "lib/errorHandler";
import { FavourSchema } from "models/Favour";
import Head from "next/head";
import React from "react";
import useSWR from "swr";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useAuth } from "lib/auth";

TimeAgo.addLocale(en);

const FavourList: React.FC = () => {
  const { user, accessToken } = useAuth();
  const { data: allUserFavours } = useSWR<FavourSchema[], ApiError>(
    accessToken ? ["/api/favour", accessToken] : null
  );

  console.log(allUserFavours); // Delete when finish :)

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

        {!allUserFavours ? (
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
            {allUserFavours.map((favour: FavourSchema) => (
              <Card key={favour._id.toString()} favour={favour}></Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </>
  );
};

export default FavourList;
