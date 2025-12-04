import { Post, User, Comment, Story, Message, Highlight } from '../types';

// Mock Data
const MOCK_USERS: Record<string, User> = {
  'current': {
    id: 'current',
    name: 'Roberto Santos',
    handle: '@robertos',
    avatarUrl: 'https://picsum.photos/seed/me/200/200',
    bio: 'Entusiasta de tecnologia e criador de loops. ♾️\nExplorando o futuro das redes sociais.',
    isPrivate: false,
    following: ['user1', 'user2', 'user4'],
    followers: ['user1', 'user3', 'user5'],
    repostedPostIds: [],
    highlights: [
        { id: 'h1', title: 'Viagens', imageUrl: 'https://picsum.photos/seed/travel/200/200' },
        { id: 'h2', title: 'Tech', imageUrl: 'https://picsum.photos/seed/tech_h/200/200' }
    ]
  },
  'user1': {
    id: 'user1',
    name: 'Ana Silva',
    handle: '@ana.silva',
    avatarUrl: 'https://picsum.photos/seed/ana/200/200',
    bio: 'Fotógrafa e amante de café. ☕\nCapturando momentos.',
    isPrivate: true,
    following: ['current', 'user3'],
    followers: ['current', 'user2'],
    repostedPostIds: [],
    highlights: [
        { id: 'h3', title: 'Cafés', imageUrl: 'https://picsum.photos/seed/coffee/200/200' }
    ]
  },
  'user2': {
    id: 'user2',
    name: 'Tech Insider',
    handle: '@tech_daily',
    avatarUrl: 'https://picsum.photos/seed/tech/200/200',
    bio: 'Notícias de tecnologia diárias.',
    isPrivate: false,
    following: ['user4'],
    followers: ['current', 'user4'],
    repostedPostIds: ['p4'],
    highlights: []
  },
  'user3': {
    id: 'user3',
    name: 'Marcos Viajante',
    handle: '@marcos_trips',
    avatarUrl: 'https://picsum.photos/seed/marcos/200/200',
    bio: 'Viajando o mundo. 🌎',
    isPrivate: false,
    following: ['current'],
    followers: ['user1'],
    repostedPostIds: [],
    highlights: [
         { id: 'h4', title: 'Praias', imageUrl: 'https://picsum.photos/seed/beach/200/200' },
         { id: 'h5', title: 'Serras', imageUrl: 'https://picsum.photos/seed/mountain/200/200' }
    ]
  },
  'user4': {
    id: 'user4',
    name: 'Laura Design',
    handle: '@laura.ux',
    avatarUrl: 'https://picsum.photos/seed/laura/200/200',
    bio: 'UX/UI Designer 🎨\nCriando experiências digitais.',
    isPrivate: false,
    following: ['user2', 'user5'],
    followers: ['current', 'user5'],
    repostedPostIds: [],
    highlights: [
        { id: 'h6', title: 'Projetos', imageUrl: 'https://picsum.photos/seed/design/200/200' }
    ]
  },
  'user5': {
    id: 'user5',
    name: 'Pedro Gamer',
    handle: '@pedro_plays',
    avatarUrl: 'https://picsum.photos/seed/pedro/200/200',
    bio: 'Live toda noite! 🎮\nRPG e FPS.',
    isPrivate: false,
    following: ['user2'],
    followers: ['user4'],
    repostedPostIds: [],
    highlights: []
  },
  'user6': {
    id: 'user6',
    name: 'Sofia Fitness',
    handle: '@sofia.fit',
    avatarUrl: 'https://picsum.photos/seed/sofia/200/200',
    bio: 'Saúde e bem-estar. 💪\nDicas de treino.',
    isPrivate: false,
    following: [],
    followers: [],
    repostedPostIds: [],
    highlights: [
        { id: 'h7', title: 'Treinos', imageUrl: 'https://picsum.photos/seed/gym/200/200' }
    ]
  },
  'user7': {
    id: 'user7',
    name: 'Lucas Chef',
    handle: '@lucas.cozinha',
    avatarUrl: 'https://picsum.photos/seed/lucas/200/200',
    bio: 'Receitas fáceis e deliciosas. 🍳',
    isPrivate: false,
    following: ['user6'],
    followers: ['user3'],
    repostedPostIds: [],
    highlights: []
  }
};

const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'user2',
    content: 'O futuro da IA é agora! 🤖 Acabei de testar o novo modelo Gemini e é incrível como ele entende contexto. #AI #Tech #Loop',
    location: 'Silicon Valley, CA',
    likes: 124,
    reposts: 12,
    comments: [
       { id: 'c10', userId: 'user1', text: 'Estou louca para testar!', timestamp: new Date() }
    ],
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    isLikedByCurrentUser: false,
    isRepostedByCurrentUser: false,
    isSavedByCurrentUser: false,
  },
  {
    id: 'p2',
    userId: 'user3',
    content: 'Nada como um café da manhã com essa vista. ☕🏔️',
    imageUrl: 'https://picsum.photos/seed/mountains/800/600',
    location: 'Swiss Alps',
    taggedUsers: ['user1'],
    likes: 89,
    reposts: 5,
    comments: [
      { id: 'c1', userId: 'user1', text: 'Que lugar lindo!', timestamp: new Date() }
    ],
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    isLikedByCurrentUser: true,
    isRepostedByCurrentUser: false,
    isSavedByCurrentUser: true,
  },
  {
    id: 'p6',
    userId: 'user4',
    content: 'Acabei de finalizar o redesign do meu portfólio. O que acharam das cores? 🎨',
    imageUrl: 'https://picsum.photos/seed/colors/800/600',
    likes: 210,
    reposts: 34,
    comments: [],
    timestamp: new Date(Date.now() - 8000000),
    isLikedByCurrentUser: false,
    isRepostedByCurrentUser: false,
    isSavedByCurrentUser: false
  },
  {
      id: 'p3',
      userId: 'user1',
      content: 'Novo ensaio fotográfico disponível no meu portfólio. Link na bio! 📸',
      imageUrl: 'https://picsum.photos/seed/camera/800/600',
      likes: 45,
      reposts: 2,
      comments: [],
      timestamp: new Date(Date.now() - 10000000),
      isLikedByCurrentUser: false,
      isRepostedByCurrentUser: false,
      isSavedByCurrentUser: false
  },
  {
      id: 'p7',
      userId: 'user7',
      content: 'Bolo de cenoura com chocolate. A receita clássica que nunca falha! 🥕🍫\n\nReceita nos comentários.',
      imageUrl: 'https://picsum.photos/seed/cake/800/600',
      likes: 567,
      reposts: 120,
      comments: [],
      timestamp: new Date(Date.now() - 11000000),
      isLikedByCurrentUser: false,
      isRepostedByCurrentUser: false,
      isSavedByCurrentUser: false
  },
  {
      id: 'p4',
      userId: 'user2',
      content: 'A Apple acabou de anunciar novos produtos. O que acharam?',
      likes: 230,
      reposts: 45,
      comments: [],
      timestamp: new Date(Date.now() - 12000000),
      isLikedByCurrentUser: false,
      isRepostedByCurrentUser: false,
      isSavedByCurrentUser: false
  },
  {
      id: 'p5',
      userId: 'user3',
      content: 'Partiu próxima aventura! ✈️',
      imageUrl: 'https://picsum.photos/seed/plane/800/600',
      likes: 12,
      reposts: 0,
      comments: [],
      timestamp: new Date(Date.now() - 15000000),
      isLikedByCurrentUser: false,
      isRepostedByCurrentUser: false,
      isSavedByCurrentUser: false
  }
];

const INITIAL_STORIES: Story[] = [
    { id: 's1', userId: 'user1', imageUrl: 'https://picsum.photos/seed/story1/300/500', mediaType: 'image', isViewed: false, timestamp: new Date() },
    { id: 's2', userId: 'user2', imageUrl: 'https://picsum.photos/seed/story2/300/500', mediaType: 'image', isViewed: false, timestamp: new Date() },
    { id: 's3', userId: 'user4', imageUrl: 'https://picsum.photos/seed/story3/300/500', mediaType: 'image', isViewed: false, timestamp: new Date() },
    { id: 's4', userId: 'user6', imageUrl: 'https://picsum.photos/seed/story4/300/500', mediaType: 'image', isViewed: false, timestamp: new Date() },
];

const INITIAL_MESSAGES: Message[] = [
    { id: 'm1', senderId: 'user1', receiverId: 'current', text: 'Oi! Vi seu post sobre IA, muito legal!', timestamp: new Date(Date.now() - 86400000) },
    { id: 'm2', senderId: 'current', receiverId: 'user1', text: 'Obrigado Ana! Você devia testar também.', timestamp: new Date(Date.now() - 86000000) },
    { id: 'm3', senderId: 'user4', receiverId: 'current', text: 'Adorei as fotos da viagem!', timestamp: new Date(Date.now() - 40000000) }
];

class LoopDataService {
  private posts: Post[];
  private stories: Story[];
  private users: Record<string, User>;
  private currentUser: User;
  private messages: Message[];

  constructor() {
    this.posts = [...INITIAL_POSTS];
    this.stories = [...INITIAL_STORIES];
    this.users = JSON.parse(JSON.stringify(MOCK_USERS));
    this.currentUser = this.users['current'];
    this.messages = [...INITIAL_MESSAGES];
  }

  // Called when a NEW user registers
  createNewUser(name: string, handle: string) {
      const newId = `user_${Date.now()}`;
      const newUser: User = {
          id: newId,
          name: name,
          handle: handle,
          avatarUrl: 'https://picsum.photos/seed/new_user/200/200',
          bio: '',
          isPrivate: false,
          following: [],
          followers: [],
          repostedPostIds: [],
          highlights: []
      };
      
      this.users[newId] = newUser;
      this.currentUser = newUser;
      this.messages = []; 
      return newUser;
  }

  // --- Getters ---
  getCurrentUser(): User {
    return this.currentUser;
  }

  getUserById(id: string): User | undefined {
    return this.users[id];
  }

  getAllUsers(): User[] {
    return Object.values(this.users).filter(u => u.id !== this.currentUser.id);
  }

  getAllPosts(): Post[] {
    return [...this.posts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getExplorePosts(): Post[] {
      return [...this.posts]
        .filter(p => p.userId !== this.currentUser.id)
        .sort(() => Math.random() - 0.5);
  }

  getSavedPosts(): Post[] {
    return this.posts.filter(p => p.isSavedByCurrentUser);
  }

  getLikedPosts(): Post[] {
      return this.posts.filter(p => p.isLikedByCurrentUser);
  }

  getPostsByUser(userId: string): Post[] {
      // Returns posts AUTHORED by the user
      return this.posts.filter(p => p.userId === userId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getRepostsByUser(userId: string): Post[] {
      // Returns posts reposted by the specified user
      const user = this.users[userId];
      if (!user) return [];
      
      // Filter posts that are in the user's reposted list
      return this.posts
        .filter(p => user.repostedPostIds.includes(p.id))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getAllStories(): Story[] {
    return [...this.stories].sort((a, b) => {
        if (a.userId === this.currentUser.id) return -1;
        if (b.userId === this.currentUser.id) return 1;
        return Number(a.isViewed) - Number(b.isViewed);
    });
  }
  
  getStoriesByUser(userId: string): Story[] {
      return this.stories.filter(s => s.userId === userId);
  }

  getMessagesForChat(userId: string): Message[] {
      return this.messages.filter(m => 
        (m.senderId === this.currentUser.id && m.receiverId === userId) ||
        (m.senderId === userId && m.receiverId === this.currentUser.id)
      ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // --- Actions ---
  createPost(content: string, imageUrl?: string, location?: string, taggedUsers?: string[]): Post {
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      userId: this.currentUser.id,
      content,
      imageUrl,
      location,
      taggedUsers,
      likes: 0,
      reposts: 0,
      comments: [],
      timestamp: new Date(),
      isLikedByCurrentUser: false,
      isRepostedByCurrentUser: false,
      isSavedByCurrentUser: false
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  createStory(mediaUrl: string, mediaType: 'image' | 'video'): Story {
    const newStory: Story = {
        id: Math.random().toString(36).substr(2, 9),
        userId: this.currentUser.id,
        imageUrl: mediaUrl,
        mediaType: mediaType,
        isViewed: false,
        timestamp: new Date()
    };
    // If user already has stories, just add it. The sort will handle order.
    this.stories.unshift(newStory);
    return newStory;
  }

  toggleLike(postId: string): Post | null {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return null;

    const post = this.posts[postIndex];
    const isLiked = post.isLikedByCurrentUser;

    const updatedPost = {
      ...post,
      likes: isLiked ? post.likes - 1 : post.likes + 1,
      isLikedByCurrentUser: !isLiked
    };

    this.posts[postIndex] = updatedPost;
    return updatedPost;
  }

  toggleRepost(postId: string): Post | null {
      const postIndex = this.posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return null;

      const post = this.posts[postIndex];
      const isReposted = post.isRepostedByCurrentUser;

      // Update Post Object
      const updatedPost = {
          ...post,
          reposts: isReposted ? post.reposts - 1 : post.reposts + 1,
          isRepostedByCurrentUser: !isReposted
      };
      this.posts[postIndex] = updatedPost;

      // Update Current User's Repost List
      if (!isReposted) {
          // Add to reposts
          if (!this.currentUser.repostedPostIds.includes(postId)) {
              this.currentUser.repostedPostIds.push(postId);
          }
      } else {
          // Remove from reposts
          this.currentUser.repostedPostIds = this.currentUser.repostedPostIds.filter(id => id !== postId);
      }
      
      // Update user in storage
      this.users[this.currentUser.id] = this.currentUser;

      return updatedPost;
  }

  toggleSave(postId: string): Post | null {
      const postIndex = this.posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return null;

      const updatedPost = {
          ...this.posts[postIndex],
          isSavedByCurrentUser: !this.posts[postIndex].isSavedByCurrentUser
      };
      this.posts[postIndex] = updatedPost;
      return updatedPost;
  }

  addComment(postId: string, text: string): Comment | null {
      const postIndex = this.posts.findIndex(p => p.id === postId);
      if (postIndex === -1) return null;

      const newComment: Comment = {
          id: Math.random().toString(36).substr(2, 9),
          userId: this.currentUser.id,
          text,
          timestamp: new Date()
      };

      const updatedPost = {
          ...this.posts[postIndex],
          comments: [...this.posts[postIndex].comments, newComment]
      };
      this.posts[postIndex] = updatedPost;
      return newComment;
  }

  updateProfile(updates: Partial<User>) {
      if (updates.handle && !updates.handle.startsWith('@')) {
          updates.handle = `@${updates.handle}`;
      }
      this.currentUser = { ...this.currentUser, ...updates };
      this.users[this.currentUser.id] = this.currentUser;
      return this.currentUser;
  }

  addHighlight(title: string, imageUrl: string) {
      const newHighlight: Highlight = {
          id: Math.random().toString(36).substr(2, 9),
          title,
          imageUrl
      };
      this.currentUser.highlights.push(newHighlight);
      this.users[this.currentUser.id] = this.currentUser;
      return this.currentUser.highlights;
  }

  toggleFollow(targetUserId: string) {
      const isFollowing = this.currentUser.following.includes(targetUserId);
      const targetUser = this.users[targetUserId];

      if (!targetUser) return;

      if (isFollowing) {
          this.currentUser.following = this.currentUser.following.filter(id => id !== targetUserId);
          targetUser.followers = targetUser.followers.filter(id => id !== this.currentUser.id);
      } else {
          this.currentUser.following.push(targetUserId);
          targetUser.followers.push(this.currentUser.id);
      }
      
      this.users[this.currentUser.id] = this.currentUser;
      this.users[targetUserId] = targetUser;
  }

  isFollowing(userId: string): boolean {
      return this.currentUser.following.includes(userId);
  }

  sendMessage(receiverId: string, text: string): Message {
      const newMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          senderId: this.currentUser.id,
          receiverId,
          text,
          timestamp: new Date()
      };
      this.messages.push(newMessage);
      return newMessage;
  }
}

export const loopService = new LoopDataService();