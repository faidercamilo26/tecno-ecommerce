"use client"

import { MagnifyingGlassIcon, ArrowPathIcon } from "@heroicons/react/24/outline"

export default function NoResultsFound({ resetFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        <MagnifyingGlassIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
      <p className="text-sm text-gray-500 max-w-md mb-8">
        There are no products matching the selected filters. Try other search criteria or show all products.
      </p>
      <button
        onClick={resetFilters}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <ArrowPathIcon className="h-5 w-5 mr-2" aria-hidden="true" />
        View all products
      </button>
    </div>
  )
}

