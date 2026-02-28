'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type MenuOption = 'createevent' | 'eventsList' | 'invoice' | 'receipt' | 'workorder';

const menuItems = [
  { id: 'master', label: 'Manage Masters', url: '/admin/masters' },
  { id: 'eventsList', label: 'Events List', url: '/admin/events' },
  { id: 'invoice', label: 'Invoice List', url: '/admin/invoice' },
  { id: 'receipt', label: 'Receipt List', url: '/admin/receipt' },
  { id: 'workorder', label: 'Workorder List', url: '/admin/workorder' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<MenuOption>('eventsList');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin token exists
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
    } else {
      setIsAuthorized(true);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const currentMenu = menuItems.find((item) => item.id === activeMenu);

  return (
    <div className="min-h-screen">
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 backdrop-blur shadow-lg border-r border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-8">Admin Panel</h1>

          <nav className="space-y-2 mb-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id as MenuOption)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeMenu === item.id
                    ? 'bg-brand text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-hidden">
          <div className="h-full rounded-2xl overflow-hidden shadow-lg bg-white/90 backdrop-blur border border-slate-200">
            {currentMenu && (
              <iframe
                src={currentMenu.url}
                title={currentMenu.label}
                className="w-full h-full border-none"
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
