import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import CoordinatorNavbar from "../components/CoordinatorNavbar";

const BASE_URL = "https://final-project-be-o1ei.vercel.app";

export default function BudgetDocumentation() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [coordName, setCoordName] = useState("");
  const [clubName, setClubName] = useState("AI Club");
  const [approvedBudget, setApprovedBudget] = useState("");
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", category: "Logistics", amount: "", notes: "" });

  const coordinator = JSON.parse(localStorage.getItem("coordinator") || "{}");

  useEffect(() => {
    fetch(`${BASE_URL}/events`)
      .then(r => r.json())
      .then(data => setEvents(data))
      .catch(console.error);
    setCoordName(coordinator.name || coordinator.firstName || "Coordinator");
  }, []);

  const selectedEvent = events.find(e => e._id === selectedEventId);
  const total = items.reduce((s, i) => s + i.amount, 0);
  const diff = approvedBudget ? Number(approvedBudget) - total : null;

  const handleAdd = () => {
    if (!selectedEventId) return alert("Select an event first");
    if (!form.name || !form.amount) return alert("Fill required fields");
    setItems([...items, { ...form, id: Date.now(), amount: Number(form.amount) }]);
    setForm({ name: "", category: "Logistics", amount: "", notes: "" });
  };

  const deleteItem = (id) => setItems(items.filter(i => i.id !== id));

  const exportPDF = () => {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // ── Dark header band ──
    doc.setFillColor(11, 14, 19);          // #0B0E13
    doc.rect(0, 0, pageW, 42, "F");

    // Orange accent line
    doc.setFillColor(249, 121, 36);        // #F97924
    doc.rect(0, 42, pageW, 3, "F");

    // Title
    doc.setTextColor(249, 121, 36);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("EventHub — Budget Report", pageW / 2, 20, { align: "center" });

    doc.setTextColor(231, 235, 239);       // #E7EBEF
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`, pageW / 2, 32, { align: "center" });

    // ── Event info card ──
    let y = 58;
    doc.setFillColor(18, 21, 28);         // #12151C
    doc.roundedRect(10, y - 6, pageW - 20, 40, 3, 3, "F");

    doc.setTextColor(115, 123, 140);      // #737B8C
    doc.setFontSize(8);
    doc.text("EVENT", 16, y + 2);
    doc.setTextColor(231, 235, 239);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(selectedEvent?.title || "—", 16, y + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(115, 123, 140);
    doc.text(`Coordinator: ${coordName}`, 16, y + 20);
    doc.text(`Club: ${clubName}`, 16, y + 28);
    doc.text(`Approved Budget: ₹${approvedBudget || "—"}`, pageW / 2, y + 20);
    if (selectedEvent?.date)
      doc.text(`Date: ${new Date(selectedEvent.date).toLocaleDateString("en-IN")}`, pageW / 2, y + 28);

    // ── Items table ──
    y += 52;
    doc.setFillColor(29, 33, 42);         // #1D212A
    doc.rect(10, y, pageW - 20, 8, "F");

    doc.setTextColor(249, 121, 36);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("#", 14, y + 5.5);
    doc.text("Item", 22, y + 5.5);
    doc.text("Category", 100, y + 5.5);
    doc.text("Notes", 145, y + 5.5);
    doc.text("Amount", pageW - 14, y + 5.5, { align: "right" });
    y += 12;

    doc.setFont("helvetica", "normal");
    items.forEach((item, i) => {
      if (y > 270) { doc.addPage(); y = 20; }

      // alternating row
      if (i % 2 === 0) {
        doc.setFillColor(18, 21, 28);
        doc.rect(10, y - 4, pageW - 20, 9, "F");
      }

      doc.setTextColor(231, 235, 239);
      doc.setFontSize(9);
      doc.text(String(i + 1), 14, y + 1.5);
      doc.text(item.name.length > 25 ? item.name.slice(0, 25) + "…" : item.name, 22, y + 1.5);

      doc.setTextColor(115, 123, 140);
      doc.text(item.category, 100, y + 1.5);
      doc.text(item.notes ? item.notes.slice(0, 18) : "—", 145, y + 1.5);

      doc.setTextColor(249, 121, 36);
      doc.text(`₹${item.amount.toLocaleString("en-IN")}`, pageW - 14, y + 1.5, { align: "right" });
      y += 10;
    });

    // ── Total band ──
    y += 6;
    doc.setFillColor(249, 121, 36, 0.15);
    doc.setFillColor(40, 30, 15);
    doc.rect(10, y, pageW - 20, 14, "F");
    doc.setFillColor(249, 121, 36);
    doc.rect(10, y, 3, 14, "F");

    doc.setTextColor(231, 235, 239);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Total Expenditure", 18, y + 9);
    doc.setTextColor(249, 121, 36);
    doc.text(`₹${total.toLocaleString("en-IN")}`, pageW - 14, y + 9, { align: "right" });

    // Budget status
    if (diff !== null) {
      y += 18;
      const isOver = diff < 0;
      doc.setFontSize(9);
      doc.setTextColor(isOver ? 239 : 52, isOver ? 68 : 211, isOver ? 68 : 153);
      doc.text(
        isOver
          ? `⚠ Over budget by ₹${Math.abs(diff).toLocaleString("en-IN")}`
          : `✓ Under budget by ₹${diff.toLocaleString("en-IN")}`,
        pageW / 2, y, { align: "center" }
      );
    }

    // ── Footer ──
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFillColor(11, 14, 19);
    doc.rect(0, pageH - 14, pageW, 14, "F");
    doc.setTextColor(115, 123, 140);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text("EventHub • PCCOER Campus Events Management", pageW / 2, pageH - 5, { align: "center" });

    doc.save(`budget_${(selectedEvent?.title || "event").replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#E7EBEF]">
      <CoordinatorNavbar />
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">

        <div>
          <h1 className="text-3xl font-bold">Budget Documentation</h1>
          <p className="text-[#737B8C]">Track expenses and generate branded PDF reports</p>
        </div>

        {/* Event Info */}
        <div className="bg-[#12151C] border border-[#1D212A] p-5 rounded-xl space-y-3">
          <h2 className="font-semibold">Event Info</h2>
          <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full p-2 bg-[#1D212A] rounded outline-none focus:ring-1 focus:ring-orange-500">
            <option value="">— Select Event —</option>
            {events.map(ev => <option key={ev._id} value={ev._id}>{ev.title}</option>)}
          </select>
          <div className="flex gap-2">
            <input placeholder="Coordinator Name" value={coordName}
              onChange={(e) => setCoordName(e.target.value)}
              className="w-full p-2 bg-[#1D212A] rounded outline-none" />
            <input placeholder="Club Name" value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="w-full p-2 bg-[#1D212A] rounded outline-none" />
          </div>
          <input type="number" placeholder="Approved Budget (₹)" value={approvedBudget}
            onChange={(e) => setApprovedBudget(e.target.value)}
            className="w-full p-2 bg-[#1D212A] rounded outline-none" />
        </div>

        {/* Add Item */}
        <div className="bg-[#12151C] border border-[#1D212A] p-5 rounded-xl space-y-3">
          <h2 className="font-semibold">Add Expense Item</h2>
          <input placeholder="Item Name *" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 bg-[#1D212A] rounded outline-none" />
          <div className="flex gap-2">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2 bg-[#1D212A] rounded">
              {["Logistics","Food & Beverage","Marketing","Technology","Prizes","Stationery","Other"].map(c =>
                <option key={c}>{c}</option>
              )}
            </select>
            <input type="number" placeholder="Amount (₹) *" value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full p-2 bg-[#1D212A] rounded outline-none" />
          </div>
          <input placeholder="Notes (optional)" value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full p-2 bg-[#1D212A] rounded outline-none" />
          <button onClick={handleAdd}
            className="bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-2 rounded font-semibold text-sm text-[#0B0E13]">
            + Add Item
          </button>
        </div>

        {/* Items List */}
        <div className="bg-[#12151C] border border-[#1D212A] p-5 rounded-xl">
          <h2 className="mb-4 font-semibold">Budget Items ({items.length})</h2>
          {items.length === 0 ? (
            <p className="text-[#737B8C] text-center py-6">No items added yet</p>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id}
                  className="flex justify-between items-center bg-[#1D212A] p-3 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-[#737B8C]">{item.category}{item.notes ? ` • ${item.notes}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500 font-semibold">₹{item.amount.toLocaleString("en-IN")}</span>
                    <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-300 transition text-lg leading-none">×</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Total */}
          <div className="mt-5 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Expenditure</span>
              <span className="text-orange-500 font-bold text-lg">₹{total.toLocaleString("en-IN")}</span>
            </div>
            {diff !== null && (
              <p className={`text-sm mt-2 ${diff >= 0 ? "text-green-400" : "text-red-400"}`}>
                {diff >= 0 ? `✓ Under budget by ₹${diff.toLocaleString("en-IN")}` : `⚠ Over budget by ₹${Math.abs(diff).toLocaleString("en-IN")}`}
              </p>
            )}
          </div>

          <button onClick={exportPDF}
            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-orange-400 py-2.5 rounded-lg font-semibold text-[#0B0E13] hover:shadow-lg transition">
            📄 Download Themed PDF Report
          </button>
        </div>
      </div>
    </div>
  );
}