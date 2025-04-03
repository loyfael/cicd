# TodoList GitHub Actions Starter

Un kit de démarrage d'application Todo List React conçu pour apprendre les workflows CI/CD avec GitHub Actions.

> 📝 Consultez la [notice de l'exercice](notice.md) pour plus de détails sur les objectifs et les étapes à suivre.

## Fonctionnalités

- Ajouter de nouvelles tâches
- Marquer les tâches comme complétées
- Modifier les tâches existantes
- Supprimer les tâches

## Stack Technique

- React 19
- TypeScript
- Vite
- Vitest
- React Testing Library
- CSS3

## Tests

Exécuter les tests en mode watch :

```bash
npm test
# ou
yarn test
```

Exécuter les tests pour le CI (exécution unique) :

```bash
npm run test:ci
# ou
yarn run test:ci
```

Générer un rapport de couverture de tests :

```bash
npm run test:coverage
# ou
yarn test:coverage
```

## Structure du Projet

```
src/
  ├── components/
  │   ├── TodoList.tsx
  │   ├── TodoItem.tsx
  │   ├── TodoItemEdit.tsx
  │   └── __tests__/
  │       └── TodoList.test.tsx
  ├── App.tsx
  ├── App.css
  └── main.tsx
```

## Configuration GitHub Actions

### Environnements

Deux environnements sont configurés :

| Environnement | Variables                                     | Secrets        |
| ------------- | --------------------------------------------- | -------------- |
| `develop`     | `DEPLOY_URL: https://dev.todoapp.exemple.com` | `DEPLOY_TOKEN` |
| `production`  | `DEPLOY_URL: https://todoapp.exemple.com`     | `DEPLOY_TOKEN` |

### Gestion des Branches

- `main` : branche principale
- `develop` : branche de développement
- Les branches `feature/*` doivent être créées depuis `develop`

### Protection des Branches

Configuration requise pour `main` et `develop` :

- ✅ Pull requests uniquement (pas de push direct)
- ✅ Tests obligatoires
- ✅ Pour `main` : minimum 1 reviewer

## Workflow CI/CD

### Flow de Développement

Lors d'une pull request d'une branche feature vers develop :

1. Exécution des tests
2. Build (fictif)
3. Déploiement (fictif) sur l'environnement de développement

En cas de succès :

- Merge automatique de la pull request
- Création d'une pull request de develop vers main

### Flow de Production

Après review et validation manuelle de la pull request develop → main :

- Déploiement (fictif) sur l'environnement de production

## Objectifs d'Apprentissage

Ce repository de démarrage est conçu pour vous aider à apprendre :

- L'implémentation de GitHub Actions
- La mise en place de pipelines CI/CD
- Les stratégies de protection des branches
- La configuration des environnements
- Les tests automatisés en CI

## Prochaines Étapes

Consultez le repository solution [todolist-github-actions-solution](https://github.com/HenriTeinturier/todolist-github-actions-solution) pour voir l'implémentation complète avec les workflows GitHub Actions.
