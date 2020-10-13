import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/core";
import { useAuth } from "lib/auth";
import { FetcherError } from "utils/fetcher";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userValidation } from "lib/validator";

interface ILoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();
  const { register, handleSubmit, errors: formErrors } = useForm<ILoginForm>({
    resolver: yupResolver(userValidation),
  });

  // ==================== Toast 🍞 ====================

  const toast = useToast();

  function errorToast(description: string, title = "Uh Oh...") {
    toast({
      title,
      description,
      status: "error",
      duration: 10000,
      isClosable: true,
    });
  }

  // ==================== Standard Login ====================

  const emailPassLogin = async ({ email, password }: ILoginForm) => {
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (error) {
      errorToast(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==================== Social Login ====================

  const providerLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      const { details } = error as FetcherError;
      errorToast(details?.errors[0].message || "Something went wrong.");
    }
  };

  return (
    <>
      <Head>
        <title>Pinki | Login</title>
      </Head>

      <Link href="/">
        <a>Home</a>
      </Link>

      <Container maxW="30rem" mt={32}>
        <Stack as="form" onSubmit={handleSubmit(emailPassLogin)} spacing={8}>
          <Heading fontSize="6xl" textAlign="center">
            Login
          </Heading>
          <FormControl isInvalid={!!formErrors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" name="email" ref={register} />
            <FormErrorMessage>{formErrors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formErrors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              id="password"
              name="password"
              ref={register}
              type="password"
            />
            <FormErrorMessage>{formErrors.password?.message}</FormErrorMessage>
          </FormControl>
          <Button type="submit" w="full" size="lg" isLoading={loading}>
            Submit
          </Button>

          <Divider />

          <Button colorScheme="gray" size="lg" onClick={providerLogin}>
            Login with Google
          </Button>
        </Stack>
      </Container>
    </>
  );
};

export default Login;
