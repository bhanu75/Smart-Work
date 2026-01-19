import React, { useState } from "react";

export default function App() { const [shopName, setShopName] = useState("मेगा पेंट्स"); const [address, setAddress] = useState("प्रतापगढ़ रोड, छोटी सादरी, चित्तौड़गढ़, राजस्थान"); const [mobile, setMobile] = useState("7023621717"); const [billNo, setBillNo] = useState("492"); const [date, setDate] = useState(""); const [customer, setCustomer] = useState("");

return ( <div className="min-h-screen flex justify-center items-center bg-gray-200 p-4"> <div className="w-[480px] h-[800px] bg-pink-300 border-2 border-black p-4 text-black"> <div className="text-center"> <h1 className="text-2xl font-bold">{shopName}</h1> <p className="text-sm">पता : {address}</p> <p className="text-sm">मोबाइल : {mobile}</p> </div>

<div className="flex justify-between mt-4 text-sm">
      <div>क्रमांक : <input value={billNo} onChange={e => setBillNo(e.target.value)} className="border-b border-black bg-transparent w-20" /></div>
      <div>दिनांक : <input value={date} onChange={e => setDate(e.target.value)} className="border-b border-black bg-transparent w-24" /></div>
    </div>

    <div className="mt-3 text-sm">
      श्रीमान् : <input value={customer} onChange={e => setCustomer(e.target.value)} className="border-b border-black bg-transparent w-full" />
    </div>

    <table className="w-full border border-black mt-4 text-sm">
      <thead>
        <tr className="border-b border-black">
          <th className="border-r border-black">क्र.सं.</th>
          <th className="border-r border-black">विवरण</th>
          <th className="border-r border-black">तादाद</th>
          <th className="border-r border-black">दर</th>
          <th>रुपया</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 15 }).map((_, i) => (
          <tr key={i} className="border-b border-black h-6">
            <td className="border-r border-black"></td>
            <td className="border-r border-black"></td>
            <td className="border-r border-black"></td>
            <td className="border-r border-black"></td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="mt-4 text-right text-sm">
      कुल राशि : ____________________
    </div>

    <div className="flex justify-between mt-10 text-sm">
      <div>ग्राहक के हस्ताक्षर :</div>
      <div>विक्रेता के हस्ताक्षर :</div>
    </div>

    <div className="mt-6 text-xs text-center text-gray-700">
      (यह लेआउट 12×20 से.मी. पारंपरिक बिल बुक के अनुसार है)
    </div>
  </div>
</div>

); }
