import { useState } from "react";

export default function App() {
  const [numbers, setNumbers] = useState("");
  const [message, setMessage] = useState("");
  const [current, setCurrent] = useState(0);

  const start = () => {
    const list = numbers
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length >= 10);

    if (!list.length || !message) {
      alert("Numbers aur message dono daalo");
      return;
    }

    openWhatsApp(list, 0);
  };

  const openWhatsApp = (list, index) => {
  if (index >= list.length) return;

  setCurrent(index + 1);

  setTimeout(() => {
    const mobile = list[index].startsWith("91") ? list[index] : `91${list[index]}`;
    const url = `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;
    
    // Open in new tab instead of same page
    window.open(url, "_blank");

    // Next number
    openWhatsApp(list, index + 1);
  }, 3000);
};
  
  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h3>📲 WhatsApp Multi Send Test</h3>

      {/* NUMBERS TEXTAREA */}
      <textarea
        placeholder={`Enter numbers (one per line or comma separated)
9876543210
9998887776`}
        value={numbers}
        onChange={(e) => setNumbers(e.target.value)}
        rows={5}
        inputMode="text"
        style={{ width: "100%", marginBottom: 10 }}
      ></textarea>

      {/* MESSAGE TEXTAREA */}
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        inputMode="text"
        style={{ width: "100%", marginBottom: 10 }}
      ></textarea>

      <button onClick={start} style={{ padding: 10 }}>
        Start (3 sec delay)
      </button>

      {current > 0 && <p>Opening WhatsApp for #{current}</p>}
    </div>
  );
}
