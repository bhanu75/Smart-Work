import React, { useState } from 'react';
import { Plus, Trash2, Printer, Save, FileText, Search, X, Edit2, Eye } from 'lucide-react';

const SERVICES = [
  { id: 1, name: 'Deluxe Room (Per Night)', price: 3500, category: 'Accommodation' },
  { id: 2, name: 'Super Deluxe Room (Per Night)', price: 5000, category: 'Accommodation' },
  { id: 3, name: 'Suite Room (Per Night)', price: 8500, category: 'Accommodation' },
  { id: 4, name: 'Royal Suite (Per Night)', price: 12000, category: 'Accommodation' },
  { id: 5, name: 'Standard Room (Per Night)', price: 2500, category: 'Accommodation' },
  { id: 6, name: 'Extra Bed', price: 800, category: 'Accommodation' },
  
  { id: 10, name: 'Breakfast Buffet', price: 450, category: 'Food' },
  { id: 11, name: 'Lunch Buffet', price: 650, category: 'Food' },
  { id: 12, name: 'Dinner Buffet', price: 750, category: 'Food' },
  { id: 13, name: 'Veg Thali', price: 400, category: 'Food' },
  { id: 14, name: 'Non-Veg Thali', price: 550, category: 'Food' },
  { id: 15, name: 'Dal Bati Churma (Special)', price: 380, category: 'Food' },
  { id: 16, name: 'Gatte Ki Sabzi', price: 280, category: 'Food' },
  { id: 17, name: 'Paneer Butter Masala', price: 320, category: 'Food' },
  { id: 18, name: 'Chicken Curry', price: 400, category: 'Food' },
  { id: 19, name: 'Mutton Rogan Josh', price: 520, category: 'Food' },
  { id: 20, name: 'Biryani (Veg)', price: 280, category: 'Food' },
  { id: 21, name: 'Biryani (Chicken)', price: 380, category: 'Food' },
  { id: 22, name: 'Fried Rice', price: 220, category: 'Food' },
  { id: 23, name: 'Noodles', price: 200, category: 'Food' },
  
  { id: 30, name: 'Chai (Tea)', price: 40, category: 'Beverages' },
  { id: 31, name: 'Coffee', price: 60, category: 'Beverages' },
  { id: 32, name: 'Masala Chai', price: 50, category: 'Beverages' },
  { id: 33, name: 'Cold Coffee', price: 100, category: 'Beverages' },
  { id: 34, name: 'Fresh Lime Soda', price: 80, category: 'Beverages' },
  { id: 35, name: 'Lassi (Sweet)', price: 70, category: 'Beverages' },
  { id: 36, name: 'Lassi (Salted)', price: 70, category: 'Beverages' },
  { id: 37, name: 'Fresh Juice (Seasonal)', price: 120, category: 'Beverages' },
  { id: 38, name: 'Soft Drink (Coke/Pepsi)', price: 50, category: 'Beverages' },
  { id: 39, name: 'Mineral Water (1L)', price: 40, category: 'Beverages' },
  { id: 40, name: 'Welcome Drink', price: 150, category: 'Beverages' },
  
  { id: 50, name: 'Samosa (2 Pcs)', price: 40, category: 'Snacks' },
  { id: 51, name: 'Pakora Plate', price: 80, category: 'Snacks' },
  { id: 52, name: 'Vada Pav', price: 50, category: 'Snacks' },
  { id: 53, name: 'Sandwich (Veg)', price: 100, category: 'Snacks' },
  { id: 54, name: 'Sandwich (Cheese)', price: 120, category: 'Snacks' },
  { id: 55, name: 'French Fries', price: 120, category: 'Snacks' },
  { id: 56, name: 'Spring Roll', price: 140, category: 'Snacks' },
  
  { id: 70, name: 'Laundry Service', price: 300, category: 'Additional Services' },
  { id: 71, name: 'Airport Pickup/Drop', price: 800, category: 'Additional Services' },
  { id: 72, name: 'Room Service Charge', price: 100, category: 'Additional Services' },
  { id: 73, name: 'Conference Hall (Per Hour)', price: 2000, category: 'Additional Services' },
  { id: 74, name: 'Banquet Hall (Per Day)', price: 25000, category: 'Additional Services' },
];

export default function HotelBillingSystem() {
  const [bills, setBills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBill, setCurrentBill] = useState({
    billNo: `INV-${Date.now().toString().slice(-6)}`,
    customerName: '',
    address: '',
    mobile: '',
    email: '',
    checkIn: '',
    checkOut: '',
    date: new Date().toISOString().split('T')[0],
    services: [],
    discount: 0,
    discountType: 'amount',
    cgst: 6,
    sgst: 6,
    notes: ''
  });

  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const calculateTotals = (bill) => {
    const subtotal = bill.services.reduce((sum, service) => sum + (service.quantity * service.price), 0);
    const discountAmount = bill.discountType === 'percent' 
      ? (subtotal * bill.discount) / 100 
      : bill.discount;
    const afterDiscount = subtotal - discountAmount;
    const cgstAmount = (afterDiscount * bill.cgst) / 100;
    const sgstAmount = (afterDiscount * bill.sgst) / 100;
    const grandTotal = afterDiscount + cgstAmount + sgstAmount;
    
    return { subtotal, discountAmount, afterDiscount, cgstAmount, sgstAmount, grandTotal };
  };

  const addServiceToBill = (service) => {
    const existingService = currentBill.services.find(s => s.id === service.id);
    if (existingService) {
      setCurrentBill({
        ...currentBill,
        services: currentBill.services.map(s => 
          s.id === service.id ? { ...s, quantity: s.quantity + 1 } : s
        )
      });
    } else {
      setCurrentBill({
        ...currentBill,
        services: [...currentBill.services, { ...service, quantity: 1 }]
      });
    }
    setShowServiceDropdown(false);
  };

  const updateServiceQuantity = (index, quantity) => {
    const newServices = [...currentBill.services];
    newServices[index].quantity = Math.max(1, parseInt(quantity) || 1);
    setCurrentBill({ ...currentBill, services: newServices });
  };

  const updateServicePrice = (index, price) => {
    const newServices = [...currentBill.services];
    newServices[index].price = parseFloat(price) || 0;
    setCurrentBill({ ...currentBill, services: newServices });
  };

  const removeService = (index) => {
    setCurrentBill({
      ...currentBill,
      services: currentBill.services.filter((_, i) => i !== index)
    });
  };

  const saveBill = () => {
    if (!currentBill.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }
    if (currentBill.services.length === 0) {
      alert('Please add at least one service');
      return;
    }

    if (editingId !== null) {
      setBills(bills.map(bill => bill.id === editingId ? { ...currentBill, id: editingId } : bill));
      setEditingId(null);
    } else {
      const newBill = { ...currentBill, id: Date.now() };
      setBills([newBill, ...bills]);
    }

    resetForm();
  };

  const resetForm = () => {
    setCurrentBill({
      billNo: `INV-${Date.now().toString().slice(-6)}`,
      customerName: '',
      address: '',
      mobile: '',
      email: '',
      checkIn: '',
      checkOut: '',
      date: new Date().toISOString().split('T')[0],
      services: [],
      discount: 0,
      discountType: 'amount',
      cgst: 6,
      sgst: 6,
      notes: ''
    });
    setShowForm(false);
  };

  const editBill = (bill) => {
    setCurrentBill(bill);
    setEditingId(bill.id);
    setShowForm(true);
  };

  const deleteBill = (id) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      setBills(bills.filter(bill => bill.id !== id));
    }
  };

  const printBill = (bill) => {
    const totals = calculateTotals(bill);
    const printWindow = window.open('', '', 'width=900,height=800');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${bill.billNo}</title>
          <style>
            @page { 
              size: A4; 
              margin: 10mm; 
            }
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box; 
            }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 11pt;
              line-height: 1.3;
              color: #000;
              background: white;
            }
            .invoice-wrapper {
              border: 2px solid #000;
              padding: 0;
              background: white;
            }
            
            /* Header Section */
            .header-row {
              display: table;
              width: 100%;
              border-bottom: 2px solid #000;
            }
            .gst-cell {
              display: table-cell;
              padding: 8px;
              font-size: 9pt;
              vertical-align: top;
              border-right: 2px solid #000;
              width: 35%;
            }
            .title-cell {
              display: table-cell;
              padding: 8px;
              text-align: center;
              font-weight: bold;
              font-size: 13pt;
              vertical-align: middle;
              border-right: 2px solid #000;
              width: 30%;
            }
            .mobile-cell {
              display: table-cell;
              padding: 8px;
              font-size: 9pt;
              text-align: right;
              vertical-align: top;
              width: 35%;
            }
            
            /* Hotel Name Section */
            .hotel-section {
              text-align: center;
              padding: 12px;
              border-bottom: 2px solid #000;
            }
            .hotel-name {
              font-size: 22pt;
              font-weight: bold;
              letter-spacing: 3px;
              margin-bottom: 4px;
            }
            .hotel-subtitle {
              font-size: 8pt;
              margin-bottom: 6px;
            }
            .hotel-address {
              font-size: 9pt;
              line-height: 1.4;
            }
            
            /* Info Grid Section */
            .info-grid {
              display: table;
              width: 100%;
              border-bottom: 2px solid #000;
            }
            .info-left {
              display: table-cell;
              width: 50%;
              padding: 10px;
              border-right: 2px solid #000;
              vertical-align: top;
            }
            .info-right {
              display: table-cell;
              width: 50%;
              padding: 10px;
              vertical-align: top;
            }
            .info-row {
              margin-bottom: 6px;
              font-size: 10pt;
            }
            .info-label {
              display: inline-block;
              width: 110px;
              font-weight: normal;
            }
            .info-value {
              font-weight: normal;
            }
            
            /* Main Table */
            .main-table {
              width: 100%;
              border-collapse: collapse;
            }
            .main-table th {
              border: 1px solid #000;
              padding: 8px 6px;
              font-size: 9pt;
              font-weight: bold;
              text-align: center;
              background-color: #f0f0f0;
            }
            .main-table td {
              border: 1px solid #000;
              padding: 6px;
              font-size: 10pt;
              vertical-align: top;
            }
            .col-sr { width: 40px; text-align: center; }
            .col-desc { text-align: left; }
            .col-qty { width: 60px; text-align: center; }
            .col-rate { width: 90px; text-align: right; }
            .col-amount { width: 100px; text-align: right; }
            
            .service-name {
              font-weight: 600;
              margin-bottom: 2px;
            }
            .service-category {
              font-size: 8pt;
              color: #666;
              font-style: italic;
            }
            
            /* Empty rows for spacing */
            .empty-row td {
              height: 60px;
              border-left: 1px solid #000;
              border-right: 1px solid #000;
            }
            
            /* Total Row */
            .total-row td {
              font-weight: bold;
              text-align: right;
              padding: 8px;
            }
            
            /* Bottom Section */
            .bottom-section {
              display: table;
              width: 100%;
              border-top: 2px solid #000;
            }
            .tax-calc {
              display: table-cell;
              width: 50%;
              padding: 10px;
              border-right: 2px solid #000;
              font-size: 9pt;
              vertical-align: top;
            }
            .totals-section {
              display: table-cell;
              width: 50%;
              padding: 10px;
              font-size: 10pt;
            }
            .total-line {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
              border-bottom: 1px solid #ddd;
            }
            .total-line:last-child {
              border-bottom: none;
              font-weight: bold;
              font-size: 11pt;
              padding-top: 8px;
              border-top: 2px solid #000;
            }
            .total-label { font-weight: 600; }
            .total-value { text-align: right; min-width: 100px; }
            
            /* Footer */
            .footer-section {
              border-top: 2px solid #000;
              padding: 15px;
              text-align: center;
              font-size: 10pt;
            }
            .footer-title {
              font-weight: bold;
              margin-bottom: 4px;
            }
            .footer-subtitle {
              font-style: italic;
              color: #666;
            }
            
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-wrapper">
            <!-- Header Row -->
            <div class="header-row">
              <div class="gst-cell">GST NO. : 08AABCH1234F1Z5</div>
              <div class="title-cell">TAX INVOICE</div>
              <div class="mobile-cell">Mobile : ${bill.mobile || '838292923'}<br>${bill.billNo}</div>
            </div>
            
            <!-- Hotel Name Section -->
            <div class="hotel-section">
              <div class="hotel-name">HOTEL GRAND SITA</div>
              <div class="hotel-subtitle">(A UNIT OF GRAND HOSPITALITY)</div>
              <div class="hotel-address">
                Near Udaiya Pole, Udaipur, Rajasthan<br>
                Email: hotelgrandsita@gmail.com, Website: www.hotelgrandsita.com
              </div>
            </div>
            
            <!-- Info Grid -->
            <div class="info-grid">
              <div class="info-left">
                <div class="info-row">
                  <span class="info-label">Invoice No.</span> : ${bill.billNo}
                </div>
                <div class="info-row">
                  <span class="info-label">NAME OF GUEST</span> : ${bill.customerName}
                </div>
                ${bill.mobile ? `<div class="info-row">
                  <span class="info-label">Mobile No.</span> ${bill.mobile}
                </div>` : ''}
                ${bill.address ? `<div class="info-row">
                  <span class="info-label">Address</span> : ${bill.address}
                </div>` : ''}
                <div class="info-row">
                  <span class="info-label">GSTIN:</span>
                </div>
              </div>
              <div class="info-right">
                <div class="info-row">
                  <span class="info-label">Invoice Date</span> : ${new Date(bill.date).toLocaleDateString('en-GB')}
                </div>
                ${bill.checkIn ? `<div class="info-row">
                  <span class="info-label">Arrival Date</span> : ${new Date(bill.checkIn).toLocaleDateString('en-GB')}
                </div>` : ''}
                ${bill.checkOut ? `<div class="info-row">
                  <span class="info-label">Departure Date</span> : ${new Date(bill.checkOut).toLocaleDateString('en-GB')}
                </div>` : ''}
              </div>
            </div>
            
            <!-- Main Services Table -->
            <table class="main-table">
              <thead>
                <tr>
                  <th class="col-sr">Sr.</th>
                  <th class="col-desc">Particulars</th>
                  <th class="col-qty">Qty</th>
                  <th class="col-rate">Rate</th>
                  <th class="col-amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${bill.services.map((service, index) => `
                  <tr>
                    <td class="col-sr">${index + 1}</td>
                    <td class="col-desc">
                      <div class="service-name">${service.name}</div>
                      <div class="service-category">${service.category}</div>
                    </td>
                    <td class="col-qty">${service.quantity}</td>
                    <td class="col-rate">${service.price.toFixed(2)}</td>
                    <td class="col-amount">${(service.quantity * service.price).toFixed(2)}</td>
                  </tr>
                `).join('')}
                
                <!-- Empty Rows for spacing -->
                ${bill.services.length < 5 ? Array(5 - bill.services.length).fill(0).map(() => `
                  <tr class="empty-row">
                    <td class="col-sr">&nbsp;</td>
                    <td class="col-desc">&nbsp;</td>
                    <td class="col-qty">&nbsp;</td>
                    <td class="col-rate">&nbsp;</td>
                    <td class="col-amount">&nbsp;</td>
                  </tr>
                `).join('') : ''}
                
                <!-- Total Row -->
                <tr class="total-row">
                  <td colspan="2" style="text-align: center; border-right: 1px solid #000;">TOTAL</td>
                  <td class="col-qty">${bill.services.reduce((sum, s) => sum + s.quantity, 0)}</td>
                  <td class="col-rate">Sub Total (W/o Tax)</td>
                  <td class="col-amount">${totals.subtotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            
            <!-- Bottom Section with Tax Calculation -->
            <div class="bottom-section">
              <div class="tax-calc">
                <div>S-GST @ ${bill.sgst}% ON ₹${totals.afterDiscount.toFixed(2)} = ${totals.sgstAmount.toFixed(2)}</div>
                <div>C-GST @ ${bill.cgst}% ON ₹${totals.afterDiscount.toFixed(2)} = ${totals.cgstAmount.toFixed(2)}</div>
              </div>
              <div class="totals-section">
                ${totals.discountAmount > 0 ? `
                  <div class="total-line">
                    <span class="total-label">Disc. Amt.</span>
                    <span class="total-value">: ${totals.discountAmount.toFixed(2)}</span>
                  </div>
                ` : `
                  <div class="total-line">
                    <span class="total-label">Disc. Amt.</span>
                    <span class="total-value">: 0.00</span>
                  </div>
                `}
                <div class="total-line">
                  <span class="total-label">GST</span>
                  <span class="total-value">: ${(totals.cgstAmount + totals.sgstAmount).toFixed(2)}</span>
                </div>
                <div class="total-line">
                  <span class="total-label">Round Off</span>
                  <span class="total-value">: 0.00</span>
                </div>
                <div class="total-line">
                  <span class="total-label">Grand Total</span>
                  <span class="total-value">: ${totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer-section">
              <div class="footer-title">Thank You for Choosing Hotel Grand Sita</div>
              <div class="footer-subtitle">We look forward to serving you again</div>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 250);
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const totals = calculateTotals(currentBill);
  const filteredServices = SERVICES.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedServices = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-wider mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              HOTEL GRAND SITA
            </h1>
            <p className="text-amber-200 text-lg italic tracking-wide">Experience Royal Hospitality</p>
            <div className="mt-4 text-sm opacity-90">
              <p>Near Udaiya Pole, Udaipur, Rajasthan | Phone: +91 838292923</p>
              <p>GSTIN: 08AABCH1234F1Z5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Action Button */}
        {!showForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-3"
            >
              <Plus size={24} />
              Create New Invoice
            </button>
          </div>
        )}

        {/* Invoice Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 border border-amber-200">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-8 py-6 border-b-2 border-amber-300">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-amber-900">
                  {editingId ? 'Edit Invoice' : 'New Invoice'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-amber-700 hover:text-amber-900 p-2 hover:bg-amber-200 rounded-lg transition"
                >
                  <X size={28} />
                </button>
              </div>
            </div>

            <div className="p-8">
              {/* Customer & Invoice Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4 border-b-2 border-amber-300 pb-2">
                    Customer Details
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name *</label>
                    <input
                      type="text"
                      value={currentBill.customerName}
                      onChange={(e) => setCurrentBill({ ...currentBill, customerName: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={currentBill.mobile}
                      onChange={(e) => setCurrentBill({ ...currentBill, mobile: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      placeholder="+91 "
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={currentBill.email}
                      onChange={(e) => setCurrentBill({ ...currentBill, email: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      placeholder="customer@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <textarea
                      value={currentBill.address}
                      onChange={(e) => setCurrentBill({ ...currentBill, address: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      rows="3"
                      placeholder="Enter address"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4 border-b-2 border-amber-300 pb-2">
                    Invoice Details
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Number</label>
                    <input
                      type="text"
                      value={currentBill.billNo}
                      onChange={(e) => setCurrentBill({ ...currentBill, billNo: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Invoice Date</label>
                    <input
                      type="date"
                      value={currentBill.date}
                      onChange={(e) => setCurrentBill({ ...currentBill, date: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-In Date</label>
                    <input
                      type="date"
                      value={currentBill.checkIn}
                      onChange={(e) => setCurrentBill({ ...currentBill, checkIn: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-Out Date</label>
                    <input
                      type="date"
                      value={currentBill.checkOut}
                      onChange={(e) => setCurrentBill({ ...currentBill, checkOut: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Services Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-amber-900">Services</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                      <Plus size={20} />
                      Add Service
                    </button>

                    {showServiceDropdown && (
                      <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl z-50 border-2 border-amber-200 max-h-96 overflow-hidden">
                        <div className="p-4 border-b-2 border-amber-100 bg-amber-50">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="text"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Search services..."
                              className="w-full pl-10 pr-4 py-2 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-80">
                          {Object.entries(groupedServices).map(([category, services]) => (
                            <div key={category} className="border-b border-gray-100">
                              <div className="px-4 py-2 bg-amber-100 font-semibold text-amber-900 text-sm sticky top-0">
                                {category}
                              </div>
                              {services.map((service) => (
                                <button
                                  key={service.id}
                                  onClick={() => addServiceToBill(service)}
                                  className="w-full px-4 py-3 hover:bg-amber-50 text-left transition flex justify-between items-center group"
                                >
                                  <span className="text-gray-700 font-medium group-hover:text-amber-900">{service.name}</span>
                                  <span className="text-amber-700 font-bold">₹{service.price}</span>
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Services Table */}
                {currentBill.services.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border-2 border-amber-200">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
                        <tr>
                          <th className="px-6 py-4 text-left font-semibold">Service</th>
                          <th className="px-6 py-4 text-center font-semibold w-32">Quantity</th>
                          <th className="px-6 py-4 text-right font-semibold w-40">Rate (₹)</th>
                          <th className="px-6 py-4 text-right font-semibold w-40">Amount (₹)</th>
                          <th className="px-6 py-4 text-center font-semibold w-24">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentBill.services.map((service, index) => (
                          <tr key={index} className="border-b border-amber-100 hover:bg-amber-50 transition">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">{service.name}</div>
                              <div className="text-sm text-gray-500 italic">{service.category}</div>
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                min="1"
                                value={service.quantity}
                                onChange={(e) => updateServiceQuantity(index, e.target.value)}
                                className="w-20 px-3 py-2 border-2 border-gray-300 rounded-lg text-center focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={service.price}
                                onChange={(e) => updateServicePrice(index, e.target.value)}
                                className="w-32 px-3 py-2 border-2 border-gray-300 rounded-lg text-right focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                              />
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-gray-900">
                              ₹{(service.quantity * service.price).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => removeService(index)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition"
                              >
                                <Trash2 size={20} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-16 bg-amber-50 rounded-xl border-2 border-dashed border-amber-300">
                    <p className="text-gray-500 text-lg">No services added yet. Click "Add Service" to begin.</p>
                  </div>
                )}
              </div>

              {/* Tax & Discount */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4 border-b-2 border-amber-300 pb-2">
                    Discount
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Value</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentBill.discount}
                        onChange={(e) => setCurrentBill({ ...currentBill, discount: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      />
                    </div>
                    <div className="w-40">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                      <select
                        value={currentBill.discountType}
                        onChange={(e) => setCurrentBill({ ...currentBill, discountType: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      >
                        <option value="amount">₹ Amount</option>
                        <option value="percent">% Percent</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-amber-900 mb-4 border-b-2 border-amber-300 pb-2">
                    Tax Rates
                  </h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CGST (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={currentBill.cgst}
                        onChange={(e) => setCurrentBill({ ...currentBill, cgst: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">SGST (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={currentBill.sgst}
                        onChange={(e) => setCurrentBill({ ...currentBill, sgst: parseFloat(e.target.value) || 0 })}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes / Terms & Conditions</label>
                <textarea
                  value={currentBill.notes}
                  onChange={(e) => setCurrentBill({ ...currentBill, notes: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition"
                  rows="3"
                  placeholder="Any additional notes or terms..."
                />
              </div>

              {/* Totals Summary */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border-2 border-amber-200 mb-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-6 text-center">Invoice Summary</h3>
                <div className="max-w-md mx-auto space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-amber-200">
                    <span className="text-gray-700 font-medium">Subtotal</span>
                    <span className="text-xl font-semibold text-gray-900">₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  {totals.discountAmount > 0 && (
                    <>
                      <div className="flex justify-between items-center py-3 border-b border-amber-200">
                        <span className="text-gray-700 font-medium">
                          Discount {currentBill.discountType === 'percent' ? `(${currentBill.discount}%)` : ''}
                        </span>
                        <span className="text-xl font-semibold text-red-600">-₹{totals.discountAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-amber-200">
                        <span className="text-gray-700 font-medium">After Discount</span>
                        <span className="text-xl font-semibold text-gray-900">₹{totals.afterDiscount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center py-3 border-b border-amber-200">
                    <span className="text-gray-700 font-medium">CGST ({currentBill.cgst}%)</span>
                    <span className="text-xl font-semibold text-gray-900">₹{totals.cgstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-amber-200">
                    <span className="text-gray-700 font-medium">SGST ({currentBill.sgst}%)</span>
                    <span className="text-xl font-semibold text-gray-900">₹{totals.sgstAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl px-6 mt-4">
                    <span className="text-xl font-bold">GRAND TOTAL</span>
                    <span className="text-3xl font-bold">₹{totals.grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={saveBill}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={24} />
                  {editingId ? 'Update Invoice' : 'Save Invoice'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Saved Bills List */}
        {bills.length > 0 && !showForm && (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200">
            <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-8 py-6 border-b-2 border-amber-300">
              <h2 className="text-3xl font-bold text-amber-900">Saved Invoices</h2>
              <p className="text-amber-700 mt-1">Total: {bills.length} invoice{bills.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="p-6">
              <div className="grid gap-6">
                {bills.map((bill) => {
                  const billTotals = calculateTotals(bill);
                  return (
                    <div key={bill.id} className="border-2 border-amber-200 rounded-xl p-6 hover:shadow-xl transition-all bg-gradient-to-br from-white to-amber-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                              {bill.billNo}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {new Date(bill.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{bill.customerName}</h3>
                          {bill.mobile && <p className="text-gray-600">📱 {bill.mobile}</p>}
                          {bill.address && <p className="text-gray-600 text-sm">📍 {bill.address}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Grand Total</p>
                          <p className="text-3xl font-bold text-amber-700">₹{billTotals.grandTotal.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 mb-4 border border-amber-100">
                        <p className="text-sm text-gray-600 mb-2 font-semibold">Services:</p>
                        <div className="flex flex-wrap gap-2">
                          {bill.services.slice(0, 3).map((service, idx) => (
                            <span key={idx} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                              {service.name} (x{service.quantity})
                            </span>
                          ))}
                          {bill.services.length > 3 && (
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                              +{bill.services.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => printBill(bill)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          <Printer size={20} />
                          Print
                        </button>
                        <button
                          onClick={() => editBill(bill)}
                          className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          <Edit2 size={20} />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBill(bill.id)}
                          className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                          <Trash2 size={20} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {bills.length === 0 && !showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center border-2 border-dashed border-amber-300">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Invoices Yet</h3>
            <p className="text-gray-500 mb-6">Create your first invoice to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all inline-flex items-center gap-3"
            >
              <Plus size={24} />
              Create Invoice
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
