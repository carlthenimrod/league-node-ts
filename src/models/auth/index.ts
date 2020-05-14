export interface AuthResponse {
  _id: string;
  email: string;
  name: {
    first: string;
    last: string;
  }
  fullName: string;
  status: {
    new: boolean;
    verified: boolean;
  };
  img: string,
  teams: any[],
  client: string;
  access_token: string;
  refresh_token: string;
}