import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/core";
import { useAuth } from "lib/auth";
import fetcher from "lib/fetcher";
import { RequestSchema } from "models/Request";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import ReactTimeAgo from "react-time-ago";
import RewardCube from "../reward/RewardCube";

interface ReqModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  request: RequestSchema;
}

const ReqModal: React.FC<ReqModalProps> = ({ isOpen, onOpen, onClose, request }) => {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const { owner, title, createdAt, description, contributions } = request;

  const [isOpenDelete, setIsOpen] = useState(false);
  const onCloseDelete = () => setIsOpen(false);
  const cancelRef = useRef();

  const deleteRequest = async () => {
    console.log("help");
    await fetcher(`api/requests/${request._id}`, accessToken, { method: "DELETE" });
    router.reload();
  };

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent minW="4xl" p="5">
            <ModalCloseButton />
            <ModalHeader>
              <Heading size="xl">{title}</Heading>
              <ReactTimeAgo date={new Date(createdAt)} locale="en-US" timeStyle="round-minute" />
            </ModalHeader>
            <ModalBody maxW="4xl">
              <Box>
                <Heading size="md">Contributors</Heading>
                <Box my={5} p={5} borderRadius="md" bg="whiteAlpha.200" w="50%">
                  <AvatarGroup max={3}>
                    {Object.values(contributions).map((contribution) => (
                      <Avatar
                        borderColor="primary.50"
                        name={contribution.user.displayName}
                        src={contribution.user.photoURL}
                        key={contribution.user._id}
                      />
                    ))}
                  </AvatarGroup>
                </Box>
              </Box>
              <Box>
                <Heading size="md">Reward Pool</Heading>
                <Box my={5} p={5} borderRadius="md" bg="whiteAlpha.200" w="50%">
                  <Stack spacing="5">
                    {Object.values(contributions).map((contribution) =>
                      Object.keys(contribution.rewards).map((reward) => (
                        <RewardCube
                          key={reward}
                          rewardName={reward}
                          rewardNumber={contribution.rewards[reward]}
                        />
                      ))
                    )}
                  </Stack>
                </Box>
              </Box>
              <Box>
                <Heading size="md">Description</Heading>
                <Box my={5} p={5} borderRadius="md" bg="whiteAlpha.200" w="70%">
                  <Text>{description}</Text>
                </Box>
              </Box>
              <Button>Upload Evidence</Button>
            </ModalBody>
            <ModalFooter>
              {user && user.uid == request.owner._id && (
                <Button onClick={() => setIsOpen(true)} colorScheme="red">
                  Delete Request
                </Button>
              )}
              <Button colorScheme="teal">Claim</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>

      <AlertDialog
        isCentered
        isOpen={isOpenDelete}
        leastDestructiveRef={cancelRef}
        onClose={onCloseDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDelete}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteRequest} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ReqModal;
