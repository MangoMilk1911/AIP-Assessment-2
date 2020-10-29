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
  Input,
  useToast,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/core";
import Router, { useRouter } from "next/router";
import { RequestSchema } from "models/Request";
import RewardCube from "components/reward/RewardCube";
import { useAuth } from "hooks/useAuth";
import fetcher from "lib/fetcher";
import DeleteAlert from "components/request/DeleteAlert";
import RewardModal from "components/request/ContributionModal";
import useSWR from "swr";
import { GetServerSideProps, NextPage } from "next";
import { ApiError } from "lib/errorHandler";
import { useForm } from "react-hook-form";
import { RewardListProvider, useRewardList } from "hooks/useRewardList";
import { yup } from "lib/validator";
import { yupResolver } from "@hookform/resolvers/yup";
import { evidenceSchema } from "lib/validator/schemas";
import Request from "models/Request";
import { firebaseAdmin } from "lib/firebase/admin";
import nookies from "nookies";
import { firebase } from "lib/firebase/client";

dayjs.extend(relativeTime);

interface RequestPageProps {
  initRequest: RequestSchema;
}

const RequestPage: React.FC<RequestPageProps> = ({ initRequest }) => {
  const { user, accessToken } = useAuth();

  const toast = useToast();

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

  const { owner, title, createdAt, description, contributions, isClaimed } = initRequest;

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

  //evidence things
  const previewImageRef = useRef<HTMLImageElement>(null);
  const [cannotSubmit, setCannotSubmit] = useState(true);

  const checkFileType = () => {
    const fileInput = document.getElementById("evidence") as HTMLInputElement;
    const filePath = fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    if (!allowedExtensions.exec(filePath)) {
      toast({
        title: "OI MATE",
        description: "Please only upload image type files.",
        status: "error",
      });
      fileInput.value = "";
      previewImageRef.current.src = "";
      setCannotSubmit(true);
    } else {
      if (fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImageRef.current.src = e.target.result.toString();
        };
        reader.readAsDataURL(fileInput.files[0]);
        setCannotSubmit(false);
      }
    }
  };

  const confirmAndClaim = async () => {
    const fileInput = document.getElementById("evidence") as HTMLInputElement;
    const evidence = fileInput.files[0];

    // const path = `requests/${request._id}_${new Date().toISOString()}/evidence.png`;
    // const storageRef = firebase.storage().ref();
    // const fileRef = storageRef.child(path);
    // await fileRef.put(evidence);
  };

  return (
    <Container maxW="50rem" mt={24}>
      <Stack direction="column" spacing={10}>
        <Stack mb={18}>
          <Heading size="xl">{title}</Heading>
          <Text>{dayjs(createdAt).from(new Date())}</Text>
        </Stack>

        <Stack>
          {isClaimed ? (
            <Alert status="success">
              <AlertIcon />
              <AlertTitle mr={2}>Woo Hoo!</AlertTitle>
              <AlertDescription>This request has been completed. Rejoice! 🥳</AlertDescription>
            </Alert>
          ) : (
            <Alert status="info">
              <AlertIcon />
              <AlertTitle mr={2}></AlertTitle>
              <AlertDescription>
                Contribute or Claim this request below. Evidence required. 😳
              </AlertDescription>
            </Alert>
          )}
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
                <Button fontSize="sm" variant="link" onClick={onOpen} isDisabled={isClaimed}>
                  {isContributor ? "Edit" : "Add"} Contribution
                </Button>
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

        <Stack>
          <Heading size="md">Evidence</Heading>
          {isContributor && <Text>You cannot claim if you are a contributor.</Text>}
          {!isContributor && !isClaimed && (
            <Stack my={18} spacing={4}>
              <Stack id="evidenceform" as="form" align="flex-start" spacing={5}>
                <input id="evidence" type="file" onChange={checkFileType} name="evidence" />
                <Image ref={previewImageRef} hidden={cannotSubmit} w="50%" h="auto" />
              </Stack>
            </Stack>
          )}
        </Stack>

        <HStack w="100%">
          {user?.uid === initRequest.owner._id && (
            <Button onClick={() => setIsOpen(true)} colorScheme="red" isDisabled={isClaimed}>
              Delete Request
            </Button>
          )}
          <Spacer />
          {user?.uid !== initRequest.owner._id && !isContributor && !isClaimed && (
            <Button
              colorScheme="green"
              type="submit"
              isDisabled={cannotSubmit}
              onSubmit={confirmAndClaim}
            >
              Confirm & Claim
            </Button>
          )}
        </HStack>
      </Stack>

      <DeleteAlert isOpen={isOpen} onClose={onClose} id={initRequest._id} />
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { "pinky-auth": accessToken } = nookies.get(ctx);
    await firebaseAdmin.auth().verifyIdToken(accessToken);

    const request = await Request.findById(ctx.query.id).lean();

    return { props: { initRequest: request } };
  } catch (error) {
    // User isn't authenticated, send to login
    ctx.res.writeHead(302, { location: "/login" });
    ctx.res.end();

    return { props: {} as never };
  }
};

export default RequestPage;
