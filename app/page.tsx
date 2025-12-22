import GameCard from "@/components/GameCard";
import { games } from "@/data/games";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-12">
        <div className="mb-6 text-center sm:mb-12">
          {/* <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
            AT Store
          </h1> */}
          {/* <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Chọn game bạn muốn mua account
          </p> */}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <GameCard
              key={game.id}
              name={game.name}
              slug={game.slug}
              image={game.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
