# 🐘 Exercice PostgreSQL personnalisé

## 🎯 Objectif

Dans cet exercice, vous allez mettre en place un processus complet pour :

1. Préparer une base de données PostgreSQL avec des données de test
2. La packager dans une image Docker
3. Automatiser son utilisation avec GitHub Actions

## 💭 Vue d'ensemble

- Première partie : Création d'une image Docker contenant une base PostgreSQL pré-configurée
- Deuxième partie : Création d'un workflow GitHub qui démarre cette base et vérifie son contenu

## Partie 1 : Création de l'image Docker

1. 📁 Créez un nouveau dossier et les fichiers nécessaires :

```bash
mkdir postgres-init-image
cd postgres-init-image
touch init.sql
```

2. 📝 Dans `init.sql`, ajoutez :

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO users (name) VALUES
  ('Henri'),
  ('Alice'),
  ('Bob');
```

🧠 À savoir : Ce fichier sera automatiquement exécuté au démarrage du conteneur PostgreSQL si on le place dans le bon dossier dans l'image.

3. 🐳 Créez un `Dockerfile` :

```dockerfile
# On part de l'image officielle PostgreSQL
FROM postgres:17

# Variables d'environnement pour créer l'utilisateur,
# mot de passe et base de données
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=demo

# On copie le script SQL dans le dossier reconnu par PostgreSQL
COPY init.sql /docker-entrypoint-initdb.d/
```

🧠 PostgreSQL exécute automatiquement tous les fichiers .sql placés dans /docker-entrypoint-initdb.d/ au premier lancement du conteneur.

🧠 Comprendre ce qui se passe :

- L'image créée contiendra PostgreSQL déjà configuré
- Au premier démarrage, la base définie dans `POSTGRES_DB` sera créée
- Les utilisateurs de test seront automatiquement ajoutés
- Tout cela grâce au script `init.sql` qui s'exécute au démarrage

4. 📦 Buildez et publiez l'image :

```bash
docker build -t postgres-init .
docker login
docker tag postgres-init monlogin/postgres-init:latest
docker push monlogin/postgres-init:latest
```

## Partie 2 : Création du workflow GitHub Actions

🎯 Dans cette partie, vous devez :

1. Démarrer votre base de données comme un service dans GitHub Actions
2. Vérifier que les données sont bien présentes
3. [Optionnel] Faire un dump de la base

⚠️ Points importants pour le workflow :

- Le service doit être prêt avant d'être utilisé (d'où le healthcheck)
- La connexion nécessite les bonnes credentials
- Les secrets GitHub permettent de gérer les credentials de façon sécurisée

Créez un fichier `.github/workflows/exercice_postgres.yml`

Voici les éléments importants à inclure :

1. **🔌 Service PostgreSQL**

- Utilisez l'image que vous avez créée
- Ouvrez le port 5432
- Utilisez la commande `pg_isready` pour le healthcheck
- Passez les variables d'environnement suivantes au service :
  - POSTGRES_USER: <username>
  - POSTGRES_PASSWORD: <password>
  - POSTGRES_DB: <database>

2. **🛠️ Installation du client PostgreSQL**

```bash
sudo apt-get update && sudo apt-get install -y postgresql-client
```

3. **🔍 Connexion à la base**

- Utilisez `psql` (le client en ligne de commande PostgreSQL) avec cette commande :

```bash
psql -h localhost -U <username> -d <database> -c "SELECT * FROM users;"
```

💡 Astuce : Pour que la connexion fonctionne, PostgreSQL a besoin du mot de passe. Il le cherche automatiquement dans une variable d'environnement nommée `PGPASSWORD`. Pensez à configurer cette variable dans votre step !

⚠️ Important :

- 🔐 Pensez à configurer les secrets dans votre dépôt GitHub
- Les valeurs des secrets doivent correspondre à celles de votre image Docker

4. **💾 Sauvegarde de la base**

```bash
docker exec ${{ job.services.db.id }} pg_dump -U <username> -d <database> > dumps/dump.sql
```

📝 Explication détaillée de la commande :

1. `docker exec` : Cette commande permet d'exécuter une instruction à l'intérieur d'un conteneur en cours d'exécution

   - C'est comme si on "entrait" dans le conteneur pour y exécuter une commande

2. `${{ job.services.db.id }}` : C'est une variable spéciale fournie par GitHub Actions

   - Elle contient l'identifiant unique du conteneur PostgreSQL
   - GitHub Actions la crée automatiquement pour tous les services définis dans le workflow

3. `pg_dump` : C'est l'outil officiel PostgreSQL pour sauvegarder une base de données

   - Il crée une sauvegarde complète de la base au format SQL
   - Cette sauvegarde peut être utilisée plus tard pour restaurer la base

4. L'avantage de cette approche :
   - On utilise pg_dump directement depuis le conteneur PostgreSQL
   - Pas de problème de version car on utilise les outils du conteneur
   - Pas besoin d'installer de logiciels supplémentaires
   - Pas de problème de connexion car on est directement dans le conteneur

💡 Cette méthode est plus fiable que d'installer pg_dump sur le runner GitHub Actions car elle garantit que la version de pg_dump correspond exactement à la version de PostgreSQL utilisée.

5. **📦 Publication du backup**

- Publiez le fichier `dumps/backup.sql` comme artifact GitHub
- Donnez un nom significatif à votre artifact (par exemple "database-backup")

## 🔍 Vérification

Votre workflow doit :

1. Démarrer correctement le service PostgreSQL
2. Se connecter à la base
3. Afficher les utilisateurs créés (Henri, Alice, Bob)
4. Créer un dump de la base
5. Rendre le dump disponible comme artifact dans GitHub Actions

## 💡 Conseils

- Testez votre image localement avant de la publier
- Vérifiez que vos secrets correspondent aux variables dans le Dockerfile
- Consultez les logs en cas d'échec du workflow
