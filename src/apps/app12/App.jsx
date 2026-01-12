import React, { useState, useRef, useEffect } from 'react';
import { Download, Share2, Plus, Minus, Settings, Moon, Sun, Edit2, Save, Search, Trash2, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_WEIGHTS = {
  '8mm': 4.5,
  '10mm': 7,
  '12mm': 10.5,
  '16mm': 21,
  '20mm': 33,
  '25mm': 52
};

const SIZES = ['8mm', '10mm', '12mm', '16mm', '20mm', '25mm'];

const BRANDS = [
  { value: 'tata', label: 'Tata Steel', auth: 'Authorized Dealer' },
  { value: 'jsw', label: 'JSW Steel', auth: 'Authorized Dealer' },
  { value: 'sail', label: 'SAIL', auth: 'Authorized Dealer' },
  { value: 'jindal', label: 'Jindal Steel', auth: 'Authorized Dealer' },
  { value: 'kamdhenu', label: 'Kamdhenu', auth: 'Authorized Dealer' },
  { value: 'shyam', label: 'Shyam Steel', auth: 'Authorized Dealer' },
  { value: 'vizag', label: 'Vizag Steel', auth: 'Authorized Dealer' },
  { value: 'bhushan', label: 'Bhushan Steel', auth: 'Authorized Dealer' },
  { value: 'other', label: 'Other', auth: 'Retailer' }
];

export default function SteelQuotationApp() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  const [customWeights, setCustomWeights] = useState(() => {
    const saved = localStorage.getItem('customWeights');
    return saved ? JSON.parse(saved) : DEFAULT_WEIGHTS;
  });

  const [shopSettings, setShopSettings] = useState(() => {
    const saved = localStorage.getItem('shopSettings');
    return saved ? JSON.parse(saved) : {
      shopName: '',
      mobileNumber: '',
      dealerName: '',
      brandValue: '',
      showSettings: true
    };
  });

  const [baseRate, setBaseRate] = useState(() => {
    const saved = localStorage.getItem('dailyRate');
    const savedDate = localStorage.getItem('rateDate');
    const today = new Date().toDateString();
    
    if (savedDate === today && saved) {
      return saved;
    }
    return '';
  });

  const [customerName, setCustomerName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [includeDate, setIncludeDate] = useState(true);
  const [items, setItems] = useState([{ size: '12mm', quantity: 0 }]);
  const [charges, setCharges] = useState({
    transport: { enabled: false, amount: '' },
    hamali: { enabled: false, amount: '' }
  });
  const [discount, setDiscount] = useState({
    enabled: false,
    amount: '',
    type: 'flat'
  });
  const [otherItems, setOtherItems] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [savedQuotations, setSavedQuotations] = useState(() => {
    const saved = localStorage.getItem('savedQuotations');
    return saved ? JSON.parse(saved) : [];
  });
  const [showHistory, setShowHistory] = useState(false);
  const [editingWeights, setEditingWeights] = useState(false);
  const [tempWeights, setTempWeights] = useState(customWeights);

  const canvasRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (shopSettings.shopName && shopSettings.mobileNumber) {
      localStorage.setItem('shopSettings', JSON.stringify(shopSettings));
    }
  }, [shopSettings]);

  useEffect(() => {
    if (baseRate) {
      localStorage.setItem('dailyRate', baseRate.toString());
      localStorage.setItem('rateDate', new Date().toDateString());
    }
  }, [baseRate]);

  useEffect(() => {
    localStorage.setItem('customWeights', JSON.stringify(customWeights));
  }, [customWeights]);

  useEffect(() => {
    localStorage.setItem('savedQuotations', JSON.stringify(savedQuotations));
  }, [savedQuotations]);

  const getBrandInfo = () => {
    return BRANDS.find(b => b.value === shopSettings.brandValue) || BRANDS[BRANDS.length - 1];
  };

  const calculateRate = (size) => {
    if (!baseRate) return 0;
    const sizeNum = parseInt(size);
    const difference = (12 - sizeNum) / 2;
    return parseFloat(baseRate) + (difference * 2);
  };

  const calculateItemAmount = (item) => {
    const weight = parseFloat(item.quantity) * customWeights[item.size];
    const rate = calculateRate(item.size);
    return weight * rate;
  };

  const calculateSubtotal = () => {
    let total = 0;
    items.forEach(item => {
      if (item.quantity) total += calculateItemAmount(item);
    });
    if (charges.transport.enabled && charges.transport.amount) {
      total += parseFloat(charges.transport.amount);
    }
    if (charges.hamali.enabled && charges.hamali.amount) {
      total += parseFloat(charges.hamali.amount);
    }
    otherItems.forEach(item => {
      if (item.amount) total += parseFloat(item.amount);
    });
    return total;
  };

  const calculateDiscount = () => {
    if (!discount.enabled || !discount.amount) return 0;
    const subtotal = calculateSubtotal();
    if (discount.type === 'percent') {
      return (subtotal * parseFloat(discount.amount)) / 100;
    }
    return parseFloat(discount.amount);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const incrementQuantity = (index) => {
    const newItems = [...items];
    newItems[index].quantity = (newItems[index].quantity || 0) + 1;
    setItems(newItems);
  };

  const decrementQuantity = (index) => {
    const newItems = [...items];
    if (newItems[index].quantity > 0) {
      newItems[index].quantity = newItems[index].quantity - 1;
    }
    setItems(newItems);
  };

  const updateQuantity = (index, value) => {
    const newItems = [...items];
    const numValue = value === '' ? 0 : parseInt(value);
    newItems[index].quantity = isNaN(numValue) ? 0 : Math.max(0, numValue);
    setItems(newItems);
  };

  const addMaterialItem = () => {
    setItems([...items, { size: '12mm', quantity: 0 }]);
  };

  const removeMaterialItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateMaterialItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addOtherItem = () => {
    setOtherItems([...otherItems, { name: '', amount: '' }]);
  };

  const removeOtherItem = (index) => {
    setOtherItems(otherItems.filter((_, i) => i !== index));
  };

  const updateOtherItem = (index, field, value) => {
    const newItems = [...otherItems];
    newItems[index][field] = value;
    setOtherItems(newItems);
  };

  const saveQuotation = () => {
    const quotation = {
      id: Date.now(),
      date: new Date().toISOString(),
      customerName: customerName || 'Anonymous',
      deliveryLocation,
      items: items.filter(i => i.quantity > 0),
      charges,
      discount,
      otherItems: otherItems.filter(i => i.amount),
      total: calculateTotal(),
      baseRate: parseFloat(baseRate)
    };
    setSavedQuotations([quotation, ...savedQuotations]);
  };

  const loadQuotation = (quotation) => {
    setCustomerName(quotation.customerName === 'Anonymous' ? '' : quotation.customerName);
    setDeliveryLocation(quotation.deliveryLocation || '');
    setItems(quotation.items.length > 0 ? quotation.items : [{ size: '12mm', quantity: 0 }]);
    setCharges(quotation.charges);
    setDiscount(quotation.discount);
    setOtherItems(quotation.otherItems || []);
    setShowHistory(false);
  };

  const deleteQuotation = (id) => {
    setSavedQuotations(savedQuotations.filter(q => q.id !== id));
  };

  const saveWeights = () => {
    setCustomWeights(tempWeights);
    setEditingWeights(false);
  };

  const resetWeights = () => {
    setTempWeights(DEFAULT_WEIGHTS);
  };

  const generateQuotationImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 900;
    let currentY = 50;
    
    const rowCount = items.filter(i => i.quantity).length;
    const chargeCount = (charges.transport.enabled ? 1 : 0) + (charges.hamali.enabled ? 1 : 0);
    const otherCount = otherItems.filter(i => i.amount).length;
    const discountRows = discount.enabled ? 1 : 0;
    const estimatedHeight = 450 + (rowCount * 50) + (chargeCount * 40) + (otherCount * 40) + (discountRows * 40) + 250;
    canvas.height = estimatedHeight;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

    const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    headerGradient.addColorStop(0, '#1e3a8a');
    headerGradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = headerGradient;
    ctx.fillRect(30, 30, canvas.width - 60, 160);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(shopSettings.shopName || 'Steel Trading Co.', canvas.width / 2, 80);

    const brandInfo = getBrandInfo();
    if (brandInfo) {
      ctx.fillStyle = brandInfo.value === 'other' ? '#94a3b8' : '#fbbf24';
      ctx.fillRect(canvas.width / 2 - 180, 95, 360, 35);
      ctx.fillStyle = '#1e3a8a';
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`${brandInfo.auth} - ${brandInfo.label}`, canvas.width / 2, 118);
    }

    if (shopSettings.dealerName) {
      ctx.fillStyle = '#e0e7ff';
      ctx.font = '19px Arial';
      ctx.fillText(`Proprietor: ${shopSettings.dealerName}`, canvas.width / 2, 150);
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Arial';
    ctx.fillText(`📞 ${shopSettings.mobileNumber || '+91 XXXXXXXXXX'}`, canvas.width / 2, 178);

    currentY = 220;

    ctx.fillStyle = '#334155';
    ctx.fillRect(30, currentY, canvas.width - 60, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QUOTATION', canvas.width / 2, currentY + 33);

    currentY += 65;

    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(30, currentY, canvas.width - 60, 90);
    
    ctx.fillStyle = '#1e293b';
    ctx.textAlign = 'left';
    ctx.font = '19px Arial';
    
    if (includeDate) {
      const today = new Date().toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
      ctx.fillText(`Date: ${today}`, 50, currentY + 30);
    }
    
    if (customerName) {
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`Customer: ${customerName}`, 50, currentY + 62);
    }
    
    if (deliveryLocation) {
      ctx.font = '18px Arial';
      ctx.fillText(`📍 ${deliveryLocation}`, 500, currentY + 62);
    }

    currentY += 110;

    const tableStart = 30;
    const tableWidth = canvas.width - 60;
    
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(tableStart, currentY, tableWidth, 50);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Size', tableStart + 25, currentY + 32);
    ctx.fillText('Quantity', tableStart + 145, currentY + 32);
    ctx.fillText('Weight (kg)', tableStart + 285, currentY + 32);
    ctx.fillText('Rate (₹/kg)', tableStart + 445, currentY + 32);
    ctx.fillText('Amount (₹)', tableStart + 625, currentY + 32);

    currentY += 55;

    ctx.font = '18px Arial';
    
    items.forEach((item, index) => {
      if (item.quantity) {
        const weight = (parseFloat(item.quantity) * customWeights[item.size]).toFixed(2);
        const rate = calculateRate(item.size).toFixed(2);
        const amount = calculateItemAmount(item).toFixed(2);

        if (index % 2 === 0) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = '#f8fafc';
        }
        ctx.fillRect(tableStart, currentY - 28, tableWidth, 45);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(item.size, tableStart + 25, currentY);
        ctx.font = '18px Arial';
        ctx.fillText(item.quantity.toString(), tableStart + 145, currentY);
        ctx.fillText(weight, tableStart + 285, currentY);
        ctx.fillText(`₹${rate}`, tableStart + 445, currentY);
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`₹${parseFloat(amount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, tableStart + 625, currentY);
        
        currentY += 45;
      }
    });

    currentY += 20;

    if (charges.transport.enabled || charges.hamali.enabled || otherItems.length > 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 20px Arial';
      ctx.fillText('Additional Charges', tableStart + 25, currentY);
      currentY += 40;

      ctx.font = '18px Arial';
      ctx.fillStyle = '#334155';

      if (charges.transport.enabled && charges.transport.amount) {
        ctx.fillText('Transport Charge', tableStart + 45, currentY);
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`+ ₹${parseFloat(charges.transport.amount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, tableStart + 625, currentY);
        ctx.font = '18px Arial';
        currentY += 40;
      }

      if (charges.hamali.enabled && charges.hamali.amount) {
        ctx.fillText('Hamali Charge', tableStart + 45, currentY);
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`+ ₹${parseFloat(charges.hamali.amount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, tableStart + 625, currentY);
        ctx.font = '18px Arial';
        currentY += 40;
      }

      otherItems.forEach(item => {
        if (item.amount) {
          ctx.fillText(item.name || 'Other', tableStart + 45, currentY);
          ctx.font = 'bold 18px Arial';
          ctx.fillText(`+ ₹${parseFloat(item.amount).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, tableStart + 625, currentY);
          ctx.font = '18px Arial';
          currentY += 40;
        }
      });

      currentY += 15;
    }

    if (discount.enabled && discount.amount) {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(tableStart, currentY, tableWidth, 45);
      
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 19px Arial';
      ctx.fillText('Subtotal', tableStart + 25, currentY + 28);
      ctx.fillText(`₹${calculateSubtotal().toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, tableStart + 625, currentY + 28);
      
      currentY += 50;

      const discountAmount = calculateDiscount();
      ctx.fillStyle = '#fee2e2';
      ctx.fillRect(tableStart, currentY, tableWidth, 45);
      
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 19px Arial';
      const discountText = discount.type === 'percent' 
        ? `Discount (${discount.amount}%)` 
        : 'Discount';
      ctx.fillText(discountText, tableStart + 25, currentY + 28);
      ctx.fillText(`- ₹${discountAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, tableStart + 625, currentY + 28);
      
      currentY += 55;
    }

    const totalGradient = ctx.createLinearGradient(0, currentY, canvas.width, currentY);
    totalGradient.addColorStop(0, '#1e3a8a');
    totalGradient.addColorStop(1, '#3b82f6');
    ctx.fillStyle = totalGradient;
    ctx.fillRect(tableStart, currentY, tableWidth, 65);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('GRAND TOTAL', tableStart + 25, currentY + 43);
    ctx.font = 'bold 34px Arial';
    ctx.fillText(`₹${calculateTotal().toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, tableStart + 625, currentY + 43);

    currentY += 85;

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 21px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ Rate valid for today only', canvas.width / 2, currentY);
    
    currentY += 40;
    
    ctx.fillStyle = '#64748b';
    ctx.font = '17px Arial';
    ctx.fillText('Thank you for your business!', canvas.width / 2, currentY);
  };

  const downloadImage = () => {
    generateQuotationImage();
    setTimeout(() => {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `quotation-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      saveQuotation();
    }, 100);
  };

  const shareOnWhatsApp = () => {
    generateQuotationImage();
    setTimeout(() => {
      const canvas = canvasRef.current;
      canvas.toBlob((blob) => {
        const file = new File([blob], 'quotation.png', { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          navigator.share({
            files: [file],
            title: 'Steel Quotation',
            text: 'Steel Bar Quotation'
          }).catch(err => {
            console.log('Share failed:', err);
            downloadImage();
          });
        } else {
          downloadImage();
          alert('Image downloaded! Please share from your gallery to WhatsApp.');
        }
      });
      saveQuotation();
    }, 100);
  };

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900';
  const buttonBg = darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200';

  if (shopSettings.showSettings && (!shopSettings.shopName || !shopSettings.mobileNumber || !baseRate)) {
    return (
      <div className={`min-h-screen ${bgColor} p-4`}>
        <div className={`max-w-2xl mx-auto ${cardBg} rounded-xl shadow-2xl p-8 mt-10`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Settings className="w-7 h-7 text-blue-600" />
              <h2 className={`text-3xl font-bold ${textColor}`}>Initial Setup</h2>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${buttonBg} transition`}
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Shop Name *
              </label>
              <input
                type="text"
                value={shopSettings.shopName}
                onChange={(e) => setShopSettings({...shopSettings, shopName: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} transition`}
                placeholder="Enter shop name"
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Dealer/Proprietor Name *
              </label>
              <input
                type="text"
                value={shopSettings.dealerName}
                onChange={(e) => setShopSettings({...shopSettings, dealerName: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} transition`}
                placeholder="Enter dealer name"
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Brand Authentication *
              </label>
              <select
                value={shopSettings.brandValue}
                onChange={(e) => setShopSettings({...shopSettings, brandValue: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} transition`}
              >
                <option value="">Select Brand</option>
                {BRANDS.map(brand => (
                  <option key={brand.value} value={brand.value}>
                    {brand.label} ({brand.auth})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Mobile Number *
              </label>
              <input
                type="tel"
                value={shopSettings.mobileNumber}
                onChange={(e) => setShopSettings({...shopSettings, mobileNumber: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} transition`}
                placeholder="+91 XXXXXXXXXX"
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold ${textColor} mb-2`}>
                Today's Base Rate (12mm) ₹/kg *
              </label>
              <input
                type="number"
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${inputBg} transition`}
                placeholder="e.g., 57.12"
                step="0.01"
              />
            </div>

            <button
              onClick={() => {
                if (shopSettings.shopName && shopSettings.mobileNumber && shopSettings.dealerName && shopSettings.brandValue && baseRate) {
                  setShopSettings({...shopSettings, showSettings: false});
                } else {
                  alert('Please fill all required fields');
                }
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg"
            >
              Continue to App →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} p-4 pb-24`}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className={`${cardBg} rounded-xl shadow-lg p-5 mb-4`}>
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h1 className={`text-3xl font-bold ${textColor}`}>Steel Quotation Pro</h1>
              <p className={`text-sm ${textSecondary} mt-1`}>
                Base Rate (12mm): ₹{parseFloat(baseRate).toFixed(2)}/kg
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${buttonBg} transition`}
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">History ({savedQuotations.length})</span>
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${buttonBg} transition`}
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <button
                onClick={() => setShopSettings({...shopSettings, showSettings: true})}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${buttonBg} transition`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* History Sidebar */}
        {showHistory && (
          <div className={`${cardBg} rounded-xl shadow-lg p-5 mb-4 max-h-96 overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-bold text-lg ${textColor}`}>Saved Quotations</h3>
              <button
                onClick={() => setShowHistory(false)}
                className={`px-3 py-1 rounded-lg ${buttonBg}`}
              >
                Close
              </button>
            </div>
            {savedQuotations.length === 0 ? (
              <p className={`${textSecondary} text-center py-8`}>No saved quotations yet</p>
            ) : (
              <div className="space-y-3">
                {savedQuotations.map((quote) => (
                  <div key={quote.id} className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`font-semibold ${textColor}`}>{quote.customerName}</p>
                        <p className={`text-sm ${textSecondary}`}>
                          {new Date(quote.date).toLocaleDateString('en-IN')} • ₹{quote.total.toFixed(2)}
                        </p>
                        <p className={`text-xs ${textSecondary} mt-1`}>
                          {quote.items.length} items
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadQuotation(quote)}
                          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteQuotation(quote.id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Weight Settings Modal */}
        {editingWeights && (
          <div className={`${cardBg} rounded-xl shadow-lg p-6 mb-4`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-bold text-lg ${textColor}`}>Customize Weights per Nag</h3>
              <button
                onClick={() => {
                  setEditingWeights(false);
                  setTempWeights(customWeights);
                }}
                className={`px-3 py-1 rounded-lg ${buttonBg}`}
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SIZES.map(size => (
                <div key={size}>
                  <label className={`block text-sm font-medium ${textColor} mb-1`}>
                    {size}
                  </label>
                  <input
                    type="number"
                    value={tempWeights[size]}
                    onChange={(e) => setTempWeights({...tempWeights, [size]: parseFloat(e.target.value) || 0})}
                    className={`w-full px-3 py-2 border rounded-lg ${inputBg}`}
                    step="0.1"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={saveWeights}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Save Weights
              </button>
              <button
                onClick={resetWeights}
                className="px-4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
              >
                Reset to Default
              </button>
            </div>
          </div>
        )}

        {/* Customer Info */}
        <div className={`${cardBg} rounded-xl shadow-lg p-5 mb-4`}>
          <h3 className={`font-bold ${textColor} mb-4`}>Customer Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name (Optional)"
              className={`px-4 py-3 border rounded-lg ${inputBg} transition focus:ring-2 focus:ring-blue-500`}
            />
            <input
              type="text"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="Delivery Location (Optional)"
              className={`px-4 py-3 border rounded-lg ${inputBg} transition focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeDate}
                onChange={(e) => setIncludeDate(e.target.checked)}
                className="w-4 h-4"
              />
              <span className={`text-sm ${textColor}`}>Include Date</span>
            </label>
            <button
              onClick={() => setEditingWeights(true)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg ${buttonBg} text-sm transition`}
            >
              <Edit2 className="w-3 h-3" />
              Customize Weights
            </button>
          </div>
        </div>

        {/* Material Items */}
        <div className={`${cardBg} rounded-xl shadow-lg p-5 mb-4`}>
          <h3 className={`font-bold ${textColor} mb-4`}>Material Items</h3>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className={`p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                <div className="grid grid-cols-12 gap-3 items-center">
                  <select
                    value={item.size}
                    onChange={(e) => updateMaterialItem(index, 'size', e.target.value)}
                    className={`col-span-3 px-3 py-2 border rounded-lg ${inputBg} transition`}
                  >
                    {SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  
                  <div className="col-span-7 flex items-center gap-2">
                    <button
                      onClick={() => decrementQuantity(index)}
                      className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-bold"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index, e.target.value)}
                      placeholder="0"
                      className={`flex-1 px-4 py-2 border rounded-lg text-center font-bold text-lg ${inputBg} transition`}
                      min="0"
                    />
                    <button
                      onClick={() => incrementQuantity(index)}
                      className="w-10 h-10 flex items-center justify-center bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition font-bold"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeMaterialItem(index)}
                    disabled={items.length === 1}
                    className={`col-span-2 h-10 ${items.length === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white rounded-lg flex items-center justify-center transition`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {item.quantity > 0 && (
                  <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                    <div className="flex justify-between text-sm">
                      <span className={textSecondary}>Weight: {(item.quantity * customWeights[item.size]).toFixed(2)} kg</span>
                      <span className={textSecondary}>Rate: ₹{calculateRate(item.size).toFixed(2)}/kg</span>
                      <span className={`font-bold ${textColor}`}>₹{calculateItemAmount(item).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addMaterialItem}
            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full justify-center mt-3 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Size
          </button>
        </div>

        {/* Charges */}
        <div className={`${cardBg} rounded-xl shadow-lg p-5 mb-4`}>
          <h3 className={`font-bold ${textColor} mb-4`}>Additional Charges</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={charges.transport.enabled}
                onChange={(e) => setCharges({...charges, transport: {...charges.transport, enabled: e.target.checked}})}
                className="w-5 h-5"
              />
              <span className={`text-sm ${textColor} w-32 font-medium`}>Transport</span>
              {charges.transport.enabled && (
                <input
                  type="number"
                  value={charges.transport.amount}
                  onChange={(e) => setCharges({...charges, transport: {...charges.transport, amount: e.target.value}})}
                  placeholder="Amount"
                  className={`flex-1 px-4 py-2 border rounded-lg ${inputBg} transition`}
                  step="0.01"
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={charges.hamali.enabled}
                onChange={(e) => setCharges({...charges, hamali: {...charges.hamali, enabled: e.target.checked}})}
                className="w-5 h-5"
              />
              <span className={`text-sm ${textColor} w-32 font-medium`}>Hamali</span>
              {charges.hamali.enabled && (
                <input
                  type="number"
                  value={charges.hamali.amount}
                  onChange={(e) => setCharges({...charges, hamali: {...charges.hamali, amount: e.target.value}})}
                  placeholder="Amount"
                  className={`flex-1 px-4 py-2 border rounded-lg ${inputBg} transition`}
                  step="0.01"
                />
              )}
            </div>
          </div>
        </div>

        {/* Discount */}
        <div className={`${cardBg} rounded-xl shadow-lg p-5 mb-4`}>
          <h3 className={`font-bold ${textColor} mb-4`}>Discount</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={discount.enabled}
                onChange={(e) => setDiscount({...discount, enabled: e.target.checked})}
                className="w-5 h-5"
              />
              <span className={`text-sm ${textColor} font-medium`}>Apply Discount</span>
            </div>

            {discount.enabled && (
              <div className="grid grid-cols-12 gap-3">
                <select
                  value={discount.type}
                  onChange={(e) => setDiscount({...discount, type: e.target.value})}
                  className={`col-span-4 px-4 py-2 border rounded-lg ${inputBg} transition`}
                >
                  <option value="flat">Flat (₹)</option>
                  <option value="percent">Percent (%)</option>
                </select>
                <input
                  type="number"
                  value={discount.amount}
                  onChange={(e) => setDiscount({...discount, amount: e.target.value})}
                  placeholder={discount.type === 'percent' ? 'Percentage' : 'Amount'}
                  className={`col-span-8 px-4 py-2 border rounded-lg ${inputBg} transition`}
                  step="0.01"
                />
              </div>
            )}
          </div>
        </div>

        {/* Other Items */}
        <div className={`${cardBg} rounded-xl shadow-lg p-5 mb-4`}>
          <h3 className={`font-bold ${textColor} mb-4`}>Other Items</h3>
          {otherItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-3 mb-3">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateOtherItem(index, 'name', e.target.value)}
                placeholder="Item Name"
                className={`col-span-6 px-4 py-2 border rounded-lg ${inputBg} transition`}
              />
              <input
                type="number"
                value={item.amount}
                onChange={(e) => updateOtherItem(index, 'amount', e.target.value)}
                placeholder="Amount"
                className={`col-span-4 px-4 py-2 border rounded-lg ${inputBg} transition`}
                step="0.01"
              />
              <button
                onClick={() => removeOtherItem(index)}
                className="col-span-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addOtherItem}
            className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full justify-center transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Other Item
          </button>
        </div>

        {/* Details Summary */}
        <div className={`${cardBg} rounded-xl shadow-lg p-5 mb-4`}>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex justify-between items-center w-full"
          >
            <h3 className={`font-bold ${textColor} flex items-center gap-2`}>
              {showDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              View Calculation Details
            </h3>
            {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {showDetails && (
            <div className="mt-4 space-y-2">
              {items.filter(i => i.quantity > 0).map((item, idx) => (
                <div key={idx} className={`flex justify-between text-sm py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={textSecondary}>
                    {item.size} × {item.quantity} nag ({(item.quantity * customWeights[item.size]).toFixed(2)} kg @ ₹{calculateRate(item.size).toFixed(2)}/kg)
                  </span>
                  <span className={textColor}>₹{calculateItemAmount(item).toFixed(2)}</span>
                </div>
              ))}

              {charges.transport.enabled && charges.transport.amount && (
                <div className={`flex justify-between text-sm py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={textSecondary}>Transport Charge</span>
                  <span className={textColor}>₹{parseFloat(charges.transport.amount).toFixed(2)}</span>
                </div>
              )}

              {charges.hamali.enabled && charges.hamali.amount && (
                <div className={`flex justify-between text-sm py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={textSecondary}>Hamali Charge</span>
                  <span className={textColor}>₹{parseFloat(charges.hamali.amount).toFixed(2)}</span>
                </div>
              )}

              {otherItems.filter(i => i.amount).map((item, idx) => (
                <div key={idx} className={`flex justify-between text-sm py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className={textSecondary}>{item.name || 'Other'}</span>
                  <span className={textColor}>₹{parseFloat(item.amount).toFixed(2)}</span>
                </div>
              ))}

              {discount.enabled && discount.amount && (
                <>
                  <div className={`flex justify-between text-sm py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} font-semibold`}>
                    <span className={textColor}>Subtotal</span>
                    <span className={textColor}>₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className={`flex justify-between text-sm py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-red-600`}>
                    <span>Discount {discount.type === 'percent' ? `(${discount.amount}%)` : ''}</span>
                    <span>- ₹{calculateDiscount().toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Total Display */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl shadow-2xl p-6 mb-4">
          <div className="space-y-3">
            {discount.enabled && discount.amount && (
              <>
                <div className="flex justify-between items-center text-sm opacity-90">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm opacity-90">
                  <span>Discount {discount.type === 'percent' ? `(${discount.amount}%)` : ''}</span>
                  <span className="font-semibold">- ₹{calculateDiscount().toFixed(2)}</span>
                </div>
                <hr className="border-white/30" />
              </>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">GRAND TOTAL</span>
              <span className="text-4xl font-bold">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={downloadImage}
            className="flex items-center justify-center gap-3 bg-white text-blue-600 py-4 rounded-xl shadow-lg font-bold text-lg hover:bg-gray-50 transition transform hover:scale-105"
          >
            <Download className="w-6 h-6" />
            Download
          </button>
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center justify-center gap-3 bg-green-600 text-white py-4 rounded-xl shadow-lg font-bold text-lg hover:bg-green-700 transition transform hover:scale-105"
          >
            <Share2 className="w-6 h-6" />
            WhatsApp
          </button>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
