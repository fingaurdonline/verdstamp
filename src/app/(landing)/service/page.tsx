// Dark mode styling reviewed and confirmed.
"use client"
import React from "react";
import { useRef } from "react";
import LegalMobileToc from "../components/LegalMobileToc";

const sidebarItems = [
    "1. Definitions",
    "2. Acceptance of Terms",
    "3. Scope of Service and Your Rights and Obligations",
    "4. Risks Disclosures and Acknowledgements",
    "5. Transaction & Fees",
    "6. Modification/ Suspension/ Termination of Service",
    "7. Rules of Use",
    "8. Intellectual Property",
    "9. Privacy Policy",
    "10. Disclaimer of Liability",
    "11. Risks",
    "12. Indemnity",
    "13. Notifications",
    "14. Disclosures to Legal Authorities and Authorized Financial Institutions",
    "15. Miscellaneous",
];

export default function Service() {
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
                        Terms of Service
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-lnd-fg-muted">
                        The terms that govern your use of Verdstamp products
                        and services.
                    </p>
                </div>
            </section>

            <div className="mx-auto flex w-full max-w-[1280px] gap-10 px-4 py-10 lg:px-6 lg:py-14">
                <aside className="hidden w-64 shrink-0 lg:block xl:w-72">
                    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
                        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-lnd-fg-muted">
                            On this page
                        </p>
                        <nav className="mt-3 space-y-0.5">
                            {sidebarItems.map((item, idx) => (
                                <button
                                    onClick={() => scrollToSection(idx)}
                                    key={item}
                                    className={`block w-full border-l-2 py-2 pl-4 text-left text-[0.82rem] leading-snug transition-colors ${
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
                            <p className="text-sm leading-relaxed text-lnd-fg-muted mb-6">
                                These Verdstamp Terms of Use is entered into between you (hereinafter referred to as “you” or “your”) and Verdstamp operators (as defined below). By accessing, downloading, using or clicking on “I agree” to accept any Verdstamp Services (as defined below) provided by Verdstamp (as defined below), you agree that you have read, understood and accepted all of the terms and conditions stipulated in these Terms of Use (hereinafter referred to as “these Terms”) as well as our Privacy Policy at https://www.CoinMaiden.com/privacy. In addition, when using some features of the Services, you may be subject to specific additional terms and conditions applicable to those features.
                            </p>
                            <p className="text-sm leading-relaxed text-lnd-fg-muted mb-6">
                                By completing the registration as a user of our Platforms, you agree with and accept these Terms of Service (hereinafter referred to as the “Terms”) and all policies published on this website. IF YOU DO NOT ACCEPT THESE TERMS OF USE, DO NOT ACCESS THIS SITE AND DO NOT USE ANY OF Verdstamp&apos;s SERVICES, PRODUCTS AND CONTENT.
                            </p>
                            <p className="text-sm leading-relaxed text-lnd-fg-muted mb-6">
                                SERVICES PROVIDED BY Verdstamp ARE NOT AVAILABLE TO PERSONS OR ENTITIES WHO ARE RESIDE IN, CITIZENS OF, LOCATED IN, INCORPORATED IN OR HAVING A REGISTERED OFFICE IN THE  HONG KONG SAR AND THE PEOPLE&apos;S REPUBLIC OF CHINA (“BLOCKED PERSONS”). Verdstamp DOES NOT MAKE ANY EXCEPTIONS. THEREFORE IF YOU ARE A BLOCKED PERSON, DO NOT ATTEMPT TO USE ANY SERVICE OF Verdstamp. USE OF A VIRTUAL PRIVATE NETWORK (VPN) TO CIRCUMVENT THE RESTRICTIONS SET FORTH IS PROHIBITED
                            </p>
                            <section
                                id={`section-${0}`}
                                ref={(el) => {
                                    sectionRefs.current[0] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">1. Definitions</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    1.1 Verdstamp refers to an ecosystem comprising Verdstamp websites (whose domain names include but are not limited to https://www.CoinMaiden.com), mobile applications, clients, applets and other applications that are developed to offer Verdstamp Services, and includes independently-operated platforms, websites and clients within the ecosystem. In case of any inconsistency between relevant terms of use of the above platforms and the contents of these Terms, the respective applicable terms of such platforms shall prevail.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    1.2 Verdstamp Operators refer to all parties that run Verdstamp, including but not limited to legal persons, unincorporated organizations and teams that provide Verdstamp Services and are responsible for such services. For convenience, unless otherwise stated, references to “Verdstamp” and “we” in these Terms specifically mean Verdstamp Operators. UNDER THESE TERMS, Verdstamp OPERATORS MAY CHANGE AS Verdstamp&apos;s BUSINESS ADJUSTS, IN WHICH CASE, THE CHANGED OPERATORS SHALL PERFORM THEIR OBLIGATIONS UNDER THESE TERMS WITH YOU AND PROVIDE SERVICES TO YOU, AND SUCH CHANGE DOES NOT AFFECT YOUR RIGHTS AND INTERESTS UNDER THESE TERMS. ADDITIONALLY, THE SCOPE OF Verdstamp OPERATORS MAY BE EXPANDED DUE TO THE PROVISION OF NEW Verdstamp SERVICES, IN WHICH CASE, IF YOU CONTINUE TO USE Verdstamp SERVICES, IT IS DEEMED THAT YOU HAVE AGREED TO JOINTLY EXECUTE THESE TERMS WITH THE NEWLY ADDED Verdstamp OPERATORS. IN CASE OF A DISPUTE, YOU SHALL DETERMINE THE ENTITIES BY WHICH THESE TERMS ARE PERFORMED WITH YOU AND THE COUNTERPARTIES OF THE DISPUTE, DEPENDING ON THE SPECIFIC SERVICES YOU USE AND THE PARTICULAR ACTIONS THAT AFFECT YOUR RIGHTS OR INTERESTS.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    1.3 Verdstamp Services refer to various services provided to you by Verdstamp that are based on Internet and/or blockchain technologies and offered via Verdstamp websites, mobile applications, and other forms (including new ones enabled by future technological development).
                                </p>
                            </section>
                            <section
                                id={`section-${1}`}
                                ref={(el) => {
                                    sectionRefs.current[1] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">2. Acceptance of Terms</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    2.1 You are at least 18 years of age and have the full capacity to accept these Terms and enter into a transaction involving digital assets. You are not deprived the right to use our service and have the full capacity for legal action. If you do not meet the above condition, please do not register at our Platforms, otherwise the Company may suspend or terminate your account at any time.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">   2.2 Your entering into and performing these Terms are not prohibited by the laws and regulations of the country or region to which you belong, reside, pay tax or carry out business activities or other business. If you do not meet the above conditions, you should immediately terminate the registration or stop using our Platforms&apos; services. For the avoidance of doubt, Verdstamp does not provide any services to persons or entities who are resided in or a citizen of the United States of America, Canada, the People&apos;s Republic of China or Hong Kong SAR.</p>

                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">   2.3 By completing the full registration process or continuing to use our Platforms&apos; related services from time to time, you fully understand and accept the entirety of these Terms, as amended and published from time to time on the Platforms. The contents of these Terms include all the terms of these Terms and the various rules that have been released by our Platforms or may be released in the future. All the rules published on the Platforms from time to time are hereby expressly incorporated and form an integral part of these Terms and have the same legal effect as the body of these Terms.</p>

                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">   2.4 Our Platforms have the right to modify these Terms from time to time or to formulate and modify various specific rules according to these Terms and publish them in the relevant system sections of Platforms without separately notifying you. You should pay attention to the changes in these Terms and the specific rules from time to time. If you continue to use the services after the changes in the content of these Terms and the specific rules, you are deemed to have fully read, understood and accepted the amended Terms and the specific rules and to use the services of our Platforms in accordance therewith. You are advised to check these Terms from time to time and in any event on each occasion you utilize any Verdstamp Service, access to Verdstamp website or mobile application.</p>

                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">   2.5 By accepting these Terms and/or accessing the services of our Platforms from your account (either personally or through another person) in accordance with these Terms and the relevant rules and instructions of our Platforms, these Terms shall have legal effect between you and Verdstamp. These Terms do not cover legal relationships or legal disputes between you and other users of our Platforms as a result of network services or transactions, if any.</p>

                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">   2.6 You also agree that Verdstamp may, by giving notice, at its sole discretion immediately terminate your access to our Platforms and to your account. You agree and acknowledge our right to limit, suspend or terminate the service and your user account, prohibit your access to our Platforms and their content, services and tools, delay or remove hosted content, and take technical and legal steps to keep you off our Platforms or any further steps to recover any loss or damages caused if we determine at our sole discretion that you are or may be in breach of any laws, regulations, the rights of third parties, any of these Terms or Platform&apos;s policies, you do not meet the condition or capacity to accept these terms, and/or for any other reasons we cease to provide Verdstamp Service to you. Verdstamp shall not be liable for any loss or damage caused to you or any third party as a result of exercising our rights under this clause.</p>
                            </section>
                            <section
                                id={`section-${2}`}
                                ref={(el) => {
                                    sectionRefs.current[2] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">3. Scope of Service and Your Rights and Obligations</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.1 Verdstamp provides you with Verdstamp Service, including the service of trading one type of digital asset for another type of digital asset. We do not purchase or sell digital assets directly from or to users as principal. Our services do not provide users with the ability to trade one form of fiat currency for another form of fiat currency.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.1.1 Users have the right to browse the digital currency real-time market and transaction information on our Platforms, and have the right to submit digital currency trading instructions and complete digital currency trading through our Platforms.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.1.2 Users have the right to view the information regarding their accounts on our Platforms, and have the right to operate the functions provided by our Platforms, subject to any restrictions imposed by our Platform against specific users or users from specific regions.
                                </p>

                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.1.3 Users have the right to participate in the website activities organized by our Platforms in accordance with the activity rules published by our Platforms and other services undertaken by our Platforms.
                                </p>

                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.2 The user understands and agrees that our Platforms can adjust the service content, service type and service form on the Platforms at any time according to the actual situation at our sole discretion. Our Platforms are not responsible for any negative impact or loss caused to you or any third party due to Platforms adjustments.
                                </p>

                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.3 Depending on your country of residence, you may not be able to use all the functions of our Platforms. Without prejudice to our right of suspending certain services to users from a specific country, it is your responsibility to ensure that in accessing our Platforms and services, you are complying with the laws and regulations in your country of residence and/or the country from which you access our Platforms and services. For the avoidance of doubt, Verdstamp does not provide any services to persons or entities who are resided in or a citizen of the United States of America, Canada, the People&apos;s Republic of China or Hong Kong SAR.

                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.4 In order to access and use our services, you must create an account with Verdstamp. You agree to:
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    （1）provide accurate, current and complete information when creating the account;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    （2）maintain and promptly update your account information to keep it accurate, complete, and current;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    （3）maintain the security and confidentiality of your login credentials and restrict access to your account and your computer;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    （4）promptly notify Verdstamp if you discover or otherwise suspect any security breaches related to our Platforms;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    （5）take responsibility for all activities that occur under your account and accept all risks of unauthorized access.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.5 In order to provide services to users, our Platforms may use user&apos;s personal information, non-personal information, and information provided by third parties (hereinafter collectively referred to as &qout;user information&qout;). Once the user registers, logs in, and uses our Platforms&apos; services, the user will be deemed to fully understand, agree and accept the reasonable use of the user information by the Company including but not limited to collection, statistics and analysis thereof.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.6 You acknowledge that the status of the transaction confirmed by you on our Platforms in accordance with our Platforms&apos; service processes would be an explicit direction for our Platforms to conduct related transactions or operations for you. You agree that our Platforms have the right to deal with related matters in accordance with these Terms and/or relevant documents and rules in accordance with the relevant directions.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.7 You are responsible for any disputes or losses caused by your failure to promptly modify or confirm the status of the transaction or failure to submit the relevant application. Our Platforms do not assume any responsibility.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.8 You acknowledge that the Platform does not endorse or guarantee the safety, security, or legitimacy of any project which tokens are listed on our Platform. In the event a project violates any laws and regulations in any jurisdictions, project&apos;s founders or core team members are subject to criminal or civil liabilities, or that the project is compromised due to hacking, fraud, or other security breaches, including subsequent actions such as token freezes, modifications, or changes implemented on the blockchain by the project or relevant third parties, the exchange will not be held responsible for these actions or their consequences.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.9 Verdstamp has the absolute discretion to delist any tokens on the Platform, delist any token pairs available on the Platform, and/or terminate any services related to any tokens. In such circumstances, Verdstamp shall disclose on website the schedule of delisting of tokens, and the schedule of withdrawal of tokens. For the avoidance of doubt, the Verdstamp shall have the right to revise, amend or cancel any schedule to terminate the deposit, withdrawal or trading of any tokens without notice. In all circumstances, Verdstamp shall not be responsible or liable to any loss or damages arising from delisting any tokens, token pairs or the termination of our services related to any tokens.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.10 In any event if you utilize our Verdstamp Service via Application Programming Interface (API), or using any API provided by us (collectively, “API Service”), you agree and understand that Verdstamp only grant you a limited, non-exclusive, non-sublicensable, non-transferable, non-assignable and revocable license to use our API, and such license shall not grant you any rights over any data, personal data or any intellectual property found in content accessible through the API. By using the API Service, you further agree and acknowledge that:
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (a) you shall not interfere with or disrupt our API or the severs or networks providing the API;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (b) you shall not exploit or test any vulnerability of the API or servers, inject any unauthorised or malicious scripts, codes, commands, queries, or requests, or introduce any malicious codes through the API;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (c) you shall not user the API Service in any manner that could potentially undermine the security of the API Service, or any data, information stored, or transmitted using the API Service. In addition, you shall not, and shall not attempt to: (i) interfere with, modify or disable any features, functionality or security controls of the services or the API, (ii) defeat, avoid, bypass, remove, deactivate or otherwise circumvent any protection mechanisms for the service or the API, (iii) reverse engineer, decompile, disassemble or derive source code, underlying ideas, algorithms, structure or organizational form from the API Service;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (d) you shall not use the API service in order to monitor the availability, performance, or functionality of any of the API or for any similar benchmarking purposes;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (e) you shall not under any circumstances repackage or resell the API Service, or any part of the API or API Service;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (f) you shall not under any circumstances, use the API Service in any way that infringes or misappropriates any intellectual property of any person or that is in violation of applicable laws and regulations;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (g) you shall not commercially exploit the APIs;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (h) your use of our API Service is subject to any additional terms and limitations imposed by us from time to time without prior notice to you;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (i) we reserve our rights to revise, amend, alter, delete or in any manner change the API documentation any time at our sole and absolute discretion without prior notice to you;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (k) you are solely responsible for the security of your API Key and any compromise therefrom. We shall not be liable for executing any instructions or commands arising from the use of your API Key by any third-party;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (l) you agree that we may monitor your Use of the API to improve the service, track usage, to ensure compliance with these terms, or for security purposes;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (m) you shall immediately notify us upon becoming aware of any unauthorised use of the APIs;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (n) you shall use our API and API Service in accordance with our published technical and other specifications, including all security requirements and procedures found on our website;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (o) you are fully aware of the risk disclosure below and you shall use our API and API Service at your own risks, of which any of the API and API Service may be subject to congestion, downtime, error, bugs, or any unforeseeable circumstances which may suspend, terminate or prevent the usage of API and API Service. In such circumstances you agree that Verdstamp shall not be liable to you whether in contract, tort (including negligence), restitution, breach of statutory duty or otherwise for any direct, indirect, incidental or consequential damages.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (p) We may terminate this Agreement or suspend your access to the API for any reason whatsoever without prior notice to you. Upon such termination or suspension, you shall immediately stop using the API.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.11 For the avoidance of doubt, the API Service provided by Verdstamp is on an &qout;as is&qout; and &qout;as available&qout; basis. You acknowledge all the risk disclosure hereinbelow and we make no representations or warranties in relation to the APIs, including but not limited to any representation or warranty as to the accuracy, completeness, reliability, service levels, continued availability, timeliness, non-infringement, title, quality, merchantability, or fitness for any particular purpose of the API Service to the fullest extent permitted by the law. We shall not be liable to you or any third party whether in contract, tort (including negligence), restitution, breach of statutory duty or otherwise, for any loss or inaccuracy of or cost or any indirect, incidental or consequential damages including, but not limited to loss of revenues and loss of profits or any amount arising directly or indirectly from your or any third party&apos;s use of, or inability to use the API Service or any of our API(s), whether such use was authorized or not.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    3.12 Verdstamp has the right to restrict or impose conditions in your account, close your account or transfer any asset from your account to any party as Verdstamp deemed appropriate if, in Verdstamp&apos;s discretion, that you (a) may have violated any laws or regulations in any jurisdiction; (b) are a target of investigation by regulators or enforcement agency in any jurisdiction; (c) may have breached of these terms or any rules and regulations imposed by Verdstamp; (d) may be convicted in any criminal proceedings; (e) may be subject to any civil proceedings or being a judgment debtor in any jurisdiction which you asset may be claimed by any creditor in any jurisdiction; or (f) have not log in, conduct any action or activity with your account held at Verdstamp for over 12 months, or for a period of time set by Verdstamp, provided that such period of time shall not be less than 12 months.
                                </p>
                            </section>
                            <section
                                id={`section-${3}`}
                                ref={(el) => {
                                    sectionRefs.current[3] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">4. Risks Disclosures and Acknowledgements</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1 Loan and Margin Trading Risk Disclosures and Acknowledgements.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.1 Verdstamp launches a loan service to provide users with long/short margin trading services.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.2 The maximum amount of coins borrowed by the user is determined by the highest loan multiple, and currently Verdstamp supports up to 5 times margin trading services.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.3 Verdstamp provides risk management services for margin trading by monitoring and managing the risks of users&apos; margin accounts in Verdstamp.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.4 When using a margin trading, you unconditionally authorize Verdstamp to take actions such as reducing the position, or even completely closing the position, when the user&apos;s loan is due or the risk of the margin trading occurs, without liability whatsoever to you.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.5 When using margin trading, you should abide by relevant national laws and ensure that the source of the transaction assets is legal and compliant. Users shall not use margin trading to commit any crime against the law of the country where you belong to, reside, pay tax, carry out business activities or any other activities. Crimes herein include but not limited to money laundry.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.6 When using margin trading, you should fully recognize the risks of digital asset investment and the risks of margin trading, and exercise caution and do your best.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.7 You agree that all investment operations conducted at Verdstamp represent your true willingness to invest and unconditionally accept the potential risks and benefits of investment decisions.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.8 You understand that there may be fees and other related fees arising out of loan and margin trading, and agree to pay the corresponding fees according to the requirements of our Platforms published from time to time.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.9 You agree that Verdstamp retains the rights and authority to, at its sole discretion and without liability whatsoever to you or any third party, reduce the position, close the position, and automatically repay the risk control operation when the margin account is at risk, and unconditionally accepts the final result.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.10 When using margin trading, if there is a position the loan account asset (lending assets + interest), the difference will be recorded as arrears incurred by you. As long as there are arrears outstanding, the use of the withdrawal function will be restricted without affecting the transaction. The withdrawal function will be resumed after the arrears are repaid.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.11 Verdstamp reserves the right to suspend or terminate the business of loan and margin trading. When necessary, the Platforms may suspend or terminate the loan and leverage trading business at any time.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.1.12 Due to unexpected problems such as system failure, network reasons, denial-of-service attacks and other hacking attacks, abnormal transactions, market interruptions, or other possible abnormal conditions, we have the right to cancel the abnormal transaction results and roll back all the deals during a certain period of time according to the actual situation at our sole discretion without any liability whatsoever to you or any third party.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.2 Perpetual Contract Risk Disclosures and Acknowledgements
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.2.1 Digital assets themselves are risky. The price of digital assets is prone to fluctuate, there is no limit for prices to go up and down, and there are unlimited transactions 24 hours a day, 7 days a week worldwide. Prices are easily affected by the control of the dealer and global news events, national policies, market demand and other factors. It may happen that prices rise several times a day, and prices may fall by half in one day. Due to the high leverage of the perpetual contract, you may suffer a large loss, so we strongly recommend that participate in trading within the risk range that you can afford.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.2.2 Due to unexpected problems such as system failure, network reasons, denial-of-service attacks and other hacking attacks, abnormal transactions, market interruptions, or other possible abnormal conditions, we have the right to cancel the abnormal transaction results and roll back all the deals during a certain period of time according to the actual situation at our sole discretion without any liability whatsoever to you or any third party.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.2.3 We strictly prohibit any unfair trading practices. We have the right to warn against all unscrupulous behaviors such as maliciously manipulating prices, maliciously affecting trading systems, and, when necessary, to restrict transactions, suspend transactions, cancel transactions, reverse closed transactions, freeze accounts, rollback time transactions, etc., to eliminate adverse effects at our sole discretion without any liability whatsoever to you or any third party.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.2.4 When your position margin cannot meet the Platform&apos;s requirements, your position will be forced to close. If the price fluctuates drastically and loss is incurred after using all risk control methods, we shall have the right to recover the loss from you.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.2.5 When the number of positions or the number of orders is too large and we believe that there may be serious risks to the system and other users, you understand and agree that we have the right to ask you to take measures such as cancellation, closing and other risk control measures. In addition, when we deem it necessary, we have the right to control the risk of individual accounts by limiting the total number of positions, limiting the total number of orders, limiting the opening of positions, withdrawing orders or forcibly closing positions at our sole discretion without any liability whatsoever to you or any third party.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.3 API Service Risk Disclosures and Acknowledgements
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.3.1 Trading through an API increases the risk posed to your account security and may result in the compromise of your account credentials and the loss of funds that you have deposited into your Account. It is important that you fully understand the risks involved in using an API.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.3.2 Using an API will allow you to use, access, call, command, query or request the API to take certain actions in relation to your Account for and on your behalf.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.3.3 Prior to using our API or API Service, you must verify your identity through an API Key. You will, therefore, be required to create an API Key on with us. The API Key is a representation, verification, and authentication of your identity to us and is comprised of a public and a private key pair.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.3.4 Certain external service providers may require you to give them your API Key to support convenience services. Giving away your API Key is akin to giving away your login credentials. Giving away your API Key to a third party also means the third-party can and will have access to all your Account details, data, and authority to make and give instructions to our API on your behalf. You should exercise extreme caution in verifying the credibility and reliability of third parties that request for your API Key.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.3.5 APIs are subject to certain limitations such as limits for pulling or pushing data. API functions are also limited by the API commands that are available. APIs may also be victim of poor computer engineering and as a result suffer erroneous application or result in compromise.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.3.6 You should understand and study the API Documentation that is updated from time to time with the prevailing limitations. These limitations, updates on bugs, addition, amendment, or removal of commands will affect your use of API Service. Such changes may altogether affect (if on-going) the functioning of your API and accordingly our services to you.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.3.7 We may at times make amendments to the Use of the API without prior notice to you or without updating the API Documentation. This may impact your Use of the API and you therefore understand and accept the risks set out in the Risk Disclosures herein and accept that it is your sole responsibility to keep yourself consistently updated on changes to the API Documentation.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.3.8 When accessing and using our Services via the API, you acknowledge and accept that you may not receive the same notifications, warnings, prompts, alerts, or disclosures available on the Web Interface. This includes, without limitation, reference price disclosures, risk warnings, system or maintenance notifications, and trade execution messages. You are solely responsible for monitoring your orders, account activities, execution outcomes, and any relevant system or platform updates. Due to the automated nature of the API, you further acknowledge and accept that certain notifications or disclosures may be incomplete, delayed, or delivered in a different format or frequency than the Web Interface, which may increase your exposure to operational, market, or technical risks. We disclaim all liability for any losses, discrepancies, or damages arising from your reliance on such information while using the API.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    4.4 Fund Restriction Risks
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    We reserve the right, at our sole discretion, to impose the following restrictions on your account funds:
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    a. Scope of Restrictions
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (i) Suspend or limit deposits, withdrawals, access to funds, or use of funds;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (ii) Prohibit the use of funds for any products (including but not limited to margin trading, futures trading) or other financial instruments.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    b. Triggering Events
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Restrictions may be imposed, at our absolute discretion, in the following circumstances:
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (i) you may violate any applicable laws, regulations, or law enforcement directives;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (ii) you may violate any risk management protocols or our internal policies;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (iii) you may breach any regulatory requirements or legal restrictions on specific funds;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (iv) Suspected violations of our platform rules (e.g., market manipulation, fraud, money laundering); and/or
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (v) your actions and/or activities may impose harm or affect the interests of our Platform and/or the users of our Platform.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    c. Potential Consequences
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    You hereby are aware and acknowledge that if the restrictions are imposed, the consequences you may face include, but not limited to the following:
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (i) Forced reduction or closure of positions;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (ii) Inability to transfer restricted funds to leveraged products or other instruments;
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (iii) Restricted funds may be held indefinitely pending investigation or regulatory approval; and/or
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (iv) Any other consequences which may arise in the circumstances which are not foreseeable.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    d. Liability Disclaimer
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (i) We expressly disclaim any liability for losses, damages, or financial consequences on your part arising from these restrictions, including but not limited to liquidations or other adverse impacts on your positions, adverse market impacts, third-party actions, or force majeure events (e.g., cyberattacks, system failures, government actions);
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    (ii) You acknowledge and agree that you solely shall bear all risks and losses arising from or associated with fund restrictions, whether or not we have provided prior notice.
                                </p>
                            </section>
                            <section
                                id={`section-${4}`}
                                ref={(el) => {
                                    sectionRefs.current[4] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">5. Transaction & Fees</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    5.1 Our Platforms will provide services for your transactions, and collect necessary services or management fees, in accordance with these Terms, relevant documents, agreements and/or relevant rules and instructions on our Platforms during the service process. Please refer to the relevant documents and the rules and descriptions of the relevant pages of our Platforms which are hereby expressly incorporated into these Terms and may be amended from time to time.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    5.2 You agree that our Platforms reserve the right to adjust the specific types and amounts of the aforementioned services or management fees from time to time and to make announcements and amendments in accordance with the Terms and related rules, and your continued access to our services constitutes your acceptance to the relevant rules in their latest forms.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    5.3 Without prejudice to Clause 3.12 above, in the event your account relationship with Verdstamp has been terminated, your assets held at Verdstamp must be withdrawn within 90 days. Verdstamp shall impose a monthly custodian fee equivalent to 5% of the total remaining assets in your account with Verdstamp. In any event if your account balance becomes zero (0), Verdstamp shall have the right to close your account forthwith.
                                </p>
                            </section>
                            <section
                                id={`section-${5}`}
                                ref={(el) => {
                                    sectionRefs.current[5] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">6. Modification/ Suspension/ Termination of Service</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    6.1 These Terms shall remain in force unless unilaterally terminated by our Platforms or upon your application to terminate these Terms and with the consent of our Platforms. In the event that you violate these Terms, relevant rules, any laws or regulations, or we reasonably suspect that you are involved in illegal or inappropriate conduct in using our services, or at the request of government authorities, our Platforms reserve the right to, at our sole discretion and without any liability whatsoever to you, terminate these Terms, close your account, or restrict your use of our Platforms. However, our termination does not relieve you of your obligations under these Terms or other agreements generated on our Platforms.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    6.2 If you find that a third person fraudulently misappropriated or misappropriated your user account and password, or any other circumstances that are not legally authorized, you should immediately notify our Platforms in an effective manner, requesting our Platforms to suspend the related services. All the liabilities, losses, damages, claims, costs or expenses arising from or in connection with use of your account, whether authorized or unauthorized, shall be borne by you.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    6.3 In view of the particularity of the network service, you agree that our Platforms have the right to change, discontinue or terminate some or all of the network services at any time without prior notification nor any liability whatsoever to you or any third party.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    6.4 You understand that our Platforms need to be repaired or maintained on a platform that provides network services (such as Internet sites, mobile networks, etc.) or related equipment on a regular or irregular basis. If such a situation causes the network service to be interrupted within a reasonable period of time, our Platforms shall provide notice as soon as practicable but shall not be responsible for any loss, damage, claim or liability otherwise arising therefrom.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    6.5 Our Platforms have the right to stop, suspend or terminate all or part of the services under these Terms without notice, to take any mitigation or interlocutory measures (including without limitation to cancelling or reversing transactions and freezing accounts), and to remove or delete the registration data, at our sole discretion without any liability whatsoever to you or any third party. Without prejudice to the generality of the above, we may seek to enforce our right in the following scenarios:
                                </p>
                                <ul className="list-disc pl-6 text-sm leading-relaxed text-lnd-fg-muted mb-4 marker:text-lnd-accent">
                                    <li>Our Platforms believe that the personal data you provide is not authentic, valid or complete;</li>
                                    <li>Our Platforms discover or suspect an abnormal or illegal transaction or unusual activities on your part;</li>
                                    <li>Our Platforms consider that your account is suspected of money laundering, cashing, pyramid schemes, fraudulent use or other situations that our Platforms consider to be risky;</li>
                                    <li>Our Platforms believe that you have violated these Terms;</li>
                                    <li>If you use the fee-based network service, you do not pay the corresponding service fee to our Platforms as required;</li>
                                    <li>We detect unauthorized access to your account, or your account is subject to a governmental proceeding, criminal/regulatory investigation or any pending litigation;</li>
                                    <li>Other circumstances in which at our Platforms&apos; sole discretion, it is necessary to suspend, interrupt or terminate all or part of the services under these Terms and remove or delete the registration data.</li>
                                    <li>Our platform may impose fund restrictions as detailed in Section 4.4.</li>
                                </ul>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    6.6 You agree that the suspension, interruption or termination of your account or any other measures taken by us pursuant to the preceding clause does not release you from your liability, and you shall be liable for possible breach of contract or damages or any other cause of action during your use of the Platform&apos;s services, and our Platforms may retain your information.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    6.7 If the account of the free network service you registered is not actually used for any consecutive 90 days, our Platforms have the right to delete the account and stop providing relevant network services for you.
                                </p>
                            </section>
                            <section
                                id={`section-${6}`}
                                ref={(el) => {
                                    sectionRefs.current[6] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">7. Rules of Use</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    7.1 [Account Information Content Specification]
                                </p>
                                <ul className="list-disc pl-6 text-sm leading-relaxed text-lnd-fg-muted mb-4 marker:text-lnd-accent">
                                    <li>When applying for the Platforms&apos; service, you should provide accurate personal information in accordance with the relevant rules of the platform. If there is any change in personal data, you should update it in time.</li>
                                    <li>You should not transfer or lend your account number or password to others. If you find that others have illegally used your account, you should immediately notify the Platforms. Our Platforms do not assume any responsibility for the illegal use of accounts and passwords due to viruses, hacking or negligence of users.</li>
                                </ul>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    7.2 [Service Operation Specifications]
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    7.2.1 Users shall abide by the provisions of laws, regulations, rules, regulatory documents and policy requirements to ensure the legality of all digital currency sources in the account. You may not engage in the following acts during the use of our Platforms and related services, except as permitted by law or with the written permission of the Platforms:
                                </p>
                                <ul className="list-disc pl-6 text-sm leading-relaxed text-lnd-fg-muted mb-4 marker:text-lnd-accent">
                                    <li>Use the Platforms&apos; service to conduct any behaviour that may adversely affect the normal operation of the internet or mobile network;</li>
                                    <li>Upload, display or disseminate any false, harassing, slanderous, abusive, intimidating, vulgar information or speeches or any other information or speeches in violation of laws and regulations, by using the web services provided by the Platforms.</li>
                                    <li>Use the Platforms&apos; service system to conduct any behaviour that is not conducive to the Platforms;</li>
                                    <li>Infringe on the legal rights of third parties, such as reputation rights, portrait rights, intellectual property rights, trade secrets, etc. or infringe on the commercial interests of anyone;</li>
                                    <li>Induce other users to click on the link page or share information, or use the Platforms&apos; accounts and any features, as well as third-party operating platforms, for promotional purposes without written permission from the Platforms, or to publish commercials that are not licensed by the Platforms;</li>
                                    <li>Produce or publish methods or tools related to the above acts, or operate or disseminate the methods or tools, whether or not they are for commercial purposes;</li>
                                    <li>Other breach or potential breach of laws and regulations, rights of any third party, interference with the normal operation of the Platforms.</li>
                                </ul>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    7.2.2 The user promises to comply with all the digital currency trading rules of the Platforms including but not limited to the following:
                                </p>
                                <ul className="list-disc pl-6 text-sm leading-relaxed text-lnd-fg-muted mb-4 marker:text-lnd-accent">
                                    <li>
                                        <b>Browse transaction information</b>
                                        <br />
                                        When users browse digital currency transaction information on the Platforms, they should carefully read all the content contained in the transaction information, including but not limited to digital currency price, request amount, handling fee, buying or selling direction, and the users shall fully accept all the content contained in the transaction information before entering into a transaction by clicking the button.
                                    </li>
                                    <li>
                                        <b>Submit a request</b>
                                        <br />
                                        The user can submit a transaction request after checking and confirming the transaction information. After the user submits the transaction request, that is, the user authorizes our Platforms to perform the corresponding matching transaction on behalf of the user, our Platforms will automatically complete the matching transaction when there is a transaction satisfying the user&apos;s requested price without notifying the user in advance.
                                    </li>
                                    <li>
                                        <b>View transaction details</b>
                                        <br />
                                        The user can view the corresponding transaction record through the account transaction details to confirm their detailed transaction records.
                                    </li>
                                    <li>
                                        <b>Cancellation / modification of request</b>
                                        <br />
                                        The user has the right to revoke or modify the request at any time before the matching transaction is executed.
                                    </li>
                                </ul>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    7.3 Our Platforms have the right to review and supervise your use of the Platforms&apos; services (including but not limited to approving the content stored on our Platforms by you). If you use the Platforms&apos; services in violation of any of the above provisions, our Platforms have the right to ask you to remedy your breach (if possible) or directly take all necessary measures (including but not limited to changing or deleting the content you posted, suspending or terminating your right to use the services) to mitigate the impact of your conduct.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    7.4 Orders you place on Verdstamp during regular operation will normally be executed if the market price is at a point within the limits of your order. However, we do not guarantee that your order will be filled even if the market price was within your limit at the time such order was placed or was otherwise open. Orders you place on Verdstamp during planned or unplanned downtime will be processed on a commercially reasonable efforts basis once we resume operations. Verdstamp reserves the right to reject or cancel orders made and/or pending during downtime.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    7.5 Orders may be subject to, and Verdstamp shall have no liability for, delays, difficulties, and/or conditions affecting transmission or execution of orders over which Verdstamp has no control, including, but not limited to, mechanical or electronic failure or market congestion.
                                </p>
                            </section>
                            <section
                                id={`section-${7}`}
                                ref={(el) => {
                                    sectionRefs.current[7] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">8. Intellectual Property</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    8.1 All content on our Platforms are the property of Verdstamp and is protected by copyright, patent, trademark and any other applicable laws, unless otherwise specified herein.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    8.2 The trademarks, trade names, service marks and logos of Verdstamp and others used on our Platforms are the property of Verdstamp and its respective owners. The software, applications, text, images, graphics, data, prices, trades, charts, graphs, video and audio materials used on our Platforms belong to Verdstamp. The trademarks and other content on our Platforms should not be copied, reproduced, modified, republished, uploaded, posted, transmitted, scraped, collected or distributed in any form or by any means, no matter manual or automated.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    7.3 The use of any content from our Platforms on any other site or a networked computer environment for any other purpose is strictly prohibited; any such unauthorized use may violate copyright, patent, trademark and any other applicable laws and could result in criminal or civil penalties.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    8.4 Verdstamp is a trademark owned by the Company and allows no unauthorized use by any user or third parties.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    8.1 All content on our Platforms are the property of Verdstamp and is protected by copyright, patent, trademark and any other applicable laws, unless otherwise specified herein.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    8.2 The trademarks, trade names, service marks and logos of Verdstamp and others used on our Platforms are the property of Verdstamp and its respective owners. The software, applications, text, images, graphics, data, prices, trades, charts, graphs, video and audio materials used on our Platforms belong to Verdstamp. The trademarks and other content on our Platforms should not be copied, reproduced, modified, republished, uploaded, posted, transmitted, scraped, collected or distributed in any form or by any means, no matter manual or automated.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    7.3 The use of any content from our Platforms on any other site or a networked computer environment for any other purpose is strictly prohibited; any such unauthorized use may violate copyright, patent, trademark and any other applicable laws and could result in criminal or civil penalties.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    8.4 Verdstamp is a trademark owned by the Company and allows no unauthorized use by any user or third parties.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    8.5 Verdstamp supports the protection of intellectual property. If you wish to submit a trademark claim for violation of a registered trademark or service mark, or a copyright claim for material on which you hold a valid copyright, please email support@CoinMaiden.com.
                                </p>
                            </section>
                            <section
                                id={`section-${8}`}
                                ref={(el) => {
                                    sectionRefs.current[8] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">9. Privacy Policy</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    By registering, logging in, or using our Platforms&apos; services, you are deemed to have fully understood, agreed to, and accepted our Platforms&apos; privacy policy.
                                </p>
                            </section>
                            <section
                                id={`section-${9}`}
                                ref={(el) => {
                                    sectionRefs.current[9] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">10. Disclaimer of Liability</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Our Platforms are not giving investment advice, tax advice, legal advice, or other professional advice by allowing you to use our services or providing the services herein, the ability to purchase or sell digital assets or the storage of digital assets, and we do not recommend, or endorse that you purchase or sell digital assets, or make any investment. Before engaging in any transaction or investment activity, you should consult a qualified professional.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    The services that we provide through Verdstamp are provided to you on a strictly “as is,” “where is” and “where available” basis. The company does not represent or warrant to the accuracy, completeness, currentness, non-infringement, merchantability, or fitness for a particular purpose of Verdstamp or the information contained therein or services contained thereon. The company shall not be liable to you or anyone else for any loss or injury resulting directly or indirectly from your use of Verdstamp or any services provided by Verdstamp, including any loss caused in whole or part by any inaccuracies or incompleteness, delays, interruptions, errors or omissions, including, but not limited to, those arising from the negligence of the company or contingencies beyond their control in procuring, compiling, interpreting, computing, reporting, or delivering Verdstamp, the services thereon or the information therein. In no event will the company be liable to you or anyone else for any decision made or action taken by you in reliance on, or in connection with your use of Verdstamp, the services thereon or the information therein.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    In no event will the company be liable to you, whether in contract or tort, for any direct, special, indirect, consequential or incidental damages or any other damages of any kind even if the company has been advised of the possibility thereof. This limitation on liability includes, but is not limited to, the transmission of any viruses which may infect a user&apos;s equipment, failure of mechanical or electronic equipment or communication lines, telephone or other interconnect problem, unauthorized access, theft, operator errors, strikes or other labor problems or any force majeure. We cannot and do not guarantee continuous, uninterrupted or secure access to Verdstamp.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Our Platforms are not giving investment advice, tax advice, legal advice, or other professional advice by allowing you to use our services or providing the services herein, the ability to purchase or sell digital assets or the storage of digital assets, and we do not recommend, or endorse that you purchase or sell digital assets, or make any investment. Before engaging in any transaction or investment activity, you should consult a qualified professional.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    The services that we provide through Verdstamp are provided to you on a strictly “as is,” “where is” and “where available” basis. The company does not represent or warrant to the accuracy, completeness, currentness, non-infringement, merchantability, or fitness for a particular purpose of Verdstamp or the information contained therein or services contained thereon. The company shall not be liable to you or anyone else for any loss or injury resulting directly or indirectly from your use of Verdstamp or any services provided by Verdstamp, including any loss caused in whole or part by any inaccuracies or incompleteness, delays, interruptions, errors or omissions, including, but not limited to, those arising from the negligence of the company or contingencies beyond their control in procuring, compiling, interpreting, computing, reporting, or delivering Verdstamp, the services thereon or the information therein. In no event will the company be liable to you or anyone else for any decision made or action taken by you in reliance on, or in connection with your use of Verdstamp, the services thereon or the information therein.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    In no event will the company be liable to you, whether in contract or tort, for any direct, special, indirect, consequential or incidental damages or any other damages of any kind even if the company has been advised of the possibility thereof. This limitation on liability includes, but is not limited to, the transmission of any viruses which may infect a user&apos;s equipment, failure of mechanical or electronic equipment or communication lines, telephone or other interconnect problem, unauthorized access, theft, operator errors, strikes or other labor problems or any force majeure. We cannot and do not guarantee continuous, uninterrupted or secure access to Verdstamp.
                                </p>
                            </section>
                            <section
                                id={`section-${10}`}
                                ref={(el) => {
                                    sectionRefs.current[10] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">11. Risks</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    11.1 Digital assets transaction may be subject to high risks.
                                </p>
                                <ul className="list-disc pl-6 text-sm leading-relaxed text-lnd-fg-muted mb-4 marker:text-lnd-accent">
                                    <li>The risk of loss in trading digital assets may be substantial and losses may occur over a short period of time.</li>
                                    <li>The price and liquidity of digital assets have been subject to large fluctuations in the past and may be subject to large fluctuations in the future.</li>
                                    <li>
                                        You acknowledge that digital assets, including those related to specific projects, are subject to inherent business risks, cybersecurity risks, and other uncertainties. While the exchange will make reasonable efforts to evaluate the projects behind each listed token, you understand that the exchange cannot guarantee the ongoing validity or functionality of any digital asset or project. The exchange will impose appropriate warnings or take actions as necessary regarding the listed tokens. If a digital asset or its related project is no longer deemed valid or functional, the exchange reserves the right to delist the associated asset. In such cases, the exchange will issue announcements via its platform, and users will be given a specified timeframe to withdraw the affected tokens. After the specified deadline, the exchange will have no responsibility for the safekeeping of those tokens, and users accept any resulting risk.
                                    </li>
                                </ul>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    11.2 You acknowledge that you are solely responsible for determining the nature, potential value, suitability, and appropriateness of these risks for you, and that Verdstamp does not give advice or recommendations.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    11.3 Legislative and regulatory changes or actions at the state, federal or international level may adversely affect the use, transfer, exchange and value of digital assets.
                                </p>
                            </section>
                            <section
                                id={`section-${11}`}
                                ref={(el) => {
                                    sectionRefs.current[11] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">12. Indemnity</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    You agree to defend, indemnify and hold harmless Verdstamp from any claim, demand, action, damage, loss, cost or expense, including without limitation reasonable attorneys&apos; fees, arising out or relating to your violation of these Terms; or your violation of any laws, rules or regulations; or your violation of any rights of any other person or entity; or your use of all or part of the services provided by the Platforms.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    In relation to your use of our API or API Service, you shall indemnify us against all liabilities, damages, costs (including legal costs) and expenses arising directly or indirectly from:
                                </p>
                                <ul className="list-disc pl-6 text-sm leading-relaxed text-lnd-fg-muted mb-4 marker:text-lnd-accent">
                                    <li>any claim made by a third party in connection with your use of our API; and</li>
                                    <li>any system failure or downtime, and/or any lost or damaged data or software, arising from or in connection with your use of our API or API Service;</li>
                                </ul>
                            </section>
                            <section
                                id={`section-${12}`}
                                ref={(el) => {
                                    sectionRefs.current[12] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">13. Notifications</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    13.1 Notices under these Terms are made by way of public notice and are deemed to have been served as soon as they are published on our Platforms. In addition, other proprietary notices that are posted to you personally will be provided by our Platforms to the email address provided by you at the time of registration, or the in-site message in your personal account, or to the mobile phone provided to our Platforms after your registration. Once sent, it will be deemed to have been delivered. Please pay close attention to your email address, emails in the message system of the site, messages and SMS messages in your mobile phone.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    13.2 You understand and agree that all communication with you will be via electronic communication, including emails, site messages and SMS, and we will use those means to provide you with account-related notices and order receipts. To ensure that you receive all of our communications, you agree to keep your email address up-to-date and notify us immediately if there is any change. Delivery of any notice to the email address/mobile number on record with your user account will be considered valid. If any email is returned as undeliverable, we retain the right to block access to your user account until you provide and confirm a new email address.
                                </p>
                            </section>
                            <section
                                id={`section-${13}`}
                                ref={(el) => {
                                    sectionRefs.current[13] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">14. Disclosures to Legal Authorities and Authorized Financial Institutions</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    14.1 We may share your personal data with law enforcement agents, data protection authorities, government officials, and other authorities when:
                                </p>
                                <ul className="list-disc pl-6 text-sm leading-relaxed text-lnd-fg-muted mb-4 marker:text-lnd-accent">
                                    <li>required by law;</li>
                                    <li>compelled by subpoena, court order, or other legal procedure;</li>
                                    <li>we believe that disclosure is necessary to prevent damage or financial loss;</li>
                                    <li>disclosure is necessary to report suspected illegal activity;</li>
                                    <li>disclosure is necessary to investigate violations of these terms.</li>
                                </ul>
                            </section>
                            <section
                                id={`section-${14}`}
                                ref={(el) => {
                                    sectionRefs.current[14] = el;
                                }}>
                                <h2 className="font-Manrope text-xl font-bold text-lnd-fg mb-4">15. Miscellaneous</h2>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Our Platforms reserve the right of final interpretation of these Terms within the scope permitted by law. These Terms and related pages of our Platforms may refer to each other. If there is any conflict, these Terms shall prevail. In addition, if some of the provisions in these Terms are deemed invalid or unenforceable, the other provisions in these Terms will remain in effect.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    In the event of any conflict between these Terms and any other agreement you may have with Verdstamp, the terms of that other agreement will prevail only if these Terms are specifically identified and declared to be overridden by such other agreement.
                                </p>
                                <p className="text-sm leading-relaxed text-lnd-fg-muted mb-4">
                                    Any failure or delay by Verdstamp to enforce any of these Terms or to exercise any right hereunder shall not be construed as a waiver to any extent of our rights.
                                </p>
                            </section>
                </article>
            </div>
        </div>
    );
}
