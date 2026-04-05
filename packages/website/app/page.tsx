import { GtkProviders } from "@/components/providers";
import { ShowcasePage } from "@/components/showcase/showcase-page";

export default function HomePage() {
  return (
    <GtkProviders>
      <ShowcasePage />
    </GtkProviders>
  );
}
