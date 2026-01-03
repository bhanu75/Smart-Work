import { useState } from "react";

export default function App() {
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = () => {
    if (!mobile || !message) {
      alert("Mobile number aur message dono bharo");
      return;
    }

    setStatus("⏳ WhatsApp 10 second me open hoga...");

    setTimeout(() => {
      const formattedMobile = mobile.startsWith("91")
        ? mobile
        : `91${mobile}`;

      const url = `https://wa.me/${formattedMobile}?text=${encodeURIComponent(
        message
      )}`;

      window.location.href = url;
    }, 10000);
  };

  return (
    <div style={styles.container}>
      <h2>📲 WhatsApp Reminder Test</h2>

      <input
        type="tel"
        placeholder="Mobile number (without +91)"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
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
