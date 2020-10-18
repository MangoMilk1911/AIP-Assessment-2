import { Flex, Spacer, Text, useDisclosure } from "@chakra-ui/core";
import { FavourSchema } from "models/Favour";
import React, { useMemo } from "react";
import ReactTimeAgo from "react-time-ago";
import FavModal from "./FavModal";

interface FavourCardProps {
  favour: FavourSchema;
}

const FavourCard: React.FC<FavourCardProps> = ({ favour }) => {
  const { debtor, recipient, rewards, createdAt } = favour;
  const { isOpen, onOpen, onClose } = useDisclosure();

  let favourMessage = `${debtor.displayName} promised ${recipient.displayName}`;

  return (
    <>
      <Flex
        h={48}
        direction="column"
        bg="whiteAlpha.200"
        borderRadius="1g"
        p="5"
        width="sm"
        onClick={onOpen}
      >
        <Text>{favourMessage}</Text>

        <Spacer />

        {/* <SingleFavour></SingleFavour> */}

        <Flex>
          <ReactTimeAgo date={createdAt} locale="en-US" timeStyle="round-minute" />
        </Flex>
      </Flex>

      <FavModal favour={favour} onOpen={onOpen} onClose={onClose} isOpen={isOpen}></FavModal>
    </>
  );
};

export default FavourCard;
