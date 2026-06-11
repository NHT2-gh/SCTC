import { MenuLayoutPageView } from "@/sections/(admin)/menus/views";

export default async function MenuLayoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <MenuLayoutPageView menuId={id} />;
}
