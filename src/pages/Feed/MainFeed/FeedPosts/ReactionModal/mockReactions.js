// mockReactions.js
const reactionTypes = [
  "Like",
  "Celebrate",
  "Support",
  "Love",
  "Insightful",
  "Funny",
];
const sampleAuthors = [
  {
    id: "user_001",
    name: "Sarah Johnson",
    bio: "Senior Software Engineer @ TechCorp",
    picture: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: "user_002",
    name: "Michael Chen",
    bio: "Product Manager @ StartUpHub",
    picture: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: "user_003",
    name: "Emma Williams",
    bio: "UX Designer @ DesignStudio",
    picture: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    id: "user_004",
    name: "David Smith",
    bio: "CTO @ InnovationInc",
    picture: "https://randomuser.me/api/portraits/men/2.jpg",
  },
];

const generateMockReactions = (count = 25) => {
  return Array.from({ length: count }, (_, i) => ({
    likeId: `react_${String(i + 1).padStart(3, "0")}`,
    authorId: sampleAuthors[i % sampleAuthors.length].id,
    authorName: sampleAuthors[i % sampleAuthors.length].name,
    authorPicture: sampleAuthors[i % sampleAuthors.length].picture,
    authorBio: sampleAuthors[i % sampleAuthors.length].bio,
    type: reactionTypes[Math.floor(Math.random() * reactionTypes.length)],
  }));
};

export const mockReactionsData = generateMockReactions(25); // 25 reactions
