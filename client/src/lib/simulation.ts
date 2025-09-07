import { User, ChatMessage, MicroFeed, Post, Comment, Vote, Category } from "./types";
import { storage } from "./storage";

// Simulated users with dark personas
const SIMULATED_USERS: User[] = [
  {
    id: "sim-user-1",
    nickname: "CrimsonWhisper",
    avatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-2", 
    nickname: "VoidSeeker",
    avatar: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-3",
    nickname: "ShadowBound",
    avatar: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40", 
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-4",
    nickname: "DarkMuse",
    avatar: "https://images.unsplash.com/photo-1509909756405-be0199881695?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-5",
    nickname: "NightCrawler",
    avatar: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-6",
    nickname: "CorruptedSoul",
    avatar: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-7",
    nickname: "EternalVoid",
    avatar: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-8",
    nickname: "BloodMoon",
    avatar: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-9",
    nickname: "RavenQueen",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-10",
    nickname: "PhantomScribe",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-11",
    nickname: "NecroMancer",
    avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-12",
    nickname: "DarkOracle",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-13",
    nickname: "CryptKeeper",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-14",
    nickname: "Banshee13",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c88a0e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sim-user-15",
    nickname: "GrimReaper666",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
    createdAt: new Date().toISOString(),
  },
];

// Chat messages that simulated users will send
const CHAT_MESSAGES = [
  "The shadows grow longer tonight...",
  "Has anyone else felt the presence in their room?",
  "I found something in my grandmother's attic",
  "The ritual worked... too well",
  "3:33 AM again. They're back.",
  "The mirror shows things that aren't there",
  "I can hear voices in the static",
  "Something followed me home from the cemetery",
  "The candles keep lighting themselves",
  "Did you see that shadow move?",
  "The old book speaks in tongues",
  "My dreams are bleeding into reality",
  "The darkness has a name now",
  "I shouldn't have read those words aloud",
  "There's a face in my coffee...",
  "The wind whispers secrets",
  "My reflection blinked first",
  "The basement door opened by itself",
  "Something scratched my name in the dust",
  "The photographs change when I'm not looking",
  "I heard my name called from the forest",
  "The music box plays at midnight",
  "My shadow moved without me",
  "There are footsteps in the attic",
  "The pendulum swings backwards now",
  "I found a door that wasn't there yesterday",
  "The ravens know my secrets",
  "My hands wrote words I don't remember",
  "The clock strikes thirteen",
  "Something breathes under my bed",
];

// Microfeed posts for dark thoughts
const MICROFEED_POSTS = [
  "In the space between heartbeats, eternity whispers.",
  "Today I learned that mirrors lie, but shadows tell the truth.",
  "The silence after midnight has weight to it.",
  "Found an old key. It fits every door in my nightmares.",
  "Sometimes I wonder if my thoughts are my own.",
  "The stars spelled out my name last night. I'm terrified.",
  "Collected three black feathers today. The ritual begins.",
  "My coffee tastes like forgotten memories.",
  "The void stared back and I didn't look away.",
  "Dreamed in a language I don't speak but understand perfectly.",
  "My shadow grew longer while the sun stayed still.",
  "The roses in my garden bloomed black this morning.",
  "I can taste colors in the dark now.",
  "Time moves differently in old houses.",
  "The wind carries names of people who never existed.",
  "My reflection aged while I watched.",
  "Found poetry written in dust on my bookshelf.",
  "The moon followed me home again.",
  "I speak to spiders now. They listen.",
  "My dreams left footprints on the bedroom floor.",
  "The rain whispers secrets only I can hear.",
  "I swear my books rearrange themselves at night.",
  "The darkness has a texture like velvet.",
  "My tea leaves read my future and wept.",
  "I found a letter I wrote but never remember writing.",
  "The static on old radios speaks in Latin.",
  "My heartbeat sounds like morse code now.",
  "The wallpaper pattern shifted when I wasn't looking.",
  "I taste copper when I think about tomorrow.",
  "The night feels different since I learned its true name.",
];

// Forum posts by genre
const FORUM_POSTS_BY_GENRE = {
  dreams: [
    {
      title: "The Recurring Gallery Dream",
      content: "Every night for three weeks, I've dreamed of the same art gallery. It's filled with paintings that move when I'm not looking directly at them. The faces in the portraits follow me, and their eyes grow sadder each time I visit. Last night, I found a painting of myself sleeping. I looked so peaceful, but there was something standing behind my bed that I couldn't make out. When I woke up, I found paint under my fingernails.",
      tags: ["dreams", "paintings", "recurring", "gallery"]
    },
    {
      title: "Dreaming in Color-Sound",
      content: "I discovered I can hear colors in my dreams. Purple tastes like midnight rain, and red sounds like whispered confessions. Blue feels like being underwater while breathing perfectly. But there's one color I've never seen awake - a shade between silver and starlight that screams in perfect harmony. I've been trying to paint it for months, but my waking hands can't remember the technique my sleeping mind knows so well.",
      tags: ["dreams", "synesthesia", "colors", "artistic"]
    },
    {
      title: "The Library of Unwritten Books",
      content: "In my dreams, I visit a vast library where all the books contain stories that were never written. I can open any book and read complete novels, poems, and plays that exist nowhere in the waking world. The librarian is an elderly woman who knows every story by heart. She told me that when I die, any story I remember from the dream library will cease to exist forever. The pressure of remembering is overwhelming.",
      tags: ["dreams", "library", "stories", "memory"]
    }
  ],
  nightmares: [
    {
      title: "The Elevator That Goes Down Forever",
      content: "It started as a normal elevator ride to the parking garage. But the elevator just kept going down. Past the garage, past the basement, past floors that shouldn't exist. The display showed negative numbers: -15, -23, -45. Other people got on at floors that had no business existing. They all stared at me with empty eye sockets. When I finally woke up, I was standing in my building's elevator at 3 AM, and the display read -1.",
      tags: ["nightmare", "elevator", "endless", "basement"]
    },
    {
      title: "My Reflection Lives Independently",
      content: "I noticed it first in the bathroom mirror. My reflection was brushing its teeth a second after I stopped. Then it started making different expressions. Now it follows me to every reflective surface with a look of growing hatred. Yesterday, I covered all the mirrors in my house, but I can still see it in my phone screen, in windows, in puddles. It's getting stronger. Sometimes I catch myself making its expressions without realizing it.",
      tags: ["nightmare", "reflection", "mirror", "possession"]
    },
    {
      title: "The Backwards Day",
      content: "I keep having the same nightmare where I live an entire day backwards. I start by going to bed in my grave, then walking backwards through my death, my old age, my adult life. Every step backwards is more terrifying because I know what comes next, but I can't change anything. The worst part is the moment just before I'm born - I can see all the pain I'll cause others, and I'm helpless to prevent it. I always wake up when I reach the moment of my birth.",
      tags: ["nightmare", "time", "backwards", "death"]
    }
  ],
  occult: [
    {
      title: "Grandmother's Ritual Circle",
      content: "Cleaning out my grandmother's house, I found a circle of salt in the basement with symbols I'd never seen before. Each symbol was carved into small bones arranged around a single black candle. When I touched one of the bones, I instantly understood what each symbol meant, as if the knowledge had always been in my mind. Now I find myself drawing these symbols everywhere - in condensation on windows, in the sand at beaches, in the frost on my car. I can't stop, and each time I complete a symbol, something in my peripheral vision moves.",
      tags: ["occult", "ritual", "symbols", "grandmother"]
    },
    {
      title: "The Book That Reads You Back",
      content: "I bought an old grimoire at an estate sale. The text changes depending on who's reading it and what they need to know. But I realized it's not just showing me spells - it's learning about me. The margins now contain notes in my handwriting that I don't remember making. They detail my fears, my secrets, my deepest desires. Last night I found a page titled 'How to Bind [My Real Name]' written in what looks like my own blood.",
      tags: ["occult", "grimoire", "binding", "blood"]
    },
    {
      title: "The Midnight Market",
      content: "There's a market that only exists between 3:33 and 3:34 AM in the abandoned lot downtown. The vendors sell things that shouldn't exist: bottled laughter from children who never lived, keys to doors in your dreams, photographs of your future corpse. I've been a regular customer for months. The cost is never money - always memories, years of your life, or pieces of your soul. I'm running out of things to trade, but I can't stop going back.",
      tags: ["occult", "market", "soul", "trading"]
    }
  ],
  "urban-legends": [
    {
      title: "The Staircase in the Woods",
      content: "Found a perfectly preserved staircase in the middle of the forest, leading up to nothing. Local hikers say it's been there for decades, but no one knows where it came from. I climbed it yesterday. At the top, I could see my house from above, but everything was wrong - the rooms were arranged differently, there were people inside I didn't recognize, and my own body was sitting at the kitchen table, staring directly up at me with solid black eyes.",
      tags: ["urban-legend", "forest", "staircase", "parallel"]
    },
    {
      title: "The Radio Station That Doesn't Exist",
      content: "Every night at 2:15 AM, my car radio picks up a station that isn't on any frequency chart. It plays music from bands that never existed, news from cities that aren't real, and weather reports for tomorrow that always come true. The DJ knows my name and sometimes gives me personal advice. Last night he said, 'Stop looking for us, we'll find you when you're ready.' When I drove to the station's supposed location, I found only an empty field with a single radio antenna buried upside down.",
      tags: ["urban-legend", "radio", "dj", "prophecy"]
    },
    {
      title: "The Subway Train to Nowhere",
      content: "There's a train that runs on the abandoned subway line after midnight. The passengers are all people who've been reported missing over the past fifty years, but they look exactly the same age as when they disappeared. They're all going to the same destination - a station that isn't on any map. I almost got on last night. The conductor, a woman who disappeared in 1973, smiled at me and said, 'Not yet, but soon.' I found a ticket in my pocket this morning.",
      tags: ["urban-legend", "subway", "missing", "ticket"]
    }
  ],
  "dark-poetry": [
    {
      title: "Verses Written in Ash",
      content: "I found poetry carved into the walls of a burned house,\nEach word a scar in charcoal and regret.\nThe verses speak of love that burns too bright,\nOf hearts that crumble into embers when touched.\n\nThe final stanza was still warm:\n'Here lived a poet who loved fire more than flesh,\nWho chose to burn rather than write another word,\nWho discovered that some truths can only be told\nIn the language of smoke and destruction.'\n\nI copied every word, but when I returned, the house was whole again.",
      tags: ["dark-poetry", "fire", "love", "destruction"]
    },
    {
      title: "The Syntax of Sorrow",
      content: "Punctuation marks are falling from my eyes,\nCommas like teardrops, periods like blood.\nEach sentence I speak leaves marks on the ground,\nSpelling out stories I never meant to tell.\n\nMy grandmother reads the grammar of grief\nIn the way I pause between words,\nThe semicolons of my shallow breathing,\nThe ellipses of things left unsaid...\n\nShe says some stories write themselves\nWhether we want them to or not.",
      tags: ["dark-poetry", "grammar", "grief", "grandmother"]
    },
    {
      title: "Midnight Ink",
      content: "The pen writes by itself after midnight,\nFilling pages with words in my handwriting\nThat spell out truths I've never spoken,\nSecrets I've buried in the deepest parts of my mind.\n\nEach morning I burn the pages,\nBut the words have already been read\nBy shadows that gather in the corners,\nBy the darkness that knows my name.\n\nThe pen is running out of ink,\nAnd I'm afraid of what happens\nWhen it starts writing in blood.",
      tags: ["dark-poetry", "writing", "secrets", "blood"]
    }
  ]
};

// Comment responses for posts
const COMMENT_RESPONSES = [
  "This gave me chills... I've experienced something similar.",
  "The same thing happened to my cousin last year.",
  "You should stay away from that place.",
  "I know exactly what you mean. The darkness recognizes its own.",
  "This is why I never go out after midnight anymore.",
  "My grandmother warned me about things like this.",
  "The old rituals still work if you know how to use them.",
  "You're not alone in this. There are others.",
  "I've seen that symbol before, carved into a tree near my house.",
  "The shadows are getting stronger. We need to be careful.",
  "This is beautiful and terrifying at the same time.",
  "Your words speak to something ancient in my soul.",
  "I feel like I've been there in my dreams.",
  "The entities are drawn to stories like this.",
  "You've described my worst nightmare perfectly.",
  "I can't sleep after reading this.",
  "The poetry flows like blood from an open wound.",
  "This place sounds familiar... too familiar.",
  "I think something followed me home after reading this.",
  "The darkness is calling to you through these words.",
];

class SimulationManager {
  private chatInterval: NodeJS.Timeout | null = null;
  private microfeedInterval: NodeJS.Timeout | null = null;
  private postInterval: NodeJS.Timeout | null = null;
  private commentInterval: NodeJS.Timeout | null = null;
  private voteInterval: NodeJS.Timeout | null = null;
  private onUpdateCallback: (() => void) | null = null;

  constructor() {
    this.initializeSimulatedUsers();
  }

  private initializeSimulatedUsers(): void {
    // Check if we already have simulated content to avoid duplicates
    const existingPosts = storage.getPosts().filter(p => p.id.startsWith('sim-post-'));
    if (existingPosts.length === 0) {
      // Add some initial content only if not already present
      this.addInitialMessages();
      this.addInitialPosts();
    }
  }

  private addInitialMessages(): void {
    const now = Date.now();
    
    // Add some initial chat messages spread over the last few hours
    for (let i = 0; i < 8; i++) {
      const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
      const randomMessage = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
      
      const message: ChatMessage = {
        id: `sim-chat-${now}-${i}`,
        content: randomMessage,
        authorId: randomUser.id,
        createdAt: new Date(now - (i * 15 * 60 * 1000)).toISOString(), // 15 minutes apart
      };
      
      storage.addChatMessage(message);
    }

    // Add some initial microfeeds spread over the last day
    for (let i = 0; i < 12; i++) {
      const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
      const randomPost = MICROFEED_POSTS[Math.floor(Math.random() * MICROFEED_POSTS.length)];
      
      const microfeed: MicroFeed = {
        id: `sim-micro-${now}-${i}`,
        content: randomPost,
        authorId: randomUser.id,
        createdAt: new Date(now - (i * 2 * 60 * 60 * 1000)).toISOString(), // 2 hours apart
      };
      
      storage.addMicroFeed(microfeed);
    }
  }

  private addInitialPosts(): void {
    const now = Date.now();
    let postCounter = 0;

    // Add posts for each genre
    Object.entries(FORUM_POSTS_BY_GENRE).forEach(([genre, posts]) => {
      posts.forEach((postData, genreIndex) => {
        const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
        
        const post: Post = {
          id: `sim-post-${genre}-${genreIndex}-${now}-${Math.random().toString(36).substr(2, 9)}`,
          title: postData.title,
          content: postData.content,
          category: genre as Category,
          tags: postData.tags,
          authorId: randomUser.id,
          votes: Math.floor(Math.random() * 100) + 10, // Random votes between 10-110
          createdAt: new Date(now - (postCounter * 4 * 60 * 60 * 1000)).toISOString(), // 4 hours apart
          commentCount: Math.floor(Math.random() * 8), // Random comment count
        };
        
        postCounter++;
        storage.addPost(post);

        // Add some comments to posts
        const numComments = Math.floor(Math.random() * 5) + 1;
        for (let i = 0; i < numComments; i++) {
          const commentAuthor = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
          const randomResponse = COMMENT_RESPONSES[Math.floor(Math.random() * COMMENT_RESPONSES.length)];
          
          const comment: Comment = {
            id: `sim-comment-${now}-${post.id}-${i}`,
            content: randomResponse,
            postId: post.id,
            authorId: commentAuthor.id,
            votes: Math.floor(Math.random() * 20) - 5, // Random votes between -5 and 15
            createdAt: new Date(now - (i * 30 * 60 * 1000)).toISOString(), // 30 minutes apart
          };
          
          storage.addComment(comment);
        }
      });
    });
  }

  public startSimulation(onUpdate: () => void): void {
    this.onUpdateCallback = onUpdate;
    
    // Start chat simulation (every 45-90 seconds)
    this.chatInterval = setInterval(() => {
      this.addRandomChatMessage();
    }, 45000 + Math.random() * 45000);

    // Start microfeed simulation (every 2-5 minutes)  
    this.microfeedInterval = setInterval(() => {
      this.addRandomMicrofeed();
    }, 120000 + Math.random() * 180000);

    // Start post simulation (every 10-20 minutes)
    this.postInterval = setInterval(() => {
      this.addRandomPost();
    }, 600000 + Math.random() * 600000);

    // Start comment simulation (every 3-8 minutes)
    this.commentInterval = setInterval(() => {
      this.addRandomComment();
    }, 180000 + Math.random() * 300000);

    // Start voting simulation (every 1-3 minutes)
    this.voteInterval = setInterval(() => {
      this.addRandomVote();
    }, 60000 + Math.random() * 120000);
  }

  public stopSimulation(): void {
    if (this.chatInterval) {
      clearInterval(this.chatInterval);
      this.chatInterval = null;
    }
    
    if (this.microfeedInterval) {
      clearInterval(this.microfeedInterval);
      this.microfeedInterval = null;
    }

    if (this.postInterval) {
      clearInterval(this.postInterval);
      this.postInterval = null;
    }

    if (this.commentInterval) {
      clearInterval(this.commentInterval);
      this.commentInterval = null;
    }

    if (this.voteInterval) {
      clearInterval(this.voteInterval);
      this.voteInterval = null;
    }
  }

  private addRandomChatMessage(): void {
    const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
    const randomMessage = CHAT_MESSAGES[Math.floor(Math.random() * CHAT_MESSAGES.length)];
    
    const message: ChatMessage = {
      id: `sim-chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: randomMessage,
      authorId: randomUser.id,
      createdAt: new Date().toISOString(),
    };
    
    storage.addChatMessage(message);
    
    if (this.onUpdateCallback) {
      this.onUpdateCallback();
    }
  }

  private addRandomMicrofeed(): void {
    const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
    const randomPost = MICROFEED_POSTS[Math.floor(Math.random() * MICROFEED_POSTS.length)];
    
    const microfeed: MicroFeed = {
      id: `sim-micro-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: randomPost,
      authorId: randomUser.id,
      createdAt: new Date().toISOString(),
    };
    
    storage.addMicroFeed(microfeed);
    
    if (this.onUpdateCallback) {
      this.onUpdateCallback();
    }
  }

  private addRandomPost(): void {
    const categories = Object.keys(FORUM_POSTS_BY_GENRE) as Category[];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const posts = FORUM_POSTS_BY_GENRE[randomCategory];
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
    
    const post: Post = {
      id: `sim-post-new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: randomPost.title,
      content: randomPost.content,
      category: randomCategory,
      tags: randomPost.tags,
      authorId: randomUser.id,
      votes: Math.floor(Math.random() * 50) + 5, // Random votes between 5-55
      createdAt: new Date().toISOString(),
      commentCount: 0,
    };
    
    storage.addPost(post);
    
    if (this.onUpdateCallback) {
      this.onUpdateCallback();
    }
  }

  private addRandomComment(): void {
    const posts = storage.getPosts();
    if (posts.length === 0) return;
    
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
    const randomResponse = COMMENT_RESPONSES[Math.floor(Math.random() * COMMENT_RESPONSES.length)];
    
    const comment: Comment = {
      id: `sim-comment-new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: randomResponse,
      postId: randomPost.id,
      authorId: randomUser.id,
      votes: Math.floor(Math.random() * 15) - 3, // Random votes between -3 and 12
      createdAt: new Date().toISOString(),
    };
    
    storage.addComment(comment);
    
    if (this.onUpdateCallback) {
      this.onUpdateCallback();
    }
  }

  private addRandomVote(): void {
    const posts = storage.getPosts();
    if (posts.length === 0) return;
    
    const randomPost = posts[Math.floor(Math.random() * posts.length)];
    const randomUser = SIMULATED_USERS[Math.floor(Math.random() * SIMULATED_USERS.length)];
    const voteType = Math.random() > 0.3 ? "upvote" : "downvote"; // 70% upvotes, 30% downvotes
    
    // Check if user already voted on this post
    const existingVote = storage.getUserVote(randomUser.id, randomPost.id);
    if (existingVote) return; // User already voted
    
    const vote: Vote = {
      id: `sim-vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: randomUser.id,
      targetId: randomPost.id,
      type: voteType,
    };
    
    storage.addVote(vote);
    
    if (this.onUpdateCallback) {
      this.onUpdateCallback();
    }
  }

  public getSimulatedUser(userId: string): User | null {
    return SIMULATED_USERS.find(user => user.id === userId) || null;
  }

  public getAllSimulatedUsers(): User[] {
    return [...SIMULATED_USERS];
  }
}

export const simulationManager = new SimulationManager();
export { SIMULATED_USERS };