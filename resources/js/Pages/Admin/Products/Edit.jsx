import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import ProductForm from './ProductForm';

export default function Edit({ product, categories }) {
    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl font-semibold leading-tight text-gray-800">
                    Modifier un produit
                </h1>
            }
        >
            <Head title={`Modifier ${product.name}`} />

            <div className="py-10">
                <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Modifier « {product.name} »
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Mettez à jour les informations du produit.
                        </p>
                    </div>
                    <ProductForm product={product} categories={categories} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
