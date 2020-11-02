import React from "react";
import { SimpleGrid, SimpleGridProps, Stack } from "@chakra-ui/core";
import PageNavigation from "components/list/PageNavigation";
import { AnimatePresence, motion, MotionProps } from "framer-motion";
import { PaginatedFavours } from "pages/favours";
import FavourCard from "./Card";

const listAnimation: Pick<MotionProps, "initial" | "animate" | "exit" | "variants"> = {
  initial: "hidden",
  animate: "visible",
  exit: "hidden",
  variants: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

interface ListContentProps extends Omit<SimpleGridProps, "transition"> {
  data: PaginatedFavours;
  pageIndex: number;
  setPageIndex: React.Dispatch<React.SetStateAction<number>>;
}

const FavoursList: React.FC<ListContentProps> = ({
  data,
  pageIndex,
  setPageIndex,
  ...restProps
}) => {
  const { favours, ...pageData } = data;

  return (
    <Stack spacing={8}>
      <AnimatePresence exitBeforeEnter>
        <SimpleGrid
          as={motion.div}
          columns={2}
          spacing={8}
          {...restProps}
          {...listAnimation}
          key={pageIndex} // So the animation replays whenever the page changes
        >
          {favours.map((favour) => (
            <FavourCard favour={favour} key={favour._id.toString()} />
          ))}
        </SimpleGrid>
      </AnimatePresence>

      <PageNavigation {...pageData} pageIndex={pageIndex} setPageIndex={setPageIndex} />
    </Stack>
  );
};

export default FavoursList;
