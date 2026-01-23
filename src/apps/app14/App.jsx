import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "lift_win_products_v1";

// ✅ Product Database (tum isko aur extend kar sakte ho)
const DEFAULT_PRODUCTS = [
  // ---- PAINTS (Points per Ltr) ----
  { id: "walmasta_range", name: "Walmasta Range", unit: "Ltr", pointsPerUnit: 4, cashToken: {} },
  { id: "bison_emulsion", name: "Bison Emulsion Range", unit: "Ltr", pointsPerUnit: 4, cashToken: {} },

  { id: "wcoat_range", name: "W'Coat Range", unit: "Ltr", pointsPerUnit: 12, cashToken: { "20L": 200, "10L": 100 } },
  { id: "easy_clean", name: "Easy Clean Range", unit: "Ltr", pointsPerUnit: 12, cashToken: { "20L": 200, "10L": 100, "4L": 40, "1L": 10 } },

  { id: "wcoat_longlife", name: "W'Coat Longlife Range", unit: "Ltr", pointsPerUnit: 24, cashToken: { "20L": 100, "10L": 50 } },
  { id: "silk_range", name: "Silk Range", unit: "Ltr", pointsPerUnit: 24, cashToken: { "20L": 100, "10L": 50, "4L": 20, "1L": 5 } },

  // ---- PRIMERS (example from token summary) ----
  { id: "primer_996", name: "Walmasta Int/Ext Primer (996)", unit: "Ltr", pointsPerUnit: 4, cashToken: { "20L": 100, "10L": 50 } },
  { id: "bp_white_417", name: "BP White Primer WT - 417", unit: "Ltr", pointsPerUnit: 4, cashToken: { "20L": 50, "10L": 25 } },
  { id: "bp_white_lite", name: "BP White WT Primer Lite", unit: "Ltr", pointsPerUnit: 4, cashToken: { "20L": 20, "10L": 10 } },

  // ---- ENAMEL ----
  { id: "luxol_pu_enamel", name: "Luxol PU Enamel", unit: "Ltr", pointsPerUnit: 12, cashToken: { "4L": 10, "1L": 4 } },

  // ---- ACR PUTTY (Kg) ----
  { id: "happy_wall_putty", name: "Happy Wall Putty", unit: "Kg", pointsPerUnit: 2, cashToken: { "20Kg": 50, "10Kg": 25 } },

  // ---- HOME SHIELD ----
  { id: "roof_kool_n_seal", name: "Roof Kool N Seal", unit: "Ltr", pointsPerUnit: 12, cashToken: { "20L": 200, "10L": 100, "1L": 50 } },
];

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_PRODUCTS;
    return parsed;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export default function App() {
  const [products, setProducts] = useState(loadProducts);

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(products?.[0]?.id || "");
  const [qty, setQty] = useState(1);

  // DBT user editable
  const [dbt, setDbt] = useState(() => {
    try {
      const raw = localStorage.getItem("dbt_value_v1");
      return raw ? Number(raw) : 0;
    } catch {
      return 0;
    }
  });

  // pack selection for cash token
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedId),
    [products, selectedId]
  );

  const packOptions = useMemo(() => {
    if (!selectedProduct?.cashToken) return [];
    return Object.keys(selectedProduct.cashToken);
  }, [selectedProduct]);

  const [pack, setPack] = useState("");

  useEffect(() => {
    // default pack set
    if (packOptions.length > 0) setPack(packOptions[0]);
    else setPack("");
  }, [selectedId]);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    localStorage.setItem("dbt_value_v1", String(dbt || 0));
  }, [dbt]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [query, products]);

  const points = useMemo(() => {
    if (!selectedProduct) return 0;
    return (Number(selectedProduct.pointsPerUnit || 0) * Number(qty || 0));
  }, [selectedProduct, qty]);

  const cashTokenValue = useMemo(() => {
    if (!selectedProduct || !pack) return 0;
    const perPack = selectedProduct.cashToken?.[pack] || 0;
    return perPack; // token summary pack based fixed
  }, [selectedProduct, pack]);

  // ---- Import / Export ----
  const exportJSON = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lift_win_products_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        alert("Invalid JSON format. Must be an array.");
        return;
      }
      setProducts(parsed);
      alert("Import successful ✅");
    } catch {
      alert("Invalid JSON file ❌");
    }
  };

  // ---- Add Product (basic) ----
  const addNewProduct = () => {
    const name = prompt("Enter Product Name:");
    if (!name) return;

    const pointsPerUnit = Number(prompt("Points per Unit (Ltr/Kg):", "4"));
    const unit = prompt("Unit (Ltr/Kg):", "Ltr") || "Ltr";

    const newItem = {
      id: `${Date.now()}`,
      name,
      unit,
      pointsPerUnit: isNaN(pointsPerUnit) ? 0 : pointsPerUnit,
      cashToken: {},
    };

    setProducts((prev) => [newItem, ...prev]);
    setSelectedId(newItem.id);
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 6 }}>Lift & Win Calculator (2025-26)</h2>
      <p style={{ marginTop: 0, color: "#555" }}>
        Search product → Get <b>DBT</b>, <b>Points</b>, <b>Value Token</b>
      </p>

      {/* Search */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <input
          style={{ flex: 1, padding: 10, fontSize: 16 }}
          placeholder="Search product..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={addNewProduct} style={{ padding: "10px 14px", cursor: "pointer" }}>
          + Add Product
        </button>
      </div>

      {/* Product List */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Products</h3>
          <div style={{ maxHeight: 280, overflow: "auto" }}>
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                style={{
                  padding: 10,
                  borderRadius: 8,
                  cursor: "pointer",
                  marginBottom: 6,
                  background: p.id === selectedId ? "#e8f0ff" : "#fafafa",
                  border: "1px solid #eee",
                }}
              >
                <div style={{ fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 13, color: "#666" }}>
                  Unit: {p.unit} • {p.pointsPerUnit} points/{p.unit}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Result Panel */}
        <div style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Result</h3>

          {!selectedProduct ? (
            <p>No product selected</p>
          ) : (
            <>
              <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>
                {selectedProduct.name}
              </div>

              {/* Qty */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <label style={{ minWidth: 90 }}>Quantity:</label>
                <input
                  type="number"
                  min="0"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  style={{ padding: 8, width: 120 }}
                />
                <span>{selectedProduct.unit}</span>
              </div>

              {/* Pack */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <label style={{ minWidth: 90 }}>Pack:</label>
                {packOptions.length > 0 ? (
                  <select value={pack} onChange={(e) => setPack(e.target.value)} style={{ padding: 8 }}>
                    {packOptions.map((pk) => (
                      <option key={pk} value={pk}>
                        {pk}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span style={{ color: "#777" }}>No Cash Token defined</span>
                )}
              </div>

              {/* DBT */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                <label style={{ minWidth: 90 }}>DBT:</label>
                <input
                  type="number"
                  min="0"
                  value={dbt}
                  onChange={(e) => setDbt(e.target.value)}
                  style={{ padding: 8, width: 140 }}
                />
                <span style={{ color: "#777" }}>(User Editable)</span>
              </div>

              <hr />

              {/* Outputs */}
              <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                <div style={{ padding: 10, borderRadius: 10, background: "#f7f7f7" }}>
                  <b>Points:</b> {points}
                </div>

                <div style={{ padding: 10, borderRadius: 10, background: "#f7f7f7" }}>
                  <b>Value Token (Cash Token):</b> {cashTokenValue}
                </div>

                <div style={{ padding: 10, borderRadius: 10, background: "#f7f7f7" }}>
                  <b>DBT:</b> {dbt}
                </div>
              </div>

              <hr style={{ marginTop: 16 }} />

              {/* Import Export */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={exportJSON} style={{ padding: "10px 14px", cursor: "pointer" }}>
                  Export JSON
                </button>

                <label
                  style={{
                    padding: "10px 14px",
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Import JSON
                  <input type="file" accept=".json" onChange={importJSON} style={{ display: "none" }} />
                </label>

                <button
                  onClick={() => {
                    localStorage.removeItem(STORAGE_KEY);
                    setProducts(DEFAULT_PRODUCTS);
                    alert("Reset Done ✅");
                  }}
                  style={{ padding: "10px 14px", cursor: "pointer" }}
                >
                  Reset Default
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
                           }
