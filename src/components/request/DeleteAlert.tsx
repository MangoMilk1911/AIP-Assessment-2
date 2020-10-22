import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/core";
import { useAuth } from "lib/auth";
import fetcher from "lib/fetcher";
import { Types } from "mongoose";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";

interface DeleteAlertProps {
  id: Types.ObjectId;
  isOpen: boolean;
  onClose: () => void;
}

const DeleteAlert: React.FC<DeleteAlertProps> = ({ id, isOpen, onClose }) => {
  const router = useRouter();
  const { accessToken } = useAuth();

  //Alert State
  const cancelRef = React.useRef();

  //Delete Function
  const deleteRequest = async () => {
    await fetcher(`/api/requests/${id}`, accessToken, { method: "DELETE" });
    router.push("/requests");
  };

  return (
    <>
      <AlertDialog isCentered isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Request
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteRequest} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteAlert;
