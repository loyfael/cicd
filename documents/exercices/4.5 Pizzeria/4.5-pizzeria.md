# Exercice : Simulation d'une pizzeria avec GitHub Actions

## 🔍 Contexte

Vous êtes le nouveau responsable de la pizzeria "PizzaCI - Express" et vous avez décidé de moderniser votre établissement avec GitHub Actions. Votre objectif : éviter les catastrophes comme la fois où Luigi a livré une pizza végétarienne à un client qui avait commandé une "Carnivore Supreme" ! 🥩

Le workflow doit simuler tout le processus, de la prise de commande jusqu'à la gestion des réclamations (qu'on espère éviter grâce à notre système automatisé !).

## 🎯 Objectifs pédagogiques

- Comprendre l'utilisation des inputs dans workflow_dispatch
- Maîtriser la manipulation des données JSON avec fromJSON
- Utiliser les matrices pour paralléliser les tâches
- Comprendre le mécanisme de concurrence
- Gérer les permissions GitHub

## 📊 Structure du workflow

```yaml
jobs:
  reception-commande:
    # Configuration de la réception

  cuisine:
    needs: reception-commande
    # Configuration de la cuisine avec matrix

  livraison:
    needs: cuisine
    # Configuration de la livraison avec concurrency

  reclamation:
    needs: livraison
    # Configuration des réclamations avec permissions
```

## 📝 Étapes de réalisation

### 1️⃣ Configuration initiale

- Créer un fichier `.github/workflows/pizzeria.yml`
- Configurer le déclenchement manuel avec `workflow_dispatch`

#### Les inputs dans workflow_dispatch

Les inputs permettent de demander des informations à l'utilisateur qui lance le workflow manuellement. Chaque input peut avoir :
- Une description qui explique ce qu'il faut saisir
- Un statut required (obligatoire) ou non

Exemple simple d'un input :
```yaml
on:
  workflow_dispatch:
    inputs:
      nombre_personnes:
        description: "Nombre de personnes pour la commande"
        required: true
```

#### Configuration des inputs pour notre pizzeria

Nous avons besoin de deux inputs :
1. `nom_client` : pour identifier le client
2. `pizzas` : pour la liste des pizzas commandées

Voici le code exact à utiliser pour la description dans la clé Pizzas
```yaml
description: |
  Liste des pizzas au format JSON. Attention aux points importants:
  - Utilisez des guillemets doubles
  - Entourez la liste avec []
  Exemple: ["margherita","reine","calzone"]
```

### 2️⃣ Réception de la commande

1. Créer un job `reception-commande`

#### Récupération des inputs

Les inputs du workflow_dispatch sont accessibles via le contexte `github.event.inputs`. Pour récupérer un input, utilisez la syntaxe :
```yaml
${{ github.event.inputs.nom_input }}
```

2. Configurer un output pour transmettre la liste des pizzas au job suivant (cuisine)
3. Créer des steps pour :
   - Afficher un message d'accueil avec le nom du client
   - Confirmer la réception de la commande ainsi que les pizzas commandées.

### 3️⃣ Préparation en cuisine

1. Créer un job `cuisine` qui s'occupe de préparer les pizzas.
2. Configurer une matrice avec :
   - `pizza` : utiliser fromJSON* pour récupérer la liste des pizzas
   - `taille` : ["L", "XL"]
3. Ajouter une configuration include pour une pizza dessert gratuite
4. Créer un step pour simuler la préparation de chaque pizza (echo qui présie que tel pizza de telle taille est en cours de préparation)

#### Note sur fromJSON*

La matrice peut accepter un tableau comme valeur.  
Dans notre cas, les pizzas arrivent au format JSON `["pizza1","pizza2"]`.  
Pour transformer ce JSON en tableau utilisable par la matrice, on utilise la fonction `fromJSON` :

```yaml
${{ fromJSON(<fichier.json>) }}
```

⚠️ Important : 
- On ne récupère pas directement l'input du workflow_dispatch avec `github.event.inputs`. Ce serait trop facile 😊.
- On utilise les pizzas qui nous sont envoyés directement par le job `reception-commande`.
- La fonction `fromJSON` transforme la chaîne JSON en tableau utilisable par la matrice

### 4️⃣ Livraison

1. Créer un job `livraison` qui va se charger de livrer les pizzas.
2. Pour optimiser nos ressources, si une nouvelle commande arrive pendant une livraison en cours, le livreur doit pouvoir annuler sa livraison actuelle pour prendre en charge la nouvelle commande (indice : pensez à `concurrency`).
3. Créer deux steps qui affichent un message avec:
   - Préparation de la livraison pour <nom_du_client>
   - Les pizzas à livrer sont : <liste des pizzas>

⚠️ Important : 
- il est toujours interdit de récupérer les données depuis `github.event.inputs`. Les pizzas 
arrivent toutes chaudes depuis la `cuisine`.

### 5️⃣ Gestion des réclamations

1. Créer un job `reclamation` qui dépend de `livraison`

#### Configuration des permissions

Pour pouvoir créer des issues dans le workflow, il faut ajouter les permissions nécessaires pour écrite des issues.
Normalement vous devez pouvoir trouver comment faire dans la doc assez facilement.
Surtout ne donnez cette permission qu'au job reclamation.

#### Créer une issue depuis notre workflow

Pour ça on doit utiliser le Github cli.
Cela permet d'interagir avec github depuis le runner github actions via des commandes CLI.
Github CLI est automatiquement installé dans les runners github actions.

- [GitHub CLI dans les workflows](https://docs.github.com/fr/actions/writing-workflows/choosing-what-your-workflow-does/using-github-cli-in-workflows)
- [Manuel de GitHub CLI](https://cli.github.com/manual/)
- [gh issue](https://cli.github.com/manual/gh_issue)
- [gh issue create](https://cli.github.com/manual/gh_issue_create)

Aides:
1. Ajouter le token GitHub dans les variables d'environnement de la step qui execute la commande gh:
```yaml
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

2. Pour faciliter la récupération les droits sur le repo et pouvoir utiliser gh on doit utiliser l'action checkout au préalable même si on ne se servira pas du code récupéré.
   => Les commandes `gh` doivent être exécutées après avoir cloné le dépôt avec `actions/checkout@v4`

3. indice supplémentaire une issue :
```yaml
- run: |
    gh issue create --title "title" --body "message du body"
```

## 🛠️ Conseils techniques

- Utilisez `runs-on: ubuntu-latest` pour tous les jobs
- Pour l'input JSON : `["pizza1","pizza2"]` (attention aux guillemets doubles)
- Pour la concurrence, utilisez `concurrency` au niveau du job
- Pour les permissions, utilisez `permissions` au niveau du job

## ⚠️ Points d'attention

- Le format JSON doit être strictement respecté
- Les needs doivent être correctement configurés
- La concurrence doit permettre l'annulation des livraisons
- Les permissions doivent être limitées au strict nécessaire

## ✅ Critères de réussite

- Le workflow s'exécute sans erreur
- Les pizzas sont correctement transmises entre les jobs
- La matrice génère le bon nombre de combinaisons
- La livraison peut être annulée si une nouvelle commande arrive
- Les issues sont créées avec les bonnes permissions

## 💭 Indices supplémentaires

- Pensez à tester le workflow avec différentes combinaisons de pizzas
- La matrice permet de préparer plusieurs pizzas en parallèle
- La concurrence simule un livreur qui ne peut gérer qu'une livraison à la fois
- Les permissions sont nécessaires uniquement pour le job de réclamation
