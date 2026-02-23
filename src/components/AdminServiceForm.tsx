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
    // New Fields
    benefits: string[];
    features: string[];
    process: { title: string; description: string }[];
    keyDeliverables: string[];
    faqs: { question: string; answer: string }[];
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
        benefits: [],
        features: [],
        process: [],
        keyDeliverables: [],
        faqs: [],
    });

    // Fetch if editing
    useEffect(() => {
        if (serviceId) {
            setLoading(true);
            fetch(`/api/services/${serviceId}`)
                .then((res) => res.json())
                .then((data) => {
                    // Merge with defaults to ensure all fields exist
                    setForm({
                        ...form,
                        ...data,
                        benefits: data.benefits || [],
                        features: data.features || [],
                        process: data.process || [],
                        keyDeliverables: data.keyDeliverables || [],
                        faqs: data.faqs || [],
                        details: data.details || [],
                        software: data.software || [],
                    });
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

            const cleanedForm = {
                ...form,
                details: (form.details || []).filter(item => item.trim() !== ''),
                software: (form.software || []).filter(item => item.trim() !== ''),
                benefits: (form.benefits || []).filter(item => item.trim() !== ''),
                features: (form.features || []).filter(item => item.trim() !== ''),
                keyDeliverables: (form.keyDeliverables || []).filter(item => item.trim() !== ''),
                process: (form.process || []).filter(item => item.title.trim() !== '' && item.description.trim() !== ''),
                faqs: (form.faqs || []).filter(item => item.question.trim() !== '' && item.answer.trim() !== ''),
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cleanedForm),
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
        field: 'details' | 'software' | 'benefits' | 'features' | 'keyDeliverables',
        index: number,
        value: string
    ) => {
        const newArray = [...(form[field] || [])];
        newArray[index] = value;
        setForm({ ...form, [field]: newArray });
    };

    const addArrayItem = (field: 'details' | 'software' | 'benefits' | 'features' | 'keyDeliverables') => {
        setForm({ ...form, [field]: [...(form[field] || []), ''] });
    };

    const removeArrayItem = (field: 'details' | 'software' | 'benefits' | 'features' | 'keyDeliverables', index: number) => {
        const newArray = [...(form[field] || [])];
        newArray.splice(index, 1);
        setForm({ ...form, [field]: newArray });
    };

    // Complex Array Handlers (Process & FAQs)
    const handleComplexArrayChange = (
        field: 'process' | 'faqs',
        index: number,
        subField: string,
        value: string
    ) => {
        const newArray = [...(form[field] || [])] as any[];
        newArray[index] = { ...newArray[index], [subField]: value };
        setForm({ ...form, [field]: newArray });
    };

    const addComplexItem = (field: 'process' | 'faqs') => {
        const newItem = field === 'process'
            ? { title: '', description: '' }
            : { question: '', answer: '' };
        setForm({ ...form, [field]: [...(form[field] || []), newItem] as any });
    };

    const removeComplexItem = (field: 'process' | 'faqs', index: number) => {
        const newArray = [...(form[field] || [])];
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

            {/* =========================================
                ADVANCED TECHNICAL DATA
            ========================================= */}
            <div className="pt-8 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-900">Advanced Technical Data</h3>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">New Showcase Fields</span>
                </div>
            </div>

            {/* Benefits */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Benefits (The 'Why')</label>
                {form.benefits?.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayChange('benefits', idx, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                            placeholder="e.g. 100% Clash Discovery"
                        />
                        <button type="button" onClick={() => removeArrayItem('benefits', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X size={20} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('benefits')} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus size={16} /> Add Benefit</button>
            </div>

            {/* Features */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Technical Features</label>
                {form.features?.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayChange('features', idx, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                            placeholder="e.g. LOD 500 Modeling"
                        />
                        <button type="button" onClick={() => removeArrayItem('features', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X size={20} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('features')} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus size={16} /> Add Feature</button>
            </div>

            {/* Deliverables */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Key Deliverables</label>
                {form.keyDeliverables?.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayChange('keyDeliverables', idx, e.target.value)}
                            className="flex-1 px-4 py-2 rounded-lg border border-gray-200"
                            placeholder="e.g. Revit Central File (.rvt)"
                        />
                        <button type="button" onClick={() => removeArrayItem('keyDeliverables', idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X size={20} /></button>
                    </div>
                ))}
                <button type="button" onClick={() => addArrayItem('keyDeliverables')} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus size={16} /> Add Deliverable</button>
            </div>

            {/* Process Steps */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Process / Workflow Steps</label>
                {form.process?.map((item, idx) => (
                    <div key={idx} className="space-y-2 p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100 relative group">
                        <button type="button" onClick={() => removeComplexItem('process', idx)} className="absolute top-2 right-2 p-1 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                        <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleComplexArrayChange('process', idx, 'title', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 font-bold text-sm"
                            placeholder="Step Title (e.g. Data Collection)"
                        />
                        <textarea
                            value={item.description}
                            onChange={(e) => handleComplexArrayChange('process', idx, 'description', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            placeholder="Step description..."
                            rows={2}
                        />
                    </div>
                ))}
                <button type="button" onClick={() => addComplexItem('process')} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus size={16} /> Add Process Step</button>
            </div>

            {/* FAQs */}
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">FAQs</label>
                {form.faqs?.map((item, idx) => (
                    <div key={idx} className="space-y-2 p-4 bg-gray-50 rounded-xl mb-4 border border-gray-100 relative group">
                        <button type="button" onClick={() => removeComplexItem('faqs', idx)} className="absolute top-2 right-2 p-1 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                        <input
                            type="text"
                            value={item.question}
                            onChange={(e) => handleComplexArrayChange('faqs', idx, 'question', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 font-bold text-sm"
                            placeholder="Question"
                        />
                        <textarea
                            value={item.answer}
                            onChange={(e) => handleComplexArrayChange('faqs', idx, 'answer', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                            placeholder="Answer"
                            rows={2}
                        />
                    </div>
                ))}
                <button type="button" onClick={() => addComplexItem('faqs')} className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"><Plus size={16} /> Add FAQ</button>
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
