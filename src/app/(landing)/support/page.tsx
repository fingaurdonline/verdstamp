"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Paperclip, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PageHero from "../components/PageHero";

export default function SupportPage() {
    const [formData, setFormData] = useState({
        email: "",
        issueType: "",
        subject: "",
        description: "",
        attachments: [] as File[],
    });

    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const files = Array.from(e.dataTransfer.files);
            setFormData((prev) => ({
                ...prev,
                attachments: [...prev.attachments, ...files],
            }));
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData((prev) => ({
                ...prev,
                attachments: [...prev.attachments, ...files],
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <main className="w-full">
            <PageHero
                align="center"
                eyebrow="Support"
                title={
                    <>
                        How can we{" "}
                        <span className="text-lnd-accent">help?</span>
                    </>
                }
                subtitle="Please enter the details of your request. A member of our support staff will respond as soon as possible."
            />

            <section className="mx-auto w-full max-w-[900px] px-4 py-12 lg:px-6 lg:py-16">
                <div className="rounded-3xl border border-lnd-border bg-lnd-surface p-5 lg:p-8">
                    <form
                        id="new_request"
                        className="space-y-6"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-lnd-fg"
                                >
                                    Registered email in Verdstamp
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    className="h-11 rounded-xl border-lnd-border bg-lnd-surface-2 text-sm text-lnd-fg placeholder:text-lnd-fg-muted/60 focus-visible:ring-lnd-accent"
                                    required
                                />
                                <div className="text-left sm:text-right">
                                    <Link
                                        href="/contact-us"
                                        className="text-xs font-medium text-lnd-accent hover:underline"
                                    >
                                        Registered email not available?
                                    </Link>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="subject"
                                    className="text-sm font-medium text-lnd-fg"
                                >
                                    Subject
                                </Label>
                                <Input
                                    id="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            subject: e.target.value,
                                        }))
                                    }
                                    className="h-11 rounded-xl border-lnd-border bg-lnd-surface-2 text-sm text-lnd-fg placeholder:text-lnd-fg-muted/60 focus-visible:ring-lnd-accent"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="request_description"
                                className="text-sm font-medium text-lnd-fg"
                            >
                                Description
                            </Label>
                            <textarea
                                id="request_description"
                                name="request_description"
                                rows={7}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                required
                                placeholder="Include any details that will help us resolve your request faster."
                                className="w-full rounded-xl border border-lnd-border bg-lnd-surface-2 px-4 py-3 text-sm leading-relaxed text-lnd-fg placeholder:text-lnd-fg-muted/60 focus:border-lnd-accent focus:outline-none focus:ring-1 focus:ring-lnd-accent/40"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-lnd-fg">
                                Attachments{" "}
                                <span className="font-normal text-lnd-fg-muted">
                                    (optional)
                                </span>
                            </Label>

                            <div
                                className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
                                    dragActive
                                        ? "border-lnd-accent bg-lnd-accent/5"
                                        : "border-lnd-border bg-lnd-surface-2/50 hover:border-lnd-accent/40"
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                <input
                                    id="file-upload"
                                    type="file"
                                    multiple
                                    onChange={handleFileInput}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="flex cursor-pointer flex-col items-center gap-2"
                                >
                                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-lnd-border bg-lnd-surface text-lnd-accent">
                                        <Upload className="h-5 w-5" />
                                    </span>
                                    <span className="text-sm text-lnd-fg-muted">
                                        <span className="font-semibold text-lnd-accent">
                                            Add file
                                        </span>{" "}
                                        or drop files here
                                    </span>
                                </label>
                            </div>

                            {formData.attachments.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-lnd-fg-muted">
                                        Uploaded files
                                    </p>
                                    <div className="space-y-2">
                                        {formData.attachments.map(
                                            (file, index) => (
                                                <div
                                                    key={`${file.name}-${index}`}
                                                    className="flex items-center justify-between gap-3 rounded-xl border border-lnd-border bg-lnd-surface-2 px-3 py-2.5"
                                                >
                                                    <span className="flex min-w-0 items-center gap-2 text-sm text-lnd-fg">
                                                        <Paperclip className="h-3.5 w-3.5 shrink-0 text-lnd-fg-muted" />
                                                        <span className="truncate">
                                                            {file.name}
                                                        </span>
                                                    </span>
                                                    <button
                                                        type="button"
                                                        aria-label={`Remove ${file.name}`}
                                                        onClick={() => {
                                                            setFormData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    attachments:
                                                                        prev.attachments.filter(
                                                                            (
                                                                                _,
                                                                                i,
                                                                            ) =>
                                                                                i !==
                                                                                index,
                                                                        ),
                                                                }),
                                                            );
                                                        }}
                                                        className="shrink-0 rounded-full border border-lnd-border p-1.5 text-lnd-fg-muted transition-colors hover:border-red-500/40 hover:text-red-500"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-lnd-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-lnd-fg-muted">
                                We may ask for more information to verify your
                                account.
                            </p>
                            <button
                                type="submit"
                                className="lnd-btn-accent px-8 py-3 text-sm"
                            >
                                Submit request
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-4 flex flex-col items-start justify-between gap-4 rounded-2xl border border-lnd-border bg-lnd-surface px-5 py-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-Manrope text-sm font-semibold text-lnd-fg">
                            Prefer to reach a specific team?
                        </h2>
                        <p className="mt-1 text-xs text-lnd-fg-muted">
                            Business, listings, legal and product contacts are
                            listed on our contact page.
                        </p>
                    </div>
                    <Link
                        href="/contact-us"
                        className="lnd-btn-ghost inline-flex shrink-0 items-center gap-2 px-5 py-2.5 text-xs"
                    >
                        Contact us
                        <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
