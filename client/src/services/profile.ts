import { auth } from "firebase/client";
import { useAuthState } from "react-firebase-hooks/auth";
import { ErrorResponse } from "utils/errorHandler";
import { fetchFromApi } from ".";

/**
 * Returns an async function for create a user profile
 * once logged in with firebase auth.
 */
export function useCreateProfile() {
  const [user] = useAuthState(auth);

  return async (): Promise<ErrorResponse> => {
    const token = await user.getIdToken();

    // Apply auth header
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        authorization: "Bearer " + token,
      },
    };

    // Make the request and return the body
    const response = await fetchFromApi("/profile/create", requestOptions);
    return response.json();
  };
}
