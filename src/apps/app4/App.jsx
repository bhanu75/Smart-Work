import { useState } from "react"; import { Card, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; import { Search } from "lucide-react";

export default function Dashboard() { const [open, setOpen] = useState(false); const [search, setSearch] = useState("");

const data = [ { client: "Amit Verma", policy: "Growth Plus", type: "ULIP", due: "22 Apr 2024", value: "₹24,50,000", growth: "12.7%" }, { client: "Rajesh Sharma", policy: "Wealth ULIP", type: "ULIP", due: "20 Jul 2024", value: "₹31,80,500", growth: "15.7%" }, ];

return ( <div className="min-h-screen bg-slate-50 text-slate-900 flex"> {/* Sidebar */} <aside className="w-64 bg-slate-900 text-slate-100 p-6 space-y-6"> <div className="text-xl font-semibold">Policy Desk</div> <nav className="space-y-3 text-sm"> <div>Dashboard</div> <div>Policies</div> <div>Notes</div> <div>Settings</div> </nav> </aside>

{/* Main */}
  <main className="flex-1 p-8 space-y-8">
    {/* Top Bar */}
    <div className="flex justify-between items-center">
      <div className="relative w-80">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search policies"
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Button onClick={() => setOpen(true)}>Add Policy</Button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-4 gap-6">
      <Card><CardContent className="p-4">Active Policies<br /><span className="text-2xl font-semibold">28</span></CardContent></Card>
      <Card><CardContent className="p-4">Total Invested<br /><span className="text-2xl font-semibold">₹24,50,000</span></CardContent></Card>
      <Card><CardContent className="p-4">Current Value<br /><span className="text-2xl font-semibold">₹31,80,500</span></CardContent></Card>
      <Card><CardContent className="p-4">Avg Growth<br /><span className="text-2xl font-semibold">12.7%</span></CardContent></Card>
    </div>

    {/* Table */}
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Next Due</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Growth</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.client}</TableCell>
                <TableCell>{row.policy}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.due}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.growth}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="secondary">View</Button>
                  <Button size="sm">Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </main>

  {/* Dialog */}
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Policy</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <Input placeholder="Client Name" />
        <Input placeholder="Policy Name" />
        <Input placeholder="Policy Type (ULIP)" />
        <Input placeholder="Units" />
        <Input placeholder="Current NAV" />
        <Button className="w-full">Save</Button>
      </div>
    </DialogContent>
  </Dialog>
</div>

); }
