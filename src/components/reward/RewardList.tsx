import React from "react";
import { Rewards } from "models/Contribution";
import { RewardsReducerAction } from "pages/requests/create";
import { availableRewards } from "utils/availableRewards";
import RewardRow from "./RewardRow";
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

interface RewardModalProps {
  currentRewards: Rewards;
  dispatch: React.Dispatch<RewardsReducerAction>;
}

const RewardModal: React.FC<RewardModalProps> = ({ currentRewards, dispatch }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function addReward(emoji: string) {
    dispatch({ type: "set", payload: { reward: emoji, quantity: 1 } });
    onClose();
  }

  return (
    <>
      <Button w="100%" onClick={onOpen}>
        Add Reward
      </Button>

      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Choose Reward</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="repeat(3,2fr)">
                {Object.keys(availableRewards).map((reward) => (
                  <Button
                    onClick={() => addReward(reward)}
                    size="lg"
                    key={reward}
                    disabled={Object.keys(currentRewards).includes(reward)}
                  >
                    {reward}
                  </Button>
                ))}
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

interface RewardListProps {
  rewards: Rewards;
  dispatch: React.Dispatch<RewardsReducerAction>;
}

const RewardList: React.FC<RewardListProps> = ({ rewards, dispatch }) => (
  <div id="reward-list">
    {Object.keys(rewards).map((emoji) => (
      <RewardRow reward={emoji} quantity={rewards[emoji]} dispatch={dispatch} key={emoji} />
    ))}
    <RewardModal currentRewards={rewards} dispatch={dispatch} />
  </div>
);

export default RewardList;
