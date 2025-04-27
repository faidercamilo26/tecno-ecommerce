import { useState, useEffect } from "react"
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react"
import { X, ShoppingCart, CreditCard } from "lucide-react"
import {get_product} from "../../redux/actions/products"
import { connect } from "react-redux"

const ProductDetailModal = ({
    product,
    isOpen,
    onClose,
    productId,
    get_product
}) => {

    useEffect(() => {
        if (isOpen && productId) {
            get_product(productId);
        }
    }, [productId, get_product]);

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ease-in-out data-closed:opacity-0"
          />
    
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-xl shadow-xl transition-all duration-200 ease-in-out data-closed:opacity-0 data-closed:scale-95"
            >
              {product ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Imagen del producto (lado izquierdo) */}
                  <div className="relative h-[400px] md:h-full bg-gray-100 rounded-l-xl overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
    
                  {/* Detalles del producto (lado derecho) */}
                  <div className="p-6 relative flex flex-col">
                    {/* Botón para cerrar */}
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100">
                      <X className="h-6 w-6 text-gray-500" />
                    </button>
    
                    {/* Nombre del producto */}
                    <h2 className="text-2xl font-bold mt-6 md:mt-0">{product.name}</h2>
    
                    {/* Precio */}
                    <div className="mt-4 text-xl font-semibold text-primary">${product.price}</div>
    
                    {/* Descripción */}
                    <div className="mt-6 text-gray-600 flex-grow">
                      <p>{product.description}</p>
                    </div>
    
                    {/* Botones de acción */}
                    <div className="mt-8 space-y-3">
                      <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                        <span>Add to cart</span>
                      </button>
    
                      <button className="w-full flex items-center justify-center gap-2 bg-indigo-600 border-white text-white  py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                        <CreditCard className="h-5 w-5" />
                        <span>Buy now</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>No se encontró el producto</p>
                  <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
                    Cerrar
                  </button>
                </div>
              )}
            </DialogPanel>
          </div>
        </Dialog>
      )
}

const mapStateToProps = state => ({
    product: state.Products.product
})

export default connect(mapStateToProps, {
    get_product
}) (ProductDetailModal);


