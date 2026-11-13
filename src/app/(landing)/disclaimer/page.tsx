"use client"
import React from "react";
import { useRef } from "react";
import LegalMobileToc from "../components/LegalMobileToc";

const sidebarItems = [
    "Purpose",
    "No Personal Advice",
    "No Monitoring",
    "No Tax, Regulatory or Legal Advice",
    "Market Risk",
    "Liquidity Risk",
    "Fees & Charges",
    "Availability Risk",
    "Third-Party Risk",
    "Security Risk",
    "Risks related to Digital Assets",
    "Monitoring Risk",
    "Communication Risk",
    "Currency",
    "Legal Risk",
];

export default function Disclaimer() {
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
                    <h1 className="mt-3 font-Manrope text-3xl font-extrabold leading-[1.12] tracking-tight text-lnd-fg lg:text-4xl">
                        Disclaimer
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-lnd-fg-muted">
                        Important information about the risks of using
                        Verdstamp services.
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
                            <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                This Compliance Disclosure should be read in conjunction with the Verdstamp Terms of Service and Verdstamp Privacy Policy. Please ensure you fully understand the risks involved and the related compliance matters before you trade on Verdstamp.
                            </p>
                            <section
                                id="section-0"
                                ref={el => { sectionRefs.current[0] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">1. Purpose</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    This disclaimer provides you with information about the risks associated with Verdstamp Services. Each Verdstamp Service has its own distinct risks. This notice provides a general description of the risks when you use Verdstamp Services.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    This disclaimer does not explain all of the risks or how such risks relate to your personal circumstances. It is important that you fully understand the risks involved before making a decision to use Verdstamp Services.
                                </p>
                            </section>
                            <section
                                id="section-1"
                                ref={el => { sectionRefs.current[1] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">2. No Personal Advice</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    We do not provide personal advice in relation to our products or services. We sometimes provide factual information, information about transaction procedures and information about the potential risks. However, any decision to use our products or services is made by you. No communication or information provided to you by Verdstamp is intended as, or shall be considered or construed as, investment advice, financial advice, trading advice, or any other sort of advice. You are solely responsible for determining whether any investment, investment strategy or related transaction is appropriate for you according to your personal investment objectives, financial circumstances and risk tolerance.
                                </p>
                            </section>
                            <section
                                id="section-2"
                                ref={el => { sectionRefs.current[2] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">3. No Monitoring</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Verdstamp is not your broker, intermediary, agent, or advisor and has no fiduciary relationship or obligation to you in connection with any trades or other decisions or activities undertaken by you using Verdstamp Services. We do not monitor whether your use of Verdstamp Services is consistent with your financial goals and objectives. It is up to you to assess whether your financial resources are adequate for your financial activity with us, and to your risk appetite in the products and services you use.
                                </p>
                            </section>
                            <section
                                id="section-3"
                                ref={el => { sectionRefs.current[3] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">4. No Tax, Regulatory or Legal Advice</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    The taxation of Digital Assets is uncertain, and you are responsible for determining what taxes you might be liable to, and how they apply, when transacting through the Verdstamp Services. It is your responsibility to report and pay any taxes that may arise from transacting on the Verdstamp Services, and you acknowledge that Verdstamp does not provide legal or tax advice relative to these transactions. If you have any doubts about your tax status or obligations when using Verdstamp Services, or with respect to the Digital Assets held to the credit of your Verdstamp account, you may wish to seek independent advice.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    You acknowledge that, when, where and as required by applicable legislation, Verdstamp shall report information regarding your transactions, transfers, distributions or payments to tax or other public authorities. Similarly, when, where and as required by applicable law, Verdstamp shall withhold taxes related to your transactions, transfers, distributions or payments. Applicable legislation could also prompt Verdstamp to request you for additional tax information, status, certificates or documentation. You acknowledge that failure to answer these requests within the timeframe defined, may result in withholding taxes by Verdstamp, to be remitted to tax authorities as defined by relevant law. You are encouraged to seek professional and personal tax advice regarding the above and before making any digital asset transaction.
                                </p>
                            </section>
                            <section
                                id="section-4"
                                ref={el => { sectionRefs.current[4] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">5. Market Risk</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Digital Asset trading is subject to high market risk and price volatility. Changes in value may be significant and may occur rapidly and without warning. Past performance is not a reliable indicator of future performance. The value of an investment and any returns can go down as well as up, and you may not get back the amount you had invested.
                                </p>
                            </section>
                            <section
                                id="section-5"
                                ref={el => { sectionRefs.current[5] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">6. Liquidity Risk</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Digital Assets may have limited liquidity which may make it difficult or impossible for you to sell or exit a position when you wish to do so. This may occur at any time, including at times of rapid price movements.
                                </p>
                            </section>
                            <section
                                id="section-6"
                                ref={el => { sectionRefs.current[6] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">7. Fees & Charges</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Our fees and charges are set out at <a href="https://verdstampdigital.app/fees-standard" className="text-lnd-accent underline underline-offset-2" target="_blank" rel="noopener noreferrer">verdstampdigital.app/fees-standard</a>. Verdstamp may, in its discretion, update the fees & charges from time to time. Please be aware of all costs and charges that apply to you, because such costs and charges will affect the gains you generate from using Verdstamp Services.
                                </p>
                            </section>
                            <section
                                id="section-7"
                                ref={el => { sectionRefs.current[7] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">8. Availability Risk</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    We do not guarantee that the Verdstamp Services will be available at any particular time or that Verdstamp Services will not be subject to unplanned service outages or network congestion. It may not be possible for you to buy, sell, store, transfer, send or receive Digital Assets when you wish to do so.
                                </p>
                            </section>
                            <section
                                id="section-8"
                                ref={el => { sectionRefs.current[8] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">9. Third-Party Risk</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Third parties, such as payment providers, custodians, and banking partners may be involved in the provision of Verdstamp Services. You may be subject to the terms & conditions of these third parties, and Verdstamp may not be responsible for any loss that these third parties may cause to you.
                                </p>
                            </section>
                            <section
                                id="section-9"
                                ref={el => { sectionRefs.current[9] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">10. Security Risk</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    It is not possible for Verdstamp to eliminate all security risks. You are responsible for keeping your Verdstamp Account password safe, and you may be responsible for all the transactions under your Verdstamp Account, whether you authorised them or not. Transactions in Digital Assets may be irreversible, and losses due to fraudulent or unauthorised transactions may not be recoverable.
                                </p>
                            </section>
                            <section
                                id="section-10"
                                ref={el => { sectionRefs.current[10] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">11. Risks related to Digital Assets</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Given the nature of Digital Assets and their underlying technologies, there are a number of intrinsic risks, including but not limited to: faults, defects, hacks, exploits, errors, protocol failures or unforeseen circumstances occurring in respect of a Digital Asset or the technologies or economic systems on which the Digital Asset rely; transactions in Digital Assets being irreversible. Consequently, losses due to fraudulent or accidental transactions may not be recoverable; technological development leading to the obsolescence of a Digital Asset; delays causing a transactions not be settled on the scheduled delivery date; and attacks on the protocol or technologies on which a Digital Asset depends, including, but not limited to: 
                                </p>
                                <ul className="list-disc pl-6 text-sm leading-relaxed text-lnd-fg-muted mb-4 marker:text-lnd-accent">
                                    <li>distributed denial of service</li>
                                    <li>sybil attacks</li>
                                    <li>phishing</li>
                                    <li>social engineering</li>
                                    <li>hacking</li>
                                    <li>smurfing</li>
                                    <li>malware</li>
                                    <li>double spending</li>
                                    <li>majority-mining, consensus-based or other mining attacks</li>
                                    <li>misinformation campaigns</li>
                                    <li>forks</li>
                                    <li>spoofing</li>
                                </ul>
                            </section>
                            <section
                                id="section-11"
                                ref={el => { sectionRefs.current[11] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">12. Monitoring Risk</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Digital Asset markets are open 24 hours a day, 7 days a week. Rapid price changes may occur at any time, including outside of normal business hours.
                                </p>
                            </section>
                            <section
                                id="section-12"
                                ref={el => { sectionRefs.current[12] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">13. Communication Risk</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    When you communicate with us via electronic communication, you should be aware that electronic communications can fail, can be delayed, may not be secure and/or may not reach the intended destination.
                                </p>
                            </section>
                            <section
                                id="section-13"
                                ref={el => { sectionRefs.current[13] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">14. Currency</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Currency exchange fluctuations will impact your gains and losses.
                                </p>
                            </section>
                            <section
                                id="section-14"
                                ref={el => { sectionRefs.current[14] = el; }}
                            >
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">15. Legal Risk</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Changes in laws and regulations may materially affect the value of Digital Assets. This risk is unpredictable and may vary from market to market.
                                </p>
                            </section>
                </article>
            </div>
        </div>
    )
}