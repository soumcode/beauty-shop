<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DriverController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\Client\AddressController;
use App\Http\Controllers\Client\DashboardController as ClientDashboardController;
use App\Http\Controllers\Client\OrderController as ClientOrderController;
use App\Http\Controllers\Client\ProfileController as ClientProfileController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\GeniusPayWebhookController;
use App\Http\Controllers\Livreur\DashboardController as LivreurDashboardController;
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



Route::get('/panier', function () {
    return Inertia::render('Cart');
})->name('cart');



Route::post(
    '/webhooks/geniuspay',
    [GeniusPayWebhookController::class, 'handle']
)->name('geniuspay.webhook');

Route::post(
    '/webhook/geniuspay',
    [GeniusPayWebhookController::class, 'handle']
);

Route::post(
    '/',
    [GeniusPayWebhookController::class, 'handle']
);

Route::middleware('auth')->group(function () {
    Route::get('/profile', [
        AuthProfileController::class,
        'edit',
    ])->name('profile.edit');

    Route::patch('/profile', [
        AuthProfileController::class,
        'update',
    ])->name('profile.update');

    Route::delete('/profile', [
        AuthProfileController::class,
        'destroy',
    ])->name('profile.destroy');

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
});



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
