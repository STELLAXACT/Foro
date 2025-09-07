export * from "@shared/schema";

export interface AppData {
  user: User | null;
  posts: Post[];
  comments: Comment[];
  microFeeds: MicroFeed[];
  chatMessages: ChatMessage[];
  votes: Vote[];
  cart: CartItem[];
}

export interface UserProfile {
  nickname: string;
  avatar?: string;
}

export type Category = "dreams" | "nightmares" | "occult" | "urban-legends" | "dark-poetry";

export const CATEGORIES: { id: Category; name: string; icon: string }[] = [
  { id: "dreams", name: "Dreams", icon: "fas fa-moon" },
  { id: "nightmares", name: "Nightmares", icon: "fas fa-ghost" },
  { id: "occult", name: "Occult", icon: "fas fa-eye" },
  { id: "urban-legends", name: "Urban Legends", icon: "fas fa-building" },
  { id: "dark-poetry", name: "Dark Poetry", icon: "fas fa-feather" },
];

export const DARK_MARKET_ITEMS: DarkMarketItem[] = [
  {
    id: "cursed-mask",
    name: "Cursed Mask 🕷️",
    description: "An ancient mask that reveals hidden truths to those brave enough to wear it.",
    price: 13,
    icon: "🕷️",
    image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: "black-candle",
    name: "Black Candle 🕯️",
    description: "A candle that burns with shadows, perfect for summoning rituals.",
    price: 7,
    icon: "🕯️",
    image: "https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: "ancient-grimoire",
    name: "Ancient Grimoire 📖",
    description: "A tome containing forbidden knowledge from ages past.",
    price: 25,
    icon: "📖",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: "blood-amulet",
    name: "Blood Amulet 🔮",
    description: "A crimson amulet that pulses with otherworldly energy.",
    price: 18,
    icon: "🔮",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
];
