import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post, Comment, User, insertCommentSchema, InsertComment } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface PostModalProps {
  postId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export function PostModal({ postId, onClose, onUpdate }: PostModalProps) {
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState<User | null>(null);
  const currentUser = storage.getUser();

  const form = useForm<InsertComment>({
    resolver: zodResolver(insertCommentSchema),
    defaultValues: {
      content: "",
      postId,
      authorId: currentUser?.id || "",
    },
  });

  useEffect(() => {
    const foundPost = storage.getPost(postId);
    if (foundPost) {
      setPost(foundPost);
      setComments(storage.getComments(postId));
      // In a real app, we'd fetch the author from storage
      // For now, using current user as placeholder
      setAuthor(currentUser);
    }
  }, [postId, currentUser]);

  const onSubmit = (data: InsertComment) => {
    if (!currentUser) {
      toast({
        title: "❌ Authentication Required",
        description: "You must create a profile before commenting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newComment: Comment = {
        ...data,
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        authorId: currentUser.id,
        votes: 0,
        createdAt: new Date().toISOString(),
      };

      storage.addComment(newComment);
      setComments(storage.getComments(postId));
      onUpdate();
      
      form.reset();
      
      toast({
        title: "💀 Comment Added",
        description: "Your dark wisdom has been shared.",
      });
    } catch (error) {
      toast({
        title: "❌ Comment Failed",
        description: "The shadows consumed your words. Try again.",
        variant: "destructive",
      });
    }
  };

  if (!post) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto modal-backdrop" data-testid="post-modal">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs font-semibold" data-testid="modal-category">
                {post.category.toUpperCase().replace("-", " ")}
              </Badge>
              {author?.avatar && (
                <img
                  src={author.avatar}
                  alt="Author avatar"
                  className="w-6 h-6 rounded-full border border-accent"
                  data-testid="modal-author-avatar"
                />
              )}
              <span className="text-sm text-muted-foreground" data-testid="modal-author-name">
                {author?.nickname || "Anonymous"}
              </span>
              <span className="text-sm text-muted-foreground" data-testid="modal-timestamp">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-left" data-testid="modal-title">
            {post.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post Image */}
          {post.image && (
            <img
              src={post.image}
              alt="Post image"
              className="w-full h-64 object-cover rounded-lg"
              data-testid="modal-image"
            />
          )}

          {/* Post Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="modal-content">
              {post.content}
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs" data-testid={`modal-tag-${index}`}>
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="border-t border-primary/30 pt-6">
            <h3 className="text-lg font-semibold text-accent mb-4" data-testid="comments-header">
              <i className="fas fa-comments mr-2"></i>Responses ({comments.length})
            </h3>

            {/* Comment Form */}
            {currentUser ? (
              <Card className="mb-6">
                <CardContent className="pt-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Share your thoughts on this tale..."
                                rows={3}
                                {...field}
                                className="bg-input border-border resize-none"
                                data-testid="textarea-comment"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-accent hover:bg-accent/80 text-accent-foreground"
                          data-testid="button-submit-comment"
                        >
                          <i className="fas fa-reply mr-2"></i>Reply
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6">
                <CardContent className="pt-4">
                  <div className="text-center text-muted-foreground">
                    <i className="fas fa-user-secret text-2xl mb-2"></i>
                    <p>You must create a profile to leave comments in the shadows...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <i className="fas fa-wind text-3xl text-muted-foreground mb-3"></i>
                  <p className="text-muted-foreground">No responses yet... The silence is deafening.</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <Card key={comment.id} className="border-primary/20" data-testid={`comment-${comment.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <img
                          src={currentUser?.avatar || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=24&h=24"}
                          alt="Commenter avatar"
                          className="w-6 h-6 rounded-full border border-accent"
                          data-testid={`comment-avatar-${comment.id}`}
                        />
                        <span className="text-sm font-semibold text-accent" data-testid={`comment-author-${comment.id}`}>
                          {currentUser?.nickname || "Anonymous"}
                        </span>
                        <span className="text-sm text-muted-foreground" data-testid={`comment-timestamp-${comment.id}`}>
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap" data-testid={`comment-content-${comment.id}`}>
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-4 mt-3">
                        <button className="text-xs text-muted-foreground hover:text-accent transition-colors" data-testid={`comment-upvote-${comment.id}`}>
                          <i className="fas fa-thumbs-up mr-1"></i>{comment.votes}
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-accent transition-colors" data-testid={`comment-reply-${comment.id}`}>
                          <i className="fas fa-reply mr-1"></i>Reply
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
