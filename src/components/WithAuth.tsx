import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "hooks/useAuth";
import { Heading, Spinner, Stack, useToast } from "@chakra-ui/core";
import Layout from "./layout/Layout";

const Loader: React.FC = () => (
  <Layout title="Loading..." mt={48}>
    <Stack w="full" direction="column" spacing={6} align="center">
      <Heading size="xl" fontWeight="medium">
        Loading...
      </Heading>
      <Spinner size="xl" speed="1s" thickness="4px" />
    </Stack>
  </Layout>
);

const withAuth = (WrappedComponent) => {
  const AuthGuard: React.FC = (props) => {
    const { loading, accessToken } = useAuth();
    const router = useRouter();
    const toast = useToast();

    // Redirect if user isn't logged in and display toast
    useEffect(() => {
      if (!loading && !accessToken) {
        toast({
          status: "warning",
          title: "You must be logged in to view to page!",
        });

        router.push("/login?redirect=" + router.pathname);
      }
    }, [loading, accessToken, router]);

    // if there's a loggedInUser, show the wrapped page, otherwise show a loading indicator
    return accessToken ? <WrappedComponent {...props} /> : <Loader />;
  };

  return AuthGuard;
};

export default withAuth;
