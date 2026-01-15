"use client"

import React, { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface AdBannerProps {
    slot: string
    format?: "auto" | "rectangle" | "horizontal" | "vertical"
    className?: string
    placeholderText?: string
}

export function AdBanner({
    slot,
    format = "auto",
    className,
    placeholderText = "Advertisement"
}: AdBannerProps) {
    const isDev = process.env.NODE_ENV === "development"
    const adRef = useRef<HTMLModElement>(null)

    useEffect(() => {
        if (!isDev) {
            try {
                // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({})
            } catch (err) {
                console.error("AdSense error", err)
            }
        }
    }, [isDev])

    if (isDev) {
        return (
            <div className={cn(
                "bg-zinc-100 dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400 text-sm font-medium p-4 text-center",
                className
            )}>
                {placeholderText} <br />
                <span className="text-xs opacity-70">(AdSense Slot: {slot})</span>
            </div>
        )
    }

    return (
        <div className={cn("overflow-hidden", className)}>
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"></ins>
        </div>
    )
}
