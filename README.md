# 🌸 Beauty Shop - Boutique de Produits de Beauté

Une plateforme e-commerce moderne et complète dédiée aux produits de beauté, conçue avec Laravel, Inertia.js et React. L'application gère l'ensemble du cycle de vente, de la commande client jusqu'à la livraison finale.

## 🚀 Fonctionnalités

L'application est divisée en trois espaces distincts selon le rôle de l'utilisateur :

### 🛍️ Espace Client
- **Catalogue de produits** : Consultation des produits et navigation par catégories.
- **Gestion du Panier** : Ajout et gestion des produits avant l'achat.
- **Processus de Checkout** : Tunnel d'achat sécurisé avec gestion des adresses de livraison.
- **Suivi des Commandes** : Historique des commandes et suivi de l'état de livraison.
- **Profil Utilisateur** : Gestion des informations personnelles, des adresses et du mot de passe.
- **Paiement** : Intégration de passerelles de paiement (via GeniusPay).

### 🛠️ Espace Administration
- **Gestion du Catalogue** : CRUD complet pour les catégories et les produits.
- **Gestion des Commandes** : Suivi global des commandes et mise à jour des statuts.
- **Logistique** : Affectation des livreurs aux commandes.
- **Gestion des Livreurs** : Administration des comptes livreurs.
- **Tableau de Bord** : Vue d'ensemble de l'activité de la boutique.

### 🚚 Espace Livreur
- **Gestion des Livraisons** : Liste des livraisons assignées.
- **Détails de Livraison** : Accès aux informations du client et de la commande.
- **Mise à jour du Statut** : Possibilité de marquer une livraison comme effectuée ou annulée.

## 🛠️ Stack Technique

- **Backend** : [Laravel 11+](https://laravel.com) (PHP 8.5)
- **Frontend** : [React](https://react.dev) avec [Inertia.js](https://inertiajs.com)
- **Styling** : [Tailwind CSS](https://tailwindcss.com)
- **Base de données** : SQLite (par défaut) / MySQL / PostgreSQL
- **Authentification** : Laravel Breeze
- **Gestion des actifs** : Vite

## ⚙️ Installation et Configuration

### Prérequis
- PHP ≥ 8.5
- Composer
- Node.js & NPM
- Un serveur de base de données (ou SQLite)

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/votre-utilisateur/beauty-shop.git
   cd beauty-shop
   ```

2. **Installer les dépendances PHP**
   ```bash
   composer install
   ```

3. **Installer les dépendances JS**
   ```bash
   npm install
   ```

4. **Configuration de l'environnement**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   Configurez vos accès base de données dans le fichier `.env`.

5. **Migration et Seeders**
   ```bash
   php artisan migrate --seed
   ```

6. **Lancement de l'application**
   ```bash
   php artisan serve
   npm run dev
   ```

## 🧪 Tests
L'application utilise **Pest** pour les tests. Pour lancer la suite de tests :
```bash
php artisan test
```

## 📁 Structure du Projet
- `app/Http/Controllers/Admin` : Logique d'administration.
- `app/Http/Controllers/Client` : Logique utilisateur.
- `app/Http/Controllers/Livreur` : Logique de livraison.
- `resources/js/Pages` : Composants React (Vues Inertia).
- `routes/web.php` : Définition des routes de l'application.
