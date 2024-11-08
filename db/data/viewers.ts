import { v4 as uuidv4 } from 'uuid';

export const viewers = [
   { 
    id: 1,
    _id: uuidv4(),
    name: "Walt",
    clerkId: "walt@clerkId.com",
    discordId: "123456789",
    discordUsername: "walt#1234",
    color: "#FF5733", // Warm orange
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Walt",
    joinedDate: new Date("2023-01-01"),
    isAdmin: true
  },
  { 
    id: 2,
    _id: uuidv4(),
    name: "Jesse",
    clerkId: "jesse@clerkId.com",
    discordId: "234567890",
    discordUsername: "jesse#5678",
    color: "#33FF57", // Bright green
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jesse",
    joinedDate: new Date("2023-01-02"),
    isAdmin: false
  },
  { 
    id: 3,
    _id: uuidv4(),
    name: "Kieran",
    clerkId: "user_2nfbZyfw3etREo7xr8Hdog6K6ih",
    discordId: "345678901",
    discordUsername: "kieran#9012",
    color: "#3357FF", // Blue
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kieran",
    joinedDate: new Date("2023-01-03"),
    isAdmin: true
  },
  { 
    id: 4,
    _id: uuidv4(),
    name: "Nicole",
    clerkId: "nicole@clerkId.com",
    discordId: "456789012",
    discordUsername: "nicole#3456",
    color: "#FF33F5", // Pink
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nicole",
    joinedDate: new Date("2023-02-01"),
    isAdmin: false
  },
  { 
    id: 5,
    _id: uuidv4(),
    name: "Maggie",
    clerkId: "maggie@clerkId.com",
    discordId: "567890123",
    discordUsername: "maggie#7890",
    color: "#FFD700", // Gold
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maggie",
    joinedDate: new Date("2023-02-15"),
    isAdmin: false
  },
  { 
    id: 6,
    _id: uuidv4(),
    name: "Jonny",
    clerkId: "user_2nnc8MWkBNdElRIci7yw9h7OpLW",
    discordId: "678901234",
    discordUsername: "jonny#4567",
    color: "#E74C3C", // Bright red
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jonny",
    joinedDate: new Date("2023-02-20"),
    isAdmin: false
  },
  { 
    id: 7,
    _id: uuidv4(),
    name: "Mitch",
    clerkId: "mitch@clerkId.com",
    discordId: "789012345",
    discordUsername: "mitch#8901",
    color: "#2ECC71", // Emerald green
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mitch",
    joinedDate: new Date("2023-03-01"),
    isAdmin: false
  },
  { 
    id: 8,
    _id: uuidv4(),
    name: "Mike",
    clerkId: "mike@clerkId.com",
    discordId: "890123456",
    discordUsername: "mike#2345",
    color: "#3498DB", // Ocean blue
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    joinedDate: new Date("2023-03-15"),
    isAdmin: false
  },
  { 
    id: 9,
    _id: uuidv4(),
    name: "Jay",
    clerkId: "jay@clerkId.com",
    discordId: "901234567",
    discordUsername: "jay#6789",
    color: "#9B59B6", // Purple
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jay",
    joinedDate: new Date("2023-04-01"),
    isAdmin: false
  },
  { 
    id: 10,
    _id: uuidv4(),
    name: "Sam",
    clerkId: "sam@clerkId.com",
    discordId: "012345678",
    discordUsername: "sam#0123",
    color: "#F1C40F", // Yellow
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
    joinedDate: new Date("2023-04-15"),
    isAdmin: false
  },
  { 
    id: 11,
    _id: uuidv4(),
      name: "Garrett",
    clerkId: "garet@clerkId.com",
    discordId: "123456780",
    discordUsername: "garrett#4567",
    color: "#1ABC9C", // Turquoise
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Garrett",
    joinedDate: new Date("2023-05-01"),
    isAdmin: false
  },
  { 
    id: 12,
    _id: uuidv4(),
    name: "Glen",
    clerkId: "user_2nXSWm5M7UciAriKqOfUnwRiI2q",
    discordId: "234567801",
    discordUsername: "glen#8901",
    color: "#D35400", // Burnt orange
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Glen",
    joinedDate: new Date("2023-05-15"),
    isAdmin: true
  },
  { 
    id: 13,
    _id: uuidv4(),
    name: "Paddy",
    clerkId: "paddy@clerkId.com",
    discordId: "345678012",
    discordUsername: "paddy#2345",
    color: "#27AE60", // Forest green
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Paddy",
    joinedDate: new Date("2023-06-01"),
    isAdmin: false
  },
  { 
    id: 14,
    _id: uuidv4(),
    name: "Colin",
    clerkId: "colin@clerkId.com",
    discordId: "456780123",
    discordUsername: "colin#6789",
    color: "#2980B9", // Strong blue
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Colin",
    joinedDate: new Date("2023-06-15"),
    isAdmin: false
  },
  { 
    id: 15,
    _id: uuidv4(),
    name: "Kyle",
    clerkId: "kyle@clerkId.com",
    discordId: "567801234",
    discordUsername: "kyle#0123",
    color: "#8E44AD", // Royal purple
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kyle",
    joinedDate: new Date("2023-07-01"),
    isAdmin: false
  },
  { 
    id: 16,
    _id: uuidv4(),
    name: "Soraya",
    clerkId: "soraya@clerkId.com",
    discordId: "678012345",
    discordUsername: "soraya#4567",
    color: "#C0392B", // Deep red
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Soraya",
    joinedDate: new Date("2023-07-15"),
    isAdmin: false
  },
  { 
    id: 17,
    _id: uuidv4(),
    name: "Coob",
    clerkId: "coob@clerkId.com",
    discordId: "789012345",
    discordUsername: "coob#7890",
    color: "#9B59B6", // Purple
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Coob",
    joinedDate: new Date("2023-01-13"),
    isAdmin: false
  },
  {
    id: 18,
    _id: uuidv4(),
    name: "test",
    clerkId: "user_2oB4uhwcaRV85dTK5fYFZchMbKe",
    discordId: "123456789",
    discordUsername: "pro wrestler",
    color: "#FF5733",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
    joinedDate: new Date("2024-10-31"),
    isAdmin: false
    }
] as const;
