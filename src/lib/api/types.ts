export interface SpoonacularRecipe {
    id: number | string;
    title: string;
    image: string;
    sourceUrl: string;
    ingredientLines: string[];
    nutrition: {
        nutrients: {
            name: string;
            amount: number;
            unit: string;
        }[];
    };
}

export interface SearchParams {
    query?: string;
    minCalories?: number;
    maxCalories?: number;
    minProtein?: number;
    maxProtein?: number;
    minCarbs?: number;
    maxCarbs?: number;
    minFat?: number;
    maxFat?: number;
    diet?: string; // e.g. "vegan"
    intolerances?: string; // e.g. "peanut"
    excludedIngredients?: string[]; // e.g. ["cilantro", "shellfish"]
    number?: number;
}
