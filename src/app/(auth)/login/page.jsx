import { AuthLoginPage } from "@/components/templates/AuthLoginPage/AuthLoginPage";

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  return {
    title: "Sign In | KATERI",
    description: "Access your KATERI account to manage orders and favorites.",
    robots: { index: false, follow: false },
  };
}

export default function LoginPage() {
  return <AuthLoginPage />;
}
