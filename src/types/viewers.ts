export interface Rating {
  id: number;
  _id: string;
  movieId: number;
  viewerId: number;
  score: number;
  movieTitle: string;
  date: Date | null;
  clerkId: string;
  year?: string;
  runtime?: string;
  poster?: string;
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
  pickedList: {
    id: number;
    _id: string;
    title: string;
    date: Date | null;
    poster: string | null;
  }[];
}

export interface ViewerResponse {
  viewer: {
    id: number;
    _id: string;
    name: string;
    clerkId: string;
    discordId?: string;
    discordUsername?: string;
    color: string;
    avatar?: string;
    isAdmin: boolean;
    bio?: string;
    ratings: any[];
    pickedList: any[];
    isCurrentViewer: boolean;
  } | null;
  isAdmin: boolean;
  error: string | null;
}