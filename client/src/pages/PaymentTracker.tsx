import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, Plus, ArrowDownCircle, ArrowUpCircle, Filter, Search } from "lucide-react";
import PageTitle from "@/components/common/PageTitle";

interface Payment {
  id: number;
  transactionId: number;
  date: string;
  amount: number;
  method: string;
  reference: string;
  status: string;
}

interface Transaction {
  id: number;
  type: string;
  date: string;
  refNumber: string;
  supplierId?: number;
  totalAmount: number;
  gstAmount: number;
  status: string;
  dueDate?: string;
}

interface Supplier {
  id: number;
  name: string;
}

export default function PaymentTracker() {
  const [activeTab, setActiveTab] = useState<'receivable' | 'payable'>('receivable');
  const [timeRange, setTimeRange] = useState<string>("30days");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/transactions'],
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['/api/payments'],
  });

  const { data: suppliers, isLoading: suppliersLoading } = useQuery({
    queryKey: ['/api/suppliers'],
  });

  const isLoading = transactionsLoading || paymentsLoading || suppliersLoading;

  // Helper function to get supplier name by ID
  const getSupplierName = (supplierId?: number) => {
    if (!supplierId || !suppliers) return "Unknown";
    const supplier = suppliers.find((s: Supplier) => s.id === supplierId);
    return supplier ? supplier.name : "Unknown";
  };

  // Format as Indian Rupees
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  // Calculate due amount for a transaction
  const calculateDueAmount = (transaction: Transaction) => {
    if (!payments) return transaction.totalAmount;
    
    const transactionPayments = payments.filter(
      (payment: Payment) => payment.transactionId === transaction.id
    );
    
    const paidAmount = transactionPayments.reduce(
      (sum: number, payment: Payment) => sum + payment.amount, 0
    );
    
    return Math.max(0, transaction.totalAmount - paidAmount);
  };

  // Filter transactions based on active tab, status, and search
  const filteredTransactions = !isLoading && transactions && suppliers
    ? transactions.filter((transaction: Transaction) => {
        // Filter by transaction type (receivable/payable)
        const typeMatch = activeTab === 'receivable' 
          ? transaction.type === 'sale'
          : transaction.type === 'purchase';
        
        // Filter by status
        const statusMatch = statusFilter === 'all' || transaction.status === statusFilter;
        
        // Filter by search term (ref number or supplier name)
        const searchMatch = search === "" || 
          transaction.refNumber?.toLowerCase().includes(search.toLowerCase()) ||
          getSupplierName(transaction.supplierId).toLowerCase().includes(search.toLowerCase());
        
        return typeMatch && statusMatch && searchMatch;
      })
    : [];

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a: Transaction, b: Transaction) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Calculate total due amount
  const totalDueAmount = sortedTransactions.reduce(
    (sum: number, transaction: Transaction) => sum + calculateDueAmount(transaction), 0
  );

  return (
    <div className="space-y-6">
      <PageTitle 
        title="Payment Tracker" 
        subtitle={activeTab === 'receivable' ? "Track and manage customer payments" : "Track and manage supplier payments"}
        actions={
          <button className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center">
            <Plus className="w-4 h-4 mr-1" /> {activeTab === 'receivable' ? 'Add Invoice' : 'Record Payment'}
          </button>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">Total {activeTab === 'receivable' ? 'Receivable' : 'Payable'}</p>
          <div className="flex items-center">
            <IndianRupee className="w-5 h-5 text-gray-700 mr-1" />
            <h3 className="text-2xl font-bold text-gray-800">
              {isLoading ? "--" : formatCurrency(totalDueAmount)}
            </h3>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">Overdue</p>
          <div className="flex items-center text-red-600">
            <IndianRupee className="w-5 h-5 mr-1" />
            <h3 className="text-2xl font-bold">
              {isLoading ? "--" : formatCurrency(25000)}
            </h3>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-lg shadow">
          <p className="text-sm text-gray-500 mb-1">Due This Week</p>
          <div className="flex items-center text-amber-600">
            <IndianRupee className="w-5 h-5 mr-1" />
            <h3 className="text-2xl font-bold">
              {isLoading ? "--" : formatCurrency(15000)}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            {/* Tab Navigation */}
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'receivable'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('receivable')}
              >
                <ArrowDownCircle className="w-4 h-4 inline mr-1" /> Receivables
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'payable'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('payable')}
              >
                <ArrowUpCircle className="w-4 h-4 inline mr-1" /> Payables
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reference or supplier..."
                  className="pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="year">This Year</option>
              </select>
              
              <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm flex items-center">
                <Filter className="w-4 h-4 mr-1" /> More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {activeTab === 'receivable' ? 'Customer/Invoice' : 'Supplier/Bill'}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-32"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-5 bg-gray-200 rounded w-16 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : sortedTransactions.length > 0 ? (
                sortedTransactions.map((transaction: Transaction) => {
                  const dueAmount = calculateDueAmount(transaction);
                  const isOverdue = transaction.dueDate && new Date(transaction.dueDate) < new Date();
                  
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getSupplierName(transaction.supplierId)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.type === 'sale' ? 'Invoice' : 'Bill'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{transaction.refNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(transaction.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          dueAmount > 0 ? (isOverdue ? 'text-red-600 font-medium' : 'text-amber-600') : 'text-green-600'
                        }`}>
                          {formatCurrency(dueAmount)}
                        </div>
                        {transaction.dueDate && (
                          <div className="text-xs text-gray-500">
                            Due: {formatDate(transaction.dueDate)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 mr-3">
                          View Details
                        </button>
                        {dueAmount > 0 && (
                          <button className="text-green-600 hover:text-green-900">
                            {activeTab === 'receivable' ? 'Record Payment' : 'Make Payment'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <i className="ri-wallet-3-line text-4xl text-gray-300 mb-2"></i>
                      <p>No {activeTab === 'receivable' ? 'receivables' : 'payables'} found</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or add a new {activeTab === 'receivable' ? 'invoice' : 'bill'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Tips */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Management Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">
              {activeTab === 'receivable' ? 'Improving Collections' : 'Managing Payables'}
            </h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              {activeTab === 'receivable' ? (
                <>
                  <li>Send invoice reminders 7 days before due date</li>
                  <li>Offer multiple payment options to customers</li>
                  <li>Consider early payment discounts for large invoices</li>
                  <li>Follow up within 3 days of missed payments</li>
                </>
              ) : (
                <>
                  <li>Schedule payments to optimize cash flow</li>
                  <li>Take advantage of early payment discounts when possible</li>
                  <li>Maintain good supplier relationships by paying on time</li>
                  <li>Verify all invoices against purchase orders before payment</li>
                </>
              )}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Payment Terms Explained</h4>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li><span className="font-medium">Net 30:</span> Payment due within 30 days</li>
              <li><span className="font-medium">2/10 Net 30:</span> 2% discount if paid within 10 days, full amount due in 30 days</li>
              <li><span className="font-medium">EOM:</span> Payment due at the end of month</li>
              <li><span className="font-medium">CIA:</span> Cash in advance required before delivery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
