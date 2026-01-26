import React, { useState } from "react";

export default function App() {
  const [msg, setMsg] = useState("");

  const test = async () => {
    setMsg("1) Button clicked ✅");

    // Permission request
    const perm = await Notification.requestPermission();
    setMsg("2) Permission: " + perm);

    if (perm !== "granted") return;

    // Notification test
    new Notification("Test Notification 🔔", {
      body: "Agar ye aa gaya to notification system OK hai 😄",
    });

    setMsg("3) Notification triggered ✅");

    // Popup test
    alert("Popup working ✅");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Notification Test</h2>
      <button
        onClick={test}
        style={{
          padding: 12,
          width: "100%",
          borderRadius: 10,
          border: "none",
          background: "black",
          color: "white",
          fontSize: 16,
        }}
      >
        TEST NOW
      </button>

      <p style={{ marginTop: 15 }}>{msg}</p>
    </div>
  );
}
