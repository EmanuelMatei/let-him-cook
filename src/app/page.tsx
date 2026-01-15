import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white dark:bg-black">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-50">
          Let Him <span className="text-orange-600">Cook</span>
        </h1>

        <p className="mt-3 text-2xl text-zinc-600 dark:text-zinc-400">
          Your AI-powered nutrition assistant.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-8 text-xl rounded-full shadow-lg transition-transform hover:scale-105">
              Start Cooking 👨‍🍳
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <FeatureCard
            title="Smart Macros"
            desc="Find recipes that fit your exact protein and calorie targets."
            icon="📊"
          />
          <FeatureCard
            title="Dietary Filters"
            desc="Vegan, Keto, Gluten-free? We got you covered."
            icon="🥗"
          />
          <FeatureCard
            title="Save Favorites"
            desc="Build your personal cookbook with recipes you love."
            icon="❤️"
          />
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-zinc-500">Powered by Edamam & Supabase</p>
      </footer>
    </div>
  )
}

function FeatureCard({ title, desc, icon }: { title: string, desc: string, icon: string }) {
  return (
    <div className="p-6 border rounded-xl hover:shadow-md transition-shadow dark:border-zinc-800">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-500">{desc}</p>
    </div>
  )
}
