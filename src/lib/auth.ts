import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { firebase } from "lib/firebase/client";
import constate from "constate";
import nookies from "nookies";
import fetcher from "utils/fetcher";

async function createProfile(accessToken: string) {
  return await fetcher("/api/profile", accessToken, { method: "POST" });
}

function authContextHook() {
  const [user, setUser] = useState<firebase.User>();
  const [accessToken, setAccessToken] = useState<string>();

  const Router = useRouter();

  /**
   * Update user state whenever firebase auth state changes.
   */
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(setUser);
  }, []);

  /**
   * Update access token whenever token refreshes or auth state changes.
   */
  useEffect(() => {
    return firebase.auth().onIdTokenChanged(async (user) => {
      const accessToken = await user?.getIdToken();
      setAccessToken(accessToken);

      // Store/Remove access token cookie for SSR
      if (accessToken) {
        nookies.set(null, "pinky-auth", accessToken, {
          maxAge: 60 * 60,
          path: "/",
        });
      } else {
        nookies.destroy(null, "pinky-auth");
      }
    });
  }, []);

  // =================== Auth Actions =====================

  async function signIn(email: string, pass: string) {
    await firebase.auth().signInWithEmailAndPassword(email, pass);
    Router.push("/");
  }

  async function signInWithGoogle() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const { additionalUserInfo } = await firebase.auth().signInWithPopup(googleProvider);

    if (additionalUserInfo?.isNewUser) await createProfile(accessToken);

    Router.push("/");
  }

  async function signOut() {
    Router.push("/");
    await firebase.auth().signOut();
  }

  return {
    user,
    accessToken,
    signIn,
    signInWithGoogle,
    signOut,
  };
}

export const [AuthProvider, useAuth] = constate(authContextHook);
