import { Box, Divider, SimpleGrid, Text, Wrap } from "@chakra-ui/core";
import { Contribution } from "models";
import { RequestSchema } from "models/Request";
import React from "react";
import ReactTimeAgo from "react-time-ago";

interface RequestCardProps {
  request: RequestSchema;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
  const { noOfContributors, owner, title, createdAt } = request;
  //const contributions = Contribution.findById(request._id);
  return (
    <Box bg="primary.200" p="5" width="sm" height="40">
      <Text fontSize="xl" isTruncated>
        {title}
      </Text>
      <Divider my="2"></Divider>
      <Box>
        <Wrap>
          <Text>from {owner.displayName} </Text>
          {noOfContributors - 1 > 0 && <Text> & {noOfContributors - 1} other.</Text>}
          {noOfContributors - 1 > 1 && <Text> & {noOfContributors - 1} others.</Text>}
        </Wrap>

        <SimpleGrid columns={2}>
          <ReactTimeAgo date={createdAt} locale="en-US" timeStyle="round-minute" />
          <Text>Contributors: {noOfContributors}</Text>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default RequestCard;
