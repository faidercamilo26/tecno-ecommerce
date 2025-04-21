import Layout from '../hocs/Layout';
import { useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid'
import { connect } from 'react-redux';
import { getCategories } from '../redux/actions/categories';
import { useEffect } from "react";
import { get_filtered_products, get_products } from '../redux/actions/products';
import ProductDetailModal from './pages/productDetailModal';
import { Link } from "react-router-dom"
import { prices } from '../helpers/fixedPrices';
import Pagination from '../components/utils/Pagination';
import NoResultsFound from '../components/utils/NoResultsFound';




function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Shop = ({
    getCategories,
    categories,
    get_products,
    products,
    get_filtered_products,
    filtered_products,
}) => {

    const [filtersCategory, setFiltersCategory] = useState([])
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

    const [selectedProductId, setSelectedProductId] = useState(null);

    const [showProducts, setShowProducts] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9);
    const [ifFiltered, setIfFiltered] = useState(false);
    

    const [formData, setFormData] = useState({
        categories_id: [],
        price_range: 'Any',
        sort_by: 'date_created',
        order: 'desc'
    })

    const {
        categories_id,
        price_range,
        sort_by,
        order
    } = formData;


    useEffect(() => {
        getCategories();
        get_products();
        window.scrollTo(0,0)
    }, []); 

    
    
    useEffect(() => {
        if (categories?.length > 0 && filtersCategory.length === 0) {
            const newFilters = categories.map(category => ({
                id: category.id,
                name: category.name,
                options: category.subcategories?.length > 0 
                    ? category.subcategories.map(sub => ({
                        value: sub.id,
                        label: sub.name,
                        checked: false
                    }))
                    : []
            }));
            
            setFiltersCategory(newFilters);
        }
    }, [categories]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ 
          top: 0, 
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      };

    useEffect(() => {
        setShowProducts(
            ifFiltered ? (Array.isArray(filtered_products) && filtered_products.length 
                ? filtered_products 
                : []
            ) : Array.isArray(products) 
                ? products 
                : []
        );
    }, [products, filtered_products, ifFiltered]);


    

    const onChange = e => {

        const {name, value, checked} = e.target;


        setFormData(
            prevState => {
                if (name === 'subcategory_id'){

                    const updateeCategories = checked
                    ? [...prevState.categories_id, Number(value)] :
                    prevState.categories_id.filter(id => id !== Number(value));

                    return {
                        ...prevState,
                        categories_id: updateeCategories
                    }
                } else if (name === 'price_range') {
                    return {
                        ...prevState,
                        [name]: prevState[name] === value ? null : value // Alternar selección
                    };
                }

                return {
                    ...prevState,
                    [name]: value
                }
            }
        )
    }

    const onSubmit = e => {
        e.preventDefault();
        get_filtered_products(categories_id, price_range, sort_by, order);
        setIfFiltered(true);
    }

    const openModal = (productId) => {
      setSelectedProductId(productId);
    };
  
    const closeModal = () => {
      setSelectedProductId(null);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedProducts = showProducts.slice(indexOfFirstItem, indexOfLastItem);

    return(
        <Layout>
             <div className="bg-white">
                <div>
                    {/* Mobile filter dialog */}
                    <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
                    <DialogBackdrop
                        transition
                        className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                    />

                    <div className="fixed inset-0 z-40 flex">
                        <DialogPanel
                        transition
                        className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
                        >
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                            <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(false)}
                            className="-mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                            >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon aria-hidden="true" className="size-6" />
                            </button>
                        </div>

                        {/* Filters */}
                        <form onSubmit={e => onSubmit(e)} className="mt-4 border-t border-gray-200">
                            <h3 className="sr-only">Categories</h3>
                            

                            {filtersCategory.map((section) => (
                            <Disclosure key={section.id} as="div" className="ml-6 border-b border-gray-200 py-6">
                                <h3 className="-my-3 flow-root">
                                <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                    <span className="font-medium text-gray-900">{section.name}</span>
                                    <span className="ml-6 flex items-center">
                                    <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                                    <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                                    </span>
                                </DisclosureButton>
                                </h3>
                                <DisclosurePanel className="pt-6">
                                <div className="space-y-4">
                                    {section.options.map((option, optionIdx) => (
                                    
                                    <div key={option.id} className="flex gap-3">
                                        <div className="flex h-5 shrink-0 items-center">
                                        <div className="group grid size-4 grid-cols-1">
                                            <input
                                            defaultChecked={false}
                                            onChange={e => onChange(e)}
                                            value={option.value}
                                            id={section.id}
                                            name='subcategory_id'
                                            type="checkbox"
                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                            />
                                            <svg
                                            fill="none"
                                            viewBox="0 0 14 14"
                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                            >
                                            <path
                                                d="M3 8L6 11L11 3.5"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-checked:opacity-100"
                                            />
                                            <path
                                                d="M3 7H11"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-indeterminate:opacity-100"
                                            />
                                            </svg>
                                        </div>
                                        </div>
                                        <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600">
                                        {option.label}
                                        </label>
                                    </div>
                                    ))}
                                </div>
                                </DisclosurePanel>
                            </Disclosure>
                            ))}

                            <button
                                type="submit"
                                className="mt-6 float-right inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Search
                            </button>
                        </form>
                        </DialogPanel>
                    </div>
                    </Dialog>

                    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Products</h1>

                        <div className="flex items-center">
                        

                        
                        <button
                            type="button"
                            onClick={() => setMobileFiltersOpen(true)}
                            className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                        >
                            <span className="sr-only">Filters</span>
                            <FunnelIcon aria-hidden="true" className="size-5" />
                        </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pt-6 pb-24">
                        <h2 id="products-heading" className="sr-only">
                        Products
                        </h2>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                        {/* Filters Destok */}
                        <form onSubmit={e => onSubmit(e)} className="hidden lg:block">

                            <h3 className="text-xl font-bold tracking-tight text-gray-900">Prices</h3>

                            {
                                
                                <Disclosure as="div" className="mb-6 border-b border-gray-200 py-6">
                                    
                                <h3 className="-my-3 flow-root">
                                <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                    <span className="font-medium text-gray-900">Rank of prices</span>
                                    <span className="ml-6 flex items-center">
                                    <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                                    <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                                    </span>
                                </DisclosureButton>
                                </h3>
                                <DisclosurePanel className="pt-6">
                                <div className="space-y-4">
                                    {prices.map(price => (
                                    <div key={price.id} className="flex gap-3">
                                        <div className="flex h-5 shrink-0 items-center">
                                        <div className="group grid size-4 grid-cols-1">
                                            <input
                                            id={price.id}
                                            checked={price_range === price.name}
                                            onChange={onChange}
                                            name='price_range'
                                            value={price.name}
                                            type="radio"
                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                            />
                                            <svg
                                            fill="none"
                                            viewBox="0 0 14 14"
                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                            >
                                            <path
                                                d="M3 8L6 11L11 3.5"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-checked:opacity-100"
                                            />
                                            <path
                                                d="M3 7H11"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-indeterminate:opacity-100"
                                            />
                                            </svg>
                                        </div>
                                        </div>
                                        <label htmlFor={`filter-${price.id}`} className="text-sm text-gray-600">
                                        {price.name}
                                        </label>
                                    </div>
                                    ))}
                                </div>
                                </DisclosurePanel>
                            </Disclosure>
                            
                            }
                            
                            <h3 className="text-xl font-bold tracking-tight text-gray-900">Categories</h3>

                            {filtersCategory.map((section) => (
                            <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                                <h3 className="-my-3 flow-root">
                                <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                                    <span className="font-medium text-gray-900">{section.name}</span>
                                    <span className="ml-6 flex items-center">
                                    <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                                    <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                                    </span>
                                </DisclosureButton>
                                </h3>
                                <DisclosurePanel className="pt-6">
                                <div className="space-y-4">
                                    {section.options.map((option, optionIdx) => (
                                    
                                    <div key={option.id} className="flex gap-3">
                                        <div className="flex h-5 shrink-0 items-center">
                                        <div className="group grid size-4 grid-cols-1">
                                            <input
                                            defaultChecked={false}
                                            onChange={e => onChange(e)}
                                            value={option.value}
                                            id={section.id}
                                            name='subcategory_id'
                                            type="checkbox"
                                            className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                            />
                                            <svg
                                            fill="none"
                                            viewBox="0 0 14 14"
                                            className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                            >
                                            <path
                                                d="M3 8L6 11L11 3.5"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-checked:opacity-100"
                                            />
                                            <path
                                                d="M3 7H11"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="opacity-0 group-has-indeterminate:opacity-100"
                                            />
                                            </svg>
                                        </div>
                                        </div>
                                        <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600">
                                        {option.label}
                                        </label>
                                    </div>
                                    ))}
                                </div>
                                </DisclosurePanel>
                            </Disclosure>
                            ))}

                            <button
                                type="submit"
                                className="mt-6 float-right inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Search
                            </button>
                        </form>

                        {/* Product grid */}

                        {
                            <div className="lg:col-span-3 h-full">
                            <div className="bg-white h-full">
                              <div className="max-w-2xl mx-auto py-16 px-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:px-8 h-full flex flex-col">
                                
                                <div className="flex-1 flex flex-col">
                                  {paginatedProducts.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-3 xl:gap-x-8">
                                      {paginatedProducts.map((product) => (
                                        <div key={product.id} className="group relative">
                                          <div
                                            onClick={() => openModal(product.id)}
                                            className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none cursor-pointer"
                                          >
                                            <img
                                              src={product.get_thumbnail}
                                              alt={product.name}
                                              className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                                            />
                                          </div>
                                          <div className="mt-4 flex justify-between">
                                            <div>
                                              <h3 className="text-sm text-gray-700">
                                                <Link
                                                  onClick={() => openModal(product.id)}
                                                  className="hover:text-gray-900"
                                                >
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
                                  ) : (
                                    <div className="flex-1 flex flex-col justify-center items-center min-h-[300px]">
                                      <NoResultsFound
                                        resetFilters={() => {
                                          setIfFiltered(false);
                                          setFormData({
                                            categories_id: [],
                                            price_range: 'Any',
                                            sort_by: 'date_created',
                                            order: 'desc'
                                          });
                                        }}
                                      />
                                    </div>
                                  )}
                      
                                  {paginatedProducts.length > 0 && (
                                    <div className="mt-auto pb-8">
                                      <Pagination
                                        totalItems={showProducts.length}
                                        itemsPerPage={itemsPerPage}
                                        currentPage={currentPage}
                                        onPageChange={handlePageChange}
                                      />
                                    </div>
                                  )}
                                </div>
                      
                                <ProductDetailModal
                                  isOpen={!!selectedProductId}
                                  onClose={closeModal}
                                  productId={selectedProductId}
                                />
                              </div>
                            </div>
                          </div>

                        }
                        
                        </div>
                    </section>
                    </main>
                </div>
                </div>
        </Layout>
    )
    
}

const mapStateToProp = state => ({
    categories: state.Categories.categories,
    products: state.Products.products,
    filtered_products: state.Products.filtered_products
})

export default connect (mapStateToProp,{
    getCategories,
    get_products,
    get_filtered_products
})(Shop);