import React, { useCallback, useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorMode,
  useDisclosure,
  useToast,
  Wrap,
} from "@chakra-ui/core";
import { AddIcon, ArrowBackIcon, AttachmentIcon, DeleteIcon } from "@chakra-ui/icons";
import Layout from "components/layout/Layout";
import WithAuth from "components/WithAuth";
import RewardCube from "components/reward/RewardCube";
import { useAuth } from "hooks/useAuth";
import useInitialValue from "hooks/useInitialValue";
import { isServerError, ServerError } from "lib/errorHandler";
import fetcher from "lib/fetcher";
import { firebase } from "lib/firebase/client";
import { FavourSchema } from "models/Favour";
import useSWR from "swr";
import ErrorPage from "components/layout/Error";
import Loader from "components/layout/Loader";
import { motion } from "framer-motion";
import UserPreview from "components/favour/UserPreview";
import { useDropzone } from "react-dropzone";
import DeleteFavourAlert from "components/favour/DeleteAlert";

/**
 * Favour Details Page
 */

const FavourDetails: React.FC = () => {
  const { user, accessToken } = useAuth();
  const router = useRouter();

  const toast = useToast();
  const { colorMode } = useColorMode();
  function useColorModeValue(light: any, dark: any) {
    return colorMode === "light" ? light : dark;
  }

  // Use initial query.id since exit page animation will set query.id to undefined.
  const id = useInitialValue(router.query.id);

  const { data: favour, error, mutate } = useSWR<FavourSchema, ServerError>([
    `/api/favours/${id}`,
    accessToken,
  ]);

  // Claiming
  const claimed = favour && favour.evidence;
  const { isOpen: modalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();

  const previewImgRef = useRef<HTMLImageElement>();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file.type.includes("image")) {
      toast({
        status: "error",
        title: "That ain't no image 👿",
      });

      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      previewImgRef.current.src = reader.result.toString();
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, inputRef: imgInputRef } = useDropzone({ onDrop });

  /**
   * Delete Alert State
   */
  const [isAlertOpen, setAlertOpen] = useState(false);
  const canDelete =
    favour && (user.uid === favour.recipient._id || (user.uid === favour.debtor._id && claimed));

  // Upload Evidence
  const [uploading, setUploading] = useState(false);
  const canUploadEvidence = favour && user.uid === favour.debtor._id && !favour.evidence;
  const uploadEvidence = useCallback(async () => {
    setUploading(true);
    const image = imgInputRef.current.files[0];

    try {
      const timestamp = new Date().toISOString();
      const path = `favours/${favour.debtor._id}_${favour.recipient._id}_${timestamp}/evidence.png`;
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(path);
      await fileRef.put(image);

      await fetcher(`/api/favours/${favour._id}/evidence`, accessToken, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidence: path,
        }),
      });

      mutate({
        ...favour,
        evidence: path,
      });

      toast({
        status: "success",
        title: "Evidence submitted! 🥳",
      });

      closeModal();
      setUploading(false);
    } catch (error) {
      const errMsg = isServerError(error) ? error.errors[0].message : error.message;
      toast({
        status: "error",
        title: errMsg || "Something went wrong...",
      });
    }
  }, [favour]);

  // Image
  const [initEvidenceURL, setinitEvidenceURL] = useState("");
  const [evidenceURL, setEvidenceURL] = useState("");
  useEffect(() => {
    if (favour?.initialEvidence) {
      firebase.storage().ref(favour.initialEvidence).getDownloadURL().then(setinitEvidenceURL);
    }

    if (favour?.evidence) {
      firebase.storage().ref(favour.evidence).getDownloadURL().then(setEvidenceURL);
    }
  }, [favour]);

  if (error) return <ErrorPage statusCode={error.statusCode} error={error.errors[0].message} />;

  if (!favour) return <Loader />;

  return (
    <Layout as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Back Button */}
      <NextLink href="/favours">
        <Button
          leftIcon={<ArrowBackIcon mb="2px" />}
          variant="ghost"
          colorScheme="teal"
          size="sm"
          mb={6}
          fontWeight="normal"
          borderRadius="full"
        >
          Back
        </Button>
      </NextLink>

      {/* Claimed Status */}
      {claimed ? (
        <Alert status="success">
          <AlertIcon />
          This favour has been claimed! 🥳
        </Alert>
      ) : (
        <Alert status="info">
          <AlertIcon />
          This favour hasn't been completed yet. 😢
        </Alert>
      )}

      <Stack mt={16} spacing={12} align="center">
        {/* Involved Users */}
        <Stack
          direction="row"
          spacing={4}
          align="center"
          px={8}
          py={6}
          bg={useColorModeValue("gray.100", "whiteAlpha.200")}
          shadow={useColorModeValue("xl", "none")}
          borderRadius="full"
        >
          <UserPreview user={favour.debtor} />
          <Text color={useColorModeValue("teal.500", "primary.300")}>Promised</Text>
          <UserPreview user={favour.recipient} />
        </Stack>

        {/* Reward Pool */}
        <Wrap justify="center" w="28rem">
          {Object.keys(favour.rewards).map((reward) => (
            <RewardCube reward={reward} quantity={favour.rewards[reward]} key={reward} />
          ))}
        </Wrap>

        {/* Evidence */}
        <Flex>
          {initEvidenceURL && (
            <Box mr={8}>
              <Text textAlign="center" mb={2}>
                Initial Evidence
              </Text>
              <Image boxSize="320px" src={initEvidenceURL} fit="cover" borderRadius="md" />
            </Box>
          )}

          <Box>
            <Text textAlign="center" mb={2}>
              Debtor Evidence
            </Text>
            {evidenceURL ? (
              <Image boxSize="320px" src={evidenceURL} fit="cover" borderRadius="md" />
            ) : (
              // Upload Evidence
              <Box>
                <Button
                  onClick={openModal}
                  disabled={!canUploadEvidence}
                  boxSize="320px"
                  borderRadius="md"
                  colorScheme="teal"
                  variant="outline"
                  size="lg"
                  rightIcon={<AddIcon mb="2px" />}
                >
                  Press to Upload
                </Button>
                {!canUploadEvidence && (
                  <Text textAlign="center" color="gray.500" mt={2}>
                    Only Debtor can upload evidence
                  </Text>
                )}
              </Box>
            )}
          </Box>
        </Flex>

        {/* Delete Favour */}
        <Button
          onClick={() => setAlertOpen(true)}
          isDisabled={!canDelete}
          rightIcon={<DeleteIcon />}
          variant="outline"
          colorScheme="red"
          borderRadius="full"
        >
          Delete Favour
        </Button>
      </Stack>

      {/* Image Upload Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal}>
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
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              Choose File
            </Button>

            {/* Preview Image */}
            <Image ref={previewImgRef} mx="auto" borderRadius="md" />
          </ModalBody>

          <ModalFooter>
            <Button onClick={closeModal} mr={3} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={uploadEvidence}
              isDisabled={!imgInputRef.current?.files.length}
              isLoading={uploading}
              colorScheme="green"
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Alert */}
      <DeleteFavourAlert favour={favour} isOpen={isAlertOpen} setOpen={setAlertOpen} />
    </Layout>
  );
};

export default WithAuth(FavourDetails);
