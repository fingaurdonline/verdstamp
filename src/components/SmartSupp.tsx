"use client";
import { useEffect } from "react";

export default function SmartsuppChat() {
    useEffect(() => {
        const w = window as any;
        w._smartsupp = w._smartsupp || {};
        w._smartsupp.key = "";

        if (!w.smartsupp) {
            const d = document;
            const s = d.getElementsByTagName("script")[0];
            const c = d.createElement("script");
            c.type = "text/javascript";
            c.charset = "utf-8";
            c.async = true;
            c.src = "https://www.smartsuppchat.com/loader.js?";
            s.parentNode!.insertBefore(c, s);
        }
    }, []);

    return (
        <noscript>
            Powered by{" "}
            <a href="https://www.smartsupp.com" target="_blank" rel="noopener noreferrer">
                Smartsupp
            </a>
        </noscript>
    );
}
