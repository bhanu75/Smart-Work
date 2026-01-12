import React, { useState, useRef, useEffect } from 'react';
import { Download, Share2, Plus, X, Settings } from 'lucide-react';

const WEIGHT_PER_NAG = {
  '8mm': 4.5,
  '10mm': 7,
  '12mm': 10.5,
  '16mm': 21,
  '20mm': 33,
  '25mm': 52
};

const SIZES = ['8mm', '10mm', '12mm', '16mm', '20mm', '25mm'];

export default function SteelQuotationApp() {
  // Shop Settings (One-time setup)
  const [shopSettings, setShopSettings] = useState(() => {
    const saved = localStorage.getItem('shopSettings');
    return saved ? JSON.parse(saved) : {
      shopName: '',
      mobileNumber: '',
      showSettings: true
    };
  });

  // Daily Base Rate
  const [baseRate, setBaseRate] = useState(() => {
    const saved = localStorage.getItem('dailyRate');
    const savedDate = localStorage.getItem('rateDate');
    const today = new Date().toDateString();
    
    if (savedDate === today && saved) {
      return parseFloat(saved);
    }
    return '';
  });

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [includeDate, setIncludeDate] = useState(true);
  
  // Material Items
  const [items, setItems] = useState([
    { size: '12mm', quantity: '' }
  ]);

  // Charges
  const [charges, setCharges] = useState({
    transport: { enabled: false, amount: '' },
    hamali: { enabled: false, amount: '' }
  });

  // Other Items
  const [otherItems, setOtherItems] = useState([]);

  const canvasRef = useRef(null);

  // Save shop settings
  useEffect(() => {
    if (shopSettings.shopName && shopSettings.mobileNumber) {
      localStorage.setItem('shopSettings', JSON.stringify(shopSettings));
    }
  }, [shopSettings]);

  // Save daily rate
  useEffect(() => {
    if (baseRate) {
      localStorage.setItem('dailyRate', baseRate.toString());
      localStorage.setItem('rateDate', new Date().toDateString());
    }
  }, [baseRate]);

  const calculateRate = (size) => {
    if (!baseRate) return 0;
    const sizeNum = parseInt(size);
    const difference = (12 - sizeNum) / 2;
    return parseFloat(baseRate) + (difference * 2);
  };

  const calculateItemAmount = (item) => {
    const weight = parseFloat(item.quantity) * WEIGHT_PER_NAG[item.size];
    const rate = calculateRate(item.size);
    return weight * rate;
  };

  const calculateTotal = () => {
    let total = 0;
    
    // Material items
    items.forEach(item => {
      if (item.quantity) {
        total += calculateItemAmount(item);
      }
    });

    // Charges
    if (charges.transport.enabled && charges.transport.amount) {
      total += parseFloat(charges.transport.amount);
    }
    if (charges.hamali.enabled && charges.hamali.amount) {
      total += parseFloat(charges.hamali.amount);
    }

    // Other items
    otherItems.forEach(item => {
      if (item.amount) {
        total += parseFloat(item.amount);
      }
    });

    return total;
  };

  const addMaterialItem = () => {
    setItems([...items, { size: '12mm', quantity: '' }]);
  };

  const removeMaterialItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
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

  const generateQuotationImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    let currentY = 40;
    
    // Calculate approximate height needed
    const rowCount = items.filter(i => i.quantity).length;
    const chargeCount = (charges.transport.enabled ? 1 : 0) + (charges.hamali.enabled ? 1 : 0);
    const otherCount = otherItems.filter(i => i.amount).length;
    const estimatedHeight = 300 + (rowCount * 40) + (chargeCount * 30) + (otherCount * 30) + 200;
    canvas.height = estimatedHeight;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header Background
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(0, 0, canvas.width, 120);

    // Shop Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(shopSettings.shopName || 'Steel Trading Co.', canvas.width / 2, 45);

    // Mobile Number
    ctx.font = '20px Arial';
    ctx.fillText(`📞 ${shopSettings.mobileNumber || '+91 XXXXXXXXXX'}`, canvas.width / 2, 75);

    // Date
    if (includeDate) {
      const today = new Date().toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
      ctx.font = '18px Arial';
      ctx.fillText(`Date: ${today}`, canvas.width / 2, 100);
    }

    currentY = 150;

    // Customer Info
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.font = 'bold 20px Arial';
    
    if (customerName) {
      ctx.fillText(`Customer: ${customerName}`, 30, currentY);
      currentY += 30;
    }
    
    if (deliveryLocation) {
      ctx.fillText(`Delivery: ${deliveryLocation}`, 30, currentY);
      currentY += 30;
    }

    currentY += 20;

    // Table Header
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(20, currentY, canvas.width - 40, 40);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Size', 30, currentY + 25);
    ctx.fillText('Nag', 130, currentY + 25);
    ctx.fillText('Weight(kg)', 230, currentY + 25);
    ctx.fillText('Rate(₹/kg)', 370, currentY + 25);
    ctx.fillText('Amount(₹)', 530, currentY + 25);

    currentY += 50;

    // Material Items
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    
    items.forEach((item, index) => {
      if (item.quantity) {
        const weight = (parseFloat(item.quantity) * WEIGHT_PER_NAG[item.size]).toFixed(2);
        const rate = calculateRate(item.size).toFixed(2);
        const amount = calculateItemAmount(item).toFixed(2);

        // Alternate row background
        if (index % 2 === 0) {
          ctx.fillStyle = '#f3f4f6';
          ctx.fillRect(20, currentY - 20, canvas.width - 40, 35);
        }

        ctx.fillStyle = '#000000';
        ctx.fillText(item.size, 30, currentY);
        ctx.fillText(item.quantity, 130, currentY);
        ctx.fillText(weight, 230, currentY);
        ctx.fillText(`₹${rate}`, 370, currentY);
        ctx.fillText(`₹${amount}`, 530, currentY);
        
        currentY += 35;
      }
    });

    currentY += 20;

    // Charges Section
    if (charges.transport.enabled || charges.hamali.enabled || otherItems.length > 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Additional Charges:', 30, currentY);
      currentY += 30;

      ctx.font = '16px Arial';
      ctx.fillStyle = '#000000';

      if (charges.transport.enabled && charges.transport.amount) {
        ctx.fillText('Transport Charge', 50, currentY);
        ctx.fillText(`₹${parseFloat(charges.transport.amount).toFixed(2)}`, 530, currentY);
        currentY += 30;
      }

      if (charges.hamali.enabled && charges.hamali.amount) {
        ctx.fillText('Hamali Charge', 50, currentY);
        ctx.fillText(`₹${parseFloat(charges.hamali.amount).toFixed(2)}`, 530, currentY);
        currentY += 30;
      }

      otherItems.forEach(item => {
        if (item.amount) {
          ctx.fillText(item.name || 'Other', 50, currentY);
          ctx.fillText(`₹${parseFloat(item.amount).toFixed(2)}`, 530, currentY);
          currentY += 30;
        }
      });

      currentY += 10;
    }

    // Total
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(20, currentY, canvas.width - 40, 50);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('GRAND TOTAL', 30, currentY + 33);
    ctx.fillText(`₹${calculateTotal().toFixed(2)}`, 530, currentY + 33);

    currentY += 70;

    // Footer
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ Rate valid for today only', canvas.width / 2, currentY);
  };

  const downloadImage = () => {
    generateQuotationImage();
    setTimeout(() => {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `quotation-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
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
    }, 100);
  };

  // Settings Panel
  if (shopSettings.showSettings && (!shopSettings.shopName || !shopSettings.mobileNumber || !baseRate)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl p-6 mt-10">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Initial Setup</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name *
              </label>
              <input
                type="text"
                value={shopSettings.shopName}
                onChange={(e) => setShopSettings({...shopSettings, shopName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter shop name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                value={shopSettings.mobileNumber}
                onChange={(e) => setShopSettings({...shopSettings, mobileNumber: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Today's Base Rate (12mm) ₹/kg *
              </label>
              <input
                type="number"
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter rate for 12mm"
                step="0.01"
              />
            </div>

            <button
              onClick={() => {
                if (shopSettings.shopName && shopSettings.mobileNumber && baseRate) {
                  setShopSettings({...shopSettings, showSettings: false});
                } else {
                  alert('Please fill all required fields');
                }
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Continue to App
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Steel Quotation</h1>
            <button
              onClick={() => setShopSettings({...shopSettings, showSettings: true})}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Base Rate (12mm): ₹{baseRate}/kg
          </p>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">Customer Details (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer Name"
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={deliveryLocation}
              onChange={(e) => setDeliveryLocation(e.target.value)}
              placeholder="Delivery Location"
              className="px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <label className="flex items-center gap-2 mt-3">
            <input
              type="checkbox"
              checked={includeDate}
              onChange={(e) => setIncludeDate(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Include Date</span>
          </label>
        </div>

        {/* Material Items */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">Material Items</h3>
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-3">
              <select
                value={item.size}
                onChange={(e) => updateMaterialItem(index, 'size', e.target.value)}
                className="col-span-5 px-3 py-2 border border-gray-300 rounded-md"
              >
                {SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateMaterialItem(index, 'quantity', e.target.value)}
                placeholder="Nag"
                className="col-span-5 px-3 py-2 border border-gray-300 rounded-md"
              />
              {items.length > 1 && (
                <button
                  onClick={() => removeMaterialItem(index)}
                  className="col-span-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  <X className="w-4 h-4 mx-auto" />
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addMaterialItem}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            Add Size
          </button>
        </div>

        {/* Charges */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">Additional Charges</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={charges.transport.enabled}
                onChange={(e) => setCharges({...charges, transport: {...charges.transport, enabled: e.target.checked}})}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 w-32">Transport</span>
              {charges.transport.enabled && (
                <input
                  type="number"
                  value={charges.transport.amount}
                  onChange={(e) => setCharges({...charges, transport: {...charges.transport, amount: e.target.value}})}
                  placeholder="Amount"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={charges.hamali.enabled}
                onChange={(e) => setCharges({...charges, hamali: {...charges.hamali, enabled: e.target.checked}})}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700 w-32">Hamali</span>
              {charges.hamali.enabled && (
                <input
                  type="number"
                  value={charges.hamali.amount}
                  onChange={(e) => setCharges({...charges, hamali: {...charges.hamali, amount: e.target.value}})}
                  placeholder="Amount"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
          </div>
        </div>

        {/* Other Items */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">Other Items</h3>
          {otherItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-3">
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateOtherItem(index, 'name', e.target.value)}
                placeholder="Item Name"
                className="col-span-6 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                value={item.amount}
                onChange={(e) => updateOtherItem(index, 'amount', e.target.value)}
                placeholder="Amount"
                className="col-span-4 px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                onClick={() => removeOtherItem(index)}
                className="col-span-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
              >
                <X className="w-4 h-4 mx-auto" />
              </button>
            </div>
          ))}
          <button
            onClick={addOtherItem}
            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            Add Other Item
          </button>
        </div>

        {/* Total Display */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Grand Total</span>
            <span className="text-3xl font-bold">₹{calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={downloadImage}
            className="flex items-center justify-center gap-2 bg-white text-blue-600 py-3 rounded-md shadow-md font-semibold hover:bg-gray-50"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-md shadow-md font-semibold hover:bg-green-700"
          >
            <Share2 className="w-5 h-5" />
            Share WhatsApp
          </button>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
