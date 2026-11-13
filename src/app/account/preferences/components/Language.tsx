"use client"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "fa", name: "فارسی" },
    { code: "zh-CN", name: "简体中文" },
    { code: "zh-TW", name: "繁體中文" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
    { code: "id", name: "Indonesia" },
    { code: "tr", name: "Türkçe(KKTC)" },
    { code: "ar", name: "العربية" },
    { code: "es", name: "Español" },
    { code: "pt", name: "Português" },
]

export function Language() {
    const user = useQuery(api.user.user)
    const updateLanguage = useMutation(api.user.update_language)

    const handleLanguageChange = (value: string) => {
        updateLanguage({ language: value })
    }

    return (
        <Select value={user?.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="flex h-9 w-28 items-center gap-2 rounded-md border px-2.5 text-sm transition-all duration-300 hover:border-lnd-accent/55 [&>span]:truncate sm:w-40">
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
                <SelectGroup>
                    <SelectLabel>Available Languages</SelectLabel>
                    {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
