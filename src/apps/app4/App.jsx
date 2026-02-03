import { useState } from "react";

export default function Dashboard() { const [open, setOpen] = useState(false); const [search, setSearch] = useState("");

const data = [ { client: "Amit Verma", policy: "Growth Plus", type: "ULIP", due: "22 Apr 2024", value: "₹24,50,000", growth: "12.7%" }, { client: "Rajesh Sharma", policy: "Wealth ULIP", type: "ULIP", due: "20 Jul 2024", value: "₹31,80,500", growth: "15.7%" }, ];

return ( <div className="min-h-screen flex bg-slate-50 text-slate-900"> {/* Sidebar */} <aside className="w-64 bg-slate-900 text-slate-100 p-6"> <div className="text-xl font-semibold mb-8">Policy Desk</div> <nav className="space-y-4 text-sm"> <div className="opacity-80">Dashboard</div> <div className="opacity-80">Policies</div> <div className="opacity-80">Notes</div> <div className="opacity-80">Settings</div> </nav> </aside>

{/* Main */}
  <main className="flex-1 p-8 space-y-8">
    {/* Top bar */}
    <div className="flex justify-between items-center">
      <input
        className="w-80 rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        placeholder="Search policies"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-slate-900 text-white px-4 py-2 text-sm"
      >
        Add Policy
      </button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-4 gap-6">
      <Stat title="Active Policies" value="28" />
      <Stat title="Total Invested" value="₹24,50,000" />
      <Stat title="Current Value" value="₹31,80,500" />
      <Stat title="Avg Growth" value="12.7%" />
    </div>

    {/* Table */}
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 text-left">
          <tr>
            <Th>Client</Th>
            <Th>Policy</Th>
            <Th>Type</Th>
            <Th>Next Due</Th>
            <Th>Value</Th>
            <Th>Growth</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t">
              <Td>{row.client}</Td>
              <Td>{row.policy}</Td>
              <Td>{row.type}</Td>
              <Td>{row.due}</Td>
              <Td>{row.value}</Td>
              <Td>{row.growth}</Td>
              <Td className="space-x-2">
                <button className="px-3 py-1 rounded-md border">View</button>
                <button className="px-3 py-1 rounded-md bg-slate-900 text-white">Edit</button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </main>

  {/* Modal */}
  {open && (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white w-[420px] rounded-xl p-6 space-y-4">
        <div className="text-lg font-semibold">Add Policy</div>
        <Input placeholder="Client Name" />
        <Input placeholder="Policy Name" />
        <Input placeholder="Policy Type (ULIP)" />
        <Input placeholder="Units" />
        <Input placeholder="Current NAV" />
        <div className="flex justify-end gap-2">
          <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm">Cancel</button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm">Save</button>
        </div>
      </div>
    </div>
  )}
</div>

); }

function Stat({ title, value }) { return ( <div className="rounded-xl border border-slate-200 bg-white p-4"> <div className="text-xs text-slate-500 mb-1">{title}</div> <div className="text-2xl font-semibold">{value}</div> </div> ); }

function Th({ children }) { return <th className="px-4 py-3 font-medium">{children}</th>; }

function Td({ children, className = "" }) { return <td className={px-4 py-3 ${className}}>{children}</td>; }

function Input({ placeholder }) { return ( <input
placeholder={placeholder}
className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
/> ); }
