import {
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
  Text,
} from "@chakra-ui/core";
import { RequestSchema } from "models/Request";
import React from "react";
import ReactTimeAgo from "react-time-ago";
import Plaque from "../contributor/Plaque";

interface ReqModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  request: RequestSchema;
}

const ReqModal: React.FC<ReqModalProps> = ({ isOpen, onOpen, onClose, request }) => {
  const { noOfContributors, owner, title, createdAt, description } = request;
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent minW="4xl" p="5">
            <ModalCloseButton />
            <ModalHeader>
              <Heading size="xl">{title}</Heading>
              <ReactTimeAgo date={createdAt} locale="en-US" timeStyle="round-minute" />
            </ModalHeader>
            <ModalBody maxW="4xl">
              <Box>
                <Heading size="md">Contributors</Heading>
                <Plaque contributor={owner.displayName}></Plaque>
              </Box>
              <Box>
                <Heading size="md">Reward Pool</Heading>
                <Box w="10" h="10" bg="whiteAlpha.200"></Box>
              </Box>
              <Box>
                <Heading size="md">Description</Heading>
                <Text>{description}</Text>
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
