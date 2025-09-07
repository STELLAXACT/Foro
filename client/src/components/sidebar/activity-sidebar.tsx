import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MicroFeed, ChatMessage, User, insertMicroFeedSchema, insertChatMessageSchema, InsertMicroFeed, InsertChatMessage } from "@/lib/types";
import { storage } from "@/lib/storage";
import { simulationManager } from "@/lib/simulation";
import { VotingRoulette } from "@/components/roulette/voting-roulette";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ActivitySidebarProps {
  microFeeds: MicroFeed[];
  chatMessages: ChatMessage[];
  user: User | null;
  onUpdate: () => void;
}

export function ActivitySidebar({ microFeeds, chatMessages, user, onUpdate }: ActivitySidebarProps) {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");

  const microFeedForm = useForm<InsertMicroFeed>({
    resolver: zodResolver(insertMicroFeedSchema),
    defaultValues: {
      content: "",
      authorId: user?.id || "",
    },
  });

  const onMicroFeedSubmit = (data: InsertMicroFeed) => {
    if (!user) {
      toast({
        title: "❌ Authentication Required",
        description: "You must create a profile before posting.",
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
      
      microFeedForm.reset();
      
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

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !chatMessage.trim()) return;

    try {
      const newMessage: ChatMessage = {
        id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: chatMessage,
        authorId: user.id,
        createdAt: new Date().toISOString(),
      };

      storage.addChatMessage(newMessage);
      onUpdate();
      setChatMessage("");
      
      // Scroll to bottom of chat
      const chatContainer = document.getElementById('chat-messages');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    } catch (error) {
      toast({
        title: "❌ Message Failed",
        description: "Your message was lost in the shadows.",
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
    
    return "Anonymous";
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

  return (
    <aside className="w-80 bg-sidebar border-l border-sidebar-border hidden xl:block" data-testid="activity-sidebar">
      <div className="p-4 space-y-8">
        {/* MicroFeed */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg font-creepy text-accent">
              <i className="fas fa-raven mr-2"></i>Dark Whispers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recent MicroFeeds */}
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {microFeeds.slice(0, 5).map((feed) => (
                  <div key={feed.id} className="bg-muted rounded-lg p-3 border border-primary/20" data-testid={`microfeed-${feed.id}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <img
                        src={getAuthorAvatar(feed.authorId)}
                        alt="User avatar"
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-xs text-muted-foreground" data-testid={`microfeed-author-${feed.id}`}>
                        {getAuthorName(feed.authorId)}
                      </span>
                      <span className="text-xs text-muted-foreground" data-testid={`microfeed-time-${feed.id}`}>
                        {formatDistanceToNow(new Date(feed.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm" data-testid={`microfeed-content-${feed.id}`}>{feed.content}</p>
                  </div>
                ))}
                {microFeeds.length === 0 && (
                  <div className="text-center text-muted-foreground py-4">
                    <i className="fas fa-wind text-2xl mb-2"></i>
                    <p className="text-sm">The whispers have not yet begun...</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* MicroFeed Form */}
            <Form {...microFeedForm}>
              <form onSubmit={microFeedForm.handleSubmit(onMicroFeedSubmit)} className="space-y-2">
                <FormField
                  control={microFeedForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Share a dark thought..."
                          rows={2}
                          {...field}
                          className="bg-input border-border text-sm resize-none"
                          data-testid="textarea-microfeed"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/80 text-accent-foreground text-sm"
                  disabled={!user}
                  data-testid="button-submit-microfeed"
                >
                  <i className="fas fa-feather mr-2"></i>Whisper
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Live Chat */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg font-creepy text-accent">
              <i className="fas fa-comments mr-2"></i>Ritual Chamber
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Chat Messages */}
            <ScrollArea className="h-64 mb-4 border border-primary/20 rounded-lg p-3" id="chat-messages">
              <div className="space-y-2">
                {chatMessages.slice(-20).map((message) => (
                  <div key={message.id} className="text-sm" data-testid={`chat-message-${message.id}`}>
                    <span className="text-accent font-semibold" data-testid={`chat-author-${message.id}`}>
                      {getAuthorName(message.authorId)}:
                    </span>
                    <span className="text-muted-foreground ml-2" data-testid={`chat-content-${message.id}`}>
                      {message.content}
                    </span>
                  </div>
                ))}
                {chatMessages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <i className="fas fa-ghost text-3xl mb-2"></i>
                    <p className="text-sm">The ritual chamber is silent...</p>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter the darkness..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 bg-input border-border text-sm"
                disabled={!user}
                data-testid="input-chat"
              />
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/80 text-accent-foreground"
                disabled={!user || !chatMessage.trim()}
                data-testid="button-send-chat"
              >
                <i className="fas fa-paper-plane"></i>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Voting Roulette */}
        <VotingRoulette onUpdate={onUpdate} />
      </div>
    </aside>
  );
}
