import React from 'react'
import { ShopByCategory } from '../_components/ShopByCategory/ShopByCategory'
import { getAllCategories, getAllProducts } from "_/api/services/routeServices"
export default async function page() {
    const categories = await getAllCategories()
  return (
    <div className='m-10'>
         <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Our Categories
        </h1>
        <p className="text-gray-500">
          Explore top brands and shop your favorites
        </p>
      </div>
      <ShopByCategory categories={categories} loading={!categories} />
    </div>
  )
}
