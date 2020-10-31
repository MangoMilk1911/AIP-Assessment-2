import {
  Avatar,
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  FormHelperText,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/core";
import { useAuth } from "hooks/useAuth";
import useDebounce from "hooks/useDebounce";
import { UserSchema } from "models/User";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";

const listAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      // delay: 0.2,
      // duration: 0.2,
      delayChildren: 0.3,
      staggerChildren: 0.3,
    },
  },
};

const cardAnimation = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

/**
 * User Preview Card
 */

interface UserPreviewProps {
  user: UserSchema;
  onClick: () => void;
}

const UserPreview: React.FC<UserPreviewProps> = ({ user, onClick }) => (
  <Stack
    as={motion.div}
    onClick={onClick}
    direction="row"
    spacing={4}
    p={5}
    bg="whiteAlpha.100"
    align="center"
    borderRadius="lg"
    style={{ transition: "background 0.2s ease" }}
    _hover={{ cursor: "pointer", bg: "whiteAlpha.200" }}
    variants={cardAnimation}
  >
    <Avatar name={user.displayName} />
    <Box>
      <Text fontSize="xl">{user.displayName}</Text>
      <Text color="gray.400">{user.email}</Text>
    </Box>
  </Stack>
);

/**
 * Select User
 */

interface SelectUserProps {
  onSelectUser: (user: UserSchema) => void;
}

const SelectUser: React.FC<SelectUserProps> = ({ onSelectUser }) => {
  const { user } = useAuth();

  const [show, setShow] = useState(false);
  const [userQuery, setUserQuery] = useState("");
  const debouncedQuery = useDebounce(userQuery, 500);

  const { data, isValidating } = useSWR<UserSchema[]>(
    `/api/users?q=${debouncedQuery.length >= 2 && debouncedQuery}`
  );

  const users = useMemo(() => {
    return data?.filter((u) => u._id !== user.uid);
  }, [data]);

  return (
    <Stack pos="relative">
      {/* Search Bar */}
      <Input
        value={userQuery}
        onChange={(e) => {
          setUserQuery(e.target.value);
        }}
        onFocus={() => setShow(true)}
        placeholder="Search for user by name"
      />
      <FormHelperText fontSize="sm">Search must be more than 2 characters.</FormHelperText>

      {/* Popup */}
      <Box
        pos="absolute"
        top="100%"
        zIndex="9999"
        w="full"
        bgColor="gray.700"
        borderRadius="lg"
        shadow="lg"
      >
        <Collapse in={show}>
          {isValidating ? (
            <Center py={6}>
              <Spinner size="lg" />
            </Center>
          ) : !users || users?.length === 0 ? (
            <Text fontSize="xl" textAlign="center" py={6}>
              No users found 😢
            </Text>
          ) : (
            // Cards
            <Stack
              as={motion.div}
              spacing={4}
              p={3}
              variants={listAnimation}
              animate={show ? "show" : "hidden"}
            >
              {users.map((user) => (
                <UserPreview
                  user={user}
                  onClick={() => {
                    onSelectUser(user);
                    setUserQuery(user.displayName);
                    setShow(false);
                  }}
                  key={user._id}
                />
              ))}
            </Stack>
          )}
        </Collapse>
      </Box>
    </Stack>
  );
};

export default SelectUser;
