import { Box, Divider, Flex, Spacer, Text, Wrap } from "@chakra-ui/core";
import { Contribution } from "models";
import { RequestSchema } from "models/Request";
import React, { useMemo } from "react";
import ReactTimeAgo from "react-time-ago";

interface RequestCardProps {
  request: RequestSchema;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const { noOfContributors, owner, title, createdAt } = request;

  const contributors = useMemo(() => {
    const restCount = noOfContributors - 1;

    let contrString = `From ${owner.displayName}`;
    if (restCount > 0) contrString += ` & ${restCount} other` + (restCount > 1 ? "s" : "");

    return contrString;
  }, [noOfContributors, owner.displayName]);

  //const contributions = Contribution.findById(request._id);
  return (
    <Flex h={48} direction="column" bg="whiteAlpha.200" borderRadius="lg" p="5" width="sm">
      <Text fontSize="xl" fontWeight="bold" isTruncated>
        {title}
      </Text>

      <Text>{contributors}</Text>

      <Spacer />

      <Flex>
        <ReactTimeAgo date={createdAt} locale="en-US" timeStyle="round-minute" />
        <Spacer />
        <Text>Contributors: {noOfContributors}</Text>
      </Flex>
    </Flex>
  );
};

export default RequestCard;
