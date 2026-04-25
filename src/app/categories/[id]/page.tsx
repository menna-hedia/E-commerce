import {
  getCategoryDetails,
  getSubCategoriesOnCategory,
} from "_/api/services/routeServices";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [category, subCategories] = await Promise.all([
    getCategoryDetails(id),
    getSubCategoriesOnCategory(id),
  ]);

  if (!category) {
    return (
      <div className="text-center py-20 text-gray-400 text-lg">
        Category not found
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-4 mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          {category.name}
        </h1>
        <div className="w-full max-w-3xl bg-white border rounded-2xl p-6 shadow-sm">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-72 object-contain"
          />
        </div>
      </div>

      {/* SubCategories */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Sub Categories
        </h2>
        <div className="w-16 h-1 bg-green-600 mt-2 rounded-full" />
      </div>

      {subCategories?.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

          {subCategories.map((sub: any) => (
            <div
              key={sub._id}
              className="group bg-white border rounded-xl p-5 text-center
                         hover:shadow-md hover:border-green-500 transition"
            >
              <h3 className="text-gray-800 font-medium group-hover:text-green-600">
                {sub.name}
              </h3>
            </div>
          ))}

        </div>
      ) : (
        <div className="text-center text-gray-400 py-10">
          No subcategories available
        </div>
      )}
    </div>
  );
}