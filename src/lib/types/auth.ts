export type LoginResponse = {
  token: string;
  role: "User" | "Admin";
};
