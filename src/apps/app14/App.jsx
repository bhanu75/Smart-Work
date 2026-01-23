import { useMemo, useState } from "react";

/**
 * pointsPerUnit:
 * Economy = 4
 * Premium = 12
 * Luxury = 24
 */

const PRODUCTS = [
  { name: "Walmasta Lite", dbt: 80, pointsPerUnit: 4, tokenPerUnit: 5 },
  { name: "Bison Emulsion Lite", dbt: 80, pointsPerUnit: 4, tokenPerUnit: 5 },
  { name: "Walmasta Regular", dbt: 80, pointsPerUnit: 4, tokenPerUnit: 5 },
  { name: "Bison Emulsion Regular", dbt: 80, pointsPerUnit: 4, tokenPerUnit: 5 },

  { name: "Walmasta Glow", dbt: 100, pointsPerUnit: 4, tokenPerUnit: 5 },
  { name: "Bison Emulsion Glow", dbt: 100, pointsPerUnit: 4, tokenPerUnit: 5 },

  { name: "Anti Dust / W’Coat Range", dbt: 200, pointsPerUnit: 12, tokenPerUnit: 10 },
  { name: "Easy Clean Range", dbt: 350, pointsPerUnit: 12, tokenPerUnit: 5 },
  { name: "Color Plus", dbt: 100, pointsPerUnit: 12, tokenPerUnit: 10 },

  { name: "Silk Range", dbt: 400, pointsPerUnit: 24, tokenPerUnit: 5 },
  { name: "W’Coat Longlife Range", dbt: 400, pointsPerUnit: 24, tokenPerUnit: 5 },

  { name: "W’Coat Exterior Primer", dbt: 80, pointsPerUnit: 4, tokenPerUnit: 5 },
  { name: "Primer 996", dbt: 80, pointsPerUnit: 4, tokenPerUnit: 5 },
  { name: "Primer 796", dbt: 80, pointsPerUnit: 4, tokenPerUnit: 5 },

  { name: "Normal Berger Putty", dbt: 0, pointsPerUnit: 2, tokenPerUnit: 2.5 },
  { name: "Homeshield Waterproof Putty", dbt: 40, pointsPerUnit: 2, tokenPerUnit: 2.5 },

  { name: "Kool N Seal", dbt: 100, pointsPerUnit: 12, tokenPerUnit: 10 },
  { name: "Dampstop Advance", dbt: 12, pointsPerUnit: 12, tokenPerUnit: 50 },

  { name: "Luxol PU Enamel", dbt: 12, pointsPerUnit: 12, tokenPerUnit: 0 },
  { name: "Silk Glmart", dbt: 24, pointsPerUnit: 24, tokenPerUnit: 0 },
];

export default function App() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(PRODUCTS[0]);
  const [qty, setQty] = useState(20);
  const [dbt, setDbt] = useState(PRODUCTS[0].dbt);

  const filtered = useMemo(() => {
    return PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const points = qty * selected.pointsPerUnit;
  const valueToken = qty * selected.tokenPerUnit;

  return (
    <div style={styles.app}>
      <h2 style={styles.title}>Lift & Win</h2>

      <input
        style={styles.search}
        placeholder="Search product"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div style={styles.layout}>
        {/* Product List */}
        <div style={styles.list}>
          {filtered.map(p => (
            <div
              key={p.name}
              style={{
                ...styles.item,
                background: selected.name === p.name ? "#1c1c1e" : "#111"
              }}
              onClick={() => {
                setSelected(p);
                setQty(20);
                setDbt(p.dbt);
              }}
            >
              {p.name}
            </div>
          ))}
        </div>

        {/* Result Card */}
        <div style={styles.card}>
          <h3>{selected.name}</h3>

          <label>Quantity</label>
          <input
            type="number"
            value={qty}
            onChange={e => setQty(+e.target.value)}
            style={styles.input}
          />

          <label>DBT (Editable)</label>
          <input
            type="number"
            value={dbt}
            onChange={e => setDbt(+e.target.value)}
            style={styles.input}
          />

          <div style={styles.result}>Points: {points}</div>
          <div style={styles.result}>Value Token: ₹{valueToken}</div>
          <div style={styles.result}>DBT: ₹{dbt}</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    padding: 16,
    fontFamily: "system-ui"
  },
  title: {
    textAlign: "center",
    marginBottom: 12
  },
  search: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    border: "none",
    background: "#1c1c1e",
    color: "#fff",
    marginBottom: 12
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12
  },
  list: {
    maxHeight: "75vh",
    overflowY: "auto"
  },
  item: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 8,
    cursor: "pointer"
  },
  card: {
    background: "#1c1c1e",
    padding: 16,
    borderRadius: 18
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 12,
    border: "none",
    marginBottom: 12
  },
  result: {
    background: "#2c2c2e",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8
  }
};
