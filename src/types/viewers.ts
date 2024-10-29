export interface Rating {
  id: number;
  _id: string;
  movieId: number;
  viewerId: number;
  score: number;
  movieTitle: string;
  date: Date | null;
  clerkId: string;
}

export interface Viewer {
  id: number;
  _id: string;
  name: string;
  clerkId: string | null;
  discordId?: string;
  discordUsername?: string;
  color: string;
  avatar?: string;
  isAdmin: boolean;
  bio?: string;
  ratings: Rating[];
}

export interface ViewerResponse {
  data: {
    data: Viewer;
    error: null;
  } | {
    data: null;
    error: string;
  }
}