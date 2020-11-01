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
    useEffect(() => {
      if (!loading && !accessToken) {
        toast({
          status: "warning",
          title: "You must be logged in to view to page!",
        });

        router.push("/login?redirect=" + router.asPath);
      }
    }, [loading, accessToken, router]);

    // if there's a loggedInUser, show the wrapped page, otherwise show a loading indicator
    return accessToken ? <WrappedComponent {...props} /> : <Loader />;
  };

  return AuthGuard;
};

export default WithAuth;
