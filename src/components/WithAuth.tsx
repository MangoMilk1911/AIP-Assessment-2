import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "hooks/useAuth";
import { useToast } from "@chakra-ui/core";
import Loader from "./layout/Loader";

const WithAuth = (ProtectedComponent) => {
  const AuthGuard: React.FC = (props) => {
    const { loading, user, accessToken } = useAuth();
    const router = useRouter();
    const toast = useToast();

    const isAuthed = user && accessToken;

    // Redirect if user isn't logged in and display toast
    useEffect(
      () => {
        if (!loading && !isAuthed) {
          toast({
            status: "warning",
            title: "You must be logged in to view to page!",
          });

          router.push("/login?redirect=" + router.asPath);
        }
      },
      // Intentionally omit router from dependency array as we only care about auth state
      [loading, isAuthed]
    );

    // if authed, show the protected page, otherwise show a loading indicator
    return isAuthed ? <ProtectedComponent {...props} /> : <Loader />;
  };

  return AuthGuard;
};

export default WithAuth;
