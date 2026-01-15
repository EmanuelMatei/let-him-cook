"use client"

import * as React from "react"
import { MacroCalculator, MacroTargets } from "@/components/dashboard/MacroCalculator"
import { RecipeCard } from "@/components/dashboard/RecipeCard"
import { AdBanner } from "@/components/ads/AdBanner"
import { getRecipesAction, getFavoriteRecipes } from "@/app/actions"

interface Recipe {
    id: number | string
    title: string
    image: string
    sourceUrl: string
    ingredientLines: string[]
    calories: number
    protein: number
    carbs: number
    fat: number
}

export default function DashboardPage() {
    const [recipes, setRecipes] = React.useState<Recipe[]>([])
    const [favorites, setFavorites] = React.useState<string[]>([])
    const [loading, setLoading] = React.useState(true) // Start loading true for auto-search

    // Initial load for favorites
    React.useEffect(() => {
        getFavoriteRecipes()
            .then(ids => setFavorites(ids))
            .catch(err => console.error("Failed to load favorites", err))
    }, [])

    // Auto-search on mount
    React.useEffect(() => {
        // Default targets to match initial slider values
        handleSearch({
            calories: { min: 300, max: 800 },
            protein: { min: 15, max: 50 },
            carbs: { min: 20, max: 80 },
            fat: { min: 10, max: 40 }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSearch = async (targets: MacroTargets) => {
        setLoading(true)
        try {
            // Pass explicit ranges from the new UI sliders
            const results = await getRecipesAction({
                minCalories: targets.calories.min,
                maxCalories: targets.calories.max,
                minProtein: targets.protein.min,
                maxProtein: targets.protein.max,
                minCarbs: targets.carbs.min,
                maxCarbs: targets.carbs.max,
                minFat: targets.fat.min,
                maxFat: targets.fat.max,
                number: 9
            })
            if (results.length > 0) {
                setRecipes(results)
            } else {
                setRecipes([])
            }
        } catch (e) {
            console.error(e)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            alert(`Search failed: ${(e as any).message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-8 lg:grid-cols-[350px_1fr]">
            {/* Left Column: Calculator */}
            <aside className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2">Macro Calculator</h2>
                    <p className="text-zinc-500 text-sm mb-4">Adjust your targets to find the perfect meal.</p>
                </div>
                <MacroCalculator onSearch={handleSearch} isLoading={loading} />
            </aside>

            {/* Right Column: Recipe Grid */}
            <main>
                <AdBanner slot="dashboard-top" className="mb-8 w-full h-[90px] rounded-lg" format="horizontal" />

                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                        {loading ? "Finding the best matches..." : "Recommended for You"}
                    </h2>
                </div>

                {loading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-video w-full rounded-xl bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                {...recipe}
                                isFavorite={favorites.includes(String(recipe.id))}
                            />
                        ))}

                        {recipes.length === 0 && (
                            <div className="col-span-full py-12 text-center text-zinc-500">
                                No recipes found matching these strict macros. Try widening the range.
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
