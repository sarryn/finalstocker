import { useLocation, Link } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="md:hidden mobile-nav bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
      <ul className="grid grid-cols-5 h-16">
        <li>
          <Link href="/dashboard">
            <div className={`flex flex-col items-center justify-center h-full cursor-pointer ${location === "/dashboard" || location === "/" ? "text-primary-700" : "text-gray-600"}`}>
              <i className="ri-dashboard-line text-xl"></i>
              <span className="text-xs mt-1">Dashboard</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/inventory">
            <div className={`flex flex-col items-center justify-center h-full cursor-pointer ${location === "/inventory" ? "text-primary-700" : "text-gray-600"}`}>
              <i className="ri-box-3-line text-xl"></i>
              <span className="text-xs mt-1">Inventory</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/scanner">
            <div className={`flex flex-col items-center justify-center h-full cursor-pointer ${location === "/scanner" ? "text-primary-700" : "text-gray-600"}`}>
              <div className="-mt-6 w-14 h-14 rounded-full bg-primary-700 flex items-center justify-center text-white">
                <i className="ri-barcode-line text-2xl"></i>
              </div>
              <span className="text-xs mt-1">Scan</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/suppliers">
            <div className={`flex flex-col items-center justify-center h-full cursor-pointer ${location === "/suppliers" ? "text-primary-700" : "text-gray-600"}`}>
              <i className="ri-truck-line text-xl"></i>
              <span className="text-xs mt-1">Suppliers</span>
            </div>
          </Link>
        </li>
        <li>
          <Link href="/payment-tracker">
            <div className={`flex flex-col items-center justify-center h-full cursor-pointer ${location === "/payment-tracker" ? "text-primary-700" : "text-gray-600"}`}>
              <i className="ri-wallet-3-line text-xl"></i>
              <span className="text-xs mt-1">Payments</span>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
