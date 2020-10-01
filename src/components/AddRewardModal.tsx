import React from "react";
import {
  Button,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/core";
import { AddIcon } from "@chakra-ui/icons";

const AddRewardModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>
        <AddIcon /> Add
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Reward</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(3,2fr)">
              <Button size="lg" m="2">
                😀
              </Button>
              <Button size="lg" m="2">
                😁
              </Button>
              <Button size="lg" m="2">
                😂
              </Button>
              <Button size="lg" m="2">
                🤣
              </Button>
              <Button size="lg" m="2">
                😃
              </Button>
              <Button size="lg" m="2">
                😄
              </Button>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddRewardModal;
