"use client"
import React from "react";
import { useRef } from "react";
import LegalMobileToc from "../components/LegalMobileToc";

const sidebarItems = [
    "1. Scope of Application",
    "2. Use of Information",
    "3. Disclosure of Information",
    "4. Storage/Transfer of Information",
    "5. Use of Cookies",
    "6. Protection of Information",
    "7. Disclaimer of Liability",
    "8. External Websites",
    "9. Your Statutory Rights",
    "10. Contact Us"
];

export default function PrivacyPolicy() {
    // Dark mode styling reviewed and confirmed.
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);
    const [acive, setActive] = React.useState(0)

    const scrollToSection = (index: number) => {
        const section = sectionRefs.current[index];
        if (!section) return;
        section.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(index);
    };
    return (
        <div className="w-full">
            <section className="relative overflow-hidden border-b border-lnd-border">
                <div
                    aria-hidden
                    className="lnd-dot-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]"
                />
                <div className="relative mx-auto w-full max-w-[1280px] px-4 py-12 lg:px-6 lg:py-16">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-lnd-accent">
                        Legal
                    </p>
                    <h1 className="mt-2 font-Manrope text-3xl font-extrabold tracking-tight text-lnd-fg lg:text-4xl">
                        Privacy Policy
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-lnd-fg-muted">
                        How Verdstamp collects, uses and protects your personal
                        information.
                    </p>
                </div>
            </section>

            <div className="mx-auto flex w-full max-w-[1280px] gap-10 px-4 py-10 lg:px-6 lg:py-14">
                <aside className="hidden w-60 shrink-0 lg:block">
                    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-lnd-fg-muted">
                            On this page
                        </p>
                        <nav className="mt-3 space-y-0.5">
                            {sidebarItems.map((item, idx) => (
                                <button
                                    onClick={() => scrollToSection(idx)}
                                    key={item}
                                    className={`block w-full border-l-2 py-2 pl-4 text-left text-sm leading-snug transition-colors ${
                                        idx === acive
                                            ? "border-lnd-accent font-medium text-lnd-fg"
                                            : "border-lnd-border text-lnd-fg-muted hover:text-lnd-fg"
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                <article className="min-w-0 max-w-3xl flex-1 [&_section]:scroll-mt-28">
                    <LegalMobileToc
                        items={sidebarItems}
                        active={acive}
                        onSelect={scrollToSection}
                    />
                            <section
                                id="section-0"
                                ref={el => { sectionRefs.current[0] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">1. Scope of Application</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Verdstamp (“Verdstamp”, “we”, or “us”) is committed to protecting the privacy of our customers, and we take our data protection responsibilities with the utmost seriousness. This Privacy Policy describes how Verdstamp collects and processes your personal information through the Verdstamp websites and applications that reference this Privacy Policy. Verdstamp refers to an ecosystem comprising Verdstamp websites (whose domain names include but are not limited to https://www.CoinMaiden.com/), mobile applications, clients, applets and other applications that are developed to offer Verdstamp Services, and includes independently-operated platforms, websites and clients within the ecosystem. “Verdstamp Operators” refer to all parties that run Verdstamp, including but not limited to legal persons, unincorporated organizations and teams that provide Verdstamp Services and are responsible for such services. “Verdstamp” as used in this Privacy Policy includes Verdstamp Operators.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    This Privacy Policy applies to all Personal Information processing activities carried out by us, across platforms, websites, and departments of Verdstamp and Verdstamp Operators.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    To the extent that you are a customer or user of our services, this Privacy Policy applies together with any terms of business and other contractual documents, including but not limited to any agreements we may have with you. To the extent that you are not a relevant stakeholder, customer or user of our services, but are using our website, this Privacy Policy also applies to you together with our Use of Cookie (as defined below).
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    We may use or disclose your personal information in compliance with this Privacy Policy to provide better services to you. By using our products and services, you consent to the practices contained in this Privacy Policy. We may amend this Privacy Policy from time to time and strongly encourage you to review it whenever you access or use Verdstamp services to stay informed about our information practices and your privacy rights and choices. If you ever have any questions about changes made to the Privacy Policy, please reach out to support@CoinMaiden.com.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    This Privacy Policy applies to:
                                    <br className="mb-4" />
                                    A）your personal information including your name, email address, date of birth, tax number (if applicable), username, password or other personal information when you open an account on our Platforms;
                                    <br className="mb-4" />
                                    B）your browsing history and/or information related to your device, including and not limited to the types of device (Computer vs. iPhone vs. Android), operating system, mobile phone number, browser type and language, device identifiers (such as IMEI and MAC address), Internet Protocol (IP) address, location information, cookies identifiers, Internet service provider, etc.;
                                    <br className="mb-4" />
                                    C）your personal information we obtain from other sources, including third-party business partners through which you access our Platforms and related services.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    You understand and agree that this Privacy Policy is not applicable to the following information:
                                    <br className="mb-4" />
                                    A）Your search keywords when using our Platforms;
                                    <br className="mb-4" />
                                    B）Public content you create on our Platforms, including but not limited to forum posts, blogs, or social media pages;
                                    <br className="mb-4" />
                                    C）Your violation of laws, regulations or our Platforms’ rules and publishing measures you are subject to.
                                </p>
                            </section>
                            <section
                                id="section-1"
                                ref={el => { sectionRefs.current[1] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">2. Use of Information</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    We use your information for various business purposes, including but not limited to:
                                    <br className="mb-4" />
                                    A）to provide you with information about products and promotions that may be of interest to you, from ourselves and third parties, although only if you have specifically agreed to receive such information;
                                    <br className="mb-4" />
                                    B）to process applications or transactions you made and your financial information for products or services you purchased on our Platforms and;
                                    <br className="mb-4" />
                                    C）to enhance your information security by detecting malicious, deceptive, fraudulent or illegal activities;
                                    <br className="mb-4" />
                                    D）to improve our services by researching and developing our products and services;
                                    <br className="mb-4" />
                                    E）to comply with domestic and international legal obligations.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    We will gather and take good care of your personal information. If we need to share with third-party business partners to provide better service experience for you, we will require partners to protect your information as stated in this Privacy Policy.
                                </p>
                            </section>
                            <section
                                id="section-2"
                                ref={el => { sectionRefs.current[2] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">3. Disclosure of Information</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    We may disclose any personal information we collect about you:
                                    <br className="mb-4" />
                                    A）to non-affiliated third parties at your consent;
                                    <br className="mb-4" />
                                    B）to third party service/product providers so that you can use their service/product;
                                    <br className="mb-4" />
                                    C）to our business partners when we co-launch a product or service;
                                    <br className="mb-4" />
                                    D）to our affiliated entites;
                                    <br className="mb-4" />
                                    E）to other sites when deemed necessary by law, regulations or Privacy Policy.
                                    <br className="mb-4" />
                                    F）when disclosure is necessary to report suspected illegal activity;
                                    <br className="mb-4" />
                                    G）when disclosure is necessary to investigate violations of laws, regulations or this Privacy Policy;
                                    <br className="mb-4" />
                                    H）when compelled by subpoena, court order, or other legal procedure;
                                </p>
                            </section>
                            <section
                                id="section-3"
                                ref={el => { sectionRefs.current[3] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">4. Storage/Transfer of Information</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    You acknowledge that we store and process your personal and transactional information in multiple locations in the world where our service providers are located, and we protect it by maintaining physical, electronic, and procedural safeguards in compliance with applicable regulations.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Your personal information we receive will be stored for as long as you use our services or as necessary to fulfill the purpose(s) for which it was collected, provide our services, resolve disputes, establish legal defenses, conduct audits, pursue legitimate business purposes, enforce our measures, and comply with applicable laws.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    You also acknowledge that when a merger, acquisition, financing due diligence, reorganization, bankruptcy, receivership, purchase or sale of assets, or transition of service to another provider occurs, your information may be sold or transferred as part of such a transaction, as permitted by law and/or contract.
                                </p>
                            </section>
                            <section
                                id="section-4"
                                ref={el => { sectionRefs.current[4] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">5. Use of Cookies</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    A）We use a browser feature known as a &qout;cookie&qout;, which assigns a unique identification (a small data file) to your computer, tablet, mobile phone, or other devices.
                                    <br className="mb-4" />
                                    B）The information collected from cookies allows us to store your preferences so as to improve the quality of your experience on the Platforms by recognizing and delivering more of the most desired features and information, as well as by resolving access difficulties;
                                    <br className="mb-4" />
                                    C）You are free to block, decline, or remove our cookies as your browser or browser add-on permits, but doing so may interfere with your use of our services.
                                    <br className="mb-4" />
                                    D）The information we collect from cookies is applicable with this Privacy Policy.
                                </p>
                            </section>
                            <section
                                id="section-5"
                                ref={el => { sectionRefs.current[5] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">6. Protection of Information</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    A）We implement reasonable security practices and procedures to protect the confidentiality and security of your information, including any nonpublic personal information.
                                    <br className="mb-4" />
                                    B）We protect your information using reasonable physical, technical and administrative security measures such as limitation of access on employees to your information.
                                    <br className="mb-4" />
                                    C）You are responsible for reviewing the privacy statements, policies, terms, and conditions of any person or company to whom you choose to link or with whom you choose to contract.
                                    <br className="mb-4" />
                                    D）We cannot guarantee or warrant the security of any information you provide to us as no system is perfectly secure.
                                    <br className="mb-4" />
                                    E）If you find your personal information (especially username and passwords on our Platforms) disclosed, you should immediately contact our support for protection measures.
                                </p>
                            </section>
                            <section
                                id="section-6"
                                ref={el => { sectionRefs.current[6] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">7. Disclaimer of Liability</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Verdstamp assumes no liability or responsibility, to the fullest extent of any applicable law, for:
                                    <br className="mb-4" />
                                    A）any unintentional disclosure;
                                    <br className="mb-4" />
                                    B）disclosure of your personal information because you share with others your account(s) or password(s) on our Platforms;
                                    <br className="mb-4" />
                                    C）any stolen, lost, or unauthorized use of your account information any breach of security or data terms related to your account information, or any criminal or other third party act affecting our Platforms;
                                    <br className="mb-4" />
                                    D）lawsuits or related damages led by disclosure of your personal information on our external websites.
                                </p>
                            </section>
                            <section
                                id="section-7"
                                ref={el => { sectionRefs.current[7] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">8. External Websites</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Occasionally, the Verdstamp website may provide references or links to other websites (&qout;External Websites&qout;). We do not control these External Websites or any of the content contained therein. External Websites have separate and independent terms of use and related policies.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    We request that you review the policies, rules, terms, and regulations of each site that you visit. If you prefer not to share your personal information with External Websites, please note that you must separately opt out of their use of your information for various purposes.
                                </p>
                            </section>
                            <section
                                id="section-8"
                                ref={el => { sectionRefs.current[8] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">9. Your Statutory Rights</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Depending on applicable law, you may have the rights as set out below, which you may exercise by contacting us at support@CoinMaiden.com.
                                    <br className="mb-4" />
                                    A）Access: you are entitled to ask us if we are processing your information and, if we are, you can request access to your personal data. This enables you to receive a copy of the personal data we hold about you and certain other information about it to check that we are lawfully processing it. We process a large quantity of information, and can thus request that before the information is delivered, you specify the information or processing activities to which your request relates.
                                    <br className="mb-4" />
                                    B）Correction: you are entitled to request that any incomplete or inaccurate personal data we hold about you is corrected.
                                    <br className="mb-4" />
                                    C）Erasure: you are entitled to ask us to delete or remove personal data in certain circumstances. There are also certain exceptions where we may refuse a request for erasure, for example, where the personal data is required for compliance with law or in connection with claims.
                                    <br className="mb-4" />
                                    D）Restriction: you are entitled to ask us to suspend the processing of certain of your personal data about you, for example if you want us to establish its accuracy or the reason for processing it.
                                    <br className="mb-4" />
                                    E）Transfer: you may request the transfer of certain of your personal data to another party.
                                    <br className="mb-4" />
                                    F）Objection: where we are processing your personal data based on legitimate interests (or those of a third party) you may challenge this. However, we may be entitled to continue processing your information based on our legitimate interests or where this is relevant to legal claims. You also have the right to object where we are processing your personal data for direct marketing purposes.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    If these rights apply, they may however be limited, for example if fulfilling your request would reveal personal data about another person, would infringe the rights of another person or legal entity (including our rights), or if you ask us to delete or change data which we are required by law to keep (or have other compelling legitimate interests in keeping). We will inform you of relevant exemptions we rely upon when responding to any request you make.
                                </p>
                            </section>
                            <section
                                id="section-9"
                                ref={el => { sectionRefs.current[9] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">10. Contact Us</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    If you have any questions relating to our privacy policy and your rights and obligations arising from these policy terms, or if you intend to exercise your rights stated in this privacy policy, please contact support@CoinMaiden.com.
                                </p>
                            </section>
                </article>
            </div>
        </div>
    )
}