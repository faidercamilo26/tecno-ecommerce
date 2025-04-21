import { Link } from "react-router-dom"
import { useState } from "react"
import ProductDetailModal from "../../containers/pages/productDetailModal"
export default function ProductsArrival({
      data
  }) {

    const [selectedProductId, setSelectedProductId] = useState(null);

    const openModal = (productId) => {
      setSelectedProductId(productId);
    };
  
    const closeModal = () => {
      setSelectedProductId(null);
    };

    return (
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">New products</h2>
  
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {data &&
            data !== null &&
            data !== undefined &&
             data.map((product) => (
              <div key={product.id} className="group relative">
                <div onClick={() => openModal(product.id)}  className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <img
                    src={product.get_thumbnail}
                    alt=""
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link onClick={() => openModal(product.id)} >
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    
                  </div>
                  <p className="text-sm font-medium text-gray-900">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
          <ProductDetailModal isOpen={!!selectedProductId} onClose={closeModal} productId={selectedProductId} />
        </div>
      </div>
    )
  }
  