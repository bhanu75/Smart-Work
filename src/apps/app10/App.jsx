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
      const mobile = list[index].startsWith("91")
        ? list[index]
        : `91${list[index]}`;

      const url = `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;

      window.location.href = url;
    }, 3000); // ✅ 3 seconds
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h3>📲 WhatsApp Multi Send Test</h3>

      <textarea
        placeholder={`Enter numbers (one per line or comma separated)
9876543210
9998887776`}
        value={numbers}
        onChange={e => setNumbers(e.target.value)}
        rows={5}
        inputMode="text"
        style={{ width: "100%", marginBottom: 10 }}
      />

      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={4}
        inputMode="text"
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={start} style={{ padding: 10 }}>
        Start (3 sec delay)
      </button>

      {current > 0 && <p>Opening WhatsApp for #{current}</p>}
    </div>
  );
}
      <textarea
        placeholder={`Enter numbers (one per line or comma separated)
9876543210
9998887776`}
        value={numbers}
        onChange={e => setNumbers(e.target.value)}
        rows={5}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={startSending}>
        Start WhatsApp Flow
      </button>
    </div>
  );
}  return (
    <div style={{ padding: 20 }}>
      <h3>📲 Bulk WhatsApp Test</h3>

      <textarea
        placeholder="98765...,99988...,91234..."
        value={numbers}
        onChange={e => setNumbers(e.target.value)}
        rows={3}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        rows={4}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={startSending}>
        Start WhatsApp Flow
      </button>

      {index > 0 && <p>Sent till: {index}</p>}
    </div>
  );
}        onChange={(e) => setMobile(e.target.value)}
        style={styles.input}
      />

      <textarea
        placeholder="Reminder message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        style={styles.textarea}
      />

      <button onClick={handleSend} style={styles.button}>
        Send after 10 seconds
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "40px auto",
    padding: 20,
    fontFamily: "Arial",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  textarea: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    backgroundColor: "#25D366",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
