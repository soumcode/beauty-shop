<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DriverController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\PromotionController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Client\AddressController;
use App\Http\Controllers\Client\DashboardController as ClientDashboardController;
use App\Http\Controllers\Client\FavoriteController;
use App\Http\Controllers\Client\NotificationController;
use App\Http\Controllers\Client\OrderController as ClientOrderController;
use App\Http\Controllers\Client\ProfileController as ClientProfileController;
use App\Http\Controllers\Client\PromotionController as ClientPromotionController;
use App\Http\Controllers\Client\ReviewController;
use App\Http\Controllers\GeniusPayWebhookController;
use App\Http\Controllers\Livreur\DashboardController as LivreurDashboardController;
use App\Http\Controllers\Livreur\DeliveryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController as AuthProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('/produits', [
    ProductController::class,
    'index',
])->name('products.index');

Route::get('/produits/{product:slug}', [
    ProductController::class,
    'show',
])->name('products.show');

Route::get('/panier', fn () => Inertia::render('Cart'))
    ->name('cart.index');

Route::post(
    '/webhooks/geniuspay',
    [GeniusPayWebhookController::class, 'handle']
)->name('geniuspay.webhook');

Route::post(
    '/webhook/geniuspay',
    [GeniusPayWebhookController::class, 'handle']
);

Route::get('/paiement/succes', function () {
    return redirect()->route('client.orders.index')
        ->with('success', 'Paiement effectué avec succès.');
})->name('payment.success');

Route::get('/paiement/echec', function () {
    return redirect()->route('client.orders.index')
        ->withErrors([
            'payment' => 'Le paiement n’a pas été effectué.',
        ]);
})->name('payment.error');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [
        AuthProfileController::class,
        'edit',
    ])->name('profile.edit');

    Route::post(
        '/produits/{product}/avis',
        [ReviewController::class, 'store']
    )->name('client.reviews.store');

    Route::delete(
        '/avis/{review}',
        [ReviewController::class, 'destroy']
    )->name('client.reviews.destroy');

    Route::patch('/profile', [
        AuthProfileController::class,
        'update',
    ])->name('profile.update');

    Route::delete('/profile', [
        AuthProfileController::class,
        'destroy',
    ])->name('profile.destroy');

    Route::get(
        '/mes-notifications',
        [NotificationController::class, 'index']
    )->name('client.notifications.index');

    Route::patch(
        '/mes-notifications/{notification}/read',
        [NotificationController::class, 'markAsRead']
    )->name('client.notifications.read');

    Route::patch(
        '/mes-notifications/read-all',
        [NotificationController::class, 'markAllAsRead']
    )->name('client.notifications.read-all');

    Route::get('/dashboard', function () {
        $role = auth()->user()->role;

        if ($role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        if ($role === 'livreur') {
            return redirect()->route('livreur.dashboard');
        }

        return app(ClientDashboardController::class)->index();
    })->name('dashboard');

    Route::get('/mes-commandes', [
        ClientOrderController::class,
        'index',
    ])->name('client.orders.index');

    Route::get('/mes-commandes/{order}', [
        ClientOrderController::class,
        'show',
    ])->name('client.orders.show');

    Route::get('/profil', [
        ClientProfileController::class,
        'edit',
    ])->name('client.profile.edit');

    Route::patch('/profil', [
        ClientProfileController::class,
        'update',
    ])->name('client.profile.update');

    Route::patch('/profil/mot-de-passe', [
        ClientProfileController::class,
        'updatePassword',
    ])->name('client.profile.password.update');

    Route::get('/checkout', [
        CheckoutController::class,
        'create',
    ])->name('checkout');

    Route::get(
        '/promotion/check',
        [ClientPromotionController::class, 'check']
    )->name('client.promotions.check');

    Route::post('/checkout', [
        CheckoutController::class,
        'store',
    ])->name('checkout.store');

    Route::get('/commandes/{order}/confirmation', [
        CheckoutController::class,
        'confirmation',
    ])->name('orders.confirmation');

    Route::get('/mes-adresses', [
        AddressController::class,
        'index',
    ])->name('client.addresses.index');

    Route::get('/mes-adresses/create', [
        AddressController::class,
        'create',
    ])->name('client.addresses.create');

    Route::post('/mes-adresses', [
        AddressController::class,
        'store',
    ])->name('client.addresses.store');

    Route::get('/mes-adresses/{address}/edit', [
        AddressController::class,
        'edit',
    ])->name('client.addresses.edit');

    Route::patch('/mes-adresses/{address}', [
        AddressController::class,
        'update',
    ])->name('client.addresses.update');

    Route::delete('/mes-adresses/{address}', [
        AddressController::class,
        'destroy',
    ])->name('client.addresses.destroy');

    Route::patch('/mes-adresses/{address}/defaut', [
        AddressController::class,
        'setDefault',
    ])->name('client.addresses.set-default');

    Route::patch(
        '/mes-commandes/{order}/annuler',
        [ClientOrderController::class, 'cancel']
    )->name('client.orders.cancel');

    Route::get(
        '/mes-favoris',
        [FavoriteController::class, 'index']
    )->name('client.favorites.index');

    Route::post(
        '/produits/{product}/favori',
        [FavoriteController::class, 'store']
    )->name('client.favorites.store');

    Route::delete(
        '/produits/{product}/favori',
        [FavoriteController::class, 'destroy']
    )->name('client.favorites.destroy');

});

/* Route administrateur */

Route::middleware([
    'auth',
    'admin',
])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::resource('categories', CategoryController::class)->except([
            'show',
        ]);

        Route::resource('products', AdminProductController::class)->except([
            'show',
        ]);

        Route::resource(
            'promotions',
            PromotionController::class
        )->except([
            'show',
        ]);

        Route::get('/stock', [
            AdminProductController::class,
            'stock',
        ])->name('stock.index');

        Route::patch(
            '/promotions/{promotion}/toggle',
            [PromotionController::class, 'toggle']
        )->name('promotions.toggle');

        Route::get('/commandes', [
            OrderController::class,
            'index',
        ])->name('orders.index');

        Route::get('/commandes/{order}', [
            OrderController::class,
            'show',
        ])->name('orders.show');

        Route::patch('/commandes/{order}/statut', [
            OrderController::class,
            'updateStatus',
        ])->name('orders.update-status');

        Route::post('/commandes/{order}/affecter-livreur', [
            OrderController::class,
            'assignDriver',
        ])->name('orders.assign-driver');

        Route::post('/commandes/affecter-livreur', [
            OrderController::class,
            'assignDriverBatch',
        ])->name('orders.assign-driver-batch');

        Route::resource('drivers', DriverController::class)->except([
            'show',
            'destroy',
        ]);

        Route::get('/', [DashboardController::class, 'index'])
            ->name('dashboard');
    });

Route::middleware(['auth', 'livreur'])
    ->prefix('livreur')
    ->name('livreur.')
    ->group(function () {
        Route::get('/', [
            LivreurDashboardController::class,
            'index',
        ])->name('dashboard');

        Route::get('/livraisons', [
            DeliveryController::class,
            'index',
        ])->name('deliveries.index');

        Route::get('/livraisons/{delivery}', [
            DeliveryController::class,
            'show',
        ])->name('deliveries.show');

        Route::patch('/livraisons/{delivery}/statut', [
            DeliveryController::class,
            'updateStatus',
        ])->name('deliveries.update-status');
    });

require __DIR__.'/auth.php';
