"use client";
import { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';

interface ServicePackage {
  id: string;
  name: string;
  description: string;
  amount: number;
}

interface Service {
  id: string;
  name: string;
  packages: ServicePackage[];
}

interface ServicePackageForSummary {
  id: string;
  serviceName: string;
  packageName: string;
  description: string;
  amount: number;
}

interface FormData {
  // Customer Detail
  isExistingCustomer: boolean;
  existingCustomerId?: string;
  existingCustomerName?: string;
  fullName: string;
  dob: string;
  gender: string;
  address: string;
  phone: string;
  email: string;

  // Event Detail
  eventName: string;
  venueName: string;
  venueAddress: string;
  eventDate: string;

  // Packages
  selectedServiceName: string; // actually holds service id
  selectedPackageName: string; // actually holds package id
}

interface SummaryItem extends ServicePackageForSummary {
  remarks: string;
}

interface StoredEvent {
  id: string;
  createdAt: string;
  status: 'draft' | 'confirmed' | 'completed';
  formData: FormData;
  summaryItems: SummaryItem[];
}

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Photography',
    packages: [
      {
        id: 'p1',
        name: 'Basic',
        description: 'Professional photography coverage for 4 hours',
        amount: 3000000,
      },
      {
        id: 'p2',
        name: 'Premium',
        description: 'Professional photography coverage for 8 hours with album',
        amount: 5000000,
      },
    ],
  },
  {
    id: '2',
    name: 'Catering',
    packages: [
      {
        id: 'p3',
        name: 'Standard',
        description: 'Full menu for 100 guests',
        amount: 2000000,
      },
      {
        id: 'p4',
        name: 'Deluxe',
        description: 'Premium menu for 100 guests with beverages',
        amount: 3500000,
      },
    ],
  },
];

const mockCustomers = [
  {
    id: '1',
    name: 'John Doe',
    phone: '08123456789',
    email: 'john@example.com',
    dob: '1990-01-15',
    gender: 'Male',
    address: '123 Main Street',
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '08198765432',
    email: 'jane@example.com',
    dob: '1992-05-20',
    gender: 'Female',
    address: '456 Oak Avenue',
  },
];

export default function EventForm({ eventId }: { eventId?: string }) {
  const [formData, setFormData] = useState<FormData>({
    isExistingCustomer: false,
    fullName: '',
    dob: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    eventName: '',
    venueName: '',
    venueAddress: '',
    eventDate: '',
    selectedServiceName: '',
    selectedPackageName: '',
  });

  const [packageRemarks, setPackageRemarks] = useState('');
  const [summaryItems, setSummaryItems] = useState<SummaryItem[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(!!eventId);
  const [isEditMode, setIsEditMode] = useState(!!eventId);
  const [loadError, setLoadError] = useState('');

  // Load existing event if eventId is provided
  useEffect(() => {
    if (eventId) {
      loadEvent(eventId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const loadEvent = async (id: string) => {
    try {
      setIsLoading(true);
      setLoadError('');
      // Retrieve from localStorage (in production, this would be an API call)
      const storedEvents = localStorage.getItem('events');
      const events: StoredEvent[] = storedEvents ? JSON.parse(storedEvents) : [];
      const event = events.find((e) => e.id === id);
      if (!event) {
        setLoadError('Event not found');
        return;
      }
      setFormData(event.formData);
      setSummaryItems(event.summaryItems);
      setIsEditMode(true);
    } catch (error) {
      setLoadError('Failed to load event');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveToLocalStorage = (event: StoredEvent) => {
    const storedEvents = localStorage.getItem('events');
    const events: StoredEvent[] = storedEvents ? JSON.parse(storedEvents) : [];
    const existingIndex = events.findIndex((e) => e.id === event.id);
    if (existingIndex >= 0) {
      events[existingIndex] = event;
    } else {
      events.push(event);
    }
    localStorage.setItem('events', JSON.stringify(events));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPackage = () => {
    if (!formData.selectedServiceName || !formData.selectedPackageName) {
      alert('Please select both service and package');
      return;
    }
    const service = mockServices.find((s) => s.id === formData.selectedServiceName);
    const pkg = service?.packages.find((p) => p.id === formData.selectedPackageName);
    if (!pkg || !service) return;

    const newItem: SummaryItem = {
      id: Date.now().toString(),
      serviceName: service.name,
      packageName: pkg.name,
      description: pkg.description,
      amount: pkg.amount,
      remarks: packageRemarks,
    };

    setSummaryItems((prev) => [...prev, newItem]);
    setFormData((prev) => ({
      ...prev,
      selectedServiceName: '',
      selectedPackageName: '',
    }));
    setPackageRemarks('');
  };

  const handleRemoveItem = (id: string) => {
    setSummaryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCustomerSelect = (customer: (typeof mockCustomers)[0]) => {
    setFormData((prev) => ({
      ...prev,
      fullName: customer.name,
      phone: customer.phone,
      email: customer.email,
      dob: customer.dob,
      gender: customer.gender,
      address: customer.address,
      existingCustomerId: customer.id,
      existingCustomerName: customer.name,
    }));
    setShowSearch(false);
    setSearchTerm('');
  };

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClear = () => {
    setFormData({
      isExistingCustomer: false,
      fullName: '',
      dob: '',
      gender: '',
      address: '',
      phone: '',
      email: '',
      eventName: '',
      venueName: '',
      venueAddress: '',
      eventDate: '',
      selectedServiceName: '',
      selectedPackageName: '',
    });
    setSummaryItems([]);
    setPackageRemarks('');
    setSubmitSuccess(false);
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.eventName || summaryItems.length === 0) {
      alert('Please fill all required fields and add at least one package');
      return;
    }

    setSubmitting(true);
    setSubmitProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setSubmitProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 30;
      });
    }, 300);

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      setSubmitProgress(100);

      // Create or update event
      const newEventId = isEditMode && eventId ? eventId : `event-${Date.now()}`;
      const event: StoredEvent = {
        id: newEventId,
        createdAt: new Date().toISOString(),
        status: 'draft',
        formData,
        summaryItems,
      };

      saveToLocalStorage(event);
      setSubmitting(false);
      setSubmitSuccess(true);

      // Auto reset after 3 seconds
      setTimeout(() => {
        handleClear();
      }, 3000);
    }, 2000);
  };

  const totalAmount = summaryItems.reduce((sum, item) => sum + item.amount, 0);

  const getSelectedService = () =>
    mockServices.find((s) => s.id === formData.selectedServiceName);

  const getSelectedPackage = () =>
    getSelectedService()?.packages.find((p) => p.id === formData.selectedPackageName);

  // Render branches
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Loading event...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold text-lg mb-2">{loadError}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {isEditMode ? 'Event Updated Successfully!' : 'Event Created Successfully!'}
          </h2>
          <p className="text-slate-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              {isEditMode ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-slate-600">
              {isEditMode ? 'Update the event details below' : 'Fill in the details below to create a new event'}
            </p>
          </div>
          {isEditMode && (
            <div className="px-4 py-2 bg-blue-100 rounded-lg">
              <p className="text-sm text-blue-600 font-semibold">Edit Mode</p>
            </div>
          )}
        </div>

        <form className="space-y-8">
          {/* Customer Detail Section */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Customer Detail</h2>
            </div>

            {/* Existing Customer Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Existing Customer?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="isExistingCustomer"
                    value="false"
                    checked={!formData.isExistingCustomer}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isExistingCustomer: false,
                      }))
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-slate-700">No</span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="isExistingCustomer"
                    value="true"
                    checked={formData.isExistingCustomer}
                    onChange={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isExistingCustomer: true,
                      }))
                    }
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-slate-700">Yes</span>
                </label>
              </div>
            </div>

            {formData.isExistingCustomer ? (
              // Existing Customer Search
              <div className="mb-6 relative">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Search Customer
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, phone, or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setShowSearch(true)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {showSearch && searchTerm && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-slate-300 rounded-lg mt-1 shadow-lg z-10">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <button
                            key={customer.id}
                            type="button"
                            onClick={() => handleCustomerSelect(customer)}
                            className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-slate-100 last:border-b-0"
                          >
                            <div className="font-semibold text-slate-800">{customer.name}</div>
                            <div className="text-sm text-slate-600">{customer.phone} • {customer.email}</div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-slate-600">No customers found</div>
                      )}
                    </div>
                  )}
                </div>
                {formData.existingCustomerName && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Selected: {formData.existingCustomerName}
                  </p>
                )}
              </div>
            ) : (
              // New Customer Fields
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="08xx xxxx xxxx"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter full address"
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Event Detail Section */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Event Detail</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Event Name *
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  placeholder="e.g., Wedding Reception"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  name="venueName"
                  value={formData.venueName}
                  onChange={handleInputChange}
                  placeholder="e.g., Grand Ballroom"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Venue Address
                </label>
                <input
                  type="text"
                  name="venueAddress"
                  value={formData.venueAddress}
                  onChange={handleInputChange}
                  placeholder="Enter venue address"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Service/Package Detail Section */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-amber-600 font-bold">3</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Service/Package Detail</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Service Name *
                </label>
                <select
                  name="selectedServiceName"
                  value={formData.selectedServiceName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select service</option>
                  {mockServices.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Package Name *
                </label>
                <select
                  name="selectedPackageName"
                  value={formData.selectedPackageName}
                  onChange={handleInputChange}
                  disabled={!formData.selectedServiceName}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select package</option>
                  {getSelectedService()?.packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description and Amount Display */}
            {getSelectedPackage() && (
              <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="mb-3">
                  <label className="text-sm font-semibold text-slate-700 block mb-2">
                    Description (Read-only)
                  </label>
                  <p className="text-slate-700">{getSelectedPackage()?.description}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 block mb-2">
                    Amount (Read-only)
                  </label>
                  <p className="text-2xl font-bold text-blue-600">
                    Rp {(getSelectedPackage()?.amount ?? 0).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            )}

            {/* Remarks */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Remarks
              </label>
              <textarea
                value={packageRemarks}
                onChange={(e) => setPackageRemarks(e.target.value)}
                placeholder="Add any special notes or requirements..."
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddPackage}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mb-8"
            >
              <Plus size={20} />
              Add to Summary
            </button>

            {/* Summary Table */}
            {summaryItems.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Selected Packages</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300">
                        <th className="text-left px-4 py-3 font-semibold text-slate-700">Service</th>
                        <th className="text-left px-4 py-3 font-semibold text-slate-700">Package</th>
                        <th className="text-left px-4 py-3 font-semibold text-slate-700">Description</th>
                        <th className="text-right px-4 py-3 font-semibold text-slate-700">Amount</th>
                        <th className="text-left px-4 py-3 font-semibold text-slate-700">Remarks</th>
                        <th className="text-center px-4 py-3 font-semibold text-slate-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summaryItems.map((item) => (
                        <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-800">{item.serviceName}</td>
                          <td className="px-4 py-3 text-slate-800">{item.packageName}</td>
                          <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{item.description}</td>
                          <td className="px-4 py-3 text-right text-slate-800 font-semibold">
                            Rp {item.amount.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                            {item.remarks ?? '-'}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Total Amount */}
                <div className="mt-4 flex justify-end">
                  <div className="bg-blue-50 px-6 py-3 rounded-lg border border-blue-200">
                    <p className="text-slate-700 mb-1">Total Amount:</p>
                    <p className="text-3xl font-bold text-blue-600">Rp {totalAmount.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar - Only show during submission */}
          {submitting && (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
              <p className="text-slate-700 font-semibold mb-3">Processing your event...</p>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${submitProgress}%` }}
                />
              </div>
              <p className="text-right text-sm text-slate-600 mt-2">{Math.round(submitProgress)}%</p>
            </div>
          )}

          {/* Submit and Clear Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={handleClear}
              disabled={submitting}
              className="px-8 py-3 bg-slate-300 hover:bg-slate-400 text-slate-800 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditMode ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
