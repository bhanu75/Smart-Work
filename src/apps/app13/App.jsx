import React, { useState } from "react";

export default function App() { const [shopName, setShopName] = useState("किसान कृषि बाजार"); const [address, setAddress] = useState("पंचायत रोड, अरनिया जोशी, चित्तौड़गढ़, राजस्थान"); const [mobile, setMobile] = useState("9928494904"); const [billNo, setBillNo] = useState("642"); const [date, setDate] = useState(""); const [customer, setCustomer] = useState("");

return ( <div className="min-h-screen flex justify-center items-center bg-gray-300"> <div className="relative border-2 border-black" style={{ width: "12cm", height: "20cm", backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')", backgroundColor: "#f7a6c8", boxShadow: "0 0 6px rgba(0,0,0,0.4)", fontFamily: "'Noto Serif Devanagari', serif", color: "#1a1a1a", padding: "12px", }} > <div className="text-center"> <h1 className="text-2xl font-bold">{shopName}</h1> <p className="text-sm">पता : {address}</p> <p className="text-sm">मोबाइल : {mobile}</p> </div>

<div className="flex justify-between mt-3 text-sm">
      <div>
        क्रमांक :
        <input
          value={billNo}
          onChange={(e) => setBillNo(e.target.value)}
          className="bg-transparent border-b border-black w-20 ml-1"
        />
      </div>
      <div>
        दिनांक :
        <input
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-transparent border-b border-black w-24 ml-1"
        />
      </div>
    </div>

    <div className="mt-3 text-sm">
      श्रीमान् :
      <input
        value={customer}
        onChange={(e) => setCustomer(e.target.value)}
        className="bg-transparent border-b border-black w-full ml-1"
      />
    </div>

    <table className="w-full border border-black mt-3 text-sm">
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
          <tr key={i} className="border-b border-black" style={{ height: "18px" }}>
            <td className="border-r border-black"></td>
            <td className="border-r border-black"></td>
            <td className="border-r border-black"></td>
            <td className="border-r border-black"></td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="mt-3 text-right text-sm">कुल राशि : ____________________</div>

    <div className="flex justify-between mt-8 text-sm">
      <div>ग्राहक के हस्ताक्षर :</div>
      <div>विक्रेता के हस्ताक्षर :</div>
    </div>

    <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/noise.png')", opacity: 0.15 }} />
  </div>
</div>

); }
