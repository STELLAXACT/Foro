import { useState, useEffect } from "react";
import { storage } from "@/lib/storage";
import { AppData } from "@/lib/types";

export function useLocalStorage() {
  const [data, setData] = useState<AppData>(() => ({
    user: storage.getUser(),
    posts: storage.getPosts(),
    comments: [],
    microFeeds: storage.getMicroFeeds(),
    chatMessages: storage.getChatMessages(),
    votes: [],
    cart: storage.getCart(),
  }));

  const refreshData = () => {
    setData({
      user: storage.getUser(),
      posts: storage.getPosts(),
      comments: [],
      microFeeds: storage.getMicroFeeds(),
      chatMessages: storage.getChatMessages(),
      votes: [],
      cart: storage.getCart(),
    });
  };

  useEffect(() => {
    // Initialize sample data if needed
    storage.initializeSampleData();
    refreshData();

    // Listen for storage changes (if multiple tabs)
    const handleStorageChange = () => {
      refreshData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    data,
    refreshData,
    storage,
  };
}
