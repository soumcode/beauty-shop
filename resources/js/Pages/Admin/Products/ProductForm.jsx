import { Link, useForm } from '@inertiajs/react';

const inputClassName =
    'mt-1 block w-full rounded-md border-gray-300 text-sm shadow-sm focus:border-gray-500 focus:ring-gray-500';

function FormField({ id, label, error, children }) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}

export default function ProductForm({ product, categories }) {
    const isEditing = Boolean(product);
    const { data, setData, post, put, processing, errors } = useForm({
        category_id: product ? String(product.category_id) : '',
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        description: product?.description ?? '',
        price: product ? String(product.price) : '',
        stock: product ? String(product.stock) : '0',
        status: product?.status ?? 'active',
    });

    const submit = (event) => {
        event.preventDefault();

        if (isEditing) {
            put(route('admin.products.update', product.id));
            return;
        }

        post(route('admin.products.store'));
    };

    return (
        <form
            onSubmit={submit}
            className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                    id="name"
                    label="Nom du produit"
                    error={errors.name}
                >
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(event) =>
                            setData('name', event.target.value)
                        }
                        required
                        autoComplete="off"
                        className={inputClassName}
                    />
                </FormField>

                <FormField id="slug" label="Slug" error={errors.slug}>
                    <input
                        id="slug"
                        type="text"
                        value={data.slug}
                        onChange={(event) =>
                            setData('slug', event.target.value)
                        }
                        required
                        autoComplete="off"
                        className={inputClassName}
                    />
                </FormField>

                <FormField
                    id="category_id"
                    label="Catégorie"
                    error={errors.category_id}
                >
                    <select
                        id="category_id"
                        value={data.category_id}
                        onChange={(event) =>
                            setData('category_id', event.target.value)
                        }
                        required
                        className={inputClassName}
                    >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </FormField>

                <FormField id="price" label="Prix (€)" error={errors.price}>
                    <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.price}
                        onChange={(event) =>
                            setData('price', event.target.value)
                        }
                        required
                        className={inputClassName}
                    />
                </FormField>

                <FormField id="stock" label="Stock" error={errors.stock}>
                    <input
                        id="stock"
                        type="number"
                        min="0"
                        step="1"
                        value={data.stock}
                        onChange={(event) =>
                            setData('stock', event.target.value)
                        }
                        required
                        className={inputClassName}
                    />
                </FormField>

                <FormField id="status" label="Statut" error={errors.status}>
                    <select
                        id="status"
                        value={data.status}
                        onChange={(event) =>
                            setData('status', event.target.value)
                        }
                        required
                        className={inputClassName}
                    >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                    </select>
                </FormField>

                <div className="sm:col-span-2">
                    <FormField
                        id="description"
                        label="Description"
                        error={errors.description}
                    >
                        <textarea
                            id="description"
                            rows="5"
                            value={data.description}
                            onChange={(event) =>
                                setData('description', event.target.value)
                            }
                            className={inputClassName}
                        />
                    </FormField>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
                <Link
                    href={route('admin.products.index')}
                    className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Annuler
                </Link>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {processing
                        ? 'Enregistrement…'
                        : isEditing
                          ? 'Enregistrer les modifications'
                          : 'Créer le produit'}
                </button>
            </div>
        </form>
    );
}
