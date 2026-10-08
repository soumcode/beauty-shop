<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();

            // Code que le client saisira
            $table->string('code')->unique();

            // Nom de la promotion
            $table->string('name');

            // Description facultative
            $table->text('description')->nullable();

            // Type de réduction :
            // percentage = pourcentage
            // fixed = montant fixe
            $table->enum('type', [
                'percentage',
                'fixed',
            ]);

            // Valeur de la réduction
            $table->decimal('value', 10, 2);

            // Montant minimum nécessaire pour utiliser la promotion
            $table->decimal('min_order_amount', 10, 2)
                ->nullable();

            // Réduction maximale pour une promotion en pourcentage
            $table->decimal('max_discount', 10, 2)
                ->nullable();

            // Nombre maximum d'utilisations
            $table->unsignedInteger('usage_limit')
                ->nullable();

            // Nombre d'utilisations déjà effectuées
            $table->unsignedInteger('usage_count')
                ->default(0);

            // Date de début
            $table->dateTime('starts_at')
                ->nullable();

            // Date de fin
            $table->dateTime('ends_at')
                ->nullable();

            // Promotion active ou non
            $table->boolean('is_active')
                ->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
