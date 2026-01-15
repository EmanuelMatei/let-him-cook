"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useState, useTransition } from "react"
import { Heart } from "lucide-react"
import { toggleFavoriteAction } from "@/app/actions"
import { cn } from "@/lib/utils"

import { RecipeDetailsDialog } from "./RecipeDetailsDialog"

interface RecipeCardProps {
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

export function RecipeCard(props: RecipeCardProps & { isFavorite?: boolean }) {
    const { title, image, calories, protein, carbs, fat, isFavorite: initialFavorite } = props
    const [isFavorite, setIsFavorite] = useState(initialFavorite)
    const [pageIsPending, startTransition] = useTransition()

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()

        // Optimistic update
        setIsFavorite(!isFavorite)

        startTransition(async () => {
            try {
                await toggleFavoriteAction(props)
            } catch (error) {
                // Revert on error
                setIsFavorite(initialFavorite)
                console.error(error)
            }
        })
    }

    return (
        <Card className="group relative overflow-hidden border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm transition-all hover:scale-105">
            <button
                onClick={handleToggleFavorite}
                className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black transition-colors"
            >
                <Heart className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-zinc-600 dark:text-zinc-300")} />
            </button>

            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <CardHeader>
                <CardTitle className="line-clamp-1 text-lg pr-8">{title}</CardTitle>
                <CardDescription>
                    <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">{Math.round(calories)} kcal</Badge>
                        <div className="flex gap-1 text-xs text-zinc-500 items-center">
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{protein}g P</span>
                            <span>•</span>
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{carbs}g C</span>
                            <span>•</span>
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{fat}g F</span>
                        </div>
                    </div>
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <RecipeDetailsDialog recipe={props}>
                    <Button variant="outline" className="w-full">View Recipe</Button>
                </RecipeDetailsDialog>
            </CardFooter>
        </Card>
    )
}
