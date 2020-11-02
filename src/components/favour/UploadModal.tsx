import React, { useCallback, useRef, useState } from "react";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/core";
import { AttachmentIcon } from "@chakra-ui/icons";
import firebase from "firebase";
import { useAuth } from "hooks/useAuth";
import { isServerError } from "lib/errorHandler";
import fetcher from "lib/fetcher";
import { FavourSchema } from "models/Favour";
import { useDropzone } from "react-dropzone";
import { mutate } from "swr";

const reader = new FileReader();

interface UploadModalProps {
  favour: FavourSchema;
  modalState: any;
}

const UploadModal: React.FC<UploadModalProps> = ({ favour, modalState }) => {
  const { accessToken } = useAuth();
  const toast = useToast();

  const previewImgRef = useRef<HTMLImageElement>();
  const onSelectFile = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    // If not image type, shout at them!!!
    if (!file.type.includes("image")) {
      toast({
        status: "error",
        title: "That ain't no image 👿",
      });

      return;
    }

    // When reader finished reading selected image, set preview image src to result
    reader.onload = () => {
      previewImgRef.current.src = reader.result.toString();
    };

    // Actually read the selected image
    reader.readAsDataURL(file);
  }, []);

  const uploadState = useDropzone({ onDrop: onSelectFile });

  const [uploading, setUploading] = useState(false);
  const submitEvidence = useCallback(async () => {
    setUploading(true);
    const image = uploadState.inputRef.current.files[0];

    try {
      // Construct unqiue path for image and upload to firebase storage
      const timestamp = new Date().toISOString();
      const path = `favours/${favour.debtor._id}_${favour.recipient._id}_${timestamp}/evidence.png`;
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(path);
      await fileRef.put(image);

      // Store that fb storage path on the mongo doc
      await fetcher(`/api/favours/${favour._id}/evidence`, accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidence: path,
        }),
      });

      // Update the SWR cache for this favour to instantly update
      mutate([`/api/favours/${favour._id}`, accessToken], {
        ...favour,
        evidence: path,
      });

      toast({
        status: "success",
        title: "Evidence submitted! 🥳",
      });

      modalState.onClose();
      setUploading(false);
    } catch (error) {
      const errMsg = isServerError(error) ? error.errors[0].message : error.message;
      toast({
        status: "error",
        title: errMsg || "Something went wrong...",
      });
    }
  }, [favour]);

  return (
    <Modal isOpen={modalState.isOpen} onClose={modalState.onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Evidence</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {/* Choose File Button */}
          <Button
            w="full"
            colorScheme="teal"
            rightIcon={<AttachmentIcon mb="2px" />}
            mb={4}
            {...uploadState.getRootProps()}
          >
            <input {...uploadState.getInputProps()} />
            Choose File
          </Button>

          {/* Preview Image */}
          <Image ref={previewImgRef} mx="auto" borderRadius="md" />
        </ModalBody>

        <ModalFooter>
          <Button onClick={modalState.onClose} mr={3} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={submitEvidence}
            isDisabled={!uploadState.inputRef.current?.files.length}
            isLoading={uploading}
            colorScheme="green"
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadModal;
