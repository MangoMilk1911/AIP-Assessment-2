import { Flex, Spacer, Text, useDisclosure } from "@chakra-ui/core";
import { RequestSchema } from "models/Request";
import React, { useMemo } from "react";
import ReactTimeAgo from "react-time-ago";
import ReqModal from "./ReqModal";

interface RequestCardProps {
  request: RequestSchema;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const { noOfContributors, owner, title, createdAt, description } = request;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const contributors = useMemo(() => {
    const restCount = noOfContributors - 1;

    let contrString = `From ${owner.displayName}`;
    if (restCount > 0) contrString += ` & ${restCount} other` + (restCount > 1 ? "s" : "");

    return contrString;
  }, [noOfContributors, owner.displayName]);

  return (
    <>
      <Flex
        as="Button"
        h={48}
        direction="column"
        bg="whiteAlpha.200"
        borderRadius="lg"
        p="5"
        width="sm"
        onClick={onOpen}
      >
        <Text fontSize="xl" fontWeight="bold" isTruncated>
          {title}
        </Text>

        <Text>{contributors}</Text>

        <Spacer />

        <Flex>
          <ReactTimeAgo date={createdAt} locale="en-US" timeStyle="round-minute" />
        </Flex>
      </Flex>

      <ReqModal request={request} onOpen={onOpen} onClose={onClose} isOpen={isOpen}></ReqModal>
    </>
  );
};

export default RequestCard;
