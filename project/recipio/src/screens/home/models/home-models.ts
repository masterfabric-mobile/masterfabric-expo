export interface RecipeCard {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  time: string;
  difficulty: string;
}

export interface ActivityItem {
  id: string;
  type: 'saved' | 'finished';
  recipeId: number;
  recipeTitle: string;
  recipeImageUrl?: string;
  timeAgo: string;
}

export interface CurrentPlan {
  name: string;
  isActive: boolean;
  recipesSaved: number;
  recipesLimit: number;
}
