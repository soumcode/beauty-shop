<?php

use App\Models\User;

test('admin dashboard is accessible for admins', function () {
    $user = User::factory()->create([
        'role' => 'admin',
    ]);

    $response = $this
        ->actingAs($user)
        ->get('/admin');

    $response->assertInertia(fn ($page) => $page
        ->component('Admin/Dashboard', false)
    );
});

test('client dashboard renders for authenticated clients', function () {
    $user = User::factory()->create([
        'role' => 'client',
    ]);

    $this
        ->actingAs($user)
        ->get('/dashboard')
        ->assertInertia(fn ($page) => $page
            ->component('Client/Dashboard', false)
        );
});
