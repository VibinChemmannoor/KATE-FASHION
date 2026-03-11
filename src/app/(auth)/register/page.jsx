import { AuthRegisterPage } from "@/components/templates/AuthRegisterPage/AuthRegisterPage";

/**
 * @returns {Promise<import("next").Metadata>}
 */
export async function generateMetadata() {
  return {
    title: "Create Account | KATERI",
    description: "Create a KATERI account to save favorites and checkout faster.",
    robots: { index: false, follow: false },
  };
}

export default function RegisterPage() {
  return <AuthRegisterPage />;
}
