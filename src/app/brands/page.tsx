import { getAllBrands } from "_/api/services/routeServices";
import Link from "next/link";

export default async function BrandsPage() {
  const brands = await getAllBrands();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Our Brands
        </h1>
        <p className="text-gray-500">
          Explore top brands and shop your favorites
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

        {brands?.map((brand) => (
          <Link
            href={`/brands/${brand._id}`}
            key={brand._id}
             className="group bg-white border rounded-xl p-5 text-center
                         hover:shadow-md hover:border-green-500 transition"
          >
            {/* Image */}
            <div className="h-24 w-full flex items-center justify-center">
              <img
                src={brand.image}
                alt={brand.name}
   
              />
            </div>

            {/* Name */}
            <p className="mt-3 font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
              {brand.name}
            </p>
          </Link>
        ))}

      </div>
    </div>
  );
}