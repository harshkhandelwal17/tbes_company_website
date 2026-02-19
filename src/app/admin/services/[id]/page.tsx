import AdminServiceForm from '@/components/AdminServiceForm';

export default async function EditServicePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Service</h1>
            <AdminServiceForm serviceId={id} />
        </div>
    );
}
