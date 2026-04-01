export interface Buddy {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  gender: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  aboutMe: string;
  profilePicture: string;
  activities: string[];
  costPerHour: number;
  rate: number;
  languages: string[];
  bio: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}
