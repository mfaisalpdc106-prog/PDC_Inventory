import React, { useState } from "react";
import Icon from "./icon";

// --- COMPONENT 2: INVENTORY TABLE ---
const InventoryTable = ({ items, loading, onEdit, onDelete }) => {
  const [expandedLogs, setExpandedLogs] = useState({});

  const toggleLog = (id) => {
    setExpandedLogs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateDetailedAge = (tglBeli, isRusak, tglRusak) => {
    if (!tglBeli || isRusak !== "Ya" || !tglRusak) return null;
    const start = new Date(tglBeli);
    const end = new Date(tglRusak);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start)
      return "0 Hari";

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months -= 1;
      const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += lastMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const parts = [];
    if (years > 0) parts.push(`${years} Thn`);
    if (months > 0) parts.push(`${months} Bln`);
    if (days > 0 || parts.length === 0) parts.push(`${days} Hari`);
    return parts.join(", ");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 border-b border-b-slate-300 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-4 w-12 text-center">No</th>
              <th className="px-4 py-4">Kode & Supplier</th>
              <th className="px-4 py-4">User</th>
              <th className="px-4 py-4">Spek & Merk</th>
              <th className="px-4 py-4">Team & Lokasi</th>
              <th className="px-4 py-4">Owner</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Log & Umur</th>
              <th className="px-4 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td
                  colSpan="9"
                  className="p-12 text-center animate-pulse text-slate-400"
                >
                  Loading database...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="p-12 text-center text-slate-400 italic font-medium"
                >
                  Data tidak ditemukan.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const usageAge = calculateDetailedAge(
                  item.tgl_beli,
                  item.rusak_total,
                  item.tgl_rusak,
                );
                const logs = item.log_perbaikan || [];
                const isExpanded = expandedLogs[item.id];
                const visibleLogs = isExpanded ? logs : logs.slice(0, 1);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-4 py-4 text-center font-bold text-slate-400">
                      {item.no}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-blue-500 uppercase">
                        {item.kode}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize font-bold tracking-tight">
                        Supp: {item.supplier || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold capitalize text-slate-800">
                        {item.username || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div
                        className="font-medium text-slate-700 truncate max-w-37.5"
                        title={item.spesifikasi}
                      >
                        {item.spesifikasi || "-"}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize font-medium">
                        Merk: {item.merk || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs font-bold uppercase text-blue-500">
                        {item.team || "-"}
                      </div>
                      <div className="flex items-center capitalize gap-1 text-[10px] text-slate-400 mt-1">
                        <Icon
                          name="MapPin"
                          size={10}
                          className="text-red-500"
                        />
                        {item.posisi_barang || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium uppercase text-slate-600">
                      {item.owner || "-"}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`font-bold uppercase border shadow-sm text-[10px] tracking-tight p-1 rounded-md ${
                          item.status === "Dipakai"
                            ? "bg-green-50 text-green-500 border-green-100"
                            : item.status === "Rusak"
                              ? "bg-red-50 text-red-500 border-red-100"
                              : item.status === "Ready"
                                ? "bg-blue-50 text-blue-500 border-blue-100"
                                : "bg-yellow-50 text-yellow-500 border-yellow-100"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {" "}
                      {logs.length > 0 ? (
                        <div className="flex flex-col gap-1.5 min-w-45">
                          {visibleLogs.map((log, idx) => (
                            <div
                              key={idx}
                              className="text-[10px] bg-yellow-50 p-1.5 rounded border border-yellow-100 truncate max-w-60"
                            >
                              <div className="flex items-center gap-1 font-bold text-yellow-700">
                                <Icon name="History" size={9} /> {log.tgl}
                              </div>
                              <div className="italic text-slate-600 truncate">
                                {log.detail}
                              </div>
                            </div>
                          ))}
                          {logs.length > 1 && (
                            <button
                              onClick={() => toggleLog(item.id)}
                              className="text-[9px] font-bold text-blue-500 flex items-center gap-1 hover:underline self-start mt-0.5"
                            >
                              <Icon
                                name={isExpanded ? "ChevronUp" : "ChevronDown"}
                                size={10}
                              />
                              {isExpanded
                                ? "Sembunyikan"
                                : `Lihat Riwayat (${logs.length - 1} lagi)`}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300 text-xs italic">
                          No Log
                        </span>
                      )}
                      <div className="mt-2 pt-2 border-t border-slate-100">
                        {usageAge ? (
                          <div className="flex items-center gap-1 text-[11px] text-slate-600 font-bold">
                            <Icon
                              name="Clock"
                              size={12}
                              className="text-slate-400"
                            />{" "}
                            Umur: {usageAge}
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-300 italic">
                            Umur N/A
                          </div>
                        )}
                        {item.rusak_total === "Ya" && (
                          <div className="text-[9px] text-red-500 font-bold uppercase mt-0.5 flex items-center gap-1">
                            <Icon name="AlertTriangle" size={10} /> Mati:{" "}
                            {item.tgl_rusak || "-"}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => onEdit(item)}
                          title="Edit Data"
                          className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-md bg-blue-50 border border-blue-100 cursor-pointer shadow-sm"
                        >
                          <Icon name="Edit3" size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          title="Hapus Data"
                          className="p-1.5 text-red-600 hover:bg-red-100 rounded-md bg-red-50 border border-red-100 cursor-pointer shadow-sm"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;
