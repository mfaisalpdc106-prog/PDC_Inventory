import React, { useState } from "react";
import Icon from "./icon";

// --- COMPONENT 3: INVENTORY MODAL ---
const InventoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingId,
}) => {
  if (!isOpen) return null;

  const addLogEntry = () => {
    setFormData({
      ...formData,
      log_perbaikan: [
        { tgl: "", detail: "" },
        ...(formData.log_perbaikan || []),
      ],
    });
  };

  const updateLogEntry = (index, field, value) => {
    const newLogs = [...formData.log_perbaikan];
    newLogs[index][field] = value;
    setFormData({ ...formData, log_perbaikan: newLogs });
  };

  const removeLogEntry = (index) => {
    const newLogs = formData.log_perbaikan.filter((_, i) => i !== index);
    setFormData({ ...formData, log_perbaikan: newLogs });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-b-slate-300 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-blue-500 uppercase">
            {editingId ? "Update Data" : "Entry Baru"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 hover:rounded-full cursor-pointer transition-all active:scale-90"
          >
            <Icon name="X" />
          </button>
        </div>
        <form
          onSubmit={onSubmit}
          className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Kode Dasar
            </label>
            <input
              required
              placeholder="Contoh: CPBW1"
              value={formData.kode_base}
              onChange={(e) =>
                setFormData({ ...formData, kode_base: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Jenis
            </label>
            <select
              value={formData.jenis}
              onChange={(e) =>
                setFormData({ ...formData, jenis: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg bg-white"
            >
              <option value="Komputer">Komputer</option>
              <option value="Monitor">Monitor</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Supplier
            </label>
            <input
              value={formData.supplier}
              onChange={(e) =>
                setFormData({ ...formData, supplier: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Tanggal Beli
            </label>
            <input
              type="date"
              value={formData.tgl_beli}
              onChange={(e) =>
                setFormData({ ...formData, tgl_beli: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Merk
            </label>
            <input
              value={formData.merk}
              onChange={(e) =>
                setFormData({ ...formData, merk: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Lokasi Barang
            </label>
            <input
              value={formData.posisi_barang}
              onChange={(e) =>
                setFormData({ ...formData, posisi_barang: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              User
            </label>
            <input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Team
            </label>
            <input
              value={formData.team}
              onChange={(e) =>
                setFormData({ ...formData, team: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Owner
            </label>
            <input
              value={formData.owner}
              onChange={(e) =>
                setFormData({ ...formData, owner: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none"
            >
              <option value="Dipakai">Dipakai</option>
              <option value="Ready">Ready</option>
              <option value="Perbaikan">Perbaikan</option>
              <option value="Rusak">Rusak</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Rusak Total?
            </label>
            <select
              value={formData.rusak_total}
              onChange={(e) =>
                setFormData({ ...formData, rusak_total: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg outline-none"
            >
              <option value="Tidak">Tidak</option>
              <option value="Ya">Ya</option>
            </select>
          </div>
          {formData.rusak_total === "Ya" && (
            <div className="animate-in fade-in slide-in-from-top-1">
              <label className="block text-xs font-bold uppercase text-red-600 mb-1.5">
                Tgl Rusak Total
              </label>
              <input
                type="date"
                required={formData.rusak_total === "Ya"}
                value={formData.tgl_rusak}
                onChange={(e) =>
                  setFormData({ ...formData, tgl_rusak: e.target.value })
                }
                className="w-full p-2.5 border border-red-200 rounded-lg bg-red-50 outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>
          )}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Spesifikasi Detail
            </label>
            <textarea
              value={formData.spesifikasi}
              onChange={(e) =>
                setFormData({ ...formData, spesifikasi: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg h-24 resize-none outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5">
              Keterangan
            </label>
            <textarea
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
              className="w-full p-2.5 border border-slate-200 rounded-lg h-24 resize-none outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="md:col-span-3 border-t border-t-slate-300 pt-5 mt-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-blue-500 flex items-center gap-2 uppercase text-sm">
                <Icon name="History" size={16} /> Riwayat Perbaikan
              </h3>
              <button
                type="button"
                onClick={addLogEntry}
                className="text-[10px] p-2 font-bold cursor-pointer text-blue-500 hover:bg-blue-100 hover:ring-1 hover:ring-blue-300 rounded-md bg-blue-50 transition-all active:scale-95"
              >
                + Tambah Log Baru
              </button>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {formData.log_perbaikan &&
                formData.log_perbaikan.map((log, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row gap-3 p-3 bg-white rounded-lg border border-slate-200 relative group"
                  >
                    <div className="w-full md:w-1/3">
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">
                        Tgl Perbaikan
                      </label>
                      <input
                        type="date"
                        value={log.tgl}
                        onChange={(e) =>
                          updateLogEntry(index, "tgl", e.target.value)
                        }
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="w-full md:flex-1">
                      <label className="text-[10px] font-bold text-slate-500 block mb-1 uppercase">
                        Detail
                      </label>
                      <input
                        value={log.detail}
                        onChange={(e) =>
                          updateLogEntry(index, "detail", e.target.value)
                        }
                        className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLogEntry(index)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-100 hover:rounded-full self-end p-2 cursor-pointer transition-all active:scale-90"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          <div className="md:col-span-3 flex justify-end gap-3 pt-6 border-t border-t-slate-300 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border hover:ring-1 hover:ring-slate-300 rounded-lg border-slate-300 hover:bg-slate-50 cursor-pointer active:scale-95 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-lg font-bold flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
            >
              <Icon name="Save" size={18} /> Simpan Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;
