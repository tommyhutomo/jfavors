'use client';

import { useEffect, useMemo, useState } from 'react';

type Status = 'active' | 'inactive';
type SortOrder = 'asc' | 'desc';

function formatIDR(value: number | null | undefined) {
  const n = Number(value ?? 0);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);
}

type PageMeta = { page: number; pageSize: number; total: number; totalPages: number };

export default function MasterAdminPage() {
  const [tab, setTab] = useState<'services' | 'packages' | 'bundles'>('services');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Master Data</h1>
        <div className="mb-6 inline-flex rounded-md border border-gray-300 p-1">
            {(['services','packages','bundles'] as const).map((t) => (
            <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded px-3 py-1.5 text-sm ${tab===t ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
                {t[0].toUpperCase() + t.slice(1)}
            </button>
            ))}
        </div>

        {tab === 'services' && <ServicesPane />}
        {tab === 'packages' && <PackagesPane />}
        {tab === 'bundles' && <BundlesPane />}
        </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Services Pane
   ────────────────────────────────────────────────────────────── */
function ServicesPane() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState<PageMeta>({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [sortBy, setSortBy] = useState<'servicesNo' | 'servicesName' | 'status'>('servicesName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [form, setForm] = useState({ servicesNo: '', servicesName: '', status: 'active' as Status });

  const [editRow, setEditRow] = useState<any | null>(null);

  async function load(page = meta.page, pageSize = meta.pageSize) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status) params.set('status', status);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    const res = await fetch(`/api/admin/services?${params.toString()}`, { cache: 'no-store' });
    const json = await res.json();
    setRows(json.data || []);
    setMeta({ page: json.page, pageSize: json.pageSize, total: json.total, totalPages: json.totalPages });
  }
  useEffect(() => { load(1, meta.pageSize); /* initial */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { load(1, meta.pageSize); /* refetch on sort */ // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  function onHeaderSort(col: typeof sortBy) {
    if (sortBy === col) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortOrder('asc'); }
  }

  return (
    <section>
      <Controls
        q={q} setQ={setQ} status={status} setStatus={setStatus}
        onSearch={() => load(1, meta.pageSize)}
      />

      <CreateCard
        title="Create Service"
        fields={[
          { label: 'Service No', value: form.servicesNo, onChange: (v) => setForm({ ...form, servicesNo: v }) },
          { label: 'Service Name', value: form.servicesName, onChange: (v) => setForm({ ...form, servicesName: v }) },
          { label: 'Status', value: form.status, onChange: (v) => setForm({ ...form, status: v as Status }), options: ['active','inactive'] },
        ]}
        onSubmit={async () => {
          const res = await fetch('/api/admin/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          });
          if (res.ok) {
            setForm({ servicesNo: '', servicesName: '', status: 'active' });
            await load(1, meta.pageSize);
            alert('Service created');
          } else {
            alert((await res.json()).error ?? 'Create failed');
          }
        }}
      />

      <ListTable
        rows={rows}
        columns={[
          { key: 'servicesNo', label: 'Service No', sortable: true, sortKey: 'servicesNo' },
          { key: 'servicesName', label: 'Service Name', sortable: true, sortKey: 'servicesName' },
          { key: 'status', label: 'Status', sortable: true, sortKey: 'status' },
        ]}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onHeaderSort={(k) => onHeaderSort(k as any)}
        onEdit={(row) => setEditRow(row)}
        onDelete={async (id) => {
          const ok = confirm(`Delete service ${id}?`);
          if (!ok) return;
          const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
          if (res.ok) await load(meta.page, meta.pageSize);
          else alert((await res.json()).error ?? 'Delete failed');
        }}
      />

      <Pagination
        page={meta.page}
        pageSize={meta.pageSize}
        total={meta.total}
        totalPages={meta.totalPages}
        onPageChange={(p) => load(p, meta.pageSize)}
        onPageSizeChange={(ps) => load(1, ps)}
      />

      {editRow && (
        <EditModal
          title={`Edit Service – ${editRow.servicesNo}`}
          fields={[
            { label: 'Service Name', key: 'servicesName', type: 'text', value: editRow.servicesName },
            { label: 'Status', key: 'status', type: 'select', value: editRow.status, options: ['active','inactive'] },
          ]}
          onClose={() => setEditRow(null)}
          onSubmit={async (values) => {
            const res = await fetch(`/api/admin/services/${editRow.servicesNo}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            });
            if (res.ok) {
              setEditRow(null);
              await load(meta.page, meta.pageSize);
            } else {
              alert((await res.json()).error ?? 'Update failed');
            }
          }}
        />
      )}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Packages Pane
   ────────────────────────────────────────────────────────────── */
function PackagesPane() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [serviceNo, setServiceNo] = useState('');
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState<PageMeta>({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [sortBy, setSortBy] = useState<'packageNo' | 'servicesNo' | 'amount' | 'status'>('packageNo');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [form, setForm] = useState({
    packageNo: '',
    servicesNo: '',
    description: '',
    amount: 0,
    status: 'active' as Status,
  });

  const [editRow, setEditRow] = useState<any | null>(null);

  async function load(page = meta.page, pageSize = meta.pageSize) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status) params.set('status', status);
    if (serviceNo) params.set('service', serviceNo);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    const res = await fetch(`/api/admin/packages?${params.toString()}`, { cache: 'no-store' });
    const json = await res.json();
    setRows(json.data || []);
    setMeta({ page: json.page, pageSize: json.pageSize, total: json.total, totalPages: json.totalPages });
  }
  useEffect(() => { load(1, meta.pageSize); // initial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { load(1, meta.pageSize); // refetch on sort
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  function onHeaderSort(col: typeof sortBy) {
    if (sortBy === col) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortOrder('asc'); }
  }

  return (
    <section>
      <Controls q={q} setQ={setQ} status={status} setStatus={setStatus} onSearch={() => load(1, meta.pageSize)}>
        <input
          placeholder="Filter by Service No"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={serviceNo}
          onChange={(e) => setServiceNo(e.target.value)}
        />
      </Controls>

      <CreateCard
        title="Create Package"
        fields={[
          { label: 'Package No', value: form.packageNo, onChange: (v) => setForm({ ...form, packageNo: v }) },
          { label: 'Service No', value: form.servicesNo, onChange: (v) => setForm({ ...form, servicesNo: v }) },
          { label: 'Description', value: form.description, onChange: (v) => setForm({ ...form, description: v }) },
          { label: 'Amount (IDR)', value: String(form.amount), onChange: (v) => setForm({ ...form, amount: Number(v) }) },
          { label: 'Status', value: form.status, onChange: (v) => setForm({ ...form, status: v as Status }), options: ['active','inactive'] },
        ]}
        onSubmit={async () => {
          const res = await fetch('/api/admin/packages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          });
          if (res.ok) {
            setForm({ packageNo: '', servicesNo: '', description: '', amount: 0, status: 'active' });
            await load(1, meta.pageSize);
            alert('Package created');
          } else {
            alert((await res.json()).error ?? 'Create failed');
          }
        }}
      />

      <ListTable
        rows={rows}
        columns={[
          { key: 'packageNo', label: 'Package No', sortable: true, sortKey: 'packageNo' },
          { key: 'servicesNo', label: 'Service No', sortable: true, sortKey: 'servicesNo' },
          { key: 'description', label: 'Description' },
          { key: 'amount', label: 'Amount', sortable: true, sortKey: 'amount', format: (v) => formatIDR(v) },
          { key: 'status', label: 'Status', sortable: true, sortKey: 'status' },
        ]}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onHeaderSort={(k) => onHeaderSort(k as any)}
        onEdit={(row) => setEditRow(row)}
        onDelete={async (id) => {
          const ok = confirm(`Delete package ${id}?`);
          if (!ok) return;
          const res = await fetch(`/api/admin/packages/${id}`, { method: 'DELETE' });
          if (res.ok) await load(meta.page, meta.pageSize);
          else alert((await res.json()).error ?? 'Delete failed');
        }}
      />

      <Pagination
        page={meta.page}
        pageSize={meta.pageSize}
        total={meta.total}
        totalPages={meta.totalPages}
        onPageChange={(p) => load(p, meta.pageSize)}
        onPageSizeChange={(ps) => load(1, ps)}
      />

      {editRow && (
        <EditModal
          title={`Edit Package – ${editRow.packageNo}`}
          fields={[
            { label: 'Service No', key: 'servicesNo', type: 'text', value: editRow.servicesNo },
            { label: 'Description', key: 'description', type: 'text', value: editRow.description ?? '' },
            { label: 'Amount (IDR)', key: 'amount', type: 'number', value: String(editRow.amount ?? 0) },
            { label: 'Status', key: 'status', type: 'select', value: editRow.status, options: ['active','inactive'] },
          ]}
          onClose={() => setEditRow(null)}
          onSubmit={async (values) => {
            // coerce amount to number
            if ('amount' in values) values.amount = Number(values.amount);
            const res = await fetch(`/api/admin/packages/${editRow.packageNo}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            });
            if (res.ok) {
              setEditRow(null);
              await load(meta.page, meta.pageSize);
            } else {
              alert((await res.json()).error ?? 'Update failed');
            }
          }}
        />
      )}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Bundles Pane
   ────────────────────────────────────────────────────────────── */
function BundlesPane() {
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<Status | ''>('');
  const [rows, setRows] = useState<any[]>([]);
  const [meta, setMeta] = useState<PageMeta>({ page: 1, pageSize: 10, total: 0, totalPages: 0 });
  const [sortBy, setSortBy] = useState<'bundleId' | 'bundleName' | 'amount' | 'status'>('bundleName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const [form, setForm] = useState({
    bundleId: '',
    bundleName: '',
    description: '',
    amount: '' as number | '' | null,
    status: 'active' as Status,
  });

  const [editRow, setEditRow] = useState<any | null>(null);

  async function load(page = meta.page, pageSize = meta.pageSize) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (status) params.set('status', status);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    const res = await fetch(`/api/admin/bundles?${params.toString()}`, { cache: 'no-store' });
    const json = await res.json();
    setRows(json.data || []);
    setMeta({ page: json.page, pageSize: json.pageSize, total: json.total, totalPages: json.totalPages });
  }
  useEffect(() => { load(1, meta.pageSize); // initial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { load(1, meta.pageSize); // refetch on sort
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, sortOrder]);

  function onHeaderSort(col: typeof sortBy) {
    if (sortBy === col) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(col); setSortOrder('asc'); }
  }

  return (
    <section>
      <Controls q={q} setQ={setQ} status={status} setStatus={setStatus} onSearch={() => load(1, meta.pageSize)} />

      <CreateCard
        title="Create Bundle"
        fields={[
          { label: 'Bundle ID', value: form.bundleId, onChange: (v) => setForm({ ...form, bundleId: v }) },
          { label: 'Bundle Name', value: form.bundleName, onChange: (v) => setForm({ ...form, bundleName: v }) },
          { label: 'Description', value: form.description, onChange: (v) => setForm({ ...form, description: v }) },
          { label: 'Amount (IDR, optional)', value: String(form.amount ?? ''), onChange: (v) => setForm({ ...form, amount: v ? Number(v) : null }) },
          { label: 'Status', value: form.status, onChange: (v) => setForm({ ...form, status: v as Status }), options: ['active','inactive'] },
        ]}
        onSubmit={async () => {
          const payload = { ...form };
          const res = await fetch('/api/admin/bundles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            setForm({ bundleId: '', bundleName: '', description: '', amount: null, status: 'active' });
            await load(1, meta.pageSize);
            alert('Bundle created');
          } else {
            alert((await res.json()).error ?? 'Create failed');
          }
        }}
      />

      <ListTable
        rows={rows}
        columns={[
          { key: 'bundleId', label: 'Bundle ID', sortable: true, sortKey: 'bundleId' },
          { key: 'bundleName', label: 'Bundle Name', sortable: true, sortKey: 'bundleName' },
          { key: 'description', label: 'Description' },
          { key: 'amount', label: 'Amount', sortable: true, sortKey: 'amount', format: (v) => v == null ? '—' : formatIDR(v) },
          { key: 'status', label: 'Status', sortable: true, sortKey: 'status' },
        ]}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onHeaderSort={(k) => onHeaderSort(k as any)}
        onEdit={(row) => setEditRow(row)}
        onDelete={async (id) => {
          const ok = confirm(`Delete bundle ${id}?`);
          if (!ok) return;
          const res = await fetch(`/api/admin/bundles/${id}`, { method: 'DELETE' });
          if (res.ok) await load(meta.page, meta.pageSize);
          else alert((await res.json()).error ?? 'Delete failed');
        }}
      />

      <Pagination
        page={meta.page}
        pageSize={meta.pageSize}
        total={meta.total}
        totalPages={meta.totalPages}
        onPageChange={(p) => load(p, meta.pageSize)}
        onPageSizeChange={(ps) => load(1, ps)}
      />

      {editRow && (
        <EditModal
          title={`Edit Bundle – ${editRow.bundleId}`}
          fields={[
            { label: 'Bundle Name', key: 'bundleName', type: 'text', value: editRow.bundleName },
            { label: 'Description', key: 'description', type: 'text', value: editRow.description ?? '' },
            { label: 'Amount (IDR, optional)', key: 'amount', type: 'number', value: editRow.amount == null ? '' : String(editRow.amount) },
            { label: 'Status', key: 'status', type: 'select', value: editRow.status, options: ['active','inactive'] },
          ]}
          onClose={() => setEditRow(null)}
          onSubmit={async (values) => {
            if ('amount' in values) {
              const v = values.amount;
              values.amount = v === '' ? null : Number(v);
            }
            const res = await fetch(`/api/admin/bundles/${editRow.bundleId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            });
            if (res.ok) {
              setEditRow(null);
              await load(meta.page, meta.pageSize);
            } else {
              alert((await res.json()).error ?? 'Update failed');
            }
          }}
        />
      )}
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────
   Shared UI: Controls, CreateCard, ListTable, Pagination, EditModal
   ────────────────────────────────────────────────────────────── */

function Controls({
  q, setQ, status, setStatus, onSearch, children,
}: {
  q: string; setQ: (v: string) => void;
  status: Status | ''; setStatus: (v: Status | '') => void;
  onSearch: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <input
          placeholder="Search…"
          className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as Status | '')}
        >
          <option value="">All statuses</option>
          <option value="active">active</option>
          <option value="inactive">inactive</option>
        </select>
        <button
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white"
          onClick={onSearch}
        >
          Search
        </button>
      </div>
      {children}
    </div>
  );
}

function CreateCard({
  title,
  fields,
  onSubmit,
}: {
  title: string;
  fields: Array<{ label: string; value: string; onChange: (v: string) => void; options?: string[] }>;
  onSubmit: () => Promise<void> | void;
}) {
  return (
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f, i) =>
          f.options ? (
            <label key={i} className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">{f.label}</span>
              <select
                className="rounded-md border border-gray-300 px-3 py-2"
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
              >
                {f.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </label>
          ) : (
            <label key={i} className="flex flex-col gap-1 text-sm">
              <span className="text-gray-600">{f.label}</span>
              <input
                className="rounded-md border border-gray-300 px-3 py-2"
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
              />
            </label>
          )
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          onClick={() => onSubmit()}
        >
          Create
        </button>
      </div>
    </div>
  );
}

function ListTable({
  rows,
  columns,
  sortBy,
  sortOrder,
  onHeaderSort,
  onEdit,
  onDelete,
}: {
  rows: any[];
  columns: Array<{ key: string; label: string; format?: (v: any) => string; sortable?: boolean; sortKey?: string }>;
  sortBy: string;
  sortOrder: SortOrder;
  onHeaderSort: (sortKey: string) => void;
  onEdit: (row: any) => void;
  onDelete: (id: string) => Promise<void> | void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => {
              const active = c.sortable && c.sortKey === sortBy;
              return (
                <th
                  key={c.key}
                  className={`px-3 py-2 text-left font-medium ${c.sortable ? 'cursor-pointer select-none' : ''} ${active ? 'text-indigo-700' : 'text-gray-700'}`}
                  onClick={() => c.sortable && c.sortKey && onHeaderSort(c.sortKey)}
                >
                  <span className="inline-flex items-center gap-1">
                    {c.label}
                    {c.sortable && (
                      <span className="text-xs">
                        {active ? (sortOrder === 'asc' ? '▲' : '▼') : '↕'}
                      </span>
                    )}
                  </span>
                </th>
              );
            })}
            <th className="px-3 py-2 text-right font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={columns.map(c=>r[c.key]).join('|')} className="border-t">
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-2">
                  {c.format ? c.format(r[c.key]) : String(r[c.key] ?? '')}
                </td>
              ))}
              <td className="px-3 py-2 text-right">
                <div className="inline-flex gap-2">
                  <button
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50"
                    onClick={() => onEdit(r)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50"
                    onClick={() => onDelete(String(r[columns[0].key]))}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td className="px-3 py-6 text-center text-gray-500" colSpan={columns.length + 1}>
                No data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Pagination({
  page, pageSize, total, totalPages,
  onPageChange, onPageSizeChange,
}: {
  page: number; pageSize: number; total: number; totalPages: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (ps: number) => void;
}) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
      <div className="text-sm text-gray-600">
        Showing page <strong>{page}</strong> of <strong>{totalPages || 1}</strong> · Total: <strong>{total}</strong>
      </div>
      <div className="flex items-center gap-2">
        <select
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {[5,10,20,50,100].map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
        <button
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev}
        >
          Prev
        </button>
        <button
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function EditModal({
  title,
  fields,
  onClose,
  onSubmit,
}: {
  title: string;
  fields: Array<{ label: string; key: string; type: 'text'|'number'|'select'; value: string; options?: string[] }>;
  onClose: () => void;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
}) {
  const [values, setValues] = useState<Record<string, any>>(
    Object.fromEntries(fields.map((f) => [f.key, f.value])),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-t-xl bg-white shadow-2xl sm:rounded-xl">
        <div className="flex items-center justify-between border-b p-3 sm:p-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="p-4">
          <div className="grid gap-3">
            {fields.map((f) => (
              <label key={f.key} className="flex flex-col gap-1 text-sm">
                <span className="text-gray-600">{f.label}</span>
                {f.type === 'select' ? (
                  <select
                    className="rounded-md border border-gray-300 px-3 py-2"
                    value={values[f.key]}
                    onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  >
                    {f.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : (
                  <input
                    className="rounded-md border border-gray-300 px-3 py-2"
                    type={f.type === 'number' ? 'number' : 'text'}
                    value={values[f.key]}
                    onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                  />
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t p-3 sm:p-4">
          <button
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            onClick={async () => { await onSubmit(values); }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}