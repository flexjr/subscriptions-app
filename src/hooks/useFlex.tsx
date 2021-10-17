import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { API_URL, AUTH0_API_AUDIENCE, getData } from "../shared";
import { FlexUserInfo } from "../types";

export const useFlex = (): { flexUserInfo; isLoadingFlexUserInfo; isOnboarded; isLoadingOnboarded; setIsOnboarded } => {
  const [isLoadingOnboarded, setIsLoadingOnboarded] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState<boolean | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [flexUserInfo, setFlexUserInfo] = useState<any>({});
  const [isLoadingFlexUserInfo, setIsLoadingFlexUserInfo] = useState(true);

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

      await getData<{ onboarded }>(`${API_URL}/organizations/onboarded`, accessToken, signal)
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

    const getFlexUserInfo = async (): Promise<FlexUserInfo | undefined> => {
      const abortController = new AbortController();
      const { signal } = abortController;

      // Exit fast if not authenticated
      if (!isAuthenticated) {
        setIsLoadingFlexUserInfo(false);
        return undefined;
      }

      const accessToken = await getAccessTokenSilently({
        audience: AUTH0_API_AUDIENCE,
        scope: "openid profile email",
      });

      const userInfo = await getData<{ data: FlexUserInfo }>(`${API_URL}/users/current_user_info`, accessToken, signal)
        .then(({ data }) => {
          console.log(data);
          setFlexUserInfo(data);
          setIsLoadingFlexUserInfo(false);
          return data;
        })
        .catch((error) => {
          console.error(error);
          setIsLoadingFlexUserInfo(false);
          return undefined;
        });
      return userInfo;
    };
    getOnboardingStatus();
    getFlexUserInfo();
  }, [getAccessTokenSilently, isAuthenticated]);

  return { flexUserInfo, isLoadingFlexUserInfo, isOnboarded, isLoadingOnboarded, setIsOnboarded };
};
