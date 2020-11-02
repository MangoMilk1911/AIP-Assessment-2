import React from "react";
import { Spacer, Flex, Badge, Text } from "@chakra-ui/core";
import Card from "components/list/Card";
import dayjs from "dayjs";
import { useAuth } from "hooks/useAuth";
import { FavourSchema } from "models/Favour";
import { UserSchema } from "models/User";

/**
 * Card title
 */

interface FavourCardTitleProps {
  debtor: UserSchema;
  recipient: UserSchema;
}

const FavourCardTitle: React.FC<FavourCardTitleProps> = ({ debtor, recipient }) => {
  const { user } = useAuth();
  const isDebtor = user?.uid === debtor._id;

  return (
    <Text fontSize="xl" fontWeight="bold" isTruncated>
      {isDebtor ? "You" : debtor.displayName}{" "}
      <Text as="span" fontWeight="normal" fontSize="md">
        promised
      </Text>{" "}
      {!isDebtor ? "You" : recipient.displayName}
    </Text>
  );
};

/**
 * Favour Card
 */

interface FavourCardprops {
  favour: FavourSchema;
}

const FavourCard: React.FC<FavourCardprops> = ({ favour }) => (
  <Card href={`/favours/${favour._id}`} h={44}>
    {/* Title */}
    <FavourCardTitle debtor={favour.debtor} recipient={favour.recipient} />

    {/* Rewards */}
    <Text mt={1} fontSize="3xl">
      {Object.keys(favour.rewards).map((reward) => (
        <span key={reward}>{reward}</span>
      ))}
    </Text>

    <Spacer />

    {/* Bottom */}
    <Flex align="center" justify="space-between">
      <Text>{dayjs(favour.createdAt).from(new Date())}</Text>
      {favour.evidence && (
        <Badge colorScheme="green" border="1px solid">
          Claimed
        </Badge>
      )}
    </Flex>
  </Card>
);

export default FavourCard;
