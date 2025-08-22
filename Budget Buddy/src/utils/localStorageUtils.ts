// Utility functions for user profile management in localStorage

export interface UserProfile {
  username: string;
  moneyUsed?: number;
  // Add more fields as needed
}

const USER_PROFILE_KEY = "budgetBuddyUserProfile";

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

export function getUserProfile(): UserProfile | null {
  const data = localStorage.getItem(USER_PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearUserProfile() {
  localStorage.removeItem(USER_PROFILE_KEY);
}
