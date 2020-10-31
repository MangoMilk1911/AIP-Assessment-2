import React from "react";
import NextLink from "next/link";
import { Box, Flex, Link, LinkOverlay, Spacer, Text, useColorModeValue } from "@chakra-ui/core";
import { FavourSchema } from "models/Favour";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "hooks/useAuth";

dayjs.extend(relativeTime);

interface FavourCardProps {
  favour: FavourSchema;
}

const FavourCard: React.FC<FavourCardProps> = ({ favour }) => {
  const { _id, debtor, recipient, rewards, createdAt } = favour;

  // Change promise text based on favour
  const { user } = useAuth();
  const isDebtor = user?.uid === debtor._id;

  return (
    <NextLink href={`/favours/${_id}`}>
      <Flex
        pos="relative"
        h={40}
        p={5}
        bg={useColorModeValue("primary.50", "whiteAlpha.200")}
        boxShadow={useColorModeValue("lg", "none")}
        borderRadius="lg"
        flexDir="column"
        transition="0.15s ease"
        transitionProperty="transform, background, box-shadow"
        _hover={{
          cursor: "pointer",
          transform: "scale(1.025)",
          boxShadow: useColorModeValue("xl", "none"),
        }}
        _active={{
          bg: useColorModeValue("primary.100", "whiteAlpha.300"),
          transform: "scale(0.95)",
          boxShadow: useColorModeValue("md", "none"),
        }}
      >
        {/* Title */}

        <Text fontSize="xl" fontWeight="bold">
          {isDebtor ? "You" : debtor.displayName}{" "}
          <Text as="span" fontWeight="normal">
            promised
          </Text>{" "}
          {!isDebtor ? "You" : recipient.displayName}
        </Text>

        {/* Rewards */}
        <Text mt={1} fontSize="2xl">
          {Object.keys(rewards).map((reward) => (
            <span key={reward}>{reward}</span>
          ))}
        </Text>

        <Spacer />

        {/* Date */}
        <Text>{dayjs(createdAt).from(new Date())}</Text>
      </Flex>
    </NextLink>
  );
};

export default FavourCard;
