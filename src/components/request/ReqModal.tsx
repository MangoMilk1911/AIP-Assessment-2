import {
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
import { RequestSchema } from "models/Request";
import React from "react";
import ReactTimeAgo from "react-time-ago";
import RewardCube from "../reward/RewardCube";

interface ReqModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  request: RequestSchema;
}

const ReqModal: React.FC<ReqModalProps> = ({ isOpen, onOpen, onClose, request }) => {
  const { owner, title, createdAt, description, contributions } = request;
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
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
              <Button colorScheme="teal">Submit for Review</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default ReqModal;
