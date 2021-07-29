import { useAuth0 } from "@auth0/auth0-react";
import Avatar from "antd/lib/avatar/avatar";
import React from "react";

function Profile() {
  const { user } = useAuth0();
  console.log(user);

  return (
    <div className="site-layout-content">
      {user.email}

      <Avatar size={64} src={user.picture} />
    </div>
  );
}

export default Profile;
