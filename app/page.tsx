
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div className="grid-background"></div>

      <main className="flex-1 container">
        <Header />
      </main>

      <div className="p-3 text-center bg-gray-800 sm:p-8">
        Helping you land the job you deserve.
      </div>
    </div>
  );
}
