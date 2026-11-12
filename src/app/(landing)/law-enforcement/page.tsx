import ArticleShell from "../components/ArticleShell";

const DISCLAIMER =
    "Disclaimer: The content on this website is for reference only and does not constitute investment advice. It is not a substitute for professional financial advice. Consult a qualified financial advisor before making investment decisions. The owners and authors disclaim liability for losses or damages arising from reliance on this information. All investments carry risks; past performance is not indicative of future results.";

export default function LawEnforcementPage() {
    return (
        <ArticleShell
            category="Compliance"
            title="Law Enforcement Request Guide"
            author="Customer Specialist Team"
            published="2020-07-23"
            updated="2024-08-14"
            backHref="/support"
            backLabel="Help centre"
            disclaimer={DISCLAIMER}
            avatar={
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-lnd-border bg-lnd-surface-2 font-Manrope text-xs font-bold text-lnd-accent">
                    CS
                </span>
            }
        >
            <section>
                <h2>Introduction</h2>
                <p>
                    Verdstamp will respond to authorized law enforcement
                    requests and disclose relevant information on a
                    case-by-case basis as legally required, in accordance with
                    applicable laws and our Terms of Service and Privacy Policy.
                </p>
            </section>

            <section>
                <h2>How to submit law enforcement requests?</h2>
                <p>
                    To process law enforcement requests promptly, send an email
                    to{" "}
                    <a
                        href="mailto:compliance@CoinMaiden.com"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        compliance@CoinMaiden.com
                    </a>{" "}
                    and provide the information below:
                </p>
                <ol>
                    <li>
                        Send the email from an official agency email address
                        (unofficial domains such as @gmail, @hotmail, @yahoo,
                        @protonmail will not be accepted).
                    </li>
                    <li>
                        Provide the law enforcement agency name, jurisdiction,
                        and official website URL.
                    </li>
                    <li>
                        Include an investigation inquiry letter issued by the
                        agency (with agency name, address, telephone number, and
                        official email).
                    </li>
                    <li>
                        Include necessary details or context of the
                        investigation.
                    </li>
                    <li>
                        Provide valid identifiers to locate the subject (e.g.,
                        TXID, wallet address, Memo/Tag/Payment ID, email) in text
                        or Excel format.
                    </li>
                    <li>State a reasonable deadline.</li>
                </ol>
            </section>

            <section>
                <h2>
                    How do we verify the identity of law enforcement officers?
                </h2>
                <p>
                    Verdstamp only discloses relevant information to agencies
                    that complete identity verification. Please provide:
                </p>
                <ol>
                    <li>
                        Requests sent from the email address listed on the
                        agency&apos;s official website, or reply to the
                        Verdstamp official email for verification.
                    </li>
                    <li>
                        An official website or portal where Verdstamp can
                        confirm officer identities and submit tickets.
                    </li>
                    <li>
                        An official website with public information about the
                        officers or related cases.
                    </li>
                    <li>
                        Documentation proving the officer&apos;s identity and
                        authorization, for example:
                        <ol>
                            <li>
                                Photo of an official badge or ID (e.g., identity
                                card with a unique number) and a selfie of the
                                officer holding the ID with a handwritten
                                current date.
                            </li>
                            <li>
                                Evidence showing the officer is authorized to
                                request information (authorization documents and
                                proof of employment with the agency).
                            </li>
                        </ol>
                    </li>
                    <li>
                        Other verification methods may be accepted after
                        Verdstamp confirms their validity.
                    </li>
                </ol>
            </section>
        </ArticleShell>
    );
}
