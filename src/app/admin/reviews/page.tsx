'use client';

import { useState, useEffect } from 'react';
import {
    Star, Plus, Pencil, Trash2, X, Save,
    Quote, User, Building2, ChevronRight,
    Loader2, AlertCircle
} from 'lucide-react';
import axios from 'axios';

interface Review {
    _id: string;
    text: string;
    author: string;
    company: string;
    rating: number;
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        text: '',
        author: '',
        company: '',
        rating: 5
    });

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('/api/reviews');
            setReviews(res.data);
            setError(null);
        } catch (err: any) {
            setError('Failed to fetch reviews');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleOpenModal = (review?: Review) => {
        if (review) {
            setEditingId(review._id);
            setFormData({
                text: review.text,
                author: review.author,
                company: review.company,
                rating: review.rating
            });
        } else {
            setEditingId(null);
            setFormData({
                text: '',
                author: '',
                company: '',
                rating: 5
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setFormData({ text: '', author: '', company: '', rating: 5 });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitLoading(true);
        try {
            if (editingId) {
                await axios.put(`/api/reviews/${editingId}`, formData);
            } else {
                await axios.post('/api/reviews', formData);
            }
            await fetchReviews();
            handleCloseModal();
        } catch (err: any) {
            alert('Error saving review');
            console.error(err);
        } finally {
            setIsSubmitLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;
        try {
            await axios.delete(`/api/reviews/${id}`);
            setReviews(reviews.filter(r => r._id !== id));
        } catch (err: any) {
            alert('Error deleting review');
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Testimonials</h1>
                    <p className="text-zinc-500 text-sm mt-1">Manage client reviews and success stories for the home page.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={18} />
                    <span>Add Review</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Reviews Grid */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
                    <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
                    <p className="text-zinc-500 animate-pulse">Loading testimonials...</p>
                </div>
            ) : reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="group bg-[#09090b] border border-white/[0.08] hover:border-blue-500/30 rounded-2xl p-6 transition-all relative flex flex-col h-full"
                        >
                            <Quote className="absolute top-4 right-4 text-zinc-800 w-12 h-12 opacity-40 pointer-events-none" />

                            <div className="flex gap-1 mb-4 relative z-10">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        className={`${i < review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-700'} `}
                                    />
                                ))}
                            </div>

                            <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic flex-1 relative z-10">
                                "{review.text}"
                            </p>

                            <div className="flex items-center gap-4 pt-4 border-t border-white/[0.05] relative z-10">
                                <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                                    {review.author.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm tracking-tight">{review.author}</h4>
                                    <p className="text-zinc-500 text-[11px] uppercase tracking-wider font-semibold">{review.company}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleOpenModal(review); }}
                                    className="p-2 bg-zinc-800/80 backdrop-blur-md text-zinc-300 hover:text-white rounded-lg border border-white/10 transition-colors pointer-events-auto"
                                    title="Edit"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(review._id); }}
                                    className="p-2 bg-red-900/20 backdrop-blur-md text-red-500 hover:text-red-400 rounded-lg border border-red-500/20 transition-colors pointer-events-auto"
                                    title="Delete"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white/[0.02] border border-white/[0.05] border-dashed rounded-3xl">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-700 mb-4">
                        <Quote size={32} />
                    </div>
                    <h3 className="text-white font-bold text-lg">No reviews found</h3>
                    <p className="text-zinc-500 text-sm max-w-xs text-center mt-2">Add your first client success story to showcase it on the home page.</p>
                </div>
            )}

            {/* Modal - Unified for Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
                        onClick={handleCloseModal}
                    />
                    <div className="bg-[#09090b] border border-white/[0.08] w-full max-w-xl rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">

                        {/* Modal Header */}
                        <div className="px-8 pt-8 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
                                    {editingId ? <Pencil size={20} /> : <Plus size={20} />}
                                </div>
                                <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                                    {editingId ? 'Edit Testimonial' : 'New Testimonial'}
                                </h2>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-zinc-500 hover:text-white p-2"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="px-8 pb-8 pt-4 space-y-6">

                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest flex items-center gap-2">
                                    <Quote size={12} /> Testimonial Content
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-zinc-200 placeholder:text-zinc-700 text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                                    placeholder="Paste the client review here..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest flex items-center gap-2">
                                        <User size={12} /> Author Name / Title
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.author}
                                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-zinc-200 placeholder:text-zinc-700 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                                        placeholder="e.g. John Doe, Senior Architect"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest flex items-center gap-2">
                                        <Building2 size={12} /> Company Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl px-5 py-3 text-zinc-200 placeholder:text-zinc-700 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest flex items-center gap-2">
                                    <Star size={12} /> Rating: {formData.rating} Stars
                                </label>
                                <div className="flex gap-4 p-4 bg-black/20 rounded-2xl border border-white/5 justify-between">
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <button
                                            type="button"
                                            key={num}
                                            onClick={() => setFormData({ ...formData, rating: num })}
                                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.rating === num
                                                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                                                : 'text-zinc-600 hover:text-zinc-400'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-6 py-4 rounded-2xl font-bold text-zinc-400 bg-white/5 hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitLoading}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmitLoading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    <span>{editingId ? 'Update Review' : 'Save Testimonial'}</span>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
