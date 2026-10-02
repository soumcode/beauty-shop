import { Link } from '@inertiajs/react'
import AppLayout from '@/layouts/AppLayout'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Index({ drivers }) {
    return (
        <div className="min-h-screen bg-muted/30 p-6">

            <div className="mx-auto max-w-6xl">

                <div className="mb-6 flex items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Livreurs
                        </h1>

                        <p className="mt-2 text-muted-foreground">
                            Gérez les livreurs de votre boutique.
                        </p>
                    </div>

                    <Button asChild>
                        <Link
                            href={route(
                                'admin.drivers.create'
                            )}
                        >
                            Ajouter un livreur
                        </Link>
                    </Button>

                </div>

                <Card>

                    <CardHeader>
                        <CardTitle>
                            Liste des livreurs
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
                                            Email
                                        </th>

                                        <th className="p-3">
                                            Téléphone
                                        </th>

                                        <th className="p-3">
                                            Livraisons actives
                                        </th>

                                        <th className="p-3">
                                            État
                                        </th>

                                        <th className="p-3">
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {drivers.length > 0 ? (
                                        drivers.map(
                                            (driver) => (
                                                <tr
                                                    key={
                                                        driver.id
                                                    }
                                                    className="border-b"
                                                >

                                                    <td className="p-3 font-medium">
                                                        {
                                                            driver.name
                                                        }
                                                    </td>

                                                    <td className="p-3">
                                                        {
                                                            driver.email
                                                        }
                                                    </td>

                                                    <td className="p-3">
                                                        {
                                                            driver.phone
                                                        }
                                                    </td>

                                                    <td className="p-3">
                                                        {
                                                            driver.active_deliveries_count
                                                        }
                                                    </td>

                                                    <td className="p-3">

                                                        {driver.active_deliveries_count >
                                                        0 ? (
                                                            <Badge>
                                                                En livraison
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary">
                                                                Disponible
                                                            </Badge>
                                                        )}

                                                    </td>

                                                    <td className="p-3">

                                                        <Button
                                                            variant="outline"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    'admin.drivers.edit',
                                                                    driver.id
                                                                )}
                                                            >
                                                                Modifier
                                                            </Link>
                                                        </Button>

                                                    </td>

                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="p-8 text-center text-muted-foreground"
                                            >
                                                Aucun livreur
                                                enregistré.
                                            </td>
                                        </tr>
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </CardContent>

                </Card>

            </div>

        </div>
    )
}


Index.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
