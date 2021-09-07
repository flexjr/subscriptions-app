export interface CurrentUserInfo {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  user_roles: UserRoles[];
  user_subscriptions: UserSubscriptions[];
}

export interface UserRoles {
  orgId: number;
  userId: number;
  roleName: string;
}

export interface UserSubscriptions {
  orgId: number;
  userId: number;
  subscriptionPlanType: string;
}
