# Library API - Documentation

## Description
Cette API REST permet de gérer une bibliothèque en ligne avec les fonctionnalités suivantes :
- Gestion des utilisateurs (inscription, connexion, gestion du profil).
- Gestion des livres (consultation, ajout, mise à jour, suppression).
- Gestion des emprunts de livres (emprunter, retourner, historique).
- Notifications (disponibilité des livres et rappels de retour).

---

## Prérequis
- **Node.js** (version 16 ou supérieure)
- **npm** ou **yarn**
- **MongoDB** (cluster configuré dans `.env`)
- Outil pour tester les requêtes HTTP, comme **Postman** ou **cURL**.

---

## Installation

1. Clonez le projet :
   ```bash
   git clone https://github.com/DimitriTedom/Library-App_Backend.git
   cd Library-App_Backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Configurez les variables d'environnement :
   Créez un fichier `.env` dans le répertoire racine et ajoutez-y les lignes suivantes :
   ```env
   DATABASE_URL="mongodb+srv://username:password@cluster0.66ckt.mongodb.net/db_name?retryWrites=true&w=majority"
   EMAIL_USER="youremail@example.com"
   EMAIL_PASS="yourPassword"
   PORT=3000
   JWT_SECRET="yourJwtSecret"
   ```

4. Initialisez la base de données :
   ```bash
   npx prisma db push
   npx prisma generate
   ```
   puis, ajoutez votre adrees IP au "service acces" dans Mongo

5. Démarrez le serveur :
   ```bash
   npx nodemon src/server.ts
   ```

6. Le serveur sera accessible sur `http://localhost:3000`.

---

## Tester les fonctionnalités avec Postman

### 1. **Gestion des utilisateurs**

#### A. Inscription
- **Endpoint** : `POST /users/signup`
- **Body** :
  ```json
  {
    "nom": "John Doe",
    "email": "john.doe@example.com",
    "motDePasse": "password123"
  }
  ```
- **Résultat attendu** :
  ```json
  {
    "message": "Utilisateur créé avec succès",
    "user": {
      "id": "unique-user-id",
      "nom": "John Doe",
      "email": "john.doe@example.com"
    }
  }
  ```

#### B. Connexion
- **Endpoint** : `POST /users/login`
- **Body** :
  ```json
  {
    "email": "john.doe@example.com",
    "motDePasse": "password123"
  }
  ```
- **Résultat attendu** :
  ```json
  {
    "message": "Connexion réussie",
    "token": "jwt-token"
  }
  ```
- Copiez le **token** pour les requêtes protégées.

#### C. Consulter le profil
- **Endpoint** : `GET /users/profile`
- **Headers** :
  - `Authorization`: `Bearer <jwt-token>`
- **Résultat attendu** :
  ```json
  {
    "id": "unique-user-id",
    "nom": "John Doe",
    "email": "john.doe@example.com"
  }
  ```

#### D. Mettre à jour le profil
- **Endpoint** : `PUT /users/profile`
- **Headers** :
  - `Authorization`: `Bearer <jwt-token>`
- **Body** :
  ```json
  {
    "nom": "John Smith",
    "email": "john.smith@example.com",
    "motDePasse": "newpassword123"
  }
  ```
- **Résultat attendu** :
  ```json
  {
    "message": "Profil mis à jour avec succès",
    "user": {
      "id": "unique-user-id",
      "nom": "John Smith",
      "email": "john.smith@example.com"
    }
  }
  ```

---

### 2. **Gestion des livres**

#### A. Consulter les livres
- **Endpoint** : `GET /books`
- **Résultat attendu** :
  ```json
  [
    {
      "id": "unique-book-id",
      "titre": "Book Title",
      "auteur": "Author Name",
      "description": "Book Description",
      "anneePublication": 2023,
      "ISBN": "123456789",
      "etat": "disponible"
    }
  ]
  ```

#### B. Ajouter un livre
- **Endpoint** : `POST /books`
- **Body** :
  ```json
  {
    "titre": "New Book",
    "auteur": "Author Name",
    "description": "Book Description",
    "anneePublication": 2023,
    "ISBN": "987654321"
  }
  ```
- **Résultat attendu** :
  ```json
  {
    "message": "Livre ajouté avec succès",
    "book": {
      "id": "unique-book-id",
      "titre": "New Book"
    }
  }
  ```

---

### 3. **Gestion des emprunts**

#### A. Emprunter un livre
- **Endpoint** : `POST /loans`
- **Body** :
  ```json
  {
    "livreID": "unique-book-id",
    "utilisateurID": "unique-user-id"
  }
  ```
- **Résultat attendu** :
  ```json
  {
    "message": "Livre emprunté avec succès",
    "borrow": {
      "id": "unique-borrow-id",
      "livreID": "unique-book-id",
      "userID": "unique-user-id",
      "dateEmprunt": "2023-11-15T10:00:00.000Z"
    }
  }
  ```

#### B. Retourner un livre
- **Endpoint** : `PUT /loans/:id/return`
- **Exemple d’URL** : `http://localhost:3000/loans/unique-borrow-id/return`
- **Résultat attendu** :
  ```json
  {
    "message": "Livre retourné avec succès et Notifications envoyées.",
    "borrow": {
      "id": "unique-borrow-id",
      "dateRetour": "2023-11-15T12:00:00.000Z"
    }
  }
  ```

#### C. Consulter l’historique des emprunts
- **Endpoint** : `GET /loans/user/:userID`
- **Exemple d’URL** : `http://localhost:3000/loans/user/unique-user-id`
- **Résultat attendu** :
  ```json
  [
    {
      "id": "unique-borrow-id",
      "livre": {
        "id": "unique-book-id",
        "titre": "Book Title"
      },
      "dateEmprunt": "2023-11-14T10:00:00.000Z",
      "dateRetour": null
    }
  ]
  ```

---

### 4. **Notifications**

#### A. Notification de disponibilité
- Lorsqu’un livre est retourné, une notification est automatiquement envoyée par email aux utilisateurs qui ont réservé ce livre.

#### B. Rappel de date de retour
- Les rappels pour les dates de retour sont envoyés automatiquement par le système. Configurez un script CRON ou une fonction planifiée pour exécuter ces tâches.

---

## Déploiement
- Backend : Utilisez une plateforme comme **Render**, **Railway** ou **Heroku**.
- Frontend : Déployez avec **Netlify** ou **Vercel** et connectez-le à l’API déployée.(En cours de programmation)

## Contributeurs

[DimitriTedom @SnowDev](https://github.com/DimitriTedom)