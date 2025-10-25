import Link from 'next/link'

interface Store {
  id: string
  name: string
  slug: string
  description?: string
  logo?: string
  banner?: string
  theme?: any
}

interface StoreFooterProps {
  store: Store
}

export function StoreFooter({ store }: StoreFooterProps) {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Store Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="h-8 w-auto"
                />
              ) : (
                <div className="h-8 w-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {store.name.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-xl font-bold text-gray-900">
                {store.name}
              </span>
            </div>
            {store.description && (
              <p className="text-gray-600 mb-4 max-w-md">
                {store.description}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={`/store/${store.slug}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href={`/store/${store.slug}/products`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  href={`/store/${store.slug}/about`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href={`/store/${store.slug}/contact`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href={`/store/${store.slug}/shipping`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link 
                  href={`/store/${store.slug}/returns`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link 
                  href={`/store/${store.slug}/faq`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href={`/store/${store.slug}/support`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2024 {store.name}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                href={`/store/${store.slug}/privacy`}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                href={`/store/${store.slug}/terms`}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}