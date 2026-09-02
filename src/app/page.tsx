import {
  contact,
  engineeringAreas,
  experience,
  getFeaturedProjects,
  notes,
  profile,
  skills,
} from "@/content";
import { getThemeSections } from "@/themes/renderer";
import { getActiveThemeId } from "@/themes/server";

/**
 * A thin server component: it loads canonical content and hands it to the
 * active theme. It contains no presentation and no theme conditionals — the
 * registry does that (theme.md §11).
 */
export default async function HomePage() {
  const { Home } = await getThemeSections(await getActiveThemeId());

  return (
    <Home
      profile={profile}
      featuredProjects={getFeaturedProjects()}
      engineeringAreas={engineeringAreas}
      skills={skills}
      experience={experience}
      notes={notes}
      contact={contact}
    />
  );
}
