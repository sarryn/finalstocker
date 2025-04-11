import { useLocation, Link } from "wouter";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: "ri-dashboard-line" },
  { path: "/inventory", label: "Inventory", icon: "ri-box-3-line" },
  { path: "/scanner", label: "Scan Items", icon: "ri-barcode-line" },
  { path: "/suppliers", label: "Suppliers", icon: "ri-truck-line" },
  { path: "/locations", label: "Locations", icon: "ri-store-3-line" },
  { path: "/taxes", label: "GST & Taxes", icon: "ri-percent-line" },
  { path: "/price-management", label: "Price Management", icon: "ri-price-tag-3-line" },
  { path: "/payment-tracker", label: "Payment Tracker", icon: "ri-wallet-3-line" },
  { path: "/settings", label: "Settings", icon: "ri-settings-3-line" }
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-blue-900 text-white shadow-lg">
        <div className="flex items-center justify-center h-16 border-b border-blue-950 bg-blue-950">
          <h1 className="text-xl font-bold">InvSync</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a
                    className={`flex items-center px-6 py-3 text-white ${
                      location === item.path
                        ? "bg-blue-950 border-l-4 border-blue-400"
                        : "hover:bg-blue-800 border-l-4 border-transparent"
                    }`}
                  >
                    <i className={`${item.icon} mr-3 text-lg ${location === item.path ? "text-blue-300" : "text-blue-300"}`}></i>
                    <span>{item.label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-950 bg-blue-950">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-700 rounded-full mr-3 flex items-center justify-center">
              <span className="text-sm font-medium text-white">RK</span>
            </div>
            <div>
              <p className="text-sm">Rajesh Kumar</p>
              <p className="text-xs opacity-75">Store Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar - Slide-over panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
            onClick={onClose}
          ></div>
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white md:hidden shadow-lg">
            <div className="flex items-center justify-between h-16 border-b border-blue-950 bg-blue-950 px-6">
              <h1 className="text-xl font-bold">InvSync</h1>
              <button onClick={onClose} className="text-white">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
              <ul>
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link href={item.path}>
                      <a
                        className={`flex items-center px-6 py-3 text-white ${
                          location === item.path
                            ? "bg-blue-950 border-l-4 border-blue-400"
                            : "hover:bg-blue-800 border-l-4 border-transparent"
                        }`}
                        onClick={onClose}
                      >
                        <i className={`${item.icon} mr-3 text-lg ${location === item.path ? "text-blue-300" : "text-blue-300"}`}></i>
                        <span>{item.label}</span>
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t border-blue-950 bg-blue-950">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-700 rounded-full mr-3 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">RK</span>
                </div>
                <div>
                  <p className="text-sm">Rajesh Kumar</p>
                  <p className="text-xs opacity-75">Store Manager</p>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}
