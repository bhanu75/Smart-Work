import React, { useEffect, useState } from "react";  import { Card, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; import { Plus, Search, Pencil, Trash2 } from "lucide-react";

// 🔹 IMPORTANT: Replace with your deployed Google Apps Script Web App URL const API_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";

export default function InternalCRMApp() { const [data, setData] = useState([]); const [search, setSearch] = useState(""); const [open, setOpen] = useState(false); const [editing, setEditing] = useState(null); const [form, setForm] = useState({ customer_name: "", client_id: "", agent_name: "", agent_code: "", agent_contact: "", customer_contact: "", bonus: "", surrender_value: "", plan_name: "", remarks: "", special_remark: "", });

const fetchData = async () => { const res = await fetch(API_URL); const result = await res.json(); setData(result); };

useEffect(() => { fetchData(); }, []);

const handleSubmit = async () => { const method = editing ? "PUT" : "POST"; await fetch(API_URL, { method, body: JSON.stringify({ ...form, id: editing?.id }), }); setOpen(false); setEditing(null); setForm({ customer_name: "", client_id: "", agent_name: "", agent_code: "", agent_contact: "", customer_contact: "", bonus: "", surrender_value: "", plan_name: "", remarks: "", special_remark: "", }); fetchData(); };

const handleDelete = async (id) => { await fetch(API_URL, { method: "DELETE", body: JSON.stringify({ id }), }); fetchData(); };

const filtered = data.filter((item) => item.customer_name?.toLowerCase().includes(search.toLowerCase()) );

return ( <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white"> <div className="max-w-6xl mx-auto"> <div className="flex justify-between items-center mb-6"> <h1 className="text-2xl font-bold">Internal CRM</h1> <Button onClick={() => setOpen(true)} className="rounded-2xl"> <Plus className="w-4 h-4 mr-2" /> Add </Button> </div>

<div className="relative mb-6">
      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
      <Input
        placeholder="Search Customer Name..."
        className="pl-10 rounded-2xl bg-slate-700 border-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>

    <div className="grid gap-4">
      {filtered.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="rounded-2xl bg-slate-800 shadow-xl">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-semibold">{item.customer_name}</p>
                  <p className="text-sm text-gray-400">Client ID: {item.client_id}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setEditing(item);
                      setForm(item);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm">Agent: {item.agent_name}</p>
              <p className="text-sm">Plan: {item.plan_name}</p>
              <p className="text-sm">Surrender: {item.surrender_value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-2xl bg-slate-900 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit" : "Add"} Customer</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          {Object.keys(form).map((key) => (
            <Input
              key={key}
              placeholder={key.replace("_", " ")}
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              className="rounded-xl bg-slate-800 border-none"
            />
          ))}
          <Button onClick={handleSubmit} className="rounded-2xl">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</div>

); }
