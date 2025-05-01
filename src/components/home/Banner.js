import { Link } from "react-router-dom"

export default function Banner() {
  return (
    <div className="relative bg-white">
      <div className="pt-12 pb-20 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:static">
          <div className="sm:max-w-2xl lg:max-w-lg">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
              Engineered to Outsmart, Outperform, Outlast
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:text-lg md:mt-4 md:text-xl">
              In a world where lag kills innovation and vulnerabilities cost empires, our arsenal of cutting-edge tech isn’t just gear—it’s survival. Dominate code, crush benchmarks, and lockdown your domain with tools forged for those who refuse to bend.
            </p>
          </div>
          
          <div className="mt-8 sm:mt-10">
            {/* Contenedor de imágenes responsive */}
            <div
              aria-hidden="true"
              className="pointer-events-none lg:absolute lg:inset-y-0 lg:max-w-7xl lg:mx-auto lg:w-full"
            >
              <div className="lg:absolute lg:transform lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:space-x-6">
                  {/* Columna 1 */}
                  <div className="flex justify-center space-x-4 sm:space-x-6 lg:block lg:space-x-0">
                    <div className="w-32 h-48 sm:w-44 sm:h-64 rounded-lg overflow-hidden lg:mb-6">
                      <img
                        src="/static/images/imagen8-banner.jpeg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="w-32 h-48 sm:w-44 sm:h-64 rounded-lg overflow-hidden lg:block">
                      <img
                        src="/static/images/imagen2-banner.jpeg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Columna 2 */}
                  <div className="flex justify-center space-x-4 sm:space-x-6 lg:block lg:space-x-0">
                    <div className="w-32 h-48 sm:w-44 sm:h-64 rounded-lg overflow-hidden lg:mb-6">
                      <img
                        src="/static/images/imagen3-banner.jpeg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="w-32 h-48 sm:w-44 sm:h-64 rounded-lg overflow-hidden lg:mb-6">
                      <img
                        src="/static/images/imagen1-banner.jpeg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="w-32 h-48 sm:w-44 sm:h-64 rounded-lg overflow-hidden">
                      <img
                        src="/static/images/imagen5-banner.jpeg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Columna 3 */}
                  <div className="flex justify-center space-x-4 sm:space-x-6 lg:block lg:space-x-0">
                    <div className="w-32 h-48 sm:w-44 sm:h-64 rounded-lg overflow-hidden lg:mb-6">
                      <img
                        src="/static/images/imagen6-banner.jpeg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="w-32 h-48 sm:w-44 sm:h-64 rounded-lg overflow-hidden">
                      <img
                        src="/static/images/imagen7-banner.jpeg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center sm:justify-start"> 
              <Link
                  to="/shop"
                  className="w-60 inline-block text-center bg-indigo-600 border border-transparent rounded-md py-2 px-6 text-sm font-medium text-white hover:bg-indigo-700 sm:text-base flex justify-center mt-10"
                >
                  Get access at shop
                </Link>
            </div>
              
            
          </div>
        </div>
      </div>
    </div>
  )
}