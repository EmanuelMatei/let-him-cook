"use server"

import { searchRecipesEdamam } from "@/lib/api/edamam"
import { SearchParams } from "@/lib/api/types"

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function getRecipesAction(params: SearchParams) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        const userId = user?.id || "anonymous-user"

        // Fetch User Preferences if authenticated
        let preferences = null;
        if (user && user.email) {
            // We use email to look up the User first because Prisma User ID might be different if we didn't sync perfectly,
            // but we did sync using user.id in Onboarding. Let's try finding by ID first.
            const dbUser = await prisma.user.findUnique({
                where: { id: user.id },
                include: { preferences: true }
            });
            preferences = dbUser?.preferences;
        }

        // Merge Preferences
        const searchParams: SearchParams = { ...params };

        if (preferences) {
            // Excluded Ingredients
            if (preferences.excludedIngredients.length > 0) {
                // Combine with any existing excluded ingredients from search params (if any)
                const existing = searchParams.excludedIngredients || [];
                searchParams.excludedIngredients = [...existing, ...preferences.excludedIngredients];
            }

            // Diets
            // Edamam only accepts one 'health' param for diet usually via my wrapper (params.diet is string).
            // But my wrapper appends it.
            // If user has multiple diets (e.g. Vegan + Gluten Free), we need to handle that.
            // My wrapper currently takes `diet` as a single string.
            // Wait, standard Edamam `health` param can be repeated.
            // My wrapper `types.ts` defines `diet` as string.
            // I should technically iterate if I want to support multiple.
            // For now, let's pick the first one or prioritize.
            // Actually, let's just create a logical mapping.
            // If the user is "Vegan", apply it.
            // If they are also "Gluten Free", that's usually an intolerance in Edamam terms or another health label.

            // Let's iterate user preferences and append them to a list, but my `searchRecipesEdamam` interface 
            // takes `diet?: string` and `intolerances?: string`. 
            // It seems limited. I should probably expand `edamam.ts` to accept `healthLabels: string[]`.

            // Temporary fix: Append ONLY the first diet found to `diet` param if not already set.
            // And add `excludedIngredients`.
            if (!searchParams.diet && preferences.dietaryRestrictions.length > 0) {
                // Map Onboarding IDs to Edamam Health Labels
                const dietMap: Record<string, string> = {
                    "keto": "keto-friendly",
                    // others match exactly: vegan, vegetarian, paleo, gluten-free
                };

                const userDiet = preferences.dietaryRestrictions[0];
                searchParams.diet = dietMap[userDiet] || userDiet;
            }
        }

        if (preferences) {
            // Preferences applied above
        } else {
            // No preferences to apply
        }

        // (after preference logic, before search)
        // console.log("Calling searchRecipesEdamam with:", searchParams);

        const results = await searchRecipesEdamam(searchParams, userId);
        // Transform for UI if necessary, or pass through
        return results.map(recipe => {
            const nutrients = recipe.nutrition.nutrients;
            const getAmount = (name: string) => Math.round(nutrients.find(n => n.name === name)?.amount || 0);

            return {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                sourceUrl: recipe.sourceUrl,
                ingredientLines: recipe.ingredientLines,
                calories: getAmount("Calories"),
                protein: getAmount("Protein"),
                carbs: getAmount("Carbohydrates"),
                fat: getAmount("Fat"),
            }
        });
    } catch (error) {
        console.error("Action Error:", error);
        return [];
    }
}

export async function getFavoriteRecipes() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // We try to find user by Auth ID
    // We try to find user by Email to get the correct internal Prisma ID
    const dbUser = await prisma.user.findUnique({
        where: { email: user.email! },
        include: { savedRecipes: true }
    });

    return dbUser?.savedRecipes.map((r: { recipeId: string }) => r.recipeId) || []
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function toggleFavoriteAction(recipe: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Must be logged in to save recipes")

    // Ensure User exists in Prisma before linking foreign key
    // This handles cases where user signed up but didn't finish onboarding or sync failed
    // Ensure User exists in Prisma before linking foreign key
    // We upsert by EMAIL to handle ID mismatches (legacy vs new Supabase ID)
    const dbUser = await prisma.user.upsert({
        where: { email: user.email! },
        update: {},
        create: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || "Chef"
        }
    })

    // Check if already saved
    const existing = await prisma.savedRecipe.findUnique({
        where: {
            userId_recipeId: {
                userId: dbUser.id,
                recipeId: recipe.id
            }
        }
    })

    if (existing) {
        // Remove
        await prisma.savedRecipe.delete({
            where: { id: existing.id }
        })
        return { isFavorite: false }
    } else {
        // Add
        // Add
        try {
            await prisma.savedRecipe.create({
                data: {
                    userId: dbUser.id,
                    recipeId: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    sourceUrl: recipe.sourceUrl || "",
                    ingredientLines: recipe.ingredientLines || [],
                    nutrition: {
                        calories: recipe.calories,
                        protein: recipe.protein,
                        carbs: recipe.carbs,
                        fat: recipe.fat
                    }
                }
            })
        } catch (e) {
            console.error("Failed to save full recipe data (likely stale Prisma Client), falling back to basic data", e)
            await prisma.savedRecipe.create({
                data: {
                    userId: dbUser.id,
                    recipeId: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    // Fallback for stale client that doesn't know sourceUrl/ingredientLines yet
                    nutrition: {
                        calories: recipe.calories,
                        protein: recipe.protein,
                        carbs: recipe.carbs,
                        fat: recipe.fat
                    }
                }
            })
        }
        return { isFavorite: true }
    }
}
