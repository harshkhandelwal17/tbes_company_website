'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Search, Trash2, Eye, Filter, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    serviceInterest: string;
    subject: string;
    message: string;
    status: 'New' | 'Read' | 'Replied';
    createdAt: string;
}

export default function ContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch('/api/admin/contacts');
            const data = await res.json();
            if (Array.isArray(data)) {
                setContacts(data);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteContact = async (id: string) => {
        if (!confirm('Are you sure you want to delete this inquiry?')) return;

        try {
            const res = await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setContacts(contacts.filter(c => c._id !== id));
                if (selectedContact?._id === id) setSelectedContact(null);
            } else {
                alert('Failed to delete contact');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Error deleting contact');
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const res = await fetch('/api/admin/contacts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (res.ok) {
                setContacts(contacts.map(c =>
                    c._id === id ? { ...c, status: newStatus as any } : c
                ));
                if (selectedContact?._id === id) {
                    setSelectedContact(prev => prev ? { ...prev, status: newStatus as any } : null);
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.subject.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = statusFilter === 'All' || contact.status === statusFilter;

        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
                    <p className="text-gray-500 text-sm">Manage incoming contact requests</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                        <option value="All">All Status</option>
                        <option value="New">New</option>
                        <option value="Read">Read</option>
                        <option value="Replied">Replied</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Contact List */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[75vh]">
                    <div className="p-4 border-b bg-gray-50 font-medium text-gray-700 flex justify-between items-center">
                        <span>List ({filteredContacts.length})</span>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-2">
                        {filteredContacts.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">No inquiries found</div>
                        ) : (
                            filteredContacts.map(contact => (
                                <div
                                    key={contact._id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`p-4 rounded-lg cursor-pointer transition-all hover:bg-blue-50 border ${selectedContact?._id === contact._id ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300' : 'bg-white border-gray-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate pr-2">{contact.name}</h3>
                                        {contact.status === 'New' && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>}
                                    </div>
                                    <p className="text-sm text-gray-600 truncate mb-2">{contact.subject}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${contact.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                contact.status === 'Read' ? 'bg-gray-100 text-gray-700' :
                                                    'bg-green-100 text-green-700'
                                            }`}>
                                            {contact.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Contact Details */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 h-[75vh] flex flex-col">
                    {selectedContact ? (
                        <>
                            {/* Toolbar */}
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <select
                                        value={selectedContact.status}
                                        onChange={(e) => updateStatus(selectedContact._id, e.target.value)}
                                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="New">Mark as New</option>
                                        <option value="Read">Mark as Read</option>
                                        <option value="Replied">Mark as Replied</option>
                                    </select>
                                </div>
                                <button
                                    onClick={() => deleteContact(selectedContact._id)}
                                    className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                    title="Delete Inquiry"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedContact.subject}</h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(selectedContact.createdAt)}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">{selectedContact.serviceInterest}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">From</label>
                                        <div className="font-medium text-gray-900">{selectedContact.name}</div>
                                        <div className="text-sm text-blue-600 flex items-center gap-1">
                                            <Mail size={12} /> <a href={`mailto:${selectedContact.email}`} className="hover:underline">{selectedContact.email}</a>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company / Phone</label>
                                        <div className="font-medium text-gray-900">{selectedContact.company || 'N/A'}</div>
                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                            <Phone size={12} /> {selectedContact.phone ? <a href={`tel:${selectedContact.phone}`} className="hover:underline">{selectedContact.phone}</a> : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Message</label>
                                    <div className="prose max-w-none text-gray-800 bg-white p-6 rounded-xl border border-gray-100 shadow-sm leading-relaxed whitespace-pre-wrap">
                                        {selectedContact.message}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <Mail size={32} className="text-gray-300" />
                            </div>
                            <p>Select an inquiry to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
