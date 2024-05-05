import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageService {
  static async setItem(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("AsyncStorage setItem error:", e);
    }
  }

  static async getItem(key: string): Promise<any> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value == null) {
        return null;
      }
      return JSON.parse(value);
    } catch (e) {
      console.error("AsyncStorage getItem error:", e);
    }
  }

  static async removeItem(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error("AsyncStorage removeItem error:", e);
    }
  }
}

export default StorageService;
