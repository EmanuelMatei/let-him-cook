"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export interface MacroTargets {
    calories: { min: number, max: number }
    protein: { min: number, max: number }
    carbs: { min: number, max: number }
    fat: { min: number, max: number }
}

interface MacroCalculatorProps {
    onSearch?: (targets: MacroTargets) => void
    isLoading?: boolean
}

export function MacroCalculator({ onSearch, isLoading }: MacroCalculatorProps) {
    const [calories, setCalories] = React.useState([300, 800])
    const [protein, setProtein] = React.useState([15, 50])
    const [carbs, setCarbs] = React.useState([20, 80])
    const [fat, setFat] = React.useState([10, 40])

    const handleGenerate = () => {
        if (onSearch) {
            onSearch({
                calories: { min: calories[0], max: calories[1] },
                protein: { min: protein[0], max: protein[1] },
                carbs: { min: carbs[0], max: carbs[1] },
                fat: { min: fat[0], max: fat[1] }
            })
        }
    }

    return (
        <Card className="w-full max-w-sm border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl">
            <CardHeader>
                <CardTitle>Macro Calculator</CardTitle>
                <CardDescription>Set your nutritional targets (Min - Max).</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="calories">Calories</Label>
                        <span className="w-auto rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-zinc-500 hover:border-zinc-200 dark:text-zinc-400 dark:hover:border-zinc-800">
                            {calories[0]} - {calories[1]} kcal
                        </span>
                    </div>
                    <Slider
                        id="calories"
                        max={1500}
                        defaultValue={calories}
                        step={10}
                        minStepsBetweenThumbs={1}
                        onValueChange={setCalories}
                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        aria-label="Calories"
                    />
                </div>

                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="protein">Protein</Label>
                        <span className="w-auto rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-zinc-500 hover:border-zinc-200 dark:text-zinc-400 dark:hover:border-zinc-800">
                            {protein[0]} - {protein[1]} g
                        </span>
                    </div>
                    <Slider
                        id="protein"
                        max={100}
                        defaultValue={protein}
                        step={1}
                        minStepsBetweenThumbs={1}
                        onValueChange={setProtein}
                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        aria-label="Protein"
                    />
                </div>

                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="carbs">Carbs</Label>
                        <span className="w-auto rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-zinc-500 hover:border-zinc-200 dark:text-zinc-400 dark:hover:border-zinc-800">
                            {carbs[0]} - {carbs[1]} g
                        </span>
                    </div>
                    <Slider
                        id="carbs"
                        max={150}
                        defaultValue={carbs}
                        step={1}
                        minStepsBetweenThumbs={1}
                        onValueChange={setCarbs}
                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        aria-label="Carbs"
                    />
                </div>

                <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="fat">Fat</Label>
                        <span className="w-auto rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-zinc-500 hover:border-zinc-200 dark:text-zinc-400 dark:hover:border-zinc-800">
                            {fat[0]} - {fat[1]} g
                        </span>
                    </div>
                    <Slider
                        id="fat"
                        max={100}
                        defaultValue={fat}
                        step={1}
                        minStepsBetweenThumbs={1}
                        onValueChange={setFat}
                        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                        aria-label="Fat"

                    />
                </div>

                <Button
                    className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold"
                    onClick={handleGenerate}
                    disabled={isLoading}
                >
                    {isLoading ? "Cooking..." : "Generate Plan"}
                </Button>
            </CardContent>
        </Card>
    )
}
