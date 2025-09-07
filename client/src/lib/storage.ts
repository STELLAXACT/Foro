import { AppData, User, Post, Comment, MicroFeed, ChatMessage, Vote, CartItem } from "./types";

const STORAGE_KEY = "night-rituals-forum-data";

const defaultData: AppData = {
  user: null,
  posts: [],
  comments: [],
  microFeeds: [],
  chatMessages: [],
  votes: [],
  cart: [],
};

export class LocalStorageManager {
  private data: AppData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): AppData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultData, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
    return defaultData;
  }

  private saveData(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error("Error saving data to localStorage:", error);
    }
  }

  // User management
  setUser(user: User | null): void {
    this.data.user = user;
    this.saveData();
  }

  getUser(): User | null {
    return this.data.user;
  }

  // Posts management
  addPost(post: Post): void {
    this.data.posts.unshift(post);
    this.saveData();
  }

  getPosts(category?: string): Post[] {
    let posts = [...this.data.posts];
    if (category && category !== "all") {
      posts = posts.filter(post => post.category === category);
    }
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getPost(id: string): Post | undefined {
    return this.data.posts.find(post => post.id === id);
  }

  updatePost(id: string, updates: Partial<Post>): void {
    const index = this.data.posts.findIndex(post => post.id === id);
    if (index !== -1) {
      this.data.posts[index] = { ...this.data.posts[index], ...updates };
      this.saveData();
    }
  }

  // Comments management
  addComment(comment: Comment): void {
    this.data.comments.unshift(comment);
    // Update post comment count
    const post = this.data.posts.find(p => p.id === comment.postId);
    if (post) {
      post.commentCount = (post.commentCount || 0) + 1;
    }
    this.saveData();
  }

  getComments(postId: string): Comment[] {
    return this.data.comments
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // MicroFeed management
  addMicroFeed(microFeed: MicroFeed): void {
    this.data.microFeeds.unshift(microFeed);
    this.saveData();
  }

  getMicroFeeds(): MicroFeed[] {
    return [...this.data.microFeeds].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Chat management
  addChatMessage(message: ChatMessage): void {
    this.data.chatMessages.push(message);
    // Keep only last 100 messages
    if (this.data.chatMessages.length > 100) {
      this.data.chatMessages = this.data.chatMessages.slice(-100);
    }
    this.saveData();
  }

  getChatMessages(): ChatMessage[] {
    return [...this.data.chatMessages];
  }

  // Voting management
  addVote(vote: Vote): void {
    // Remove existing vote if any
    this.data.votes = this.data.votes.filter(
      v => !(v.userId === vote.userId && v.targetId === vote.targetId)
    );
    
    this.data.votes.push(vote);
    this.updateVoteCounts(vote.targetId);
    this.saveData();
  }

  removeVote(userId: string, targetId: string): void {
    this.data.votes = this.data.votes.filter(
      v => !(v.userId === userId && v.targetId === targetId)
    );
    this.updateVoteCounts(targetId);
    this.saveData();
  }

  getUserVote(userId: string, targetId: string): Vote | undefined {
    return this.data.votes.find(v => v.userId === userId && v.targetId === targetId);
  }

  private updateVoteCounts(targetId: string): void {
    const votes = this.data.votes.filter(v => v.targetId === targetId);
    const upvotes = votes.filter(v => v.type === "upvote").length;
    const downvotes = votes.filter(v => v.type === "downvote").length;
    const totalVotes = upvotes - downvotes;

    // Update post votes
    const post = this.data.posts.find(p => p.id === targetId);
    if (post) {
      post.votes = totalVotes;
      return;
    }

    // Update comment votes
    const comment = this.data.comments.find(c => c.id === targetId);
    if (comment) {
      comment.votes = totalVotes;
    }
  }

  // Cart management
  addToCart(item: CartItem): void {
    const existingItem = this.data.cart.find(i => i.itemId === item.itemId);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.data.cart.push(item);
    }
    this.saveData();
  }

  getCart(): CartItem[] {
    return [...this.data.cart];
  }

  clearCart(): void {
    this.data.cart = [];
    this.saveData();
  }

  // Data export/import
  exportData(): string {
    return JSON.stringify(this.data, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const importedData = JSON.parse(jsonData);
      this.data = { ...defaultData, ...importedData };
      this.saveData();
    } catch (error) {
      throw new Error("Invalid JSON data");
    }
  }

  // Initialize with sample data if needed
  initializeSampleData(): void {
    if (this.data.posts.length === 0) {
      this.addSamplePosts();
    }
  }

  private addSamplePosts(): void {
    const sampleUser: User = {
      id: "sample-user-1",
      nickname: "ShadowWalker",
      avatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
      createdAt: new Date().toISOString(),
    };

    const samplePosts: Post[] = [
      {
        id: "post-1",
        title: "The Whispers in My Bedroom Wall",
        content: "Every night at 3:33 AM, I hear them. Soft whispers coming from inside my bedroom wall. At first, I thought it was pipes or settling wood, but last night... they whispered my name. The voice was my own, but I was awake, standing in the middle of the room. I pressed my ear against the wall, and the whispers grew louder. They weren't speaking English—or any language I recognized. But somehow, I understood every word.",
        category: "nightmares",
        tags: ["horror", "supernatural", "whispers"],
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        authorId: sampleUser.id,
        votes: 666,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        commentCount: 13,
      },
      {
        id: "post-2",
        title: "The Ritual That Changed Everything",
        content: "I found this ancient text in my grandmother's attic after she passed. The symbols looked familiar, like something from a fever dream. Against all logic, I performed the ritual described within. Now I can see things that others cannot. The veil between worlds has been lifted, and I'm not sure I can ever go back to my old reality.",
        category: "occult",
        tags: ["ritual", "occult", "supernatural"],
        authorId: sampleUser.id,
        votes: 1337,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        commentCount: 27,
      },
      {
        id: "post-3",
        title: "Ode to the Endless Night",
        content: "In shadows deep where silence screams,\nAnd moonlight cuts through broken dreams,\nI dance with phantoms of my past,\nIn darkness that forever lasts.\n\nThe raven calls from twisted trees,\nWhile autumn wind through branches flees,\nAnd in this realm of endless night,\nI've found my home away from light.",
        category: "dark-poetry",
        tags: ["poetry", "darkness", "gothic"],
        authorId: sampleUser.id,
        votes: 42,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        commentCount: 8,
      },
    ];

    samplePosts.forEach(post => this.addPost(post));
    this.setUser(sampleUser);
  }
}

export const storage = new LocalStorageManager();
