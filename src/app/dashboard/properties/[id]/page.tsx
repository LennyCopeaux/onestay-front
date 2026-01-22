import { PropertyEditContainer } from "@/containers/PropertyEditContainer";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyEditPage({ params }: PageProps) {
  const { id } = await params;
  return <PropertyEditContainer propertyId={id} />;
}
