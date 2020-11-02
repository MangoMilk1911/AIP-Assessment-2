import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "hooks/useAuth";
import { useToast } from "@chakra-ui/core";
import SuperJSON from "superjson";
import Loader from "./layout/Loader";

const WithAuth = (WrappedComponent) => {
  const AuthGuard: React.FC = (props) => {
    // Deserialize if coming from GSSP
    if ("json" in props) {
      props = SuperJSON.deserialize(props);
    }

    const { loading, accessToken } = useAuth();
    const router = useRouter();
    const toast = useToast();

    // Redirect if user isn't logged in and display toast
    useEffect(
      () => {
        const atLogin = router.asPath.includes("login");

        // Don't redirect to login multiple times
        if (!loading && !accessToken && !atLogin) {
          toast({
            status: "warning",
            title: "You must be logged in to view to page!",
          });

          router.push("/login?redirect=" + router.asPath);
        }
      },
      // Intentionally omit router from dependency array as we only care about auth state
      [loading, accessToken]
    );

    // if there's a loggedInUser, show the wrapped page, otherwise show a loading indicator
    return accessToken ? <WrappedComponent {...props} /> : <Loader />;
  };

  return AuthGuard;
};

export default WithAuth;
