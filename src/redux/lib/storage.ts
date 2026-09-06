// src/redux/lib/storage.ts

const storage = {
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return Promise.resolve();
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
  getItem: (key: string) => {
    if (typeof window === "undefined") return Promise.resolve(null);
    try {
      const value = localStorage.getItem(key);
      return Promise.resolve(value);
    } catch (e) {
      return Promise.reject(e);
    }
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return Promise.resolve();
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  },
};

export default storage;
