import { getFavoriteRecipes } from "@/app/actions"
import { prisma } from "@/lib/prisma"
import { RecipeCard } from "@/components/dashboard/RecipeCard"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// We need to fetch full recipe details for favorites.
// Our `getFavoriteRecipes` currently returns just IDs (string[]).
// We should update it or create a new internal function to get full objects.
// Or, we can just query Prisma directly here since it's a Server Component.

export default async function FavoritesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const savedRecipes = await prisma.savedRecipe.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
    })

    // Transform Prisma model to Recipe interface expected by card
    // Note: SavedRecipe stores nutrition as Json, we need to cast it.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recipes = savedRecipes.map((r: any) => ({
        id: r.recipeId, // The original API ID
        title: r.title,
        image: r.image,
        // Now we store them!
        sourceUrl: r.sourceUrl || "",
        ingredientLines: r.ingredientLines || [],
        calories: r.nutrition.calories || 0,
        protein: r.nutrition.protein || 0,
        carbs: r.nutrition.carbs || 0,
        fat: r.nutrition.fat || 0,
    }))

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">My Favorites</h2>
                <p className="text-zinc-500">Your collection of loved recipes.</p>
            </div>

            {recipes.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-zinc-500 mb-4">You haven't saved any recipes yet.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.id}
                            {...recipe}
                            isFavorite={true}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
