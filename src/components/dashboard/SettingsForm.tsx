"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { updatePreferencesAction } from "@/app/dashboard/settings/actions"
import { useRouter } from "next/navigation"

const DIETARY_RESTRICTIONS = [
    { id: "vegan", label: "Vegan" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "gluten-free", label: "Gluten Free" },
    { id: "keto", label: "Ketogenic" },
    { id: "paleo", label: "Paleo" },
]

interface SettingsFormProps {
    initialData: {
        restrictions: string[]
        allergies: string[]
        favorites: string[]
        name?: string | null
        surname?: string | null
        dateOfBirth?: Date | null
        email?: string | null
    }
}

export function SettingsForm({ initialData }: SettingsFormProps) {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        firstName: initialData.name || "",
        surname: initialData.surname || "",
        dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : "",
        restrictions: initialData.restrictions,
        allergies: initialData.allergies.join(", "),
        favorites: initialData.favorites.join(", "),
    })

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await updatePreferencesAction({
                firstName: formData.firstName,
                surname: formData.surname,
                dateOfBirth: formData.dateOfBirth,
                dietaryRestrictions: formData.restrictions,
                ingredientsToAvoid: formData.allergies.split(",").map(s => s.trim()).filter(Boolean),
                lovedIngredients: formData.favorites.split(",").map(s => s.trim()).filter(Boolean)
            })
            alert("Settings updated successfully!")
            router.refresh()
        } catch (error) {
            console.error(error)
            alert("Failed to update settings.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Your personal information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={initialData.email || ""} disabled className="bg-zinc-100 dark:bg-zinc-900" />
                        <p className="text-xs text-zinc-500">Contact support to change email.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <CardHeader>
                    <CardTitle>Dietary Preferences</CardTitle>
                    <CardDescription>Manage your diet and restrictions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label>Diet Type</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {DIETARY_RESTRICTIONS.map((item) => (
                                <div key={item.id} className="flex items-center space-x-2 border rounded-md p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                                    <Checkbox id={item.id} checked={formData.restrictions.includes(item.id)} onCheckedChange={() => toggleRestriction(item.id)} />
                                    <Label htmlFor={item.id} className="cursor-pointer w-full">{item.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Ingredients to avoid (Allergies)</Label>
                        <Input
                            placeholder="e.g. Peanuts, Shellfish, Cilantro"
                            value={formData.allergies}
                            onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                        />
                        <p className="text-sm text-zinc-500">Separate multiple ingredients with commas.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Favorite Ingredients</Label>
                        <Input
                            placeholder="e.g. Chicken, Avocado, Pasta"
                            value={formData.favorites}
                            onChange={(e) => setFormData({ ...formData, favorites: e.target.value })}
                        />
                        <p className="text-sm text-zinc-500">We'll prioritize recipes containing these items.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading} className="ml-auto bg-orange-600 hover:bg-orange-700 text-white">
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
