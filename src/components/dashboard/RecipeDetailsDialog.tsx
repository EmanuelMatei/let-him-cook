"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { AdBanner } from "@/components/ads/AdBanner"

export interface RecipeDetails {
    id: string | number
    title: string
    image: string
    sourceUrl: string
    ingredientLines: string[]
    calories: number
    protein: number
    carbs: number
    fat: number
}

interface RecipeDetailsDialogProps {
    recipe: RecipeDetails
    children: React.ReactNode
}

export function RecipeDetailsDialog({ recipe, children }: RecipeDetailsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl  line-clamp-1">{recipe.title}</DialogTitle>
                    <DialogDescription>
                        {Math.round(recipe.calories)} kcal • {recipe.protein}g Protein • {recipe.carbs}g Carbs • {recipe.fat}g Fat
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-auto">
                    <div className="relative w-full h-64 mb-4 rounded-md overflow-hidden">
                        <Image
                            src={recipe.image}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Ingredients</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                                {recipe.ingredientLines.map((line, i) => (
                                    <li key={i}>{line}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-6">
                    <AdBanner slot="recipe-modal-bottom" format="rectangle" className="w-full h-[250px] mx-auto rounded-lg" />
                </div>


                <div className="pt-4 mt-auto border-t">
                    <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                        <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                            View Full Instructions <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog >
    )
}
