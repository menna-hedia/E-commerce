import { ShopByCategory } from '../_components/ShopByCategory/ShopByCategory'
import PageHeader from '../_components/PageHeader/PageHeader'
import { getAllCategories } from "_/api/services/routeServices"

export default async function page() {
  const categories = await getAllCategories()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
      <PageHeader
        title="Categories"
        description="Pick a category to see what's inside."
      />
      <div className="mt-10">
        <ShopByCategory categories={categories} loading={!categories} />
      </div>
    </div>
  )
}