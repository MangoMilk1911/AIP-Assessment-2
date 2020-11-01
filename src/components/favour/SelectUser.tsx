import {
  Avatar,
  Box,
  Center,
  Collapse,
  FormHelperText,
  Input,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/core";
import { useAuth } from "hooks/useAuth";
import useDebounce from "hooks/useDebounce";
import { UserSchema } from "models/User";
import { useMemo, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";

/**
 * User Preview Card
 */

const cardAnimation = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

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
    bg={useColorModeValue("gray.200", "whiteAlpha.200")}
    align="center"
    borderRadius="lg"
    style={{ transition: "background 0.2s ease" }}
    _hover={{ cursor: "pointer", bg: useColorModeValue("gray.300", "whiteAlpha.300") }}
    variants={cardAnimation}
  >
    <Avatar name={user.displayName} />
    <Box>
      <Text fontSize="xl">{user.displayName}</Text>
      <Text color={useColorModeValue("gray.700", "gray.400")}>{user.email}</Text>
    </Box>
  </Stack>
);

/**
 * Select User
 */

const listAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

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
    <Stack>
      {/* Search Bar */}
      <Input
        value={userQuery}
        onChange={(e) => {
          setUserQuery(e.target.value);
        }}
        onFocus={() => setShow(true)}
        onBlur={() => {
          // Delay hide so Card onClick can register (kinda gross but...)
          setTimeout(() => setShow(false), 200);
        }}
        placeholder="Search for user by name"
      />
      <FormHelperText fontSize="sm">Search must be more than 2 characters.</FormHelperText>

      {/* Popup */}

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
          // Card List
          <Stack
            as={motion.div}
            spacing={4}
            p={4}
            variants={listAnimation}
            initial="hidden"
            animate={show ? "show" : "hidden"}
          >
            {users.map((user) => (
              <UserPreview
                user={user}
                onClick={() => {
                  onSelectUser(user);
                  setUserQuery(user.displayName);
                }}
                key={user._id}
              />
            ))}
          </Stack>
        )}
      </Collapse>
    </Stack>
  );
};

export default SelectUser;
