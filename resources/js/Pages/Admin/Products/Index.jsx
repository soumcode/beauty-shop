import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const currencyFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
});

export default function Index({ products, filters }) {
    const { data, setData, get, delete: destroy, processing } = useForm({
        search: filters.search ?? '',
    });

    const searchProducts = (event) => {
        event.preventDefault();

        get(route('admin.products.index'), {
            preserveState: true,
            replace: true,
        });
    };

    const deleteProduct = (product) => {
        if (window.confirm(`Supprimer le produit « ${product.name} » ?`)) {
            destroy(route('admin.products.destroy', product.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h1 className="text-xl font-semibold leading-tight text-gray-800">
                    Produits
                </h1>
            }
        >
            <Head title="Produits" />

            <div className="py-10">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Gestion des produits
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Consultez et gérez le catalogue de la boutique.
                            </p>
                        </div>

                        <Link
                            href={route('admin.products.create')}
                            className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        >
                            Ajouter un produit
                        </Link>
                    </div>

                    <form
                        onSubmit={searchProducts}
                        className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row"
                    >
                        <label className="sr-only" htmlFor="product-search">
                            Rechercher un produit
                        </label>
                        <input
                            id="product-search"
                            type="search"
                            value={data.search}
                            onChange={(event) =>
                                setData('search', event.target.value)
                            }
                            placeholder="Rechercher par nom…"
                            className="w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:max-w-md"
                        />
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                            Rechercher
                        </button>
                    </form>

                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Produit
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Catégorie
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Prix
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Stock
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Statut
                                        </th>
                                        <th>
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.data.map((product) => (
                                        <tr key={product.id}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <p className="font-medium text-gray-900">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {product.slug}
                                                </p>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {product.category?.name ?? '—'}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {currencyFormatter.format(
                                                    Number(product.price),
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                                                {product.stock}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                                                        product.status ===
                                                        'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {product.status === 'active'
                                                        ? 'Actif'
                                                        : 'Inactif'}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                                <div className="flex justify-end gap-3">
                                                    <Link
                                                        href={route(
                                                            'admin.products.edit',
                                                            product.id,
                                                        )}
                                                        className="font-medium text-gray-700 hover:text-gray-900"
                                                    >
                                                        Modifier
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            deleteProduct(
                                                                product,
                                                            )
                                                        }
                                                        className="font-medium text-red-600 hover:text-red-800"
                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {products.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-12 text-center text-sm text-gray-500"
                                            >
                                                Aucun produit trouvé.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-600">
                                {products.total} produit
                                {products.total > 1 ? 's' : ''}
                            </p>
                            <nav
                                aria-label="Pagination des produits"
                                className="flex flex-wrap gap-2"
                            >
                                {products.links.map((link, index) => {
                                    const label = link.label
                                        .replace(/&laquo;/g, '←')
                                        .replace(/&raquo;/g, '→');

                                    return link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            preserveScroll
                                            className={`rounded-md border px-3 py-1.5 text-sm ${
                                                link.active
                                                    ? 'border-gray-900 bg-gray-900 text-white'
                                                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {label}
                                        </Link>
                                    ) : (
                                        <span
                                            key={index}
                                            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-400"
                                        >
                                            {label}
                                        </span>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
