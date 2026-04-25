// app/brands/[id]/page.tsx
import { getBrandDetails } from "_/api/services/routeServices";

export default async function BrandDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await getBrandDetails(id);

  if (!brand) return <div className="text-center py-20">Brand not found</div>;

  return (
        <div className="max-w-5xl mx-auto px-6 py-12">

      {/* Card */}
      <div className="bg-white border rounded-2xl shadow-sm p-10 text-center hover:shadow-md transition">

        {/* Image */}
        <div className="flex justify-center mb-6">
          <img
            src={brand.image}
            alt={brand.name}
            className="h-40 object-contain"
          />
        </div>

        {/* Name */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 uppercase tracking-wide">
          {brand.name}
        </h1>

        {/* Slug */}
        <p className="mt-3 text-gray-500 text-sm">
          {brand.slug}
        </p>
      </div>

    </div>

  );
}