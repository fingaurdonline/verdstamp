import ArticleShell from "../components/ArticleShell";

const DISCLAIMER =
    "Disclaimer: The content on this website is for reference only and does not constitute investment advice. It is not a substitute for professional financial advice, consultation, or recommendations. We strongly recommend that users consult with a qualified financial advisor before making any investment decisions. The owners and authors of this website disclaim any liability for any losses or damages incurred as a result of reliance on the information provided. All investments carry risks, and past performance is not indicative of future results.";

export default function STWarningArticle() {
    return (
        <ArticleShell
            category="Listing rules"
            title="ST (Special Treatment) Warning Rules"
            author="Customer Specialist Team"
            published="2022-07-29"
            updated="2023-08-18"
            backHref="/support"
            backLabel="Help centre"
            disclaimer={DISCLAIMER}
            avatar={
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-lnd-border bg-lnd-surface-2 font-Manrope text-xs font-bold text-lnd-accent">
                    CS
                </span>
            }
        >
            <p>
                According to Verdstamp ST (Special Treatment) rules, the
                projects already listed on Verdstamp may face special
                treatment and be marked as a risk warning. In this case, when a
                project violates certain Verdstamp ST rules, there will be an
                ST label displayed on the crypto information and trading pages,
                pending for strict review during an observation period. If
                issues improve, the label can be removed. Otherwise, the
                project may be delisted.
            </p>

            <p>
                Verdstamp will regularly track and review all listings, and
                decide whether to add/remove ST labels based on the latest
                results of the following factors:
            </p>

            <section>
                <h2>Project and team related issues</h2>
                <ul>
                    <li>
                        If the project team, product and business model have
                        undergone major changes, Verdstamp must be notified for
                        an overall review. If the changes are made independently
                        without notifying Verdstamp, we reserve the right to
                        delist the project.
                    </li>
                    <li>
                        The project team has unethical and fraudulent behavior,
                        such as false personal information of team founders,
                        co-founders, advisors, etc., or is suspected of being
                        involved in market manipulation, facing major legal
                        issues and other legal problems.
                    </li>
                </ul>
            </section>

            <section>
                <h2>Token-related issues</h2>
                <ul>
                    <li>
                        Lock-up tokens are not implemented according to the
                        lock-up mechanism, and the usage is transferred without
                        disclosure.
                    </li>
                    <li>Abnormal additional issuance of project tokens.</li>
                </ul>
            </section>

            <section>
                <h2>
                    Technology development and mainnet/smart contract related
                    issues
                </h2>
                <ul>
                    <li>No significant progress in products or communication.</li>
                    <li>No updates to the code repository or low frequency of updates.</li>
                    <li>
                        Security risks in the project mainnet (e.g., downtime,
                        forks).
                    </li>
                </ul>
            </section>

            <section>
                <h2>Community and operation related issues</h2>
                <ul>
                    <li>
                        Discrepancies in information disclosure, deceiving
                        investors/platforms.
                    </li>
                    <li>
                        Inactive website, chaotic information, unattended social
                        media.
                    </li>
                    <li>No response to community inquiries.</li>
                </ul>
            </section>

            <section>
                <h2>Other issues</h2>
                <ul>
                    <li>Other unethical, fraudulent, or illegal behaviors.</li>
                    <li>Other circumstances deemed by Verdstamp.</li>
                </ul>
            </section>

            <p>
                See{" "}
                <a
                    href="https://www.CoinMaiden.com/help/sections/articles/360034566714"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Verdstamp Delisting Criteria
                </a>{" "}
                for details on delisting rules.
            </p>
        </ArticleShell>
    );
}
