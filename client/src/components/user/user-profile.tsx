import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, insertUserSchema, InsertUser } from "@/lib/types";
import { storage } from "@/lib/storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  user: User | null;
  onUserChange: () => void;
}

const RANDOM_AVATARS = [
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
  "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
  "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40",
  "https://pixabay.com/get/ge235452c088bf8128eefb2ed27b27e72e0d1d071c5bc240a79230855da226b5856619b9534d3e44c3f24f7284bb19a1f786f564ea16e47cb1d9ff1b9fa0a22c9_1280.jpg",
  "https://pixabay.com/get/gfe46bf86baa722da13078a9f2c0dbaaa5ad61a1916e8b3075542be0304c09db8c6d949856f6728bc36c03c00e555ddc4e101deca71288ac54400f3c89dbe7a06_1280.jpg",
];

export function UserProfile({ user, onUserChange }: UserProfileProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      nickname: user?.nickname || "",
      avatar: user?.avatar || "",
    },
  });

  const onSubmit = (data: InsertUser) => {
    try {
      const newUser: User = {
        ...data,
        id: user?.id || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        avatar: selectedAvatar || data.avatar || RANDOM_AVATARS[Math.floor(Math.random() * RANDOM_AVATARS.length)],
        createdAt: user?.createdAt || new Date().toISOString(),
      };

      storage.setUser(newUser);
      onUserChange();
      setIsOpen(false);
      
      toast({
        title: "👤 Profile Updated",
        description: user ? "Your dark identity has been altered." : "Welcome to the shadows...",
      });
    } catch (error) {
      toast({
        title: "❌ Profile Update Failed",
        description: "The shadows rejected your identity. Try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedAvatar(result);
        form.setValue("avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRandomAvatar = () => {
    const randomAvatar = RANDOM_AVATARS[Math.floor(Math.random() * RANDOM_AVATARS.length)];
    setSelectedAvatar(randomAvatar);
    form.setValue("avatar", randomAvatar);
  };

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="bg-accent hover:bg-accent/80 text-accent-foreground glitch"
            data-testid="button-create-profile"
          >
            <i className="fas fa-user-plus mr-2"></i>
            <span className="hidden sm:inline">Enter the Shadows</span>
            <span className="sm:hidden">Join</span>
          </Button>
        </DialogTrigger>
        <DialogContent data-testid="profile-modal">
          <DialogHeader>
            <DialogTitle className="font-creepy text-accent">
              <i className="fas fa-mask mr-2"></i>Create Your Dark Identity
            </DialogTitle>
          </DialogHeader>
          <ProfileForm
            form={form}
            selectedAvatar={selectedAvatar}
            onSubmit={onSubmit}
            onImageUpload={handleImageUpload}
            onRandomAvatar={getRandomAvatar}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center space-x-2 bg-muted rounded-lg px-3 py-2 cursor-pointer hover:bg-muted/80 transition-colors" data-testid="user-profile">
          <img
            src={user.avatar || RANDOM_AVATARS[0]}
            alt="User avatar"
            className="w-8 h-8 rounded-full border border-accent"
            data-testid="user-avatar"
          />
          <span className="text-sm text-muted-foreground hidden sm:inline" data-testid="user-nickname">
            {user.nickname}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent data-testid="profile-modal">
        <DialogHeader>
          <DialogTitle className="font-creepy text-accent">
            <i className="fas fa-user-edit mr-2"></i>Edit Your Dark Identity
          </DialogTitle>
        </DialogHeader>
        <ProfileForm
          form={form}
          selectedAvatar={selectedAvatar}
          onSubmit={onSubmit}
          onImageUpload={handleImageUpload}
          onRandomAvatar={getRandomAvatar}
        />
      </DialogContent>
    </Dialog>
  );
}

interface ProfileFormProps {
  form: any;
  selectedAvatar: string;
  onSubmit: (data: InsertUser) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRandomAvatar: () => void;
}

function ProfileForm({ form, selectedAvatar, onSubmit, onImageUpload, onRandomAvatar }: ProfileFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shadow Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your alias in the darkness..."
                  {...field}
                  className="bg-input border-border"
                  data-testid="input-nickname"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormLabel>Avatar</FormLabel>
          
          {/* Avatar Preview */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full border border-accent overflow-hidden bg-muted flex items-center justify-center">
              {selectedAvatar || form.watch("avatar") ? (
                <img
                  src={selectedAvatar || form.watch("avatar")}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                  data-testid="avatar-preview"
                />
              ) : (
                <i className="fas fa-user text-muted-foreground text-xl"></i>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              {/* Upload Image */}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageUpload}
                  className="hidden"
                  data-testid="input-avatar-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  as="span"
                  data-testid="button-upload-avatar"
                >
                  <i className="fas fa-upload mr-2"></i>Upload Image
                </Button>
              </label>
              
              {/* Random Avatar */}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onRandomAvatar}
                className="w-full"
                data-testid="button-random-avatar"
              >
                <i className="fas fa-dice mr-2"></i>Random Cursed Avatar
              </Button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-accent hover:bg-accent/80 text-accent-foreground glitch"
          data-testid="button-save-profile"
        >
          <i className="fas fa-save mr-2"></i>Save Identity
        </Button>
      </form>
    </Form>
  );
}
