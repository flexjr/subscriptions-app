import { useAuth0 } from "@auth0/auth0-react";
import Avatar from "antd/lib/avatar/avatar";
import React from "react";

export const Profile: React.FunctionComponent = () => {
  const { user } = useAuth0();

  return (
    <div>
      {user?.email}

      <Avatar size={64} src={user?.picture} />
    </div>
  );
};
