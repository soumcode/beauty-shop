<?php

use App\Models\User;

test('admin dashboard is accessible for admins', function () {
    $user = User::factory()->create([
        'role' => 'admin',
    ]);

    $response = $this
        ->actingAs($user)
        ->get('/admin');

    $response->assertOk();
});
