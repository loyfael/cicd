# Exercice : Simulation d'une enquête policière avec GitHub Actions

## 🔍 Contexte

Un vol a eu lieu dans le supermarché SuperPrix. Vous devez mettre en place un workflow GitHub Actions qui simule la coordination entre les différents intervenants de l'enquête.

## 🎯 Objectifs pédagogiques

- Comprendre le fonctionnement des workflows GitHub Actions
- Maîtriser la communication entre les jobs
- Utiliser les variables d'environnement et les outputs
- Gérer l'exécution conditionnelle
- Comprendre l'exécution parallèle vs séquentielle

## 📝 Étapes de réalisation

### 1️⃣ Configuration initiale

- Créer un fichier `.github/workflows/vol.yml`
- Définir le nom du workflow et l'event `push`
- Il y aura 4 acteurs qui sont des jobs : 2 policiers, 1 détective, 1 équipe d'intervention

### 2️⃣ Les policiers sur le terrain

1. Créer deux jobs en parallèle :
   - `policier-scene` : collecte des empreintes
   - `policier-video` : récupération des vidéos
2. Pour le policier-scene :
   - Définir un output statique (Sans contexte ni GITHUB_OUTPUT) avec la clé `empreinte` et la valeur `empreinte trouvée sur la caisse`.
   - Créer des steps pour simuler l'analyse avec des "echo"
     - `echo "Le policier examine la caisse enregistreuse"`
     - `echo "Empreinte prélevée sur la caisse"`
3. Pour le policier-video :
   - Utiliser `GITHUB_OUTPUT` dans une step pour transmettre l'information de la vidéo
   - 💡 _Indice_ : Utiliser la syntaxe `echo "cle=valeur" >> $GITHUB_OUTPUT`
   - la clé et valeur dans le GITHUB_OUTPUT sera `resultat` et `Séquence vidéo 22h15-22h45 récupérée`
   - On exporte dans l'output du policier-video la vidéo avec la clé `video` et la valeur récupérée depuis le contexte steps avec la clé resultat

### 3️⃣ Le travail du détective

1. Créer un job `detective` qui doit attendre que les deux policiers aient terminé leur travail
2. Première step: Récupérer et afficher (echo) les indices des policiers
   - Utiliser la syntaxe `${{ needs.jobid.outputs.output_name }}`
3. Deuxième step: Analyser les indices et ajouter l'analyse de l'empreinte et de la vidéo dans les variables d'environnement (avec GITHUB_ENV)
   - utilier la clé `ANALYSE_EMPREINTE` et la valeur `Empreinte correspond à un suspect connu`
   - utilier la clé `ANALYSE_VIDEO` et la valeur `Suspect identifié sur la vidéo à 22h30`
4. Troisième step: Produire un rapport final avec 3 outputs :

   - Le rapport complet (clé: `conclusion`, valeur: on récupère la valeur de la variable d'environnement `ANALYSE_EMPREINTE` et `ANALYSE_VIDEO` et on les concatène avec un "suspect identifié")
   - Le lieu d'arrestation (clé: `lieu`, valeur: `42 Avenue du Commerce, Supermarché SuperPrix`)
   - L'autorisation d'arrestation (clé: `autorisation`, valeur: `true`)
   - 💡 _Indice pour la concaténation_ :

     ```yaml
     echo "conclusion=${VARIABLE1}, ${VARIABLE2}, texte à ajouter" >> "$GITHUB_OUTPUT"
     ```

5. Envoyer le rapport final à l'équipe d'intervention
   - Utiliser la propriété outputs et envoyer les clés suivantes: rapport, lieu_arrestation, autorisation_arrestation
   - Pour le rapport on récupère les données sur rapport de la dernière step: conclusion, lieu et autorisation à mettre dans les clés rapport, lieu_arrestation et autorisation_arrestation

### 4️⃣ L'intervention policière

1. Créer le dernier job `police`
2. Attend le rapport du detectve.
3. step 1: Afficher le rapport
4. Implémenter la logique conditionnelle dans deux steps:
   - step 1:Si pas d'autorisation → enquête sans suite
   - step 2: Si autorisation → arrestation

## 🛠️ Conseils techniques

- Utilisez `runs-on: ubuntu-latest` pour tous les jobs
- Pour les variables d'environnement :

  ```yaml
  echo "NOM=valeur" >> $GITHUB_ENV
  ```

- Pour les outputs :

  ```yaml
  echo "nom=valeur" >> $GITHUB_OUTPUT
  ```

- N'oubliez pas les `id:` pour les steps qui produisent des outputs

## ⚠️ Points d'attention

- Vérifiez que les noms des outputs correspondent exactement entre leur définition et leur utilisation
- Attention à la syntaxe des conditions dans les `if:`
- Les jobs en parallèle ne peuvent pas communiquer directement entre eux

## ✅ Critères de réussite

- Le workflow s'exécute sans erreur
- Les jobs s'exécutent dans le bon ordre
- Les informations sont correctement transmises entre les jobs
- Les conditions d'arrestation fonctionnent dans les deux cas (true/false)

## 🚀 Pour aller plus loin

- Ajoutez des conditions d'échec possibles
- Implémentez plusieurs scénarios différents
- Ajoutez des notifications (par exemple vers une webhook Discord)
- Créez des artifacts pour sauvegarder les preuves

## 📊 Structure du workflow final

```yaml
jobs:
  policier-scene:
    # À compléter...

  policier-video:
    # À compléter...

  detective:
    needs: [policier-scene, policier-video]
    # À compléter...

  police:
    needs: detective
    # À compléter...
```

## 💭 Indices supplémentaires

- Pensez à la chronologie d'une vraie enquête
- Chaque job représente un acteur différent avec ses propres responsabilités
- Les outputs sont comme des rapports transmis entre les différents intervenants
- Les conditions simulent la prise de décision basée sur les preuves recueillies
