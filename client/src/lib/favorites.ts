// Favorites management using localStorage
export interface FavoriteExercise {
  id: string;
  title: string;
  duration: number;
  instructor: string;
  backgroundImage: string;
  addedAt: string;
}

export const favoritesManager = {
  // Get all favorites
  getFavorites(): FavoriteExercise[] {
    try {
      const stored = localStorage.getItem('favoriteExercises');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  // Check if exercise is favorited
  isFavorite(exerciseId: string): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === exerciseId);
  },

  // Add exercise to favorites
  addFavorite(exercise: Omit<FavoriteExercise, 'addedAt'>): void {
    const favorites = this.getFavorites();
    const newFavorite: FavoriteExercise = {
      ...exercise,
      addedAt: new Date().toISOString()
    };
    
    // Avoid duplicates
    if (!this.isFavorite(exercise.id)) {
      favorites.push(newFavorite);
      localStorage.setItem('favoriteExercises', JSON.stringify(favorites));
    }
  },

  // Remove exercise from favorites
  removeFavorite(exerciseId: string): void {
    const favorites = this.getFavorites();
    const filtered = favorites.filter(fav => fav.id !== exerciseId);
    localStorage.setItem('favoriteExercises', JSON.stringify(filtered));
  },

  // Toggle favorite status
  toggleFavorite(exercise: Omit<FavoriteExercise, 'addedAt'>): boolean {
    if (this.isFavorite(exercise.id)) {
      this.removeFavorite(exercise.id);
      return false;
    } else {
      this.addFavorite(exercise);
      return true;
    }
  }
};