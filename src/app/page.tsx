import { HomeFeed } from "@/components/home-feed";

export default function Home() {
  return (
    <main className="brick-workshop relative min-h-dvh w-full md:flex md:items-center md:justify-center md:px-6 md:py-5">
      <div className="phone-frame relative h-dvh w-full overflow-hidden bg-black md:h-[min(100dvh-2.5rem,860px)] md:w-[min(100%,430px)]">
        <HomeFeed />
      </div>
    </main>
  );
}
