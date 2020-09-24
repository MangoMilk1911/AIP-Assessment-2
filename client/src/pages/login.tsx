import React from "react";
import Head from "next/head";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Heading,
  Stack,
  useColorMode,
  Container,
  Divider,
} from "@chakra-ui/core";
import { auth } from "../utils/firebase";
import Link from "next/link";

const Login: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const email = e.currentTarget["username"].value;
    const password = e.currentTarget["password"].value;

    auth
      .signInWithEmailAndPassword(email, password)
      .then(console.log)
      .catch(console.error);
  };

  return (
    <>
      <Head>
        <title>Pinki | Login</title>
      </Head>

      <Link href="/">
        <a>Home</a>
      </Link>

      <p>
        <Button onClick={toggleColorMode} variant="outline">
          mode: {colorMode}
        </Button>
      </p>

      <Box as="form" onSubmit={onSubmit} maxW="30rem" mt={32}>
        <Stack spacing={8}>
          <Heading fontSize="6xl" textAlign="center">
            Login
          </Heading>
          <FormControl isRequired>
            <FormLabel htmlFor="username">Email</FormLabel>
            <Input id="username" variant="filled" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" type="password" />
          </FormControl>
          <Button type="submit" w="full" size="lg">
            Submit
          </Button>

          <Divider />

          <Button colorScheme="gray" size="lg">
            Login with Google
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default Login;
