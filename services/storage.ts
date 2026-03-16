
const USER_ID_KEY = 'ocularAppUserId';
const USER_DATA_KEY_PREFIX = 'ocularAppData_';

// Simulates anonymous user authentication by creating and storing a unique ID.
export const initUser = (): string => {
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
};

// Generic function to save data for the current user.
export const saveData = <T,>(userId: string, key: string, data: T): void => {
  try {
    const fullKey = `${USER_DATA_KEY_PREFIX}${userId}_${key}`;
    const dataToStore = JSON.stringify(data);
    localStorage.setItem(fullKey, dataToStore);
  } catch (error) {
    console.error("Failed to save data to localStorage", error);
  }
};

// Generic function to load data for the current user.
export const loadData = <T,>(userId: string, key: string, defaultValue: T): T => {
  try {
    const fullKey = `${USER_DATA_KEY_PREFIX}${userId}_${key}`;
    const storedData = localStorage.getItem(fullKey);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error("Failed to load data from localStorage", error);
    return defaultValue;
  }
};
