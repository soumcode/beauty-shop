<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('promotion_id')
                ->nullable()
                ->after('user_id')
                ->constrained('promotions')
                ->nullOnDelete();

            $table->decimal('discount_amount', 10, 2)
                ->default(0)
                ->after('subtotal');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['promotion_id']);
            $table->dropColumn([
                'promotion_id',
                'discount_amount',
            ]);
        });
    }
};
