import React, { useMemo } from "react";
import NextLink from "next/link";
import { Flex, Spacer, Stack, Text, useDisclosure } from "@chakra-ui/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { RequestSchema } from "models/Request";

dayjs.extend(relativeTime);

interface RequestCardProps {
  request: RequestSchema;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const { owner, title, createdAt, contributions } = request;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const contributors = useMemo(() => {
    const restCount = Object.keys(contributions).length - 1;

    let contrString = `From ${owner.displayName}`;
    if (restCount > 0) contrString += ` & ${restCount} other` + (restCount > 1 ? "s" : "");

    return contrString;
  }, [contributions.size, owner.displayName]);

  return (
    <NextLink href={`requests/${request._id}`}>
      <Flex
        h={48}
        direction="column"
        bg="whiteAlpha.200"
        borderRadius="lg"
        p="5"
        width="sm"
        _hover={{ cursor: "pointer" }}
      >
        <Text fontSize="xl" fontWeight="bold" isTruncated>
          {title}
        </Text>

        <Text>{contributors}</Text>

        <Stack direction="row" spacing={5} my={4}>
          {Object.values(contributions).map((contribution) =>
            Object.keys(contribution.rewards).map((reward) => <Text fontSize="3xl">{reward}</Text>)
          )}
        </Stack>

        <Spacer />

        <Text>{dayjs(createdAt).from(new Date())}</Text>
      </Flex>
    </NextLink>
  );
};

export default RequestCard;
