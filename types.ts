export interface Highlight {
  id: string;
  title: string;
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  bio?: string;
  isPrivate: boolean;
  following: string[]; // Array of User IDs
  followers: string[]; // Array of User IDs
  repostedPostIds: string[]; // Array of Post IDs that this user has reposted
  highlights: Highlight[];
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: Date;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  imageUrl?: string;
  location?: string;
  taggedUsers?: string[]; // IDs of tagged users
  likes: number;
  reposts: number;
  comments: Comment[];
  timestamp: Date;
  isLikedByCurrentUser: boolean;
  isRepostedByCurrentUser: boolean;
  isSavedByCurrentUser: boolean;
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string; // Used for both Image URL and Video URL
  mediaType: 'image' | 'video';
  isViewed: boolean;
  timestamp: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
}

export enum NavigationTab {
  HOME = 'HOME',
  EXPLORE = 'EXPLORE',
  NOTIFICATIONS = 'NOTIFICATIONS',
  MESSAGES = 'MESSAGES',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS'
}