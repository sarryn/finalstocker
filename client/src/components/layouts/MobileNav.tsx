import { useLocation, Link } from "wouter";

export default function MobileNav() {
  const [location] = useLocation();

  return (
    <nav className="md:hidden mobile-nav bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
      <ul className="grid grid-cols-5 h-16">
        <li>
          <Link href="/dashboard">
            <a className={`flex flex-col items-center justify-center h-full ${location === "/dashboard" || location === "/" ? "text-primary-700" : "text-gray-600"}`}>
              <i className="ri-dashboard-line text-xl"></i>
              <span className="text-xs mt-1">Dashboard</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/inventory">
            <a className={`flex flex-col items-center justify-center h-full ${location === "/inventory" ? "text-primary-700" : "text-gray-600"}`}>
              <i className="ri-box-3-line text-xl"></i>
              <span className="text-xs mt-1">Inventory</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/scanner">
            <a className={`flex flex-col items-center justify-center h-full ${location === "/scanner" ? "text-primary-700" : "text-gray-600"}`}>
              <div className="-mt-6 w-14 h-14 rounded-full bg-primary-700 flex items-center justify-center text-white">
                <i className="ri-barcode-line text-2xl"></i>
              </div>
              <span className="text-xs mt-1">Scan</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/suppliers">
            <a className={`flex flex-col items-center justify-center h-full ${location === "/suppliers" ? "text-primary-700" : "text-gray-600"}`}>
              <i className="ri-truck-line text-xl"></i>
              <span className="text-xs mt-1">Suppliers</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/payment-tracker">
            <a className={`flex flex-col items-center justify-center h-full ${location === "/payment-tracker" ? "text-primary-700" : "text-gray-600"}`}>
              <i className="ri-wallet-3-line text-xl"></i>
              <span className="text-xs mt-1">Payments</span>
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
