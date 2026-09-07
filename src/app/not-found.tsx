import { getPageKit } from "@/themes/page-kit";

/**
 * 404, rendered by the active theme's primitives so it arrives inside that
 * theme's chrome rather than as a bare page (design.md §32).
 */
export default async function NotFound() {
  const { Page, Empty, Action } = await getPageKit();

  return (
    <Page
      title="Page not found"
      intro="The page you are looking for does not exist or has moved."
    >
      <div className="mt-lg grid gap-lg">
        <Empty>
          If you followed a link here, it may be out of date. The navigation above lists
          everything that does exist.
        </Empty>
        <div>
          <Action href="/">Go home</Action>
        </div>
      </div>
    </Page>
  );
}
