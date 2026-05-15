import GameContainer from "@/app/components/GameContainer"


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold">Hello World</h1>
      <GameContainer />
    </div>
  );
}
