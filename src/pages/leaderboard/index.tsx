import React from "react";
import useSWR from "swr";
import { EmbeddedUserSchema } from "models/User";
import { ApiError } from "lib/errorHandler";
import { Container, Heading, Box, Divider, Text } from "@chakra-ui/core";
import LeaderboardRow from "components/leaderboard/LeaderboardRow";

const Leaderboard: React.FC = () => {
  const { data: allUsers } = useSWR<EmbeddedUserSchema[], ApiError>("/api/leaderboard");

  return (
    <>
      <head>
        <title> Pinki | Leaderboard </title>
      </head>

      <Container maxW="5xl" centerContent>
        <Heading size="xl" m="8">
          Global Leaderboard
        </Heading>

        <Box as="table" w="full" cellPadding={20} textAlign="left">
          <tr>
            <th>Rank #</th>
            <th>
              <Text paddingRight="20px" paddingLeft="250px">
                Name
              </Text>
            </th>
            <th>
              <Text>Points</Text>
            </th>
          </tr>
        </Box>
        <Divider borderColor="red.200" />

        {allUsers && (
          <Box as="table" w="full" cellPadding={20}>
            {allUsers.map((user, idx) => (
              <LeaderboardRow user={user} rank={idx + 1} />
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};

export default Leaderboard;
