<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->unique()
                ->constrained()
                ->restrictOnDelete();

            $table->string('transaction_id')
                ->unique();

            $table->unsignedBigInteger('amount');

            $table->string('currency', 3)
                ->default('XOF');

            $table->string('status')
                ->default('pending');

            $table->text('payment_url')
                ->nullable();

            $table->timestamp('paid_at')
                ->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
