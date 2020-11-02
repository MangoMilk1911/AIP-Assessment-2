import React, { useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Text,
  useToast,
} from "@chakra-ui/core";
import { useAuth } from "hooks/useAuth";
import { useRouter } from "next/router";
import fetcher from "lib/fetcher";
import { ServerError } from "lib/errorHandler";
import { FavourSchema } from "models/Favour";

interface DeleteFavourAlertProps {
  favour: FavourSchema;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteFavourAlert: React.FC<DeleteFavourAlertProps> = ({ favour, isOpen, setOpen }) => {
  const { accessToken } = useAuth();

  const cancelRef = useRef();

  const router = useRouter();
  const toast = useToast();

  async function deleteFavour() {
    setOpen(false);

    try {
      await fetcher(`/api/favours/${favour._id}`, accessToken, { method: "DELETE" });

      toast({
        status: "success",
        title: "Favour deleted!",
      });

      router.push("/favours");
    } catch (error) {
      const { errors } = error as ServerError;

      toast({
        status: "error",
        title: "Unable to delete favour 😭",
        description: errors[0].message,
      });
    }
  }

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={() => setOpen(false)}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            You sure about this one, chief? 🤔
          </AlertDialogHeader>

          <AlertDialogBody>
            You can't rewind time to undo this...{" "}
            <Text as="span" fontSize="xs">
              I think...
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={deleteFavour} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default DeleteFavourAlert;
