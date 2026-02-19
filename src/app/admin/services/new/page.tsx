import AdminServiceForm from '@/components/AdminServiceForm';

export default function NewServicePage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Service</h1>
            <AdminServiceForm />
        </div>
    );
}
