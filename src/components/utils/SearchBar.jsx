import { useState } from "react"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { connect } from 'react-redux';
import { get_search_products } from '../../redux/actions/products';
import { useNavigate } from "react-router-dom";

function SearchBar({
  get_search_products
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const navigate = useNavigate();
  const [setRedirect] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    get_search_products(searchTerm)
    setRedirect(true)
    navigate('/search_product')
  }

  

  return (
   

    <form onSubmit={handleSearch} className="flex-1 max-w-xs mx-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white border border-transparent focus:border-indigo-300 transition-colors"
          placeholder="Search products..."
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600"
        >
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </form>
  )
}

const mapStateToProp = state => ({
})

export default connect(mapStateToProp, {
  get_search_products
})(SearchBar);