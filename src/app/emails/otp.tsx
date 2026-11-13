import Logo from "@/components/icons/logo"
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Tailwind
} from "@react-email/components"

interface OTPEmailProps {
    email?: string
    code?: string
}

export default function OTPEmail({ email, code }: OTPEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>Your Verdstamp verification code</Preview>
            <Tailwind>
                <Body className="bg-[#f6f9fc] font-sans m-0 p-0">
                    <Container className="mx-auto my-[40px] w-full max-w-[600px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        
                        {/* Header */}
                        <Section className="px-[40px] py-[32px] border-b border-gray-100 text-center">
                            <Logo className="mx-auto w-[180px] h-auto" />
                        </Section>

                        {/* Content */}
                        <Section className="px-[40px] py-[32px] text-center">
                            <Heading className="text-[#1a1a1a] text-[24px] font-bold mx-0 my-[16px] p-0 tracking-tight text-left">
                                Verification Code
                            </Heading>
                            
                            <Text className="text-[#525f7f] text-[16px] leading-[24px] text-left">
                                We received a request to verify your identity for <strong>{email}</strong>. 
                                Please use the following code to proceed:
                            </Text>

                            <Section className="my-[32px] bg-[#f8f9fa] rounded-xl px-[24px] py-[24px] w-full max-w-[400px] border border-gray-200">
                                <Text className="text-[#1a1a1a] text-[36px] font-bold tracking-[8px] m-0 text-center">
                                    {code}
                                </Text>
                            </Section>

                            <Text className="text-[#525f7f] text-[14px] leading-[24px] text-left mt-0">
                                This code is valid for <strong>10 minutes</strong>. If you did not request this code, you can safely ignore this email.
                            </Text>
                            
                            <Text className="text-[#525f7f] text-[14px] leading-[24px] text-left">
                                Stay secure,<br />
                                The Verdstamp Team
                            </Text>
                        </Section>

                        {/* Footer */}
                        <Section className="bg-[#fcfcfc] border-t border-gray-100 px-[40px] py-[24px] text-center">
                            <Text className="text-[#8898aa] text-[12px] leading-[16px] m-0">
                                © 2025 Verdstamp. All rights reserved.
                            </Text>
                            <Text className="text-[#8898aa] text-[12px] leading-[16px] m-0 mt-[8px]">
                                If you have any questions, please <Link href="#" className="text-[#3E9B2F] underline">contact our support team</Link>.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}
