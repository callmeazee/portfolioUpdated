import { EditorialHero } from "./EditorialHero";
import {
  EditorialAbout,
  EditorialCapabilities,
  EditorialContact,
  EditorialExperience,
  EditorialNotes,
} from "./EditorialSections";
import { EditorialSelectedWork } from "./EditorialSelectedWork";
import type { HomeViewProps } from "@/types/views";

/** Section order is fixed by theme.md §6.2 and shared with every other theme. */
export function EditorialHome({
  profile,
  featuredProjects,
  engineeringAreas,
  skills,
  experience,
  notes,
  contact,
}: HomeViewProps) {
  return (
    <main id="main">
      <EditorialHero profile={profile} />
      <EditorialSelectedWork projects={featuredProjects} />
      <EditorialCapabilities areas={engineeringAreas} skills={skills} />
      <EditorialExperience experience={experience} />
      <EditorialAbout profile={profile} />
      <EditorialNotes notes={notes} />
      <EditorialContact contact={contact} />
    </main>
  );
}
