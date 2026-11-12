import { AppShell } from "@/components/AppShell";
import { LandingPage } from "@/components/LandingPage";

export default function HomePage() {
  return (
    <AppShell current="home" sidebar={false} flush>
      <LandingPage />
    </AppShell>
  );
}
