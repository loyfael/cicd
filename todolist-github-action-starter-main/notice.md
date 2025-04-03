# 🚀 Exercice : Mise en place d'un workflow CI/CD avec GitHub Actions

## 🎯 Objectif

À partir d'une mini-application, vous devez créer une chaîne d'intégration et de déploiement continu (CI/CD) en utilisant GitHub Actions avec des environnements de développement et de production.

## 💻 Développement de l'application

### Prérequis

- Créer un repository GitHub
- Créer une mini-application simple avec des tests et un linter (par exemple une todolist) avec React/Vite
- Tester en local que les scripts de test et le linter passent
- ⚠️ Les tests doivent se terminer à la fin de leur exécution

### Gestion des branches

- `main` : branche principale
- `develop` : branche de développement
- Les branches `feature/*` doivent être créées depuis `develop`
- Une fois `develop` stable, elle peut être mergée dans `main`

## 🔄 Flow CI/CD

### Flow de développement

Lors d'une pull request d'une branche feature vers develop, la séquence suivante se déclenche :

1. Exécution des tests
2. Build (fictif)
3. Déploiement (fictif) sur l'environnement de développement

En cas de succès, le workflow :

- Merge automatiquement la pull request
- Crée une pull request de develop vers main

### Flow de production

Après review et validation manuelle de la pull request develop → main :

- Déploiement (fictif) sur l'environnement de production

## ⚙️ Configuration

### Environnements GitHub

Créer deux environnements dans GitHub :

| Environnement | Variables                                     | Secrets        |
| ------------- | --------------------------------------------- | -------------- |
| `develop`     | `DEPLOY_URL: https://dev.todoapp.exemple.com` | `DEPLOY_TOKEN` |
| `production`  | `DEPLOY_URL: https://todoapp.exemple.com`     | `DEPLOY_TOKEN` |

### Protection des branches

Configuration requise pour `main` et `develop` :

- ✅ Pull requests uniquement (pas de push direct)
- ✅ Tests obligatoires (à activer après mise en place du workflow)
- ✅ Pour `main` : minimum 1 reviewer

## 📝 Workflow GitHub Actions

Créer le fichier `.github/workflows/ci-cd.yml` depuis une branche feature.

### Événements déclencheurs

Nous devons écouter les événements suivants:

- Pull requests sur develop et main
- Merge manuel d'une PR sur main (push)
- Reviews de pull requests (type: submitted) pour lancer les tests

### Jobs à implémenter

| Job                                | Description                                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| `unit-tests`                       | Tests unitaires                                                                              |
| `lint`                             | Vérification ESLint                                                                          |
| `build`                            | Simule un build de l'application                                                             |
| `deploy-dev`                       | Simule un déploiement en développement (uniquement pour les PRs depuis les branches feature) |
| `auto-merge-and-create-release-pr` | Gestion automatique des PRs                                                                  |
| `deploy-prod`                      | Simule un déploiement en production (uniquement après merge sur main)                        |

### Détails des jobs

#### Tests et Lint (parallèles)

Ces deux jobs doivent s'effectuer en parallèle.

##### `unit-tests`

- Exécution des tests unitaires
- Doit utiliser une matrice pour executer des tests sur plusieurs version de node (18 et 22 par exemple).
- Doit utiliser du cache pour les dépendances.
- Doit générer un résumé des tests dans le job summary (GITHUB_STEP_SUMMARY)

##### `lint`

- vérifie le code avec ESLint
- Doit générer un résumé dans le job summary (GITHUB_STEP_SUMMARY)

#### Build

Doit se lancer si les tests sont valides

- simule un build de l'application
- C'est un fake build donc vous pouvez juste faire des echo

#### Deploy Dev

Simule un déploiement en développement (uniquement pour les PRs depuis les branches feature)

- Doit avoir des regles de concurrence.
- Doit se déclencher si la PR est depuis une branche feature et si le build est validé
- On doit récupérer les variables DEPLOY_URL et DEPLOY_TOKEN depuis l'environnement develop et les utiliser de façon fictive
- on fait donc des echos dans le job car c'est un deploiement fictif

#### Auto-merge et Release PR

De façon automatique merge les pull requests vers develop (si validé) et crée une PR de develop vers main

- Ce workflow se declenche si deploy-dev est un succès (donc les tests et le build sont également validé)
- Il doit valider automatiquement la pr de feature vers develop
- il doit également créer une pr de develop vers main

Pour ça on doit utiliser le github cli.
Cela permet d'interagir avec github depuis le runner github actions via des commandes CLI.
Github CLI est automatiquement installé dans les runners github actions.

- [GitHub CLI dans les workflows](https://docs.github.com/fr/actions/writing-workflows/choosing-what-your-workflow-does/using-github-cli-in-workflows)
- [Manuel de GitHub CLI](https://cli.github.com/manual/)
- [gh pr merge](https://cli.github.com/manual/gh_pr_merge)
- [gh pr create](https://cli.github.com/manual/gh_pr_create)

Pour le job `auto-merge-and-create-release-pr`, vous devrez :

1. Ajouter les permissions nécessaires :

```yaml
permissions:
  # On veut que le workflow puisse merger les PR
  pull-requests: write
  # On veut que le workflow puisse créer des PR
  contents: write
```

2. Utiliser ces commandes

```yaml
# Merge la PR si elle est validée
- run: gh pr merge --auto --merge "${{ github.event.pull_request.number }}"
# Crée une PR de develop vers main
- run: gh pr create --base main --head develop --title "Release to production" --body "Automated PR from develop to main"
```

3. exemple complet

```yaml
run: gh pr merge --auto --merge "${{ github.event.pull_request.number }}"
# nécéssite d'utiliser le token github et le mettre dans la variable d'environnement GH_TOKEN
env:
  GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Pour pouvoir créer une PR dans le workflow, il faut que soit coché dans les settings du repository  
✅ "allow GITHUB to create and approve pull request"  
settings > actions > general > allow GITHUB to create and approve pull request

![Allow Github Action to create and approve pull requests](/assets/Allow_action_%20pr.png)

#### Deploy Prod

Simule un déploiement en production (uniquement après merge sur main)

- Doit avoir des regles de concurrence
- Doit se déclencher si c'est un merge sur main (validation manuelle d'une pr c'est un push)
- C'est un fake donc juste des echo avec les variables et secrets de l'environnement production à afficher
- on peut ajouter des informations dans le job summary (GITHUB_STEP_SUMMARY)

## 🔍 A savoir / Aide

on peut utiliser des contextes github pour récupérer des informations sur l'événement qui a déclenché le workflow.

```yaml
github.event_name  # push | pull_request (nom de l'événement)
github.ref        # refs/heads/main | refs/heads/develop (nom de la branche)
github.event.pull_request.number # (numéro de la PR)
```

## 🧪 Test du workflow

1. Créer une branche feature/test
2. Créer une PR vers develop
3. Le workflow doit se déclencher automatiquement:
   - les tests sont lancés
   - s'ils réussissent le fake build est lancé
   - s'il réussit le deploiement fictif sur develop est lancé
   - enfin la pr est mergé automatiquement sur develop
   - et une nouvelle pr est crée de develop vers main
4. Review + Valider/merge la PR develop → main
5. Observer le deploy prod
   - le workflow de production doit se déclencher

## 📊 Résultats attendus

### Exemple de Workflow Develop

![Exemple de workflow sur develop](/assets/workflow_development.png)

### Exemple de Workflow Main

![Exemple de workflow sur main](/assets/exemple_workflow_production.png)

### Exemple de Summary

![Exemple de summary](/assets/exemple_summary.png)
