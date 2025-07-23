export interface IFollower {
  id: number;
  name: string;
  phone: string;
  type: "user";
  created_at: string;
  updated_at: string;
}

export interface IFollowersResponse {
  followers: IFollower[];
}
