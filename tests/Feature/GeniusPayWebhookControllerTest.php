<?php

test('webhook URLs accept POST requests and validate their signatures', function () {
    foreach ([
        '/',
        '/webhook/geniuspay',
        '/webhooks/geniuspay',
    ] as $url) {
        $this->post($url)
            ->assertUnauthorized()
            ->assertJson([
                'message' => 'Signature webhook manquante.',
            ]);
    }
});
