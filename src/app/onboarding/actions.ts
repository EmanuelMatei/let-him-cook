'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export interface OnboardingData {
    firstName: string
    surname: string
    dateOfBirth: string // Passed as ISO string from frontend
    dietaryRestrictions: string[]
    ingredientsToAvoid: string[]
    lovedIngredients: string[]
}

export async function saveOnboardingPreferences(data: OnboardingData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email) {
        throw new Error("Unauthorized")
    }

    try {
        // Ensure user exists in our Prisma DB (sync with Supabase)
        const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {
                name: data.firstName,
                surname: data.surname,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null
            },
            create: {
                id: user.id, // Use Supabase Auth ID
                email: user.email,
                name: data.firstName,
                surname: data.surname,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null
            }
        })

        // Create or Update Preferences
        await prisma.userPreference.upsert({
            where: { userId: dbUser.id },
            update: {
                dietaryRestrictions: data.dietaryRestrictions,
                excludedIngredients: data.ingredientsToAvoid,
                likedIngredients: data.lovedIngredients
            },
            create: {
                userId: dbUser.id,
                dietaryRestrictions: data.dietaryRestrictions,
                excludedIngredients: data.ingredientsToAvoid,
                likedIngredients: data.lovedIngredients
            }
        })

    } catch (error) {
        console.error("Failed to save preferences:", error)
        throw new Error("Failed to save data")
    }

    redirect('/dashboard')
}
