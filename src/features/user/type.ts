export type UserGender = "Male" | "Female" | "Other" | string;

export interface UserProfile {
  id: string;
  email: string | null;
  fullName: string | null;
  gender: UserGender;
  roles: string[] | null;
  phoneNumber: string | null;
  address: string | null;
  dateOfBirth: string | null;
  aboutMe: string | null;
  profilePicture: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface UpdateUserProfileRequest {
  fullName: string;
  gender: UserGender;
  phoneNumber: string;
  address: string;
  dateOfBirth: string | null;
  aboutMe: string;
}
