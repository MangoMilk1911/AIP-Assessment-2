import React from "react";
import Head from "next/head";
import NextLink from "next/link";
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
  Link,
  Stack,
  useToast,
} from "@chakra-ui/core";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "lib/auth";
import { FetcherError } from "lib/fetcher";
import { userValidation } from "lib/validator/schemas";
import { useForm } from "react-hook-form";

interface LoginForm {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const { register, handleSubmit, errors: formErrors, formState } = useForm<LoginForm>({
    resolver: yupResolver(userValidation),
    context: { form: true },
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

  async function emailPassLogin({ email, password }: LoginForm) {
    try {
      await signIn(email, password);
    } catch (error) {
      errorToast(error.message);
    }
  }

  // ==================== Social Login ====================

  async function providerLogin() {
    try {
      await signInWithGoogle();
    } catch (error) {
      const { details } = error as FetcherError;
      errorToast(details?.errors[0].message || "Something went wrong.");
    }
  }

  return (
    <>
      <Head>
        <title>Pinki | Login</title>
      </Head>

      <Container maxW="30rem" mt={32}>
        <Heading fontSize="6xl" textAlign="center" mb={8}>
          Login
        </Heading>

        <Stack as="form" onSubmit={handleSubmit(emailPassLogin)} spacing={8}>
          <FormControl isInvalid={!!formErrors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" name="email" ref={register} />
            <FormErrorMessage>{formErrors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" name="password" ref={register} type="password" />
            <FormErrorMessage>{formErrors.password?.message}</FormErrorMessage>
          </FormControl>

          <Stack align="center" spacing={4}>
            <Button
              type="submit"
              isLoading={formState.isSubmitting}
              w="full"
              size="lg"
              colorScheme="primary"
            >
              Submit
            </Button>

            <Link as="span" color="blue.300">
              <NextLink href="/register">Register</NextLink>
            </Link>
          </Stack>

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
