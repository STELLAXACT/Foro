import { Post, User, Vote } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  author: User | null;
  currentUser: User | null;
  onPostClick: () => void;
  onVote: () => void;
}

export function PostCard({ post, author, currentUser, onPostClick, onVote }: PostCardProps) {
  const handleVote = (type: "upvote" | "downvote") => {
    if (!currentUser) return;

    const existingVote = storage.getUserVote(currentUser.id, post.id);
    
    if (existingVote?.type === type) {
      // Remove vote if clicking same type
      storage.removeVote(currentUser.id, post.id);
    } else {
      // Add new vote
      const vote: Vote = {
        id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUser.id,
        targetId: post.id,
        type,
      };
      storage.addVote(vote);
    }
    
    onVote();
  };

  const currentUserVote = currentUser ? storage.getUserVote(currentUser.id, post.id) : undefined;

  return (
    <Card className="hover:border-accent/50 transition-all cursor-pointer" data-testid={`post-card-${post.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Voting */}
          <div className="flex flex-col items-center space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleVote("upvote");
              }}
              className={`upvote-btn transition-all ${
                currentUserVote?.type === "upvote" ? "text-accent" : "text-muted-foreground"
              }`}
              disabled={!currentUser}
              data-testid={`button-upvote-${post.id}`}
            >
              <i className="fas fa-chevron-up text-xl"></i>
            </Button>
            <span className="text-sm font-semibold text-accent" data-testid={`votes-${post.id}`}>
              {post.votes}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleVote("downvote");
              }}
              className={`downvote-btn transition-all ${
                currentUserVote?.type === "downvote" ? "text-destructive" : "text-muted-foreground"
              }`}
              disabled={!currentUser}
              data-testid={`button-downvote-${post.id}`}
            >
              <i className="fas fa-chevron-down text-xl"></i>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1" onClick={onPostClick}>
            {/* Header */}
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className="text-xs font-semibold" data-testid={`category-${post.id}`}>
                {post.category.toUpperCase().replace("-", " ")}
              </Badge>
              {author?.avatar && (
                <img
                  src={author.avatar}
                  alt="Author avatar"
                  className="w-6 h-6 rounded-full border border-accent"
                  data-testid={`author-avatar-${post.id}`}
                />
              )}
              <span className="text-sm text-muted-foreground" data-testid={`author-name-${post.id}`}>
                {author?.nickname || "Anonymous"}
              </span>
              <span className="text-sm text-muted-foreground" data-testid={`timestamp-${post.id}`}>
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-accent transition-colors" data-testid={`title-${post.id}`}>
              {post.title}
            </h3>

            {/* Content Preview */}
            <p className="text-muted-foreground mb-3 line-clamp-3" data-testid={`content-${post.id}`}>
              {post.content}
            </p>

            {/* Image */}
            {post.image && (
              <img
                src={post.image}
                alt="Post image"
                className="w-full h-48 object-cover rounded-lg mb-3 border border-primary/20"
                data-testid={`image-${post.id}`}
              />
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Tags */}
              <div className="flex items-center space-x-2">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs" data-testid={`tag-${post.id}-${index}`}>
                    #{tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4 text-muted-foreground">
                <button className="hover:text-accent transition-colors" data-testid={`comments-${post.id}`}>
                  <i className="fas fa-comment mr-1"></i>
                  <span>{post.commentCount || 0}</span>
                </button>
                <button className="hover:text-accent transition-colors" data-testid={`share-${post.id}`}>
                  <i className="fas fa-share mr-1"></i>Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
