import { useMemo, useState } from "react";
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
import Card from "components/List/Card";
import { useAuth } from "hooks/useAuth";
import useDebounce from "hooks/useDebounce";
import { UserSchema } from "models/User";
import useSWR from "swr";
import { motion } from "framer-motion";

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

const cardAnimation = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
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
        placeholder="Search for user by name"
        onChange={(e) => setUserQuery(e.target.value)}
        onFocus={() => setShow(true)}
        onBlur={() => {
          // Delay hide so Card onClick can register (kinda gross but...)
          setTimeout(() => setShow(false), 200);
        }}
      />
      <FormHelperText fontSize="sm">Search must be more than 2 characters.</FormHelperText>

      {/* User List */}
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
              <Card
                as={motion.div}
                onClick={() => {
                  onSelectUser(user);
                  setUserQuery(user.displayName);
                }}
                flexDir="row"
                variants={cardAnimation}
                key={user._id}
              >
                <Avatar name={user.displayName} mr={4} />
                <Box>
                  <Text fontSize="xl">{user.displayName}</Text>
                  <Text color={useColorModeValue("gray.700", "gray.400")}>{user.email}</Text>
                </Box>
              </Card>
            ))}
          </Stack>
        )}
      </Collapse>
    </Stack>
  );
};

export default SelectUser;
