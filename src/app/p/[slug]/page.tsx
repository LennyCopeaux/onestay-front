import { PublicPropertyContainer } from "@/containers/PublicPropertyContainer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicPropertyPage({ params }: PageProps) {
  const { slug } = await params;
  return <PublicPropertyContainer slug={slug} />;
}
