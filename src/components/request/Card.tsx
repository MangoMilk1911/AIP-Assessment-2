import { Button, Flex, Spacer, Text, useDisclosure } from "@chakra-ui/core";
import { RequestSchema } from "models/Request";
import React, { useMemo } from "react";
import ReactTimeAgo from "react-time-ago";
import ReqModal from "./ReqModal";

interface RequestCardProps {
  request: RequestSchema;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const { owner, title, createdAt, contributions } = request;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const contributors = useMemo(() => {
    const restCount = contributions.size - 1;

    let contrString = `From ${owner.displayName}`;
    if (restCount > 0) contrString += ` & ${restCount} other` + (restCount > 1 ? "s" : "");

    return contrString;
  }, [contributions.size, owner.displayName]);

  return (
    <>
      <Flex
        h={48}
        direction="column"
        bg="whiteAlpha.200"
        borderRadius="lg"
        p="5"
        width="sm"
        _hover={{ cursor: "pointer" }}
        onClick={onOpen}
      >
        <Text fontSize="xl" fontWeight="bold" isTruncated>
          {title}
        </Text>

        <Text>{contributors}</Text>
        <Text>{contributions.values()}</Text>

        <Spacer />

        <Flex>
          <ReactTimeAgo date={new Date(createdAt)} locale="en-US" timeStyle="round-minute" />
        </Flex>
      </Flex>

      <ReqModal request={request} onOpen={onOpen} onClose={onClose} isOpen={isOpen}></ReqModal>
    </>
  );
};

export default RequestCard;
