export interface CurrentUserInfo {
  id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  user_roles: FlexUserRole;
  user_subscriptions: FlexUserSubscription;
  user_orgs: FlexOrganization;
}

export interface FlexUserRole {
  org_id: number;
  user_id: number;
  role_name: string;
}

export interface FlexUserSubscription {
  org_id: number;
  user_id: number;
  subscription_plan: string;
  subscription_id: string;
}

export interface FlexOrganization {
  id: number;
  crn: string;
  company_name: string;
}
