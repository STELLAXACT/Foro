import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useAudio } from "@/hooks/use-audio";
import { simulationManager } from "@/lib/simulation";
import { Category, CATEGORIES } from "@/lib/types";
import { CategoriesSidebar } from "@/components/sidebar/categories-sidebar";
import { ActivitySidebar } from "@/components/sidebar/activity-sidebar";
import { CreatePostForm } from "@/components/forum/create-post-form";
import { PostCard } from "@/components/forum/post-card";
import { PostModal } from "@/components/forum/post-modal";
import { DarkMarketModal } from "@/components/market/dark-market-modal";
import { UserProfile } from "@/components/user/user-profile";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { data, refreshData, storage } = useLocalStorage();
  const { playGlitchSound } = useAudio();
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showDarkMarket, setShowDarkMarket] = useState(false);

  // Glitch effect on random elements
  useEffect(() => {
    const interval = setInterval(() => {
      const glitchElements = document.querySelectorAll('.glitch');
      if (glitchElements.length > 0) {
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)] as HTMLElement;
        randomElement.style.animation = 'glitch 0.5s';
        setTimeout(() => {
          randomElement.style.animation = '';
        }, 500);
        
        if (Math.random() < 0.3) {
          playGlitchSound();
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [playGlitchSound]);

  // Start simulation when component mounts
  useEffect(() => {
    simulationManager.startSimulation(refreshData);
    
    return () => {
      simulationManager.stopSimulation();
    };
  }, [refreshData]);

  const handleExportData = () => {
    try {
      const exportedData = storage.exportData();
      const blob = new Blob([exportedData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'night-rituals-data.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "📜 Data Exported",
        description: "Your dark secrets have been sealed in a digital grimoire.",
      });
    } catch (error) {
      toast({
        title: "❌ Export Failed",
        description: "The darkness consumed your data. Try again.",
        variant: "destructive",
      });
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        storage.importData(jsonData);
        refreshData();
        
        toast({
          title: "📖 Data Imported",
          description: "Your dark archives have been restored.",
        });
      } catch (error) {
        toast({
          title: "❌ Import Failed",
          description: "The cursed file could not be deciphered.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const filteredPosts = storage.getPosts(selectedCategory === "all" ? undefined : selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-primary/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <i className="fas fa-skull skull-icon text-2xl text-accent"></i>
              <h1 className="text-2xl font-creepy text-accent glitch" data-testid="site-title">
                Night Rituals Forum
              </h1>
              <span className="terminal-text text-sm hidden sm:inline" data-testid="site-subtitle">
                [DARK WEB ACCESS]
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <UserProfile user={data.user} onUserChange={refreshData} />
              
              <Button 
                onClick={handleExportData}
                className="bg-accent hover:bg-accent/80 text-accent-foreground glitch hidden sm:inline-flex"
                data-testid="button-export"
              >
                <i className="fas fa-download mr-2"></i>
                Export Data
              </Button>
              
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                  data-testid="input-import"
                />
                <Button 
                  as="span"
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground hidden sm:inline-flex"
                  data-testid="button-import"
                >
                  <i className="fas fa-upload mr-2"></i>
                  Import
                </Button>
              </label>
              
              <Button
                onClick={() => setShowDarkMarket(true)}
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                data-testid="button-dark-market"
              >
                <i className="fas fa-shopping-cart mr-2"></i>
                <span className="hidden sm:inline">Dark Market</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <CategoriesSidebar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 max-w-4xl">
          <CreatePostForm onPostCreated={refreshData} user={data.user} />
          
          <div className="space-y-6" data-testid="posts-list">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-ghost text-4xl text-muted-foreground mb-4"></i>
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Posts Found</h3>
                <p className="text-muted-foreground">
                  {selectedCategory === "all" 
                    ? "The darkness is silent... Create the first post to awaken the shadows." 
                    : "No posts found in this category. Be the first to share your dark tale."}
                </p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  author={data.user}
                  currentUser={data.user}
                  onPostClick={() => setSelectedPost(post.id)}
                  onVote={refreshData}
                />
              ))
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <ActivitySidebar 
          microFeeds={data.microFeeds}
          chatMessages={data.chatMessages}
          user={data.user}
          onUpdate={refreshData}
        />
      </div>

      {/* Modals */}
      {selectedPost && (
        <PostModal
          postId={selectedPost}
          onClose={() => setSelectedPost(null)}
          onUpdate={refreshData}
        />
      )}

      {showDarkMarket && (
        <DarkMarketModal
          cart={data.cart}
          onClose={() => setShowDarkMarket(false)}
          onUpdate={refreshData}
        />
      )}
    </div>
  );
}
