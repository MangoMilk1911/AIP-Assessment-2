import React from "react";
import Head from "next/head";
import NextLink from "next/link";
import {
  Button,
  Container,
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
import { userValidation } from "lib/validator/schemas";
import { useForm } from "react-hook-form";

interface RegisterForm {
  displayName: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

const Register: React.FC = () => {
  const { signUp } = useAuth();
  const { register, handleSubmit, errors: formErrors, formState } = useForm<RegisterForm>({
    resolver: yupResolver(userValidation),
    context: { form: true, create: true },
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

  // ==================== Register ====================

  async function createUser({ displayName, email, password }: RegisterForm) {
    try {
      await signUp(email, password, displayName);
    } catch (error) {
      errorToast(error.message);
    }
  }

  return (
    <>
      <Head>
        <title>Pinki | Register</title>
      </Head>

      <Container maxW="30rem" mt={32}>
        <Heading fontSize="6xl" textAlign="center" mb={8}>
          Register
        </Heading>

        <Stack as="form" onSubmit={handleSubmit(createUser)} spacing={8}>
          <FormControl isInvalid={!!formErrors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" name="email" ref={register} />
            <FormErrorMessage>{formErrors.email?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.displayName}>
            <FormLabel htmlFor="displayName">Display Name</FormLabel>
            <Input id="displayName" name="displayName" ref={register} />
            <FormErrorMessage>{formErrors.displayName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input id="password" name="password" ref={register} type="password" />
            <FormErrorMessage>{formErrors.password?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!formErrors.passwordRepeat}>
            <FormLabel htmlFor="passwordRepeat">Password Repeat</FormLabel>
            <Input id="passwordRepeat" name="passwordRepeat" ref={register} type="password" />
            <FormErrorMessage>{formErrors.passwordRepeat?.message}</FormErrorMessage>
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

            <Link as="span" color="red.300">
              <NextLink href="/">Cancel</NextLink>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};

export default Register;
