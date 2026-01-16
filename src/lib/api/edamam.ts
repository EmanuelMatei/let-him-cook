import { SearchParams, SpoonacularRecipe } from "./types";

const APP_ID = process.env.EDAMAM_APP_ID;
const APP_KEY = process.env.EDAMAM_APP_KEY;
const BASE_URL = "https://api.edamam.com/api/recipes/v2";

export async function searchRecipesEdamam(params: SearchParams, userId: string = "let-him-cook-user"): Promise<SpoonacularRecipe[]> {
    if (!APP_ID || !APP_KEY) {
        console.warn("EDAMAM_APP_ID or EDAMAM_APP_KEY is not set.");
        return [];
    }

    const url = new URL(BASE_URL);
    url.searchParams.append("type", "public");
    url.searchParams.append("app_id", APP_ID);
    url.searchParams.append("app_key", APP_KEY);

    if (params.query) url.searchParams.append("q", params.query);

    // Calories: min-max
    if (params.minCalories || params.maxCalories) {
        const min = params.minCalories || 0;
        const max = params.maxCalories || 5000;
        url.searchParams.append("calories", `${min}-${max}`);
    }

    // Nutrients: Edamam uses specific codes. 
    if (params.minProtein || params.maxProtein) {
        const min = params.minProtein || 0;
        const max = params.maxProtein ? params.maxProtein : "+";
        url.searchParams.append("nutrients[PROCNT]", `${min}-${max}`);
    }

    if (params.minCarbs || params.maxCarbs) {
        const min = params.minCarbs || 0;
        const max = params.maxCarbs ? params.maxCarbs : "+";
        url.searchParams.append("nutrients[CHOCDF]", `${min}-${max}`);
    }

    if (params.minFat || params.maxFat) {
        const min = params.minFat || 0;
        const max = params.maxFat ? params.maxFat : "+";
        url.searchParams.append("nutrients[FAT]", `${min}-${max}`);
    }

    if (params.diet) {
        url.searchParams.append("health", params.diet);
    }

    if (params.intolerances) {
        url.searchParams.append("health", `${params.intolerances}-free`);
    }

    if (params.excludedIngredients && params.excludedIngredients.length > 0) {
        params.excludedIngredients.forEach(ingredient => {
            url.searchParams.append("excluded", ingredient);
        });
    }

    try {
        // "This app requires userID" fix: Use distinct user ID for tracking
        // Edamam requires alphanumeric User ID, so we strip dashes from UUID
        // We also truncate because Edamam seems to have a length limit (e.g. 30 chars causes 401)
        const sanitizedUserId = userId.replace(/[^a-zA-Z0-9]/g, "").substring(0, 20);

        const headers = {
            "Edamam-Account-User": sanitizedUserId
        };

        // Log the full URL (masking sensitive keys for security)
        const debugUrl = url.toString().replace(APP_ID, "***").replace(APP_KEY, "***");
        console.log("Fetching Edamam URL:", debugUrl);

        const response = await fetch(url.toString(), { headers });
        if (!response.ok) {
            if (response.status === 429) {
                console.error("Edamam Rate Limit Exceeded");
                throw new Error("Rate limit exceeded. Please wait a minute before searching again.");
            }
            throw new Error(`Edamam API Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.hits.map((hit: any) => {
            const r = hit.recipe;
            return {
                id: r.uri,
                title: r.label,
                image: r.images.REGULAR?.url || r.image,
                sourceUrl: r.url,
                ingredientLines: r.ingredientLines,
                nutrition: {
                    nutrients: [
                        // Safe access with defaults in case totalNutrients is missing some fields
                        { name: "Calories", amount: r.calories / r.yield, unit: "kcal" },
                        { name: "Protein", amount: r.totalNutrients.PROCNT?.quantity / r.yield || 0, unit: "g" },
                        { name: "Carbohydrates", amount: r.totalNutrients.CHOCDF?.quantity / r.yield || 0, unit: "g" },
                        { name: "Fat", amount: r.totalNutrients.FAT?.quantity / r.yield || 0, unit: "g" },
                    ]
                }
            };
        });

    } catch (error) {
        console.error("Failed to fetch recipes from Edamam:", error);
        return [];
    }
}
