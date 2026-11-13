import Logo from "@/components/icons/logo"
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from "@react-email/components"

interface VerifyEmailProps {
    userName?: string
    verifyUrl?: string
}

export default function VerifyEmail({ userName, verifyUrl }: VerifyEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Verify your email address for Verdstamp</Preview>
            <Body className="bg-gray-50 font-sans">
                <Container className="mx-auto py-8 px-4 max-w-2xl">
                    <Section className="bg-linear-to-r from-[#A0EA82] to-[#7ED957] rounded-t-lg p-8 text-center">
                        <Logo className="mx-auto mb-4 w-[180px] h-auto" />
                        <Heading className="text-black text-2xl font-bold m-0 mb-2">Welcome to Verdstamp</Heading>
                        <Text className="text-black/80 text-sm m-0">Your trusted cryptocurrency platform</Text>
                    </Section>

                    <Section className="bg-white px-8 py-6 rounded-b-lg shadow-sm">
                        <Text className="text-gray-700 text-base leading-relaxed mb-4">
                            Dear <strong>{userName}</strong>,
                        </Text>

                        <Text className="text-gray-700 text-base leading-relaxed mb-4">
                            Welcome to Verdstamp. Thank you for creating an account.
                        </Text>

                        <Text className="text-gray-700 text-base leading-relaxed mb-6">
                            To activate your account and ensure its security, please verify your email address by clicking the button
                            below:
                        </Text>

                        <Section className="text-center mb-6">
                            <Button
                                href={verifyUrl}
                                className="bg-linear-to-r from-[#A0EA82] to-[#7ED957] text-[#0A0E0C] px-8 py-3 rounded-lg font-semibold text-base no-underline inline-block shadow-md hover:shadow-lg transition-shadow"
                            >
                                Verify Email Address
                            </Button>
                        </Section>

                        <Text className="text-gray-600 text-sm leading-relaxed mb-4">
                            This verification link will expire in 24 hours.
                        </Text>

                        <Text className="text-gray-600 text-sm leading-relaxed mb-4">
                            If you did not create an account, please disregard this email. For any assistance, please contact our
                            support team.
                        </Text>

                        <Text className="text-gray-700 text-base leading-relaxed mb-2">Thank you,</Text>
                        <Text className="text-gray-700 text-base font-semibold">Team Verdstamp </Text>
                    </Section>

                    <Section className="text-center mt-8">
                        <Text className="text-gray-500 text-xs leading-relaxed">
                            This email was sent by Verdstamp. If you have any questions, please{" "}
                            <Link href="#" className="text-[#3E9B2F] no-underline">
                                contact our support team
                            </Link>
                            .
                        </Text>
                        <Text className="text-gray-400 text-xs mt-2">© 2025 Verdstamp. All rights reserved.</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}