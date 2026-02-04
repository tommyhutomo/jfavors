"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, FileText } from "lucide-react";

/**
 * Invoice for an "event" you will generate.
 * Extend/replace with your real backend DTO as needed.
 */
type Invoice = {
  id: string;        // internal id
  eventNo: string;   // human-friendly number
  eventName: string;
  eventDate: string; // ISO yyyy-mm-dd for simplicity
  venueName: string;
  venueAddress: string;
};

/** Sample/mock data; replace with server results */
const MOCK_EVENTS: Invoice[] = [
  {
    id: "evt-10001",
    eventNo: "EV-2026-0001",
    eventName: "Company Townhall Q1",
    eventDate: "2026-02-12",
    venueName: "Jakarta Convention Center",
    venueAddress: "Jl. Gatot Subroto No. 1, Jakarta",
  },
  {
    id: "evt-10002",
    eventNo: "EV-2026-0002",
    eventName: "Wedding — Adi & Putri",
    eventDate: "2026-03-02",
    venueName: "Grand Ballroom",
    venueAddress: "Jl. Sudirman No. 12, Jakarta",
  },
  {
    id: "evt-10003",
    eventNo: "EV-2026-0003",
    eventName: "Sales Kickoff 2026",
    eventDate: "2026-01-20",
    venueName: "Bali Nusa Dua",
    venueAddress: "Kawasan BTDC, Badung, Bali",
  },
  {
    id: "evt-10004",
    eventNo: "EV-2026-0004",
    eventName: "Tech Expo Booth",
    eventDate: "2026-04-18",
    venueName: "ICE BSD",
    venueAddress: "BSD City, Tangerang",
  },
  {
    id: "evt-10005",
    eventNo: "EV-2026-0005",
    eventName: "Charity Gala Dinner",
    eventDate: "2026-05-03",
    venueName: "The Ritz-Carlton",
    venueAddress: "Mega Kuningan, Jakarta",
  },
  // add more rows as needed to test pagination
];

export default function InvoiceForm({ invoiceId }: { invoiceId?: string }) {
  // SECTION 1 — Search
  const [query, setQuery] = useState("");
  const [lastSubmittedQuery, setLastSubmittedQuery] = useState("");

  // SECTION 2 — Table + selection + pagination
  const [data, setData] = useState<Invoice[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [page, setPage] = useState(1);       // 1-based page index
  const [pageSize, setPageSize] = useState(5);

  // SECTION 3 — Document preview
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Simulate initial fetch
  useEffect(() => {
    // In production, fetch from API
    setData(MOCK_EVENTS);
  }, []);

  // Derived filtered rows (search by event name or event no)
  const filtered = useMemo(() => {
    if (!lastSubmittedQuery.trim()) return data;
    const q = lastSubmittedQuery.trim().toLowerCase();
    return data.filter(
      (e) =>
        e.eventName.toLowerCase().includes(q) ||
        e.eventNo.toLowerCase().includes(q)
    );
  }, [data, lastSubmittedQuery]);

  // Pagination calculations
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Ensure selection stays valid when filtering/paging
  useEffect(() => {
    if (selectedId && !filtered.some((x) => x.id === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  // Ensure current page remains in bounds when filters change
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  // Handlers
  const handleSearch = () => {
    setPage(1);
    setLastSubmittedQuery(query);
  };

  const clearSearch = () => {
    setQuery("");
    setLastSubmittedQuery("");
    setPage(1);
  };

  const toggleSingleCheckbox = (rowId: string) => {
    setSelectedId((prev) => (prev === rowId ? null : rowId));
  };

  const handleGenerateInvoice = async () => {
    if (!selectedId) return;

    // Simulate server-side invoice generation
    setIsGenerating(true);

    // In real life:
    // const res = await fetch(`/api/work-orders/${selectedId}/invoice`, { method: 'POST' });
    // const { pdfUrl } = await res.json();
    // setPdfUrl(pdfUrl);

    // For now we just point to a placeholder URL pattern you can implement on your backend.
    // Replace this with the real absolute/relative URL that serves application/pdf.
    const placeholderUrl = `/api/invoices/${selectedId}.pdf?ts=${Date.now()}`;
    // Simulate delay
    setTimeout(() => {
      setPdfUrl(placeholderUrl);
      setIsGenerating(false);
    }, 800);
  };

  // UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-1">Invoice</h1>
          <p className="text-slate-600">
            Search an event, select the correct one, then generate and preview the invoice.
          </p>
        </header>

        {/* SECTION 1 — Search */}
        <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Search</h2>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Event Name or Event No (e.g., EV-2026-0001)"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Search size={18} />
              Search
            </button>
            {lastSubmittedQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {lastSubmittedQuery && (
            <p className="mt-2 text-sm text-slate-600">
              Showing results for: <span className="font-semibold">{lastSubmittedQuery}</span>
            </p>
          )}
        </section>

        {/* SECTION 2 — Detail (table + selection + pagination + generate button) */}
        <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-purple-600 font-bold">2</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Detail</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Pick</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Event Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Event Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Venue Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-700">Venue Address</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-600">
                      No results found.
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        {/* Checkbox that behaves like a radio (exclusive select) */}
                        <input
                          type="checkbox"
                          checked={selectedId === row.id}
                          onChange={() => toggleSingleCheckbox(row.id)}
                          className="w-4 h-4 text-blue-600"
                          aria-label={`Select ${row.eventName}`}
                        />
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        <div className="font-semibold">{row.eventName}</div>
                        <div className="text-xs text-slate-500">#{row.eventNo}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-800">
                        {new Date(row.eventDate).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-3 text-slate-800">{row.venueName}</td>
                      <td className="px-4 py-3 text-slate-600">{row.venueAddress}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 border border-slate-300 rounded-md bg-white"
              >
                {[5, 10, 20, 50].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <span className="ml-3">
                {total === 0
                  ? "0–0 of 0"
                  : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                      currentPage * pageSize,
                      total
                    )} of ${total}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="inline-flex items-center px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center px-3 py-1.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="flex-1" />
            <button
              type="button"
              onClick={handleGenerateInvoice}
              disabled={!selectedId || isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={!selectedId ? "Pick one event first" : "Generate invoice"}
            >
              <FileText size={18} />
              {isGenerating ? "Generating..." : "Generate Invoice"}
            </button>
          </div>
        </section>

        {/* SECTION 3 — View document (PDF preview) */}
        <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-amber-600 font-bold">3</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800">View Document</h2>
          </div>

          {/* Read-only preview area */}
          <div className="border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
            {pdfUrl ? (
              <object
                data={pdfUrl}
                type="application/pdf"
                className="w-full h-[70vh]"
              >
                {/* Fallback if PDF plugin not available */}
                <iframe src={pdfUrl} className="w-full h-[70vh]" />
              </object>
            ) : (
              <div className="h-[50vh] flex flex-col items-center justify-center text-slate-600">
                <FileText className="mb-3 text-slate-400" size={40} />
                <p className="font-semibold">No document to preview</p>
                <p className="text-sm">
                  Pick one event and click <span className="font-semibold">Generate Invoice</span>.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}