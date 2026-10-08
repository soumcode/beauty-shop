<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = $user
            ->notifications()
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $unreadCount = $user
            ->unreadNotifications()
            ->count();

        return Inertia::render(
            'Client/Notifications/Index',
            [
                'notifications' => $notifications,
                'unreadCount' => $unreadCount,
            ]
        );
    }

    public function markAsRead(
        Request $request,
        string $notification
    ) {
        $user = $request->user();

        $user->notifications()
            ->where('id', $notification)
            ->firstOrFail()
            ->markAsRead();

        return back()->with(
            'success',
            'Notification marquée comme lue.'
        );
    }

    public function markAllAsRead(
        Request $request
    ) {
        $request
            ->user()
            ->unreadNotifications
            ->markAsRead();

        return back()->with(
            'success',
            'Toutes les notifications ont été marquées comme lues.'
        );
    }
}
