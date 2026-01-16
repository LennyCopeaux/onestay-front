export default function GuestPropertyPage({
  params,
}: {
  params: { propertyId: string };
}) {
  return (
    <div>
      <h1>Guest View - Property {params.propertyId}</h1>
      {/* Will be implemented later */}
    </div>
  );
}
