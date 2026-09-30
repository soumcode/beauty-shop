<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->restrictOnDelete();

            $table->enum('status', [
                'pending',
                'confirmed',
                'preparing',
                'ready',
                'assigned',
                'out_for_delivery',
                'delivered',
                'cancelled',
            ])->default('pending');

            $table->decimal('subtotal', 10, 2);

            $table->decimal('delivery_fee', 10, 2)->default(0);

            $table->decimal('total', 10, 2);

            $table->enum('payment_method', [
                'cash_on_delivery',
            ])->default('cash_on_delivery');

            $table->enum('payment_status', [
                'pending',
                'paid',
                'failed',
            ])->default('pending');

            /*
             * Adresse enregistrée au moment de la commande.
             * Ces informations ne doivent plus changer
             * lorsque le client modifie son adresse plus tard.
             */
            $table->string('delivery_name');
            $table->string('delivery_phone', 30);
            $table->string('delivery_city');
            $table->string('delivery_commune');
            $table->string('delivery_quartier');
            $table->text('delivery_address');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
