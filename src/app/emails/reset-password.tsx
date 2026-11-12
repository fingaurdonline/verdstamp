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
    Row,
    Section,
    Text,
} from "@react-email/components"

interface ResetPasswordProps {
    userName?: string
    resetUrl?: string
}

export default function ResetPassword({ userName, resetUrl }: ResetPasswordProps) {
    return (
        <Html>
            <Head />
            <Preview>Reset your password for Verdstamp</Preview>
            <Body className="bg-gray-50 font-sans">
                <Container className="mx-auto py-8 px-4 max-w-2xl">
                    <Section className="bg-linear-to-r from-[#A0EA82] to-[#7ED957] rounded-t-lg p-8 flex items-center justify-between text-center">
                        <Section className="w-24 h-24 rounded-full flex justify-center items-center overflow-hidden border-[6px] border-white shadow-md">
                            <Logo className="w-20 h-20" />
                        </Section>
                        <Row className="flex flex-col items-center justify-center mr-4">
                            <Heading className="text-black text-2xl font-bold m-0 mb-2">Welcome to Verdstamp</Heading>
                            <Text className="text-black/80 text-sm m-0">Your trusted cryptocurrency platform</Text>
                        </Row>
                    </Section>
                    <Section className="bg-white px-8 py-6 rounded-b-lg shadow-sm">
                        <Text className="text-gray-700 text-base leading-relaxed mb-4">
                            Dear <strong>{userName}</strong>,
                        </Text>

                        <Text className="text-gray-700 text-base leading-relaxed mb-4">
                            We received a request to reset the password for your Verdstamp account.
                        </Text>

                        <Text className="text-gray-700 text-base leading-relaxed mb-6">
                            To reset your password and regain access to your account, please click the button below:
                        </Text>

                        <Section className="text-center mb-6">
                            <Button
                                href={resetUrl}
                                className="bg-linear-to-r from-[#A0EA82] to-[#7ED957] text-[#0A0E0C] px-8 py-3 rounded-lg font-semibold text-base no-underline inline-block shadow-md hover:shadow-lg transition-shadow"
                            >
                                Reset Password
                            </Button>
                        </Section>

                        <Text className="text-gray-600 text-sm leading-relaxed mb-4">
                            This password reset link will expire in 1 hour for security reasons.
                        </Text>

                        <Text className="text-gray-600 text-sm leading-relaxed mb-4">
                            If you did not request a password reset, please ignore this email and your password will remain unchanged.
                            For any security concerns, please contact our support team immediately.
                        </Text>

                        <Text className="text-gray-700 text-base leading-relaxed mb-2">Best regards,</Text>
                        <Text className="text-gray-700 text-base font-semibold">The Verdstamp Security Team</Text>
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
