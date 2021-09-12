import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { API_URL, AUTH0_API_AUDIENCE, getData } from "../shared";

export const useFlex = (): { isOnboarded; isLoadingOnboarded; setIsOnboarded } => {
  const [isLoadingOnboarded, setIsLoadingOnboarded] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState<boolean | undefined>(undefined);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const getOnboardingStatus = async (): Promise<{ onboarded } | undefined> => {
      const abortController = new AbortController();
      const { signal } = abortController;

      if (!isAuthenticated) {
        return { onboarded: undefined };
      }
      if (localStorage.getItem("isOnboarded") === "true") {
        setIsOnboarded(true);
        setIsLoadingOnboarded(false);
        return { onboarded: true };
      }

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      return await getData<{ onboarded }>(`${API_URL}/organizations/onboarded`, accessToken, signal)
        .then(({ onboarded }) => {
          setIsOnboarded(onboarded);
          setIsLoadingOnboarded(false);
          localStorage.setItem("isOnboarded", onboarded.toString());
          return onboarded;
        })
        .catch((error) => {
          console.error(error);
          return undefined;
        });
    };
    getOnboardingStatus();
  }, [getAccessTokenSilently, isAuthenticated]);

  return { isOnboarded, isLoadingOnboarded, setIsOnboarded };
};
