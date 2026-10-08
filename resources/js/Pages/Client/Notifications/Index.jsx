import {
    Bell,
    Check,
    CheckCheck,
    ExternalLink,
} from 'lucide-react'

import {
    Head,
    Link,
    router,
} from '@inertiajs/react'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import AppLayout from '@/layouts/AppLayout'

export default function Index({
    notifications,
    unreadCount = 0,
}) {
    const markAsRead = (notificationId) => {
        router.patch(
            route(
                'client.notifications.read',
                notificationId
            ),
            {},
            {
                preserveScroll: true,
            }
        )
    }

    const markAllAsRead = () => {
        router.patch(
            route(
                'client.notifications.read-all'
            ),
            {},
            {
                preserveScroll: true,
            }
        )
    }

    const getNotificationData = (
        notification
    ) => {
        return notification.data || {}
    }

    return (
        <>
            <Head title="Mes notifications" />

            <div className="min-h-screen bg-muted/30">
                <div className="mx-auto max-w-4xl px-6 py-8">

                    {/* En-tête */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <div className="flex items-center gap-3">
                                <Bell className="h-7 w-7" />

                                <h1 className="text-3xl font-bold">
                                    Mes notifications
                                </h1>
                            </div>

                            <p className="mt-2 text-muted-foreground">
                                Retrouvez les mises à jour de vos commandes.
                            </p>
                        </div>

                        {unreadCount > 0 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={
                                    markAllAsRead
                                }
                            >
                                <CheckCheck className="mr-2 h-4 w-4" />

                                Tout marquer comme lu
                            </Button>
                        )}

                    </div>

                    {/* Nombre de non lues */}
                    {unreadCount > 0 && (
                        <div className="mb-6">
                            <Badge>
                                {unreadCount}{' '}
                                notification
                                {unreadCount > 1
                                    ? 's'
                                    : ''}{' '}
                                non lue
                                {unreadCount > 1
                                    ? 's'
                                    : ''}
                            </Badge>
                        </div>
                    )}

                    {/* Liste */}
                    {notifications.data.length ===
                    0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">

                                <Bell className="h-12 w-12 text-muted-foreground" />

                                <h2 className="mt-4 text-xl font-semibold">
                                    Aucune notification
                                </h2>

                                <p className="mt-2 text-muted-foreground">
                                    Vous n'avez encore reçu aucune
                                    notification.
                                </p>

                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">

                            {notifications.data.map(
                                (
                                    notification
                                ) => {
                                    const data =
                                        getNotificationData(
                                            notification
                                        )

                                    const isUnread =
                                        notification.read_at ===
                                        null

                                    return (
                                        <Card
                                            key={
                                                notification.id
                                            }
                                            className={
                                                isUnread
                                                    ? 'border-primary/30 bg-primary/5'
                                                    : ''
                                            }
                                        >
                                            <CardHeader>
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                                                    <div className="flex gap-3">

                                                        <div
                                                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                                                isUnread
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'bg-muted'
                                                            }`}
                                                        >
                                                            <Bell className="h-5 w-5" />
                                                        </div>

                                                        <div>
                                                            <CardTitle className="text-base">
                                                                {data.title ||
                                                                    'Notification'}
                                                            </CardTitle>

                                                            <p className="mt-1 text-sm text-muted-foreground">
                                                                {new Date(
                                                                    notification.created_at
                                                                ).toLocaleDateString(
                                                                    'fr-FR',
                                                                    {
                                                                        day: '2-digit',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>

                                                    </div>

                                                    {isUnread && (
                                                        <Badge>
                                                            Non lue
                                                        </Badge>
                                                    )}

                                                </div>
                                            </CardHeader>

                                            <CardContent>

                                                <p className="leading-7 text-muted-foreground">
                                                    {data.message ||
                                                        'Vous avez une nouvelle notification.'}
                                                </p>

                                                <div className="mt-5 flex flex-wrap gap-2">

                                                    {data.order_id && (
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Link
                                                                href={route(
                                                                    'client.orders.show',
                                                                    data.order_id
                                                                )}
                                                            >
                                                                <ExternalLink className="mr-2 h-4 w-4" />

                                                                Voir la commande
                                                            </Link>
                                                        </Button>
                                                    )}

                                                    {isUnread && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                markAsRead(
                                                                    notification.id
                                                                )
                                                            }
                                                        >
                                                            <Check className="mr-2 h-4 w-4" />

                                                            Marquer comme lue
                                                        </Button>
                                                    )}

                                                </div>

                                            </CardContent>
                                        </Card>
                                    )
                                }
                            )}

                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-8 flex flex-wrap justify-center gap-2">

                        {notifications.links.map(
                            (
                                link,
                                index
                            ) => (
                                <Link
                                    key={index}
                                    href={
                                        link.url ??
                                        '#'
                                    }
                                    className={`rounded-md border px-3 py-2 text-sm ${
                                        !link.url
                                            ? 'pointer-events-none opacity-50'
                                            : ''
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            link.label,
                                    }}
                                />
                            )
                        )}

                    </div>

                </div>
            </div>
        </>
    )
}

Index.layout = (page) => (
    <AppLayout>
        {page}
    </AppLayout>
)
