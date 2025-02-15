import AiComponent from "@/components/ai-component";
import Navbar from "@/components/nav";
import { Showcase } from "@/components/showcase";

export default async function Page() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col">
        <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex-1 mb-12">
            <h1 className="text-4xl font-mono mb-4">Welcome to Nuevette.ai</h1>
            <p className="text-lg mb-8">
              Experience the power of AI-driven solutions.
            </p>
            <AiComponent />
          </div>
          <div className="w-full">
            <Showcase />
          </div>
        </main>
      </div>
    </>
  );
}
