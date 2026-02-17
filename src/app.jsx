import React, { useState, useEffect, useMemo } from "react";
import Icon from "./components/icon";
import InventoryTable from "./components/inventoryTable";
import InventoryModal from "./components/inventoryModal";
import { supabase } from "./supabase";

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
const TELEGRAM_RECIPIENTS = (import.meta.env.VITE_TELEGRAM_RECIPIENTS || "")
  .split(",")
  .map((id) => id.trim())
  .filter((id) => id !== "");

// --- COMPONENT 4: MAIN APP ---
export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Komputer");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    kode_base: "",
    jenis: "Komputer",
    supplier: "",
    tgl_beli: "",
    spesifikasi: "",
    merk: "",
    username: "",
    team: "",
    status: "Dipakai",
    posisi_barang: "",
    log_perbaikan: [],
    rusak_total: "Tidak",
    tgl_rusak: "",
    keterangan: "",
    owner: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    // const initSupabase = async () => {
    //   if (typeof window !== "undefined") {
    //     if (window.supabase && !supabase) {
    //       supabase = window.supabase.createClient(
    //         SUPABASE_URL,
    //         SUPABASE_ANON_KEY,
    //       );
    //     }
    //     fetchData();
    //   }
    // };
    // initSupabase();
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("inventaris")
        .select("*")
        .order("no", { ascending: true });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendTelegramNotif = async (action, data) => {
    if (
      !TELEGRAM_BOT_TOKEN ||
      !TELEGRAM_RECIPIENTS ||
      TELEGRAM_RECIPIENTS.length === 0
    )
      return;

    const activeRecipients = TELEGRAM_RECIPIENTS.filter(
      (id) => id.trim() !== "",
    );
    if (activeRecipients.length === 0) return;

    let message = "";
    const emojiAction =
      action === "ADD"
        ? "📥 *Entry Baru*"
        : action === "EDIT"
          ? "📝 *Update Data*"
          : "🗑️ *Hapus Data*";

    message = `🔔 *NOTIFIKASI INVENTARIS*\n${emojiAction}\n\n🆔 Kode: \`${
      data.kode
    }\`\n💻 Jenis: ${data.jenis}\n👤 User: ${data.username || "-"}\n📍 Lokasi: ${
      data.posisi_barang || "-"
    }\n📊 Status: *${data.status}*\n\n-------------------------\n_Sistem PDC Inventory_`;

    const sendPromises = activeRecipients.map((chatId) =>
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }).catch((err) => console.error(`Gagal mengirim ke ${chatId}:`, err)),
    );

    await Promise.all(sendPromises);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchTab = item.jenis === activeTab;
      const matchStatus =
        statusFilter === "Semua" || item.status === statusFilter;
      const matchSearch = Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase()),
      );
      return matchTab && matchStatus && matchSearch;
    });
  }, [items, activeTab, statusFilter, searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) return;

    const extractNumberFromBase = (base) => {
      const match = base.match(/(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    };

    const generateFullCode = (base, date) => {
      if (!base || !date) return base;
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);
      return `${base}/${day}${month}${year}`;
    };

    const autoNo = extractNumberFromBase(formData.kode_base);
    const finalData = {
      ...formData,
      no: autoNo,
      kode: generateFullCode(formData.kode_base, formData.tgl_beli),
      tgl_beli: formData.tgl_beli || null,
      tgl_rusak: formData.tgl_rusak || null,
      log_perbaikan: formData.log_perbaikan || [],
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("inventaris")
          .update(finalData)
          .eq("id", editingId);
        if (error) throw error;
        sendTelegramNotif("EDIT", finalData);
      } else {
        const { error } = await supabase.from("inventaris").insert([finalData]);
        if (error) throw error;
        sendTelegramNotif("ADD", finalData);
      }
      closeModal();
      fetchData();
    } catch (err) {
      console.error("Error saving data:", err.message);
    }
  };

  const handleDelete = async (id) => {
    const itemToDelete = items.find((i) => i.id === id);
    if (!supabase || !confirm("Hapus data inventaris ini?")) return;
    try {
      const { error } = await supabase.from("inventaris").delete().eq("id", id);
      if (error) throw error;
      if (itemToDelete) sendTelegramNotif("DELETE", itemToDelete);
      fetchData();
    } catch (err) {
      console.error("Error deleting:", err.message);
    }
  };

  const closeModal = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-b-slate-300 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              title="PDC Inventory"
              className="bg-blue-500 p-2 rounded-lg text-white"
            >
              <Icon name="Database" size={24} />
            </div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold tracking-tight text-blue-500 ">
                PDC
              </h1>
              <h1 className="text-xl font-bold tracking-tight text-blue-400">
                Inventory
              </h1>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Icon name="Plus" size={18} />{" "}
            <span className="hidden sm:inline">Tambah Barang</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Tabs */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-300 w-full md:w-auto">
            <button
              onClick={() => setActiveTab("Komputer")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all ${
                activeTab === "Komputer"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Icon name="Cpu" /> Komputer
            </button>
            <button
              onClick={() => setActiveTab("Monitor")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all ${
                activeTab === "Monitor"
                  ? "bg-blue-500 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-200"
              }`}
            >
              <Icon name="Monitor" /> Monitor
            </button>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1">
              <Icon
                name="Search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Cari data..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 focus:ring-1 focus:border-blue-500 focus:ring-blue-500 rounded-xl outline-none bg-white transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-xl bg-white outline-none text-sm border-slate-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Dipakai">Dipakai</option>
              <option value="Ready">Ready</option>
              <option value="Perbaikan">Perbaikan</option>
              <option value="Rusak">Rusak</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <InventoryTable
          items={filteredItems}
          loading={loading}
          onEdit={(item) => {
            setFormData({ ...item, log_perbaikan: item.log_perbaikan || [] });
            setEditingId(item.id);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
        />
      </main>

      {/* Modal Content */}
      <InventoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        editingId={editingId}
      />
    </div>
  );
}
