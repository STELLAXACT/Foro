import { useState } from "react";
import { ChatMessage, User } from "@/lib/types";
import { storage } from "@/lib/storage";
import { simulationManager } from "@/lib/simulation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface LiveChatProps {
  messages: ChatMessage[];
  user: User | null;
  onUpdate: () => void;
  className?: string;
}

export function LiveChat({ messages, user, onUpdate, className }: LiveChatProps) {
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !chatMessage.trim()) {
      if (!user) {
        toast({
          title: "❌ Authentication Required",
          description: "You must create a profile before entering the ritual chamber.",
          variant: "destructive",
        });
      }
      return;
    }

    try {
      const newMessage: ChatMessage = {
        id: `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: chatMessage.trim(),
        authorId: user.id,
        createdAt: new Date().toISOString(),
      };

      storage.addChatMessage(newMessage);
      onUpdate();
      setChatMessage("");
      
      // Scroll to bottom of chat
      setTimeout(() => {
        const chatContainer = document.getElementById('chat-messages-container');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }, 100);
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
    
    return "Anonymous Shadow";
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
    <Card className={`border-primary/30 ${className}`} data-testid="live-chat">
      <CardHeader>
        <CardTitle className="text-lg font-creepy text-accent">
          <i className="fas fa-comments mr-2"></i>Ritual Chamber
          <span className="text-sm text-muted-foreground ml-2 font-normal">
            ({messages.length} whispers)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chat Messages */}
        <ScrollArea 
          className="h-64 mb-4 border border-primary/20 rounded-lg p-3 bg-muted/30" 
          id="chat-messages-container"
          data-testid="chat-messages-container"
        >
          <div className="space-y-2">
            {messages.slice(-50).map((message) => (
              <div key={message.id} className="text-sm flex items-start space-x-2" data-testid={`chat-message-${message.id}`}>
                <img
                  src={getAuthorAvatar(message.authorId)}
                  alt="User avatar"
                  className="w-5 h-5 rounded-full border border-accent/50 mt-0.5"
                  data-testid={`chat-avatar-${message.id}`}
                />
                <div className="flex-1">
                  <span className="text-accent font-semibold" data-testid={`chat-author-${message.id}`}>
                    {getAuthorName(message.authorId)}:
                  </span>
                  <span className="text-muted-foreground ml-2" data-testid={`chat-content-${message.id}`}>
                    {message.content}
                  </span>
                  <span className="text-xs text-muted-foreground/60 ml-2" data-testid={`chat-time-${message.id}`}>
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8" data-testid="chat-empty-state">
                <i className="fas fa-ghost text-3xl mb-2 block"></i>
                <p className="text-sm">The ritual chamber is silent...</p>
                <p className="text-xs">Be the first to break the darkness with your words.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Chat Input */}
        <form onSubmit={handleChatSubmit} className="flex space-x-2" data-testid="chat-form">
          <Input
            type="text"
            placeholder={user ? "Enter the darkness..." : "Create a profile to speak..."}
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="flex-1 bg-input border-border text-sm"
            disabled={!user}
            maxLength={500}
            data-testid="input-chat-message"
          />
          <Button
            type="submit"
            className="bg-accent hover:bg-accent/80 text-accent-foreground transition-all glitch"
            disabled={!user || !chatMessage.trim()}
            data-testid="button-send-chat"
          >
            <i className="fas fa-paper-plane"></i>
          </Button>
        </form>
        
        {chatMessage.length > 400 && (
          <div className="text-xs text-muted-foreground mt-1" data-testid="chat-character-count">
            {chatMessage.length}/500 characters
          </div>
        )}
      </CardContent>
    </Card>
  );
}
