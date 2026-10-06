<?php

return [

    

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],
    'geniuspay' => [
        'api_key' => env('GENIUSPAY_API_KEY'),

        'api_secret' => env('GENIUSPAY_API_SECRET'),

        'webhook_secret' => env('GENIUSPAY_WEBHOOK_SECRET'),

        'base_url' => env(
            'GENIUSPAY_BASE_URL',
            'https://geniuspay.ci/api/v1/merchant'
        ),

        'success_url' => env('GENIUSPAY_SUCCESS_URL'),

        'error_url' => env('GENIUSPAY_ERROR_URL'),

        'webhook_url' => env('GENIUSPAY_WEBHOOK_URL'),
    ],

];
