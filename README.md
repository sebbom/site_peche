# Site Pêche - Boutique en ligne d'articles de pêche

Une application e-commerce complète pour la vente d'articles de pêche, construite avec la stack MERN (MongoDB, Express, React, Node.js).

## 🌐 Aperçu

Site Pêche est une boutique en ligne moderne et responsive qui permet aux clients d'acheter divers articles de pêche : cannes, moulinets, leurres, appâts, accessoires, etc.

## ✨ Fonctionnalités

### 👤 Fonctionnalités Utilisateur
- **Authentification** : Inscription, connexion, déconnexion, récupération de mot de passe
- **Catalogue de produits** : Navigation par catégories, recherche, filtrage
- **Fiche produit** : Détails complets avec images, descriptions, spécifications
- **Panier** : Ajout, modification, suppression d'articles
- **Paiement** : Intégration Stripe pour les paiements sécurisés
- **Historique des commandes** : Suivi des commandes passées
- **Profil utilisateur** : Gestion des informations personnelles
- **Liste de souhaits** : Sauvegarde des produits préférés

### 👑 Fonctionnalités Admin
- **Tableau de bord** : Statistiques et aperçu des activités
- **Gestion des produits** : CRUD complet avec images, catégories, stocks
- **Gestion des catégories** : Hiérarchie de catégories avec sous-catégories
- **Gestion des commandes** : Suivi des commandes, mise à jour des statuts
- **Gestion des utilisateurs** : Visualisation et gestion des comptes clients
- **Configuration** : Paramètres du site et gestion des contenus

### 📱 Fonctionnalités Techniques
- **Design Responsive** : Adapté à tous les appareils (mobile, tablette, desktop)
- **UI Moderne** : Interface utilisateur intuitive avec Material-UI
- **Recherche avancée** : Filtres par prix, catégorie, note, etc.
- **Pagination** : Navigation fluide entre les pages de produits
- **Notifications** : Alertes et messages pour les actions utilisateur
- **SEO Friendly** : Optimisation pour les moteurs de recherche

## 🛠 Stack Technique

### Frontend
- **React 18** - Bibliothèque JavaScript pour les interfaces utilisateur
- **React Router 6** - Routage côté client
- **Material-UI (MUI)** - Composants UI modernes
- **Material Icons** - Icônes pour l'interface
- **Axios** - Client HTTP pour les requêtes API
- **Formik + Yup** - Gestion des formulaires et validation
- **React Responsive Carousel** - Carousel pour les bannières
- **Framer Motion** - Animations fluides

### Backend
- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web pour Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT (JSON Web Tokens)** - Authentification sécurisée
- **Bcrypt** - Hachage des mots de passe
- **Stripe** - Intégration des paiements en ligne
- **Nodemailer** - Envoi d'emails (réinitialisation de mot de passe, etc.)
- **CORS** - Gestion des requêtes cross-origin
- **Cookie Parser** - Gestion des cookies

### DevOps
- **Concurrently** - Exécution simultanée des serveurs frontend et backend
- **Nodemon** - Redémarrage automatique du serveur en développement
- **ESLint** - Linting du code

## 📁 Structure du Projet

```
site_peche/
├── client/                  # Application React (Frontend)
│   ├── public/              # Fichiers statiques
│   │   └── index.html       # Point d'entrée HTML
│   ├── src/                 # Code source React
│   │   ├── components/      # Composants réutilisables
│   │   │   ├── layout/      # Navbar, Footer, ScrollToTop
│   │   │   ├── products/    # Composants produits
│   │   │   ├── auth/        # Composants d'authentification
│   │   │   ├── cart/        # Composants panier
│   │   │   ├── orders/      # Composants commandes
│   │   │   ├── admin/       # Composants admin
│   │   │   └── common/      # Composants communs
│   │   ├── context/         # Context API pour la gestion d'état
│   │   │   ├── AuthContext.js
│   │   │   ├── CartContext.js
│   │   │   ├── ProductContext.js
│   │   │   ├── CategoryContext.js
│   │   │   └── OrderContext.js
│   │   ├── pages/           # Pages de l'application
│   │   │   ├── auth/        # Pages d'authentification
│   │   │   ├── admin/       # Pages admin
│   │   │   └── *.js         # Autres pages
│   │   ├── App.js           # Composant principal
│   │   ├── index.js         # Point d'entrée
│   │   └── index.css        # Styles globaux
│   └── package.json         # Dépendances frontend
│
├── server/                  # Serveur Node.js (Backend)
│   ├── config/              # Configuration
│   │   └── db.js            # Connexion MongoDB
│   ├── controllers/         # Contrôleurs des routes
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── middleware/          # Middlewares
│   │   ├── auth.js           # Authentification
│   │   ├── error.js         # Gestion des erreurs
│   │   └── catchAsyncErrors.js
│   ├── models/              # Modèles MongoDB
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/              # Routes API
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── utils/               # Utilitaires
│   │   ├── apiFeatures.js   # Fonctionnalités API (pagination, filtres)
│   │   ├── errorHandler.js
│   │   ├── jwtToken.js
│   │   └── sendEmail.js
│   ├── .env.example         # Exemple de variables d'environnement
│   ├── index.js             # Point d'entrée du serveur
│   └── package.json         # Dépendances backend
│
├── package.json             # Configuration du projet (workspaces)
├── .gitignore               # Fichiers à ignorer par Git
└── README.md                # Documentation
```

## 🚀 Installation et Exécution

### Prérequis
- Node.js (version 18 ou supérieure)
- MongoDB (local ou Atlas)
- Compte Stripe (pour les paiements)
- Git

### Installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/sebbom/site_peche.git
cd site_peche
```

2. **Installer les dépendances**
```bash
# Installer les dépendances du projet principal
npm install

# Installer les dépendances du frontend
cd client
npm install
cd ..

# Installer les dépendances du backend
cd server
npm install
cd ..
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env` dans le dossier `server/` basé sur `.env.example` :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/site_peche
JWT_SECRET=votre_secret_jwt_ici
JWT_EXPIRE=30d
COOKIE_EXPIRE=30
STRIPE_SECRET_KEY=votre_clé_secrète_stripe
STRIPE_PUBLISHABLE_KEY=votre_clé_publique_stripe
STRIPE_WEBHOOK_SECRET=votre_webhook_secret_stripe
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASSWORD=votre_mot_de_passe
SMTP_FROM=noreply@sitepeche.com
```

4. **Configurer le frontend**

Créer un fichier `.env` dans le dossier `client/` :

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### Exécution

#### Mode Développement

Pour exécuter à la fois le frontend et le backend :

```bash
npm run dev
```

Ou séparément :

```bash
# Démarrer le backend
npm run server

# Dans un autre terminal, démarrer le frontend
npm run client
```

Le frontend sera disponible sur `http://localhost:3000`
Le backend sera disponible sur `http://localhost:5000`

#### Mode Production

1. Construire le frontend :
```bash
npm run build
```

2. Démarrer le serveur :
```bash
npm start
```

Le serveur servira à la fois l'API et les fichiers statiques du frontend.

## 📡 Endpoints API

### Authentification
- `POST /api/v1/register` - Inscription
- `POST /api/v1/login` - Connexion
- `GET /api/v1/logout` - Déconnexion
- `POST /api/v1/password/forgot` - Mot de passe oublié
- `PUT /api/v1/password/reset/:token` - Réinitialisation du mot de passe
- `GET /api/v1/me` - Profil utilisateur
- `PUT /api/v1/password/update` - Mise à jour du mot de passe
- `PUT /api/v1/me/update` - Mise à jour du profil

### Produits
- `GET /api/v1/products` - Liste des produits (avec pagination, recherche, filtrage)
- `GET /api/v1/products/featured` - Produits phares
- `GET /api/v1/products/new` - Nouveautés
- `GET /api/v1/products/bestsellers` - Meilleures ventes
- `GET /api/v1/products/category/:categoryId` - Produits par catégorie
- `GET /api/v1/products/related/:productId` - Produits similaires
- `GET /api/v1/product/:id` - Détails d'un produit
- `POST /api/v1/review` - Ajouter un avis
- `GET /api/v1/reviews` - Liste des avis d'un produit
- `DELETE /api/v1/review` - Supprimer un avis

### Catégories
- `GET /api/v1/categories` - Liste des catégories
- `GET /api/v1/categories/featured` - Catégories phares
- `GET /api/v1/categories/parents` - Catégories principales
- `GET /api/v1/categories/parent/:parentId` - Sous-catégories
- `GET /api/v1/category/:id` - Détails d'une catégorie

### Panier
- `GET /api/v1/cart` - Récupérer le panier
- `POST /api/v1/cart/add` - Ajouter au panier
- `PUT /api/v1/cart/update` - Mettre à jour un article du panier
- `PUT /api/v1/cart/remove` - Retirer un article du panier
- `DELETE /api/v1/cart/clear` - Vider le panier
- `GET /api/v1/cart/count` - Nombre d'articles dans le panier
- `POST /api/v1/cart/merge` - Fusionner le panier invité avec le panier utilisateur

### Commandes
- `POST /api/v1/order/new` - Créer une commande
- `GET /api/v1/order/:id` - Détails d'une commande
- `GET /api/v1/orders/me` - Mes commandes
- `POST /api/v1/checkout/create-session` - Créer une session de paiement Stripe
- `POST /api/v1/webhook` - Webhook Stripe
- `GET /api/v1/order/session/:sessionId` - Récupérer une commande par session Stripe

### Admin
- `GET /api/v1/admin/users` - Liste des utilisateurs
- `GET /api/v1/admin/user/:id` - Détails d'un utilisateur
- `PUT /api/v1/admin/user/:id` - Mettre à jour un utilisateur
- `DELETE /api/v1/admin/user/:id` - Supprimer un utilisateur
- `GET /api/v1/admin/products` - Liste des produits (admin)
- `POST /api/v1/admin/product/new` - Créer un produit
- `PUT /api/v1/admin/product/:id` - Mettre à jour un produit
- `DELETE /api/v1/admin/product/:id` - Supprimer un produit
- `PUT /api/v1/admin/product/:id/feature` - Activer/désactiver le produit phare
- `PUT /api/v1/admin/product/:id/active` - Activer/désactiver le produit
- `GET /api/v1/admin/categories` - Liste des catégories (admin)
- `POST /api/v1/admin/category/new` - Créer une catégorie
- `PUT /api/v1/admin/category/:id` - Mettre à jour une catégorie
- `DELETE /api/v1/admin/category/:id` - Supprimer une catégorie
- `PUT /api/v1/admin/category/:id/feature` - Activer/désactiver la catégorie phare
- `PUT /api/v1/admin/category/:id/active` - Activer/désactiver la catégorie
- `PUT /api/v1/admin/categories/reorder` - Réorganiser les catégories
- `GET /api/v1/admin/orders` - Liste des commandes (admin)
- `GET /api/v1/admin/orders/recent` - Commandes récentes
- `GET /api/v1/admin/orders/status/:status` - Commandes par statut
- `GET /api/v1/admin/orders/stats` - Statistiques des commandes
- `PUT /api/v1/admin/order/:id` - Mettre à jour le statut d'une commande
- `DELETE /api/v1/admin/order/:id` - Supprimer une commande

## 📱 Catégories de Pêche

Le site propose plusieurs catégories d'articles de pêche :

- **Canne à pêche** : Canne au coup, canne à mouche, canne de mer, canne télescopique
- **Moulinets** : Moulinets fixes, moulinets à tambour, moulinets à mouche
- **Leurres** : Leurres souples, leurres durs, cuillères, leurres de surface
- **Appâts** : Appâts naturels, appâts artificiels, bouillettes
- **Accessoires** : Hameçons, fil de pêche, plombs, flotteurs, boîtes à pêche
- **Vêtements** : Combinaisons, vestes, bottes, gants, casquettes
- **Électronique** : Sondeurs, GPS, détecteurs de poissons
- **Matériel de camping** : Tentes, sacs de couchage, lampes, réchauds

## 🎨 Design et Expérience Utilisateur

### Palette de Couleurs
- **Primaire** : #1976d2 (Bleu)
- **Secondaire** : #9c27b0 (Violet)
- **Succès** : #4caf50 (Vert)
- **Avertissement** : #ff9800 (Orange)
- **Erreur** : #f44336 (Rouge)
- **Arrière-plan** : #f5f5f5 (Gris clair)

### Typographie
- **Police principale** : Roboto
- **Police des titres** : Montserrat

### Responsive Design
- **Mobile** : < 576px
- **Tablette** : 576px - 992px
- **Desktop** : > 992px

## 🔒 Sécurité

- **Authentification JWT** : Tokens sécurisés avec expiration
- **Protection des routes** : Middleware d'authentification pour les routes protégées
- **Validation des données** : Validation côté serveur et côté client
- **Protection CSRF** : Utilisation de tokens CSRF
- **Sécurité des mots de passe** : Hachage avec bcrypt
- **Protection des requêtes** : Limitation des requêtes et gestion des erreurs

## 📊 Performances

- **Lazy Loading** : Chargement paresseux des images et composants
- **Optimisation des requêtes** : Pagination et filtrage côté serveur
- **Cache** : Cache des données fréquemment utilisées
- **Compression** : Compression des réponses HTTP
- **Minification** : Minification du code JavaScript et CSS

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Forker le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commiter vos modifications (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Pousser vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENCE](LICENCE) pour plus de détails.

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter :

- **Email** : contact@sitepeche.com
- **Site web** : https://sitepeche.com
- **GitHub** : https://github.com/sebbom/site_peche

---

© 2024 Site Pêche. Tous droits réservés.
