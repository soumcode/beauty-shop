import { Link, useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/AppLayout'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Index({ categories }) {
    const { delete: destroy, processing } = useForm()

    const handleDelete = (id) => {
        if (!confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
            return
        }

        destroy(route('admin.categories.destroy', id))
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Catégories
                    </h1>

                    <p className="text-muted-foreground">
                        Gérez les catégories de votre boutique.
                    </p>
                </div>

                <Button asChild>
                    <Link href={route('admin.categories.create')}>
                        Ajouter une catégorie
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Liste des catégories
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="p-3">
                                        Nom
                                    </th>

                                    <th className="p-3">
                                        Slug
                                    </th>

                                    <th className="p-3">
                                        Statut
                                    </th>

                                    <th className="p-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {categories.data.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="border-b"
                                    >
                                        <td className="p-3">
                                            {category.name}
                                        </td>

                                        <td className="p-3">
                                            {category.slug}
                                        </td>

                                        <td className="p-3">
                                            {category.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </td>

                                        <td className="p-3">
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    asChild
                                                >
                                                    <Link
                                                        href={route(
                                                            'admin.categories.edit',
                                                            category.id
                                                        )}
                                                    >
                                                        Modifier
                                                    </Link>
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    onClick={() =>
                                                        handleDelete(
                                                            category.id
                                                        )
                                                    }
                                                    disabled={processing}
                                                >
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}


Index.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
