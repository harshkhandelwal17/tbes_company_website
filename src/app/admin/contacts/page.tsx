'use client';

import { useState, useEffect } from 'react';
import { 
  Mail, Phone, Calendar, Search, Trash2, 
  Filter, CheckCircle2, User, Building2, 
  MessageSquare, Clock, ArrowRight, X, Copy, Inbox
} from 'lucide-react';

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
  
  // Drawer State
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts');
      const data = await res.json();
      if (Array.isArray(data)) setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setContacts(prev => prev.filter(c => c._id !== id));
        if (selectedContact?._id === id) closeDrawer();
      }
    } catch (error) {
      alert('Error deleting contact');
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      // Optimistic Update
      setContacts(prev => prev.map(c => c._id === id ? { ...c, status: newStatus as any } : c));
      if (selectedContact) setSelectedContact({ ...selectedContact, status: newStatus as any });

      await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openDrawer = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDrawerOpen(true);
    // Auto-mark as read if new
    if (contact.status === 'New') {
      updateStatus(contact._id, 'Read');
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedContact(null), 300); // Wait for animation
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
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen w-full  text-white overflow-x-hidden pb-20">
      
      {/* =======================
          1. HEADER & STATS
      ======================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Inquiries</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage incoming messages and client requests.</p>
        </div>
        
        {/* Quick Stats in Header */}
        <div className="flex gap-3">
           <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex flex-col items-center">
              <span className="text-xs text-blue-400 font-bold uppercase">New</span>
              <span className="text-lg font-bold text-white">{contacts.filter(c => c.status === 'New').length}</span>
           </div>
           <div className="px-4 py-2 bg-zinc-800/50 border border-white/10 rounded-xl flex flex-col items-center">
              <span className="text-xs text-zinc-400 font-bold uppercase">Total</span>
              <span className="text-lg font-bold text-white">{contacts.length}</span>
           </div>
        </div>
      </div>

      {/* =======================
          2. FILTERS & SEARCH
      ======================== */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative group flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name, email, subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-[#09090b] border border-white/[0.08] rounded-xl pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#09090b] p-1 rounded-xl border border-white/[0.08] h-12 items-center">
          {['All', 'New', 'Replied'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-xs font-bold transition-all h-full flex items-center justify-center ${
                statusFilter === filter 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* =======================
          3. MESSAGES GRID
      ======================== */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 bg-zinc-900 rounded-2xl animate-pulse"></div>)}
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4">
             <Inbox size={32} className="text-zinc-600" />
          </div>
          <p className="text-zinc-500">No inquiries found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map(contact => (
            <div 
              key={contact._id} 
              onClick={() => openDrawer(contact)}
              className={`group relative bg-[#09090b] border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                contact.status === 'New' 
                  ? 'border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                  : 'border-white/[0.08] hover:border-white/[0.2]'
              }`}
            >
              {/* Status Dot */}
              {contact.status === 'New' && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
              )}

              <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${contact.status === 'New' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                       {contact.name.charAt(0)}
                    </div>
                    <div>
                       <h3 className={`text-sm font-bold truncate max-w-[150px] ${contact.status === 'New' ? 'text-white' : 'text-zinc-300'}`}>
                          {contact.name}
                       </h3>
                       <p className="text-xs text-zinc-500">{formatDate(contact.createdAt)}</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-2 mb-4">
                 <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-medium text-zinc-400">
                    {contact.serviceInterest}
                 </div>
                 <p className="text-sm font-medium text-white truncate">{contact.subject}</p>
                 <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {contact.message}
                 </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.08] text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                 <span className="flex items-center gap-1"><Mail size={12}/> {contact.email.split('@')[0]}...</span>
                 <span className="flex items-center gap-1 group-hover:text-blue-400 transition-colors">View Details <ArrowRight size={12}/></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =======================
          4. DETAIL DRAWER (Slide-Over)
      ======================== */}
      {isDrawerOpen && selectedContact && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" 
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <div className="relative w-full md:max-w-lg bg-[#0c0c0e] h-full shadow-2xl border-l border-white/10 animate-in slide-in-from-right duration-300 flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#0c0c0e] z-10">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                       selectedContact.status === 'New' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 
                       selectedContact.status === 'Replied' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 
                       'border-zinc-700 text-zinc-400 bg-zinc-800'
                    }`}>
                       {selectedContact.status}
                    </span>
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                       <Clock size={12}/> {new Date(selectedContact.createdAt).toLocaleString()}
                    </span>
                 </div>
                 <h2 className="text-lg font-bold text-white leading-tight mt-2">{selectedContact.subject}</h2>
              </div>
              <button onClick={closeDrawer} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
               
               {/* Sender Info Card */}
               <div className="bg-[#09090b] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                  <div className="flex items-center gap-4 border-b border-white/[0.08] pb-4">
                     <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                        {selectedContact.name.charAt(0)}
                     </div>
                     <div>
                        <h3 className="text-white font-bold">{selectedContact.name}</h3>
                        <p className="text-xs text-zinc-500">Service: <span className="text-blue-400">{selectedContact.serviceInterest}</span></p>
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors group">
                        <div className="flex items-center gap-3">
                           <Mail size={16} className="text-zinc-500"/>
                           <span className="text-sm text-zinc-300">{selectedContact.email}</span>
                        </div>
                        <button className="text-zinc-600 group-hover:text-white transition-colors" title="Copy Email">
                           <Copy size={14}/>
                        </button>
                     </div>
                     
                     <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                        <div className="flex items-center gap-3">
                           <Phone size={16} className="text-zinc-500"/>
                           <span className="text-sm text-zinc-300">{selectedContact.phone || 'No phone provided'}</span>
                        </div>
                     </div>

                     <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                        <div className="flex items-center gap-3">
                           <Building2 size={16} className="text-zinc-500"/>
                           <span className="text-sm text-zinc-300">{selectedContact.company || 'No company provided'}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Message Body */}
               <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Message Body</label>
                  <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-zinc-300 text-sm leading-7 whitespace-pre-wrap">
                     {selectedContact.message}
                  </div>
               </div>

            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 bg-[#0c0c0e] sticky bottom-0 z-10 space-y-4">
               
               {/* Status Changer */}
               <div className="flex items-center justify-between bg-[#09090b] border border-white/[0.08] p-1 rounded-xl">
                  {['New', 'Read', 'Replied'].map((status) => (
                     <button
                        key={status}
                        onClick={() => updateStatus(selectedContact._id, status)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                           selectedContact.status === status 
                              ? 'bg-white/10 text-white shadow-sm' 
                              : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                     >
                        {status}
                     </button>
                  ))}
               </div>

               <div className="flex gap-3">
                  <a 
                     href={`mailto:${selectedContact.email}`} 
                     className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                  >
                     <Mail size={16} /> Reply via Email
                  </a>
                  <button 
                     onClick={() => handleDelete(selectedContact._id)} 
                     className="px-4 py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors active:scale-[0.98]"
                  >
                     <Trash2 size={18} />
                  </button>
               </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}