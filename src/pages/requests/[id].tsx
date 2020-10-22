import React, { useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Avatar,
  AvatarGroup,
  Box,
  Heading,
  Stack,
  Button,
  Text,
  Container,
  SimpleGrid,
  HStack,
  Spacer,
  useDisclosure,
} from "@chakra-ui/core";
import Router, { useRouter } from "next/router";
import { RequestSchema } from "models/Request";
import RewardCube from "@/components/reward/RewardCube";
import { useAuth } from "lib/auth";
import fetcher from "lib/fetcher";
import DeleteAlert from "@/components/request/DeleteAlert";
import RewardModal from "@/components/request/ContributionModal";
import useSWR from "swr";
import { NextPage } from "next";
import { ApiError } from "lib/errorHandler";
import { RewardListProvider, useRewardList } from "hooks/useRewardList";

//DayJS
dayjs.extend(relativeTime);

interface RequestPageProps {
  initRequest: RequestSchema;
}

const RequestPage: NextPage<RequestPageProps> = ({ initRequest }) => {
  const { user, accessToken } = useAuth();

  const router = useRouter();
  const { id } = router.query;

  const { data: request } = useSWR<RequestSchema>("/api/requests/" + id, {
    initialData: initRequest,
  });

  //Alert
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false);

  //RewardsModal
  const { isOpen: isOpenRM, onOpen, onClose: onCloseRM } = useDisclosure();

  const { owner, title, createdAt, description, contributions } = request;
  const isContributor = user && Object.keys(contributions).includes(user.uid);

  const rewardPool = useMemo(() => {
    const temp = {};

    for (const contribution of Object.values(contributions)) {
      for (const reward in contribution.rewards) {
        temp[reward] = (temp[reward] || 0) + contribution.rewards[reward];
      }
    }

    return temp;
  }, [contributions]);

  return (
    <Container maxW="50rem" mt={16}>
      <Stack direction="column" spacing={5}>
        <Stack mb={18}>
          <Heading size="xl">{title}</Heading>
          <Text>{dayjs(createdAt).from(new Date())}</Text>
        </Stack>

        <SimpleGrid columns={2} spacing={5}>
          <Stack spacing={4}>
            <Heading size="md">Contributors</Heading>
            <Stack spacing={2} borderRadius="md" align="flex-start">
              <AvatarGroup max={3} p={2}>
                {Object.values(contributions).map((contribution) => (
                  <Avatar
                    borderColor="primary.50"
                    name={contribution.user.displayName}
                    src={contribution.user.photoURL}
                    key={contribution.user._id}
                  />
                ))}
              </AvatarGroup>
              {user && (
                <Button onClick={onOpen}>{isContributor ? "Edit" : "Add"} Contribution</Button>
              )}
            </Stack>
          </Stack>

          <Stack spacing={4}>
            <Heading size="md">Reward Pool</Heading>

            <Box borderRadius="md">
              <SimpleGrid columns={3} spacingX={12} w="50%">
                {Object.keys(rewardPool).map((reward) => (
                  <RewardCube reward={reward} quantity={rewardPool[reward]} key={reward} />
                ))}
              </SimpleGrid>
            </Box>
          </Stack>
        </SimpleGrid>

        <Stack spacing={4}>
          <Heading size="md">Description</Heading>
          <Box my={5} borderRadius="md" w="70%">
            <Text>{description}</Text>
          </Box>
        </Stack>

        <Stack align="flex-start" my={18}>
          <Button>Upload Evidence</Button>
        </Stack>

        <HStack w="100%">
          {user?.uid == request.owner._id && (
            <Button onClick={() => setIsOpen(true)} colorScheme="red">
              Delete Request
            </Button>
          )}
          <Spacer />
          <Button colorScheme="teal">Claim</Button>
        </HStack>
      </Stack>

      <DeleteAlert isOpen={isOpen} onClose={onClose} id={request._id} />
      <RewardListProvider>
        <RewardModal
          isOpen={isOpenRM}
          onClose={onCloseRM}
          initRewards={contributions[user?.uid]?.rewards}
        />
      </RewardListProvider>
    </Container>
  );
};

RequestPage.getInitialProps = async ({ query, req, res }) => {
  try {
    const request = await fetcher("http://localhost:3000/api/requests/" + query.id);
    return { initRequest: request };
  } catch (error) {
    res.writeHead(302, { location: "/requests" });
    res.end();
  }
};

export default RequestPage;
