import React from "react";
import Head from "next/head";
import Link from "next/link";
import { auth } from "../utils/firebase";
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";

const Login: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  const onSubmit: React.FormEventHandler<HTMLDivElement> = (e) => {
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

      {user?.uid || "none"}

      <Container maxW="30rem" mt={32}>
        <Stack as="form" onSubmit={onSubmit} spacing={8}>
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
      </Container>
    </>
  );
};

export default Login;
