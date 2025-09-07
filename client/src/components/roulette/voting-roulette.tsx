import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skull, Zap, ChevronRight, ArrowUp, ArrowDown } from "lucide-react";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface VotingRouletteProps {
  onUpdate?: () => void;
}

export function VotingRoulette({ onUpdate }: VotingRouletteProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastResult, setLastResult] = useState<{
    postTitle: string;
    voteType: "upvote" | "downvote";
    author: string;
  } | null>(null);
  const { toast } = useToast();

  const spinRoulette = async () => {
    if (isSpinning) return;
    
    const currentUser = storage.getUsers().find(u => u.id === "current-user") || null;
    if (!currentUser) {
      toast({
        title: "Access Denied",
        description: "You must be signed in to participate in the dark rituals.",
        variant: "destructive",
      });
      return;
    }

    setIsSpinning(true);
    
    // Dramatic spinning animation delay
    setTimeout(async () => {
      const posts = storage.getPosts();
      if (posts.length === 0) {
        setIsSpinning(false);
        toast({
          title: "The Void is Empty",
          description: "No posts found in the abyss to vote upon.",
          variant: "destructive",
        });
        return;
      }

      // Get posts the user hasn't voted on yet
      const unvotedPosts = posts.filter(post => !storage.getUserVote(currentUser.id, post.id));
      
      if (unvotedPosts.length === 0) {
        setIsSpinning(false);
        toast({
          title: "Your Will is Complete",
          description: "You have cast your judgment upon all souls in the realm.",
        });
        return;
      }

      // Random selection with weighted probability (70% upvote, 30% downvote)
      const randomPost = unvotedPosts[Math.floor(Math.random() * unvotedPosts.length)];
      const voteType = Math.random() > 0.3 ? "upvote" : "downvote";
      
      // Cast the vote
      const vote = {
        id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser.id,
        targetId: randomPost.id,
        type: voteType as "upvote" | "downvote",
      };
      
      storage.addVote(vote);
      
      // Get author info
      const author = storage.getUser(randomPost.authorId);
      
      setLastResult({
        postTitle: randomPost.title,
        voteType,
        author: author?.nickname || "Unknown Soul",
      });
      
      setIsSpinning(false);
      
      toast({
        title: voteType === "upvote" ? "Soul Blessed" : "Soul Cursed",
        description: `You have ${voteType === "upvote" ? "blessed" : "cursed"} "${randomPost.title}"`,
      });
      
      if (onUpdate) onUpdate();
    }, 2000);
  };

  return (
    <div className="bg-gray-900/50 border border-red-800/30 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skull className="h-6 w-6 text-red-500" />
        <h3 className="text-xl font-bold text-red-400">Soul Roulette</h3>
        <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
      </div>
      
      <p className="text-gray-300 text-sm mb-6">
        Let the darkness decide which soul deserves your judgment. 
        Spin the wheel of fate and cast a random vote upon the forum dwellers.
      </p>

      <Button
        onClick={spinRoulette}
        disabled={isSpinning}
        className={`w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white font-bold py-3 ${
          isSpinning ? "animate-pulse" : ""
        }`}
        data-testid="button-spin-roulette"
      >
        {isSpinning ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Consulting the Void...
          </>
        ) : (
          <>
            <Skull className="mr-2 h-5 w-5" />
            Spin the Wheel of Judgment
          </>
        )}
      </Button>

      {lastResult && (
        <div className="mt-4 p-4 bg-black/30 border border-red-700/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-400 font-semibold">Last Judgment:</span>
            {lastResult.voteType === "upvote" ? (
              <ArrowUp className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={lastResult.voteType === "upvote" ? "default" : "destructive"}>
              {lastResult.voteType === "upvote" ? "BLESSED" : "CURSED"}
            </Badge>
          </div>
          <div className="text-sm text-gray-300">
            <p className="font-medium truncate" title={lastResult.postTitle}>
              "{lastResult.postTitle}"
            </p>
            <p className="text-gray-400">
              by <span className="text-red-400">{lastResult.author}</span>
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 text-center">
        The wheel favors the righteous, but darkness sometimes prevails...
      </div>
    </div>
  );
}