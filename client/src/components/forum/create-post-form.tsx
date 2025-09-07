import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPostSchema, InsertPost, User, Category } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface CreatePostFormProps {
  onPostCreated: () => void;
  user: User | null;
}

export function CreatePostForm({ onPostCreated, user }: CreatePostFormProps) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string>("");

  const form = useForm<InsertPost>({
    resolver: zodResolver(insertPostSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "nightmares" as Category,
      tags: [],
      image: "",
      authorId: user?.id || "",
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        form.setValue("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: InsertPost) => {
    if (!user) {
      toast({
        title: "❌ Authentication Required",
        description: "You must create a profile before posting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const tagsArray = data.tags.length > 0 
        ? data.tags[0].split(/[,#\s]+/).filter(tag => tag.length > 0).map(tag => tag.replace(/^#/, ''))
        : [];

      const newPost = {
        ...data,
        id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        authorId: user.id,
        tags: tagsArray,
        votes: 0,
        createdAt: new Date().toISOString(),
        commentCount: 0,
      };

      storage.addPost(newPost);
      onPostCreated();
      
      form.reset();
      setImagePreview("");
      
      toast({
        title: "🔥 Post Summoned",
        description: "Your dark tale has been released into the void.",
      });
    } catch (error) {
      toast({
        title: "❌ Summoning Failed",
        description: "The darkness rejected your offering. Try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Card className="mb-6 border-primary/30">
        <CardContent className="pt-6">
          <div className="text-center">
            <i className="fas fa-user-secret text-4xl text-muted-foreground mb-4"></i>
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">Create Your Dark Identity</h3>
            <p className="text-muted-foreground">You must choose a nickname to enter the shadows...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6 border-primary/30" data-testid="create-post-form">
      <CardHeader>
        <CardTitle className="text-xl font-creepy text-accent">
          <i className="fas fa-pen-nib mr-2"></i>Share Your Dark Tale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Choose your realm..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="dreams">Dreams</SelectItem>
                      <SelectItem value="nightmares">Nightmares</SelectItem>
                      <SelectItem value="occult">Occult</SelectItem>
                      <SelectItem value="urban-legends">Urban Legends</SelectItem>
                      <SelectItem value="dark-poetry">Dark Poetry</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a haunting title..."
                      {...field}
                      className="bg-input border-border"
                      data-testid="input-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us your darkest story..."
                      rows={6}
                      {...field}
                      className="bg-input border-border resize-none"
                      data-testid="textarea-content"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tags: horror, supernatural, ritual..."
                      {...field}
                      value={field.value?.join(", ") || ""}
                      onChange={(e) => field.onChange([e.target.value])}
                      className="bg-input border-border"
                      data-testid="input-tags"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  data-testid="input-image"
                />
                <i className="fas fa-image mr-2 text-accent"></i>
                <span className="text-muted-foreground">Add cursed image</span>
              </label>
              
              <Button
                type="submit"
                className="bg-accent hover:bg-accent/80 text-accent-foreground glitch"
                data-testid="button-submit-post"
              >
                <i className="fas fa-fire mr-2"></i>Summon Post
              </Button>
            </div>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-primary/30"
                  data-testid="image-preview"
                />
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
