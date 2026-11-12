import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export default function ArticleShell({
    category,
    title,
    author,
    published,
    updated,
    avatar,
    children,
    disclaimer,
    backHref = "/support",
    backLabel = "Support",
}: {
    category: string;
    title: string;
    author: string;
    published: string;
    updated: string;
    avatar: ReactNode;
    children: ReactNode;
    disclaimer?: string;
    backHref?: string;
    backLabel?: string;
}) {
    return (
        <main className="w-full">
            <section className="relative overflow-hidden border-b border-lnd-border">
                <div
                    aria-hidden
                    className="lnd-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]"
                />
                <div className="relative mx-auto w-full max-w-[900px] px-4 py-12 lg:px-6 lg:py-16">
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-lnd-fg-muted transition-colors hover:text-lnd-accent"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        {backLabel}
                    </Link>
                    <p className="mt-6 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent">
                        {category}
                    </p>
                    <h1 className="mt-3 max-w-3xl font-Manrope text-3xl font-extrabold leading-[1.12] tracking-tight text-lnd-fg sm:text-4xl lg:text-[2.6rem]">
                        {title}
                    </h1>
                    <div className="mt-7 flex items-center gap-3">
                        {avatar}
                        <div>
                            <p className="text-sm font-medium text-lnd-fg">
                                {author}
                            </p>
                            <p className="mt-0.5 text-xs text-lnd-fg-muted">
                                Published on{" "}
                                <time dateTime={published}>{published}</time>
                                <span className="mx-1.5 text-lnd-border">
                                    |
                                </span>
                                Updated on{" "}
                                <time dateTime={updated}>{updated}</time>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <article className="mx-auto w-full max-w-[900px] px-4 py-12 lg:px-6 lg:py-16">
                <div className="space-y-5 text-sm leading-relaxed text-lnd-fg-muted [&_a]:font-medium [&_a]:text-lnd-accent [&_a]:underline [&_a]:underline-offset-2 [&_h2]:pt-3 [&_h2]:font-Manrope [&_h2]:text-xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-lnd-fg [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_p]:leading-relaxed [&_section]:space-y-3 [&_strong]:font-semibold [&_strong]:text-lnd-fg [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-lnd-accent [&_ol]:marker:font-medium [&_ol]:marker:text-lnd-accent">
                    {children}
                </div>

                {disclaimer && (
                    <p className="mt-10 border-t border-lnd-border pt-6 text-xs leading-relaxed text-lnd-fg-muted">
                        {disclaimer}
                    </p>
                )}
            </article>
        </main>
    );
}
