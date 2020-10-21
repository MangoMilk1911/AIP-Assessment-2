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
import { useAuth } from "lib/auth";
import fetcher from "lib/fetcher";
import { FavourSchema } from "models/Favour";
import { Router, useRouter } from "next/router";
import React from "react";
import ReactTimeAgo from "react-time-ago";
import RewardCube from "../reward/RewardCube";
// import Plaque from "the plaque place";

interface FavModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  favour: FavourSchema;
}

const FavModal: React.FC<FavModalProps> = ({ isOpen, onOpen, onClose, favour }) => {
  const router = useRouter();
  const { debtor, recipient, rewards, createdAt, evidence } = favour;
  const { user, accessToken } = useAuth();
  let favourMessage = `${debtor.displayName} promised ${recipient.displayName}`;

  const deleteFavour = async () => {
    await fetcher(`api/favours/${favour._id}`, accessToken, { method: "DELETE" });
    router.reload();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent minW="4x1" p="5">
            <ModalHeader>
              <Heading size="md">{favourMessage}</Heading>
              <ReactTimeAgo date={createdAt} locale="en-US" timestyle="round-minute" />
              <Heading size="x1">Rewards</Heading>
              <Box my={5} p={5} borderRadius="md" bg="whiteAlpha.200" w="50%">
                {Object.values(favours).map((favour) =>
                  Object.keys(favours.rewards).map((reward) => (
                    <RewardCube
                      key={reward}
                      rewardName={reward}
                      rewardNumber={favours.rewards[reward]}
                    />
                  ))
                )}
              </Box>
            </ModalHeader>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default FavModal;
