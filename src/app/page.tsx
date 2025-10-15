import Gallery from "@/components/gallery";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="container mx-auto h-dvh px-4">
      <main className="py-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Explore Gallery</h1>
          <ModeToggle />
        </div>
        <Gallery />
      </main>
    </div>
  );
}
