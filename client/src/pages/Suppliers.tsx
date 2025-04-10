import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Plus, FileDown, Phone, Mail, MapPin } from "lucide-react";
import PageTitle from "@/components/common/PageTitle";

interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstIn: string;
  isActive: boolean;
}

export default function Suppliers() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: suppliers, isLoading } = useQuery({
    queryKey: ['/api/suppliers'],
  });

  // Filter suppliers based on search term
  const filteredSuppliers = !isLoading && suppliers
    ? suppliers.filter((supplier: Supplier) => 
        supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.contactPerson?.toLowerCase().includes(search.toLowerCase()) ||
        supplier.phone.includes(search) ||
        supplier.email?.toLowerCase().includes(search.toLowerCase()) ||
        supplier.gstIn?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // Pagination
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Supplier Management" 
        subtitle="Manage your vendors and business partners"
        actions={
          <>
            <button className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add Supplier
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center">
              <FileDown className="w-4 h-4 mr-1" /> Export
            </button>
          </>
        }
      />

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="relative w-full">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search suppliers by name, contact person, phone, email or GST number..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Suppliers List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading state
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-2/3">
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-2 mt-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2 w-1/4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : paginatedSuppliers.length > 0 ? (
          paginatedSuppliers.map((supplier: Supplier) => (
            <div key={supplier.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{supplier.name}</h3>
                      {supplier.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                          Inactive
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {supplier.contactPerson && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Contact Person:</span> {supplier.contactPerson}
                        </p>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{supplier.phone}</span>
                      </div>
                      
                      {supplier.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{supplier.email}</span>
                        </div>
                      )}
                      
                      {supplier.address && (
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                          <span>{supplier.address}</span>
                        </div>
                      )}
                      
                      {supplier.gstIn && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">GST Number:</span> {supplier.gstIn}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 mt-4 md:mt-0">
                    <button className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                      Place Order
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                      View Orders
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
                <button className="text-primary-600 hover:text-primary-900">
                  <i className="ri-edit-line"></i> Edit
                </button>
                <button className="text-amber-600 hover:text-amber-900">
                  <i className="ri-mail-send-line"></i> Contact
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <i className="ri-more-2-fill"></i>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex flex-col items-center">
              <i className="ri-store-3-line text-4xl text-gray-300 mb-2"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No suppliers found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or add a new supplier</p>
              <button className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500">
                <i className="ri-add-line mr-1"></i> Add Supplier
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            <button 
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              const isCurrentPage = pageNum === currentPage;
              return (
                <button 
                  key={i}
                  className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${
                    isCurrentPage ? "bg-primary-50 text-primary-700 font-medium" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
