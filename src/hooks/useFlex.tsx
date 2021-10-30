import { useAuth0 } from "@auth0/auth0-react";
import { Tag, Tooltip } from "antd";
import React from "react";
import { useEffect, useState } from "react";
import { API_URL, AUTH0_API_AUDIENCE, getData } from "../shared";
import { FlexUserInfo } from "../types";

export const useFlex = (): {
  flexUserInfo;
  isLoadingFlexUserInfo;
  isOnboarded;
  isLoadingOnboarded;
  setIsOnboarded;
  subscriptionPlanFriendlyName;
  subscriptionPlanStatus;
} => {
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

  const subscriptionPlanFriendlyName = (subscriptionPlan: string): string | undefined => {
    const parts = subscriptionPlan.split("-"); // e.g. FLEX_PRO-SGD-Monthly
    const plan = parts[0];
    // const currency = parts[1];
    const frequency = parts[2];

    let formattedPlanName = "";
    switch (plan) {
      case "FLEX_STARTER":
        return "Flex Starter";
      case "FLEX_PRO":
        formattedPlanName = `Flex Pro`;
        return `${formattedPlanName} (${frequency})`;
      case "FLEX_PREMIUM":
        formattedPlanName = `Flex Premium`;
        return `${formattedPlanName} (${frequency})`;
      default:
        return undefined;
    }
  };

  const subscriptionPlanStatus = (status: string): JSX.Element | undefined => {
    switch (status) {
      case "active":
        return <Tag color="#3dbd7d">Active</Tag>;
      case "in_trial":
        return <Tag color="#00a854">Trial</Tag>;
      case "non_renewing":
        return (
          <Tooltip placement="top" title="Subscription is still active, but will not be renewed when it ends.">
            <Tag color="#3dbd7d">Non Renewing</Tag>
            {/* #ffbf00 */}
          </Tooltip>
        );
      case "cancelled":
        return <Tag color="#f04134">Cancelled</Tag>;
      case "future":
        return <Tag>Future</Tag>;
      case "paused":
        return <Tag>Paused</Tag>;
      default:
        return undefined;
    }
  };

  return {
    flexUserInfo,
    isLoadingFlexUserInfo,
    isOnboarded,
    isLoadingOnboarded,
    setIsOnboarded,
    subscriptionPlanFriendlyName,
    subscriptionPlanStatus,
  };
};
