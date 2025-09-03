export type HexAddress = `0x${string}`;
export type ISODateString = string;

export type FarcasterUsersResponse = {
  users: FarcasterUser[];
};

export type FarcasterUser = {
  object: "user";
  fid: number;
  username: string;
  display_name: string;
  custody_address: HexAddress;
  pro: ProInfo;
  pfp_url: string;
  profile: Profile;
  follower_count: number;
  following_count: number;
  verifications: HexAddress[];
  auth_addresses: AuthAddress[];
  verified_addresses: VerifiedAddresses;
  verified_accounts: VerifiedAccount[];
  power_badge: boolean;
  experimental: ExperimentalInfo;
  viewer_context: ViewerContext;
  score: number;
};

export type ProInfo = {
  status: string; // e.g., "subscribed"
  subscribed_at: ISODateString;
  expires_at: ISODateString;
};

export type Profile = {
  bio: Bio;
  location: Location;
  banner: { url: string };
};

export type Bio = {
  text: string;
  mentioned_profiles: DehydratedUser[];
  mentioned_profiles_ranges: Range[];
  mentioned_channels: DehydratedChannel[];
  mentioned_channels_ranges: Range[];
};

export type DehydratedUser = {
  object: "user_dehydrated";
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: HexAddress;
  score: number;
};

export type DehydratedChannel = {
  id: string;
  name: string;
  object: "channel_dehydrated";
  image_url: string;
  viewer_context: {
    following: boolean;
    role: string; // e.g., "member"
  };
};

export type Range = {
  start: number;
  end: number;
};

export type Location = {
  latitude: number;
  longitude: number;
  address: {
    city: string;
    state: string;
    state_code: string;
    country: string;
    country_code: string;
  };
  radius: number;
};

export type AuthAddress = {
  address: HexAddress;
  app: {
    object: "user_dehydrated";
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
    custody_address: HexAddress;
    score: number;
  };
};

export type VerifiedAddresses = {
  eth_addresses: HexAddress[];
  sol_addresses: string[]; // base58
  primary: {
    eth_address: HexAddress;
    sol_address: string; // base58
  };
};

export type VerifiedAccount = {
  platform: string; // e.g., "x"
  username: string;
};

export type ExperimentalInfo = {
  deprecation_notice: string;
  neynar_user_score: number;
};

export type ViewerContext = {
  following: boolean;
  followed_by: boolean;
  blocking: boolean;
  blocked_by: boolean;
};
