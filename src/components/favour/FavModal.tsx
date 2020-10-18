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
import { FavourSchema } from "models/Favour";
import React from "react";
import ReactTimeAgo from "react-time-ago";
// import Plaque from "the plaque place";

interface FavModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  favour: FavourSchema;
}

const FavModal: React.FC<FavModalProps> = ({ isOpen, onOpen, onClose, favour }) => {
  const { creator, debtor, recipient, rewards, createdAt, evidence, updatedAt } = favour;
  let favourMessage = `${debtor.displayName} promised ${recipient.displayName}`;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent minW="4x1" p="5">
            <ModalHeader>
              <Heading size="x1">favourMessage</Heading>
              <ReactTimeAgo date={createdAt} locale="en-US" timestyle="round-minute" />
            </ModalHeader>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default FavModal;
