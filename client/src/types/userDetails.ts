export interface UserDetails {
  _id: string;
  username: string;
  email: string;
  // Include other fields as necessary. You might not want to include sensitive information like passwords in your frontend state.
  createdAt: string;
  updatedAt: string;
}
