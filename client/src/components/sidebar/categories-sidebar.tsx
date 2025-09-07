import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoriesSidebarProps {
  categories: { id: Category; name: string; icon: string }[];
  selectedCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
}

export function CategoriesSidebar({ categories, selectedCategory, onCategoryChange }: CategoriesSidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border hidden lg:block" data-testid="categories-sidebar">
      <div className="p-4">
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="text-lg font-creepy text-accent">
              <i className="fas fa-fire mr-2"></i>Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={selectedCategory === "all" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onCategoryChange("all")}
              data-testid="category-all"
            >
              <i className="fas fa-globe mr-3 text-accent"></i>
              All Posts
            </Button>
            
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onCategoryChange(category.id)}
                data-testid={`category-${category.id}`}
              >
                <i className={`${category.icon} mr-3 text-accent`}></i>
                {category.name}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/30 mt-6">
          <CardHeader>
            <CardTitle className="text-lg font-creepy text-accent">
              <i className="fas fa-tags mr-2"></i>Popular Tags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["horror", "ritual", "nightmare", "supernatural", "cursed"].map((tag) => (
              <Button
                key={tag}
                variant="outline"
                size="sm"
                className="mr-2 mb-2"
                data-testid={`tag-${tag}`}
              >
                #{tag}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
