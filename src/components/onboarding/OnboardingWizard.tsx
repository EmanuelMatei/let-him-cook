"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { saveOnboardingPreferences } from "@/app/onboarding/actions"

const DIETARY_RESTRICTIONS = [
    { id: "vegan", label: "Vegan" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "gluten-free", label: "Gluten Free" },
    { id: "keto", label: "Ketogenic" },
    { id: "paleo", label: "Paleo" },
]

export function OnboardingWizard() {
    const router = useRouter()
    const [step, setStep] = React.useState(1)

    // 4 Steps total now
    // 1: Personal Info
    // 2: Diet
    // 3: Allergies
    // 4: Favorites
    const [progress, setProgress] = React.useState(25)

    const [formData, setFormData] = React.useState({
        firstName: "",
        surname: "",
        dateOfBirth: "",
        restrictions: [] as string[],
        allergies: "",
        favorites: "",
    })

    const handleNext = async () => {
        if (step < 4) {
            setStep(step + 1)
            setProgress(((step + 1) / 4) * 100)
        } else {
            // Finished
            await saveOnboardingPreferences({
                firstName: formData.firstName,
                surname: formData.surname,
                dateOfBirth: formData.dateOfBirth,
                dietaryRestrictions: formData.restrictions,
                ingredientsToAvoid: formData.allergies.split(",").map(s => s.trim()).filter(Boolean),
                lovedIngredients: formData.favorites.split(",").map(s => s.trim()).filter(Boolean)
            })
        }
    }

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1)
            setProgress(((step - 1) / 4) * 100)
        }
    }

    const toggleRestriction = (id: string) => {
        setFormData(prev => {
            const exists = prev.restrictions.includes(id)
            if (exists) {
                return { ...prev, restrictions: prev.restrictions.filter(r => r !== id) }
            } else {
                return { ...prev, restrictions: [...prev.restrictions, id] }
            }
        })
    }

    return (
        <div className="w-full max-w-lg mx-auto space-y-8">
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-zinc-500">
                    <span>Step {step} of 4</span>
                    <span>{Math.round(progress)}% completed</span>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Personal Information"}
                        {step === 2 && "Dietary Restrictions"}
                        {step === 3 && "Allergies & Avoidances"}
                        {step === 4 && "Kitchen Favorites"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Let's get to know you better."}
                        {step === 2 && "Select any specific dietary rules you follow."}
                        {step === 3 && "What ingredients should we absolutely avoid?"}
                        {step === 4 && "What ingredients do you love to cook with?"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="min-h-[300px]">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input
                                        placeholder="Mario"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Surname</Label>
                                    <Input
                                        placeholder="Rossi"
                                        value={formData.surname}
                                        onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {DIETARY_RESTRICTIONS.map((item) => (
                                <div key={item.id} className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                                    onClick={() => toggleRestriction(item.id)}>
                                    <Checkbox id={item.id} checked={formData.restrictions.includes(item.id)} onCheckedChange={() => toggleRestriction(item.id)} />
                                    <Label htmlFor={item.id} className="cursor-pointer w-full">{item.label}</Label>
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Ingredients to avoid</Label>
                                <Input
                                    placeholder="e.g. Peanuts, Shellfish, Cilantro"
                                    value={formData.allergies}
                                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                                />
                                <p className="text-sm text-zinc-500">Separate multiple ingredients with commas.</p>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Favorite Ingredients</Label>
                                <Input
                                    placeholder="e.g. Chicken, Avocado, Pasta"
                                    value={formData.favorites}
                                    onChange={(e) => setFormData({ ...formData, favorites: e.target.value })}
                                />
                                <p className="text-sm text-zinc-500">We'll prioritize recipes containing these items.</p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                        Back
                    </Button>
                    <Button onClick={handleNext} className="bg-orange-600 hover:bg-orange-700 text-white">
                        {step === 4 ? "Finish Setup" : "Next Step"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
