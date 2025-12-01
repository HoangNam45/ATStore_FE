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
    id: 2,
    name: "BanG Dream! Girls Band Party!",
    slug: "bandori",
    image: "/images/games/bangdgbp.jfif",
    servers: ["JP"],
  },
  {
    id: 3,
    name: "Uma Musume Pretty Derby",
    slug: "uma-musume",
    image: "/images/games/uma.jfif",
    servers: ["JP", "Global"],
  },
  {
    id: 4,
    name: "Cookie Run: Kingdom",
    slug: "cookie-run-kingdom",
    image: "/images/games/cookie-run.jfif",
    servers: [],
  },
  {
    id: 5,
    name: "D4DJ Groovy Mix",
    slug: "d4dj",
    image: "/images/games/d4dj.jfif",
    servers: ["JP"],
  },
  {
    id: 6,
    name: "Love and Deepspace",
    slug: "love-and-deepspace",
    image: "/images/games/lads.jfif",
    servers: ["American", "Asian", "Random Server"],
  },
  {
    id: 7,
    name: "NIKKE: The Goddess of Victory",
    slug: "nikke",
    image: "/images/games/Nikke.jfif",
    servers: ["JP", "Global"],
  },
  {
    id: 8,
    name: "Blue Archive",
    slug: "blue-archive",
    image: "/images/games/blue-archive.jfif",
    servers: ["JP", "Global"],
  },
];
