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
import RewardRow from "@/components/reward/RewardRow";

interface RewardModalProps {
  arrayOfRewards: Array<string>;
  setArrayOfRewards: React.Dispatch<React.SetStateAction<string[]>>;
}

const RewardModal: React.FC<RewardModalProps> = ({ arrayOfRewards, setArrayOfRewards }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function addReward(emoji: string) {
    setArrayOfRewards([...arrayOfRewards, emoji]); //spreading my cheeks
    onClose();
  }

  return (
    <>
      <Button onClick={onOpen}>Add</Button>

      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Choose Reward</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="repeat(3,2fr)">
                <Button onClick={() => addReward("😎")} size="lg">
                  😎
                </Button>
                <Button onClick={() => addReward("😁")} size="lg">
                  😁
                </Button>
                <Button onClick={() => addReward("😂")} size="lg">
                  😂
                </Button>
                <Button onClick={() => addReward("🤣")} size="lg">
                  🤣
                </Button>
                <Button onClick={() => addReward("😃")} size="lg">
                  😃
                </Button>
                <Button onClick={() => addReward("😄")} size="lg">
                  😄
                </Button>
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
  arrayOfRewards: Array<string>;
  setArrayOfRewards: React.Dispatch<React.SetStateAction<string[]>>;
}

const RewardList: React.FC<RewardListProps> = ({ arrayOfRewards, setArrayOfRewards }) => {
  const rewardList = arrayOfRewards.map((item) => <RewardRow emoji={item} />);
  return (
    <>
      {rewardList}
      <RewardModal setArrayOfRewards={setArrayOfRewards} arrayOfRewards={arrayOfRewards} />
    </>
  );
};

export default RewardList;
