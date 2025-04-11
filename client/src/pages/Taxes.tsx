import { useState } from "react";
import { Plus, Table, Download } from "lucide-react";
import PageTitle from "@/components/common/PageTitle";

interface GstRate {
  id: number;
  category: string;
  rate: number;
  description: string;
  hsn: string;
}

interface TaxReport {
  id: number;
  month: string;
  totalTax: number;
  status: string;
  dueDate: string;
}

export default function Taxes() {
  const [activeTab, setActiveTab] = useState<'rates' | 'reports'>('rates');
  const [baseAmount, setBaseAmount] = useState<number>(10000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [transactionType, setTransactionType] = useState<'intra' | 'inter'>('intra');
  const [calculationResult, setCalculationResult] = useState({
    baseAmount: 10000,
    cgst: 900,
    sgst: 900,
    igst: 0,
    totalAmount: 11800
  });

  // GST rates commonly used in India
  const gstRates: GstRate[] = [
    { id: 1, category: "Essential Goods", rate: 0, description: "Food grains, fresh fruits & vegetables", hsn: "Various" },
    { id: 2, category: "Basic Necessities", rate: 5, description: "Packaged food items, sugar, tea, coffee", hsn: "0902, 1701" },
    { id: 3, category: "Standard Rate", rate: 12, description: "Processed food, computers, mobiles", hsn: "8471, 8517" },
    { id: 4, category: "Standard Rate", rate: 18, description: "Electronics, chemicals, machinery", hsn: "8528, 8504" },
    { id: 5, category: "Luxury Items", rate: 28, description: "Luxury cars, tobacco products", hsn: "8703, 2402" },
  ];

  // Mock tax reports
  const taxReports: TaxReport[] = [
    { id: 1, month: "April 2023", totalTax: 28500, status: "Filed", dueDate: "20th May 2023" },
    { id: 2, month: "May 2023", totalTax: 32100, status: "Filed", dueDate: "20th June 2023" },
    { id: 3, month: "June 2023", totalTax: 29800, status: "Filed", dueDate: "20th July 2023" },
    { id: 4, month: "July 2023", totalTax: 31200, status: "Filed", dueDate: "20th August 2023" },
    { id: 5, month: "August 2023", totalTax: 33500, status: "Pending", dueDate: "20th September 2023" },
  ];

  // Function to calculate GST
  const calculateGST = () => {
    const gstAmount = baseAmount * (gstRate / 100);
    
    if (transactionType === 'intra') {
      // For intra-state transactions, divide GST equally into CGST and SGST
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;
      setCalculationResult({
        baseAmount,
        cgst,
        sgst,
        igst: 0,
        totalAmount: baseAmount + cgst + sgst
      });
    } else {
      // For inter-state transactions, apply full GST as IGST
      setCalculationResult({
        baseAmount,
        cgst: 0,
        sgst: 0,
        igst: gstAmount,
        totalAmount: baseAmount + gstAmount
      });
    }
  };

  // Format as Indian Rupees
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <PageTitle 
        title="GST & Tax Management" 
        subtitle="Manage tax rates, HSN codes and generate tax reports"
        actions={
          <>
            <button className="px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center">
              <Plus className="w-4 h-4 mr-1" /> Add GST Rate
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center">
              <Download className="w-4 h-4 mr-1" /> Export Reports
            </button>
          </>
        }
      />

      {/* Tab navigation */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'rates'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('rates')}
            >
              GST Rates
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'reports'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('reports')}
            >
              Tax Reports
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'rates' ? (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">GST Rates Guide</h3>
                <p className="text-gray-600">
                  GST (Goods and Services Tax) in India has the following slabs: 0%, 5%, 12%, 18%, and 28%. 
                  Each product should be assigned the appropriate GST rate based on the HSN (Harmonized System of Nomenclature) code.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GST Rate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        HSN Codes
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gstRates.map((rate) => (
                      <tr key={rate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rate.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rate.rate}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rate.hsn}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {rate.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-4">
                            Edit
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <i className="ri-more-2-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">GST Calculation Tool</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Left side: Calculator */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">GST Calculator</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Base Amount (₹)</label>
                          <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500" 
                            placeholder="Enter amount without GST"
                            value={baseAmount}
                            onChange={(e) => setBaseAmount(Number(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">GST Rate (%)</label>
                          <select 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={gstRate}
                            onChange={(e) => setGstRate(Number(e.target.value))}
                          >
                            <option value="0">0% - Essential Items</option>
                            <option value="5">5% - Basic Necessities</option>
                            <option value="12">12% - Standard Rate</option>
                            <option value="18">18% - Standard Rate</option>
                            <option value="28">28% - Luxury Items</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                          <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                              <input 
                                type="radio" 
                                name="transactionType" 
                                className="text-primary-600 focus:ring-primary-500" 
                                checked={transactionType === 'intra'}
                                onChange={() => setTransactionType('intra')}
                              />
                              <span className="ml-2 text-sm text-gray-700">Intra-state (CGST+SGST)</span>
                            </label>
                            <label className="inline-flex items-center">
                              <input 
                                type="radio" 
                                name="transactionType" 
                                className="text-primary-600 focus:ring-primary-500" 
                                checked={transactionType === 'inter'}
                                onChange={() => setTransactionType('inter')}
                              />
                              <span className="ml-2 text-sm text-gray-700">Inter-state (IGST)</span>
                            </label>
                          </div>
                        </div>
                        <button 
                          className="w-full px-4 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          onClick={calculateGST}
                        >
                          Calculate
                        </button>
                      </div>
                      
                      <div className="mt-4 bg-white p-4 rounded border border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Results</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">Base Amount:</div>
                          <div className="font-medium text-gray-800">{formatCurrency(calculationResult.baseAmount)}</div>
                          
                          {transactionType === 'intra' ? (
                            <>
                              <div className="text-gray-600">CGST ({gstRate/2}%):</div>
                              <div className="font-medium text-gray-800">{formatCurrency(calculationResult.cgst)}</div>
                              
                              <div className="text-gray-600">SGST ({gstRate/2}%):</div>
                              <div className="font-medium text-gray-800">{formatCurrency(calculationResult.sgst)}</div>
                            </>
                          ) : (
                            <>
                              <div className="text-gray-600">IGST ({gstRate}%):</div>
                              <div className="font-medium text-gray-800">{formatCurrency(calculationResult.igst)}</div>
                            </>
                          )}
                          
                          <div className="text-gray-600 font-medium">Total Amount:</div>
                          <div className="font-medium text-green-700">{formatCurrency(calculationResult.totalAmount)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Info and Examples */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">How GST Works in India</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2">
                        <li>GST (Goods and Services Tax) replaced multiple indirect taxes in India and has five slabs: 0%, 5%, 12%, 18%, and 28%</li>
                        <li>For intra-state transactions (within same state), GST is divided equally between CGST and SGST</li>
                        <li>For inter-state transactions, IGST is charged at the full rate</li>
                        <li>Every business with turnover above ₹40 lakhs (₹20 lakhs in some states) must register for GST</li>
                        <li>GST registration number format: 22AAAAA0000A1Z5</li>
                      </ul>
                      
                      <div className="mt-4">
                        <h4 className="font-medium text-gray-700 mb-2">Common HSN Codes</h4>
                        <div className="bg-white p-3 rounded border border-gray-200 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-700">0402: Milk Products</div>
                            <div className="text-gray-600">5% GST</div>
                            
                            <div className="text-gray-700">6309: Worn Clothing</div>
                            <div className="text-gray-600">5% GST</div>
                            
                            <div className="text-gray-700">8471: Computers</div>
                            <div className="text-gray-600">18% GST</div>
                            
                            <div className="text-gray-700">8517: Telephones</div>
                            <div className="text-gray-600">18% GST</div>
                            
                            <div className="text-gray-700">8703: Motor Cars</div>
                            <div className="text-gray-600">28% GST</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-blue-50 p-3 rounded border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Tip:</span> Input Tax Credit (ITC) allows businesses to claim credit for GST paid on purchases from the GST charged on sales, reducing the overall tax burden.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-800">Monthly GST Returns</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm">
                    <option value="fy2023-24">FY 2023-24</option>
                    <option value="fy2022-23">FY 2022-23</option>
                  </select>
                  <button className="px-3 py-2 bg-primary-700 text-white rounded-md hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm flex items-center">
                    <Table className="w-4 h-4 mr-1" /> Generate Report
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Period
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Tax
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {taxReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {report.month}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(report.totalTax)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            report.status === 'Filed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {report.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {report.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-3">
                            <i className="ri-eye-line"></i> View
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 mr-3">
                            <i className="ri-download-line"></i> Download
                          </button>
                          {report.status === 'Pending' && (
                            <button className="text-primary-600 hover:text-primary-900">
                              <i className="ri-file-list-3-line"></i> File
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <i className="ri-information-line mr-2"></i> GST Filing Information
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>GSTR-1: Monthly return for outward supplies (sales) - Due by 11th of next month</li>
                  <li>GSTR-3B: Monthly summary return - Due by 20th of next month</li>
                  <li>Late filing fees: ₹50 per day (₹20 CGST + ₹20 SGST), maximum ₹10,000</li>
                  <li>Interest on late payment: 18% per annum</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
