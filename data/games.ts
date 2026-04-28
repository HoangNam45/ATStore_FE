export interface Game {
  id: number;
  name: string;
  slug: string;
  image: string;
  servers?: string[];
}

export const games: Game[] = [
  {
    id: 1,
    name: "Project Sekai Colorful Stage Ft. Hatsune Miku",
    slug: "project-sekai",
    image: "/images/games/pjsk.jfif",
    servers: ["JP", "Global"],
  },
  {
    id: 3,
    name: "Uma Musume Pretty Derby",
    slug: "uma-musume",
    image: "/images/games/uma.jfif",
    servers: ["JP", "Global"],
  },
  {
    id: 6,
    name: "Love and Deepspace",
    slug: "love-and-deepspace",
    image: "/images/games/lads.jfif",
    servers: ["American", "Asian", "Random Server"],
  },
  {
    id: 8,
    name: "Blue Archive",
    slug: "blue-archive",
    image: "/images/games/blue-archive.jfif",
    servers: ["JP", "Global"],
  },
];
