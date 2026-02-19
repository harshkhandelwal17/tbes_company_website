'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, X, Plus } from 'lucide-react';

interface Service {
    _id?: string;
    slug: string;
    title: string;
    icon: string;
    description: string;
    details: string[];
    software: string[];
    image: string;
    color: string;
    outcome: string;
    order: number;
    active: boolean;
}

const COLORS = ['blue', 'indigo', 'orange', 'yellow', 'cyan', 'red', 'emerald', 'slate', 'purple', 'pink', 'teal', 'zinc'];

export default function AdminServiceForm({ serviceId }: { serviceId?: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<Service>({
        slug: '',
        title: '',
        icon: 'Box',
        description: '',
        details: [],
        software: [],
        image: '',
        color: 'blue',
        outcome: 'Enhanced Efficiency',
        order: 0,
        active: true,
    });

    // Fetch if editing
    useEffect(() => {
        if (serviceId) {
            setLoading(true);
            fetch(`/api/services/${serviceId}`)
                .then((res) => res.json())
                .then((data) => {
                    setForm(data);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [serviceId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = serviceId ? `/api/services/${serviceId}` : '/api/services';
            const method = serviceId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                router.push('/admin/services');
                router.refresh();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleArrayChange = (
        field: 'details' | 'software',
        index: number,
        value: string
    ) => {
        const newArray = [...form[field]];
        newArray[index] = value;
        setForm({ ...form, [field]: newArray });
    };

    const addArrayItem = (field: 'details' | 'software') => {
        setForm({ ...form, [field]: [...form[field], ''] });
    };

    const removeArrayItem = (field: 'details' | 'software', index: number) => {
        const newArray = [...form[field]];
        newArray.splice(index, 1);
        setForm({ ...form, [field]: newArray });
    };

    if (loading && serviceId && !form._id) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="e.g. Architectural Services"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Slug (URL)</label>
                    <input
                        type="text"
                        required
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                        placeholder="e.g. architectural-services"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Icon (Lucide Name)</label>
                    <input
                        type="text"
                        required
                        value={form.icon}
                        onChange={(e) => setForm({ ...form, icon: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
                    <input
                        type="text"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Outcome Text</label>
                    <input
                        type="text"
                        value={form.outcome}
                        onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="e.g. Enhanced Efficiency"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Display Order</label>
                    <input
                        type="number"
                        value={form.order}
                        onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Dynamic Arrays: Details */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Key Details (Bullet Points)</label>
                {form.details.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayChange('details', idx, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={() => removeArrayItem('details', idx)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('details')}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                    <Plus size={16} /> Add Detail
                </button>
            </div>

            {/* Dynamic Arrays: Software */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Software Stack</label>
                {form.software.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayChange('software', idx, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={() => removeArrayItem('software', idx)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                            <X size={20} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem('software')}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                    <Plus size={16} /> Add Software
                </button>
            </div>

            {/* Color Selection */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Theme Color</label>
                <div className="flex flex-wrap gap-3">
                    {COLORS.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => setForm({ ...form, color })}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                                }`}
                            style={{ backgroundColor: `var(--color-${color}-500, ${color})` }}
                            title={color}
                        />
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Selected: {form.color}</p>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-3 rounded-lg border border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    Save Service
                </button>
            </div>
        </form>
    );
}
