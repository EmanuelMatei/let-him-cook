import { SearchParams, SpoonacularRecipe } from "./types";

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com/recipes/complexSearch";

export async function searchRecipes(params: SearchParams): Promise<SpoonacularRecipe[]> {
    if (!API_KEY) {
        console.warn("SPOONACULAR_API_KEY is not set.");
        // Return mock data for development if no key is present
        return [];
    }

    const url = new URL(BASE_URL);
    url.searchParams.append("apiKey", API_KEY);
    url.searchParams.append("addRecipeNutrition", "true");
    url.searchParams.append("number", (params.number || 12).toString());

    if (params.query) url.searchParams.append("query", params.query);
    if (params.minCalories) url.searchParams.append("minCalories", params.minCalories.toString());
    if (params.maxCalories) url.searchParams.append("maxCalories", params.maxCalories.toString());
    if (params.minProtein) url.searchParams.append("minProtein", params.minProtein.toString());
    if (params.maxProtein) url.searchParams.append("maxProtein", params.maxProtein.toString());
    // Add other macros only if specified (Spoonacular supports minCarbs, maxCarbs, etc.)
    if (params.minCarbs) url.searchParams.append("minCarbs", params.minCarbs.toString());
    if (params.maxCarbs) url.searchParams.append("maxCarbs", params.maxCarbs.toString());
    if (params.minFat) url.searchParams.append("minFat", params.minFat.toString());
    if (params.maxFat) url.searchParams.append("maxFat", params.maxFat.toString());

    if (params.diet) url.searchParams.append("diet", params.diet);
    if (params.intolerances) url.searchParams.append("intolerances", params.intolerances);

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`Spoonacular API Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error("Failed to fetch recipes:", error);
        return [];
    }
}
