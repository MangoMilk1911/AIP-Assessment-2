import { Wrap } from "@chakra-ui/core";
import { RequestSchema } from "models/Request";
import React from "react";
import Card from "./Card";

interface CardListProps {
  allRequests: RequestSchema[];
}

const CardList: React.FC<CardListProps> = ({ allRequests }) => {
  return (
    <Wrap>
      {allRequests.map((request) => (
        <Card
          title={request.title}
          description={request.description}
          noOfContributors={request.noOfContributors}
        ></Card>
      ))}
    </Wrap>
  );
};

export default CardList;
