'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Plus, Eye } from 'lucide-react';

interface ServicePackage {
  id: string;
  serviceName: string;
  packageName: string;
  description: string;
  amount: number;
}

interface FormData {
  isExistingCustomer: boolean;
  existingCustomerId?: string;
  existingCustomerName?: string;
  fullName: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  eventName: string;
  venueName: string;
  venueAddress: string;
  eventDate: string;
  selectedServiceName: string;
  selectedPackageName: string;
}

interface SummaryItem extends ServicePackage {
  remarks: string;
}

interface StoredEvent {
  id: string;
  createdAt: string;
  status: 'draft' | 'confirmed' | 'completed';
  formData: FormData;
  summaryItems: SummaryItem[];
}

export default function EventsList() {
  const router = useRouter();
  const [events, setEvents] = useState<StoredEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    try {
      const storedEvents = localStorage.getItem('events');
      const parsedEvents: StoredEvent[] = storedEvents ? JSON.parse(storedEvents) : [];
      setEvents(parsedEvents.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (eventId: string) => {
    router.push(`/admin/create-event?id=${eventId}`);
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter((e) => e.id !== eventId);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
    }
  };

  const handleCreateNew = () => {
    router.push('/admin/create-event');
  };

  const filteredEvents = filterStatus === 'all' ? events : events.filter((e) => e.status === filterStatus);

  const getTotalAmount = (items: SummaryItem[]) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Events Management</h1>
            <p className="text-slate-600">Manage all your events in one place</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            <Plus size={20} />
            Create New Event
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {(['all', 'draft', 'confirmed', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Events Table */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-12 text-center">
            <p className="text-slate-600 mb-4">No events found</p>
            <button
              onClick={handleCreateNew}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Event
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="text-left px-6 py-4 font-semibold text-slate-700">Event Name</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700">Customer</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700">Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-slate-700">Venue</th>
                  <th className="text-right px-6 py-4 font-semibold text-slate-700">Total Amount</th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-700">Status</th>
                  <th className="text-center px-6 py-4 font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{event.formData.eventName}</p>
                      <p className="text-sm text-slate-600">ID: {event.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-800">{event.formData.fullName}</p>
                      <p className="text-sm text-slate-600">{event.formData.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-800">
                      {new Date(event.formData.eventDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-slate-800 max-w-xs truncate">
                      {event.formData.venueName || '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-blue-600">
                      Rp {getTotalAmount(event.summaryItems).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(event.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit event"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete event"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Stats */}
        {events.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <p className="text-slate-600 text-sm font-semibold mb-2">Total Events</p>
              <p className="text-3xl font-bold text-slate-800">{events.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <p className="text-slate-600 text-sm font-semibold mb-2">Draft</p>
              <p className="text-3xl font-bold text-yellow-600">{events.filter((e) => e.status === 'draft').length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <p className="text-slate-600 text-sm font-semibold mb-2">Confirmed</p>
              <p className="text-3xl font-bold text-blue-600">{events.filter((e) => e.status === 'confirmed').length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <p className="text-slate-600 text-sm font-semibold mb-2">Completed</p>
              <p className="text-3xl font-bold text-green-600">{events.filter((e) => e.status === 'completed').length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
