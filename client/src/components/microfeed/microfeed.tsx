import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MicroFeed, User, insertMicroFeedSchema, InsertMicroFeed } from "@/lib/types";
import { storage } from "@/lib/storage";
import { simulationManager } from "@/lib/simulation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface MicroFeedProps {
  feeds: MicroFeed[];
  user: User | null;
  onUpdate: () => void;
  className?: string;
  maxFeeds?: number;
}

export function MicroFeedComponent({ feeds, user, onUpdate, className, maxFeeds = 10 }: MicroFeedProps) {
  const { toast } = useToast();

  const form = useForm<InsertMicroFeed>({
    resolver: zodResolver(insertMicroFeedSchema),
    defaultValues: {
      content: "",
      authorId: user?.id || "",
    },
  });

  const onSubmit = (data: InsertMicroFeed) => {
    if (!user) {
      toast({
        title: "❌ Authentication Required",
        description: "You must create a profile before whispering to the void.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newMicroFeed: MicroFeed = {
        ...data,
        id: `microfeed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        authorId: user.id,
        createdAt: new Date().toISOString(),
      };

      storage.addMicroFeed(newMicroFeed);
      onUpdate();
      
      form.reset();
      
      toast({
        title: "🌙 Whisper Sent",
        description: "Your dark thought has been released into the void.",
      });
    } catch (error) {
      toast({
        title: "❌ Whisper Failed",
        description: "The darkness consumed your thought. Try again.",
        variant: "destructive",
      });
    }
  };

  const getAuthorName = (authorId: string): string => {
    // Check if it's the current user
    if (user && authorId === user.id) {
      return user.nickname;
    }
    
    // Check if it's a simulated user
    const simulatedUser = simulationManager.getSimulatedUser(authorId);
    if (simulatedUser) {
      return simulatedUser.nickname;
    }
    
    return "Anonymous Whisper";
  };

  const getAuthorAvatar = (authorId: string): string => {
    // Check if it's the current user
    if (user && authorId === user.id && user.avatar) {
      return user.avatar;
    }
    
    // Check if it's a simulated user
    const simulatedUser = simulationManager.getSimulatedUser(authorId);
    if (simulatedUser && simulatedUser.avatar) {
      return simulatedUser.avatar;
    }
    
    return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=20&h=20";
  };

  const displayFeeds = feeds.slice(0, maxFeeds);

  return (
    <Card className={`border-primary/30 ${className}`} data-testid="microfeed">
      <CardHeader>
        <CardTitle className="text-lg font-creepy text-accent">
          <i className="fas fa-raven mr-2"></i>Dark Whispers
          <span className="text-sm text-muted-foreground ml-2 font-normal">
            ({feeds.length} thoughts)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recent MicroFeeds */}
        <ScrollArea className="h-48" data-testid="microfeed-list">
          <div className="space-y-3">
            {displayFeeds.map((feed) => (
              <div key={feed.id} className="bg-muted rounded-lg p-3 border border-primary/20 hover:border-accent/30 transition-colors" data-testid={`microfeed-item-${feed.id}`}>
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={getAuthorAvatar(feed.authorId)}
                    alt="User avatar"
                    className="w-5 h-5 rounded-full border border-accent/50"
                    data-testid={`microfeed-avatar-${feed.id}`}
                  />
                  <span className="text-xs text-accent font-semibold" data-testid={`microfeed-author-${feed.id}`}>
                    {getAuthorName(feed.authorId)}
                  </span>
                  <span className="text-xs text-muted-foreground" data-testid={`microfeed-time-${feed.id}`}>
                    {formatDistanceToNow(new Date(feed.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed" data-testid={`microfeed-content-${feed.id}`}>
                  {feed.content}
                </p>
              </div>
            ))}
            {feeds.length === 0 && (
              <div className="text-center text-muted-foreground py-4" data-testid="microfeed-empty-state">
                <i className="fas fa-wind text-2xl mb-2 block"></i>
                <p className="text-sm">The whispers have not yet begun...</p>
                <p className="text-xs">Share the first dark thought with the void.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* MicroFeed Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" data-testid="microfeed-form">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder={user ? "Share a dark thought..." : "Create a profile to whisper..."}
                      rows={2}
                      maxLength={280}
                      {...field}
                      className="bg-input border-border text-sm resize-none"
                      disabled={!user}
                      data-testid="textarea-microfeed-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-muted-foreground">
                {form.watch("content")?.length || 0}/280 characters
              </div>
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/80 text-accent-foreground text-sm glitch"
                disabled={!user || !form.watch("content")?.trim()}
                data-testid="button-submit-microfeed"
              >
                <i className="fas fa-feather mr-2"></i>Whisper
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
