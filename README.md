# Online Library API

## 📚 Description

Cette API REST permet de gérer une bibliothèque en ligne. Les fonctionnalités incluent :
- Gestion des utilisateurs : inscription, connexion, mise à jour de profil, suppression de compte.
- Gestion des livres : ajout, mise à jour, suppression et consultation de livres.
- Gestion des emprunts et notifications (à implémenter).

### 🛠️ Stack Technique
- **Backend** : Node.js + Express.js
- **Langage** : TypeScript
- **Base de données** : MongoDB avec Prisma ORM
- **Versionnement** : Git + GitHub

---

## 🚀 Fonctionnalités

### Utilisateurs
- **Inscription** : Créer un compte utilisateur.
- **Connexion** : Authentifier un utilisateur et générer un token JWT.
- **Déconnexion** : Invalider le token JWT.
- **Profil** : Consulter, mettre à jour et supprimer le compte utilisateur.

### Livres
- **Liste des livres** : Récupérer tous les livres disponibles.
- **Ajout d'un livre** : Ajouter un nouveau livre à la bibliothèque.
- **Mise à jour d'un livre** : Modifier les informations d'un livre existant.
- **Suppression d'un livre** : Supprimer un livre de la bibliothèque.

---

## 📂 Arborescence du Projet

```
library-api/
├── prisma/
│   ├── schema.prisma    # Schéma Prisma pour la base de données
├── src/
│   ├── controllers/     # Logique métier pour chaque ressource
│   │   ├── userController.ts
│   │   ├── bookController.ts
│   ├── routes/          # Définition des routes de l'API
│   │   ├── userRoutes.ts
│   │   ├── bookRoutes.ts
│   ├── prismaClient.ts  # Configuration Prisma
│   ├── server.ts        # Point d'entrée principal
├── .env                 # Variables d'environnement (base de données)
├── package.json         # Dépendances et scripts
├── tsconfig.json        # Configuration TypeScript
├── README.md            # Documentation du projet
```

---

## 🖥️ Prérequis

- **Node.js** : [Télécharger ici](https://nodejs.org/)
- **MongoDB** : [Installer MongoDB](https://www.mongodb.com/docs/manual/installation/)
- **Postman** : [Télécharger ici](https://www.postman.com/downloads/)
- **Prisma CLI** : Installer via `npm install prisma --save-dev`
- **Git** : [Installer Git](https://git-scm.com/)

---

## ⚙️ Installation

1. **Cloner le projet** :
   ```bash
   git clone https://github.com/<votre-utilisateur>/library-api.git
   cd library-api
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   Créez un fichier `.env` à la racine du projet :
   ```env
   DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database>
   JWT_SECRET=your_jwt_secret
   ```

4. **Configurer Prisma** :
   - Générer le client Prisma :
     ```bash
     npx prisma generate
     ```

5. **Lancer le projet** :
   ```bash
   npx ts-node src/server.ts
   ```

---

## 🧪 Tests des Endpoints

### Utilisez **Postman** ou un autre client HTTP pour tester les endpoints.

#### 1. **Gestion des Utilisateurs**
- **Inscription** : `POST /users/signup`
  - Corps :
    ```json
    {
      "nom": "John Doe",
      "email": "john.doe@example.com",
      "motDePasse": "password123"
    }
    ```
- **Connexion** : `POST /users/login`
  - Corps :
    ```json
    {
      "email": "john.doe@example.com",
      "motDePasse": "password123"
    }
    ```
- **Profil** : `GET /users/profile` (avec token JWT dans l'en-tête `Authorization`).

#### 2. **Gestion des Livres**

- **Liste des livres** : `GET /books`.
  - Aucune donnée requise. Retourne une liste de livres au format suivant :
    ```json
    [
      {
        "id": "123456789",
        "titre": "1984",
        "auteur": "George Orwell",
        "description": "Un roman dystopique",
        "anneePublication": 1949,
        "ISBN": "123456789"
      }
    ]
    ```

- **Ajout d’un livre** : `POST /books`.
  - Corps :
    ```json
    {
      "titre": "1984",
      "auteur": "George Orwell",
      "description": "Un roman dystopique",
      "anneePublication": 1949,
      "ISBN": "123456789"
    }
    ```
  - Réponse :
    ```json
    {
      "message": "Livre ajouté avec succès",
      "book": {
        "id": "123456789",
        "titre": "1984",
        "auteur": "George Orwell",
        "description": "Un roman dystopique",
        "anneePublication": 1949,
        "ISBN": "123456789"
      }
    }
    ```

- **Mise à jour d’un livre** : `PUT /books/:id`.
  - Exemple d’ID : `/books/123456789`.
  - Corps (données à mettre à jour) :
    ```json
    {
      "titre": "1984 - Nouvelle Édition",
      "description": "Mise à jour de la description."
    }
    ```
  - Réponse :
    ```json
    {
      "message": "Livre mis à jour avec succès",
      "book": {
        "id": "123456789",
        "titre": "1984 - Nouvelle Édition",
        "auteur": "George Orwell",
        "description": "Mise à jour de la description.",
        "anneePublication": 1949,
        "ISBN": "123456789"
      }
    }
    ```

- **Suppression d’un livre** : `DELETE /books/:id`.
  - Exemple d’ID : `/books/123456789`.
  - Réponse :
    ```json
    {
      "message": "Livre supprimé avec succès"
    }
    ```

---

## 📖 Documentation

- **Prisma** : [https://www.prisma.io/docs/](https://www.prisma.io/docs/)
- **Express** : [https://expressjs.com/](https://expressjs.com/)
- **JWT** : [https://jwt.io/](https://jwt.io/)

---

## 📝 Auteur

Créé par Dimitri Tedom alias [SnowDev](https://github.com/DimitriTedom). Contactez-moi à [dimitritedom@gmail.com](mailto:dimitritedom@gmail.com) pour toute question !
---
