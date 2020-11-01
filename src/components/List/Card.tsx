import React from "react";
import NextLink from "next/link";
import { Flex, FlexProps, useColorModeValue } from "@chakra-ui/core";

// const cardVariants: Variants = {
//   hidden: {
//     opacity: 0,
//   },
//   visible: {
//     opacity: 1,
//   },
// };

interface CardProps extends FlexProps {
  href: string;
}

const Card: React.FC<CardProps> = ({ href, children, ...restProps }) => {
  const cardAnimationStyles: FlexProps = {
    css: { transition: "0.15s ease" },
    transitionProperty: "transform, background, box-shadow",
    _hover: {
      cursor: "pointer",
      transform: "scale(1.025)",
      boxShadow: useColorModeValue("xl", "none"),
    },
    _active: {
      bg: useColorModeValue("primary.100", "whiteAlpha.300"),
      transform: "scale(0.95)",
      boxShadow: useColorModeValue("md", "none"),
    },
  };

  return (
    <NextLink href={href}>
      <Flex
        pos="relative"
        h={40}
        p={5}
        bg={useColorModeValue("primary.50", "whiteAlpha.200")}
        boxShadow={useColorModeValue("lg", "none")}
        borderRadius="lg"
        flexDir="column"
        {...cardAnimationStyles}
        {...restProps}
      >
        {children}
      </Flex>
    </NextLink>
  );
};

export default Card;
