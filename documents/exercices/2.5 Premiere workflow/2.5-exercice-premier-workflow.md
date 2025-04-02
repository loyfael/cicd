# 📝 Exercice : Création d’un répertoire et d’un fichier dans un workflow GitHub Actions

Dans cet exercice, vous allez créer un **workflow GitHub Actions** déclenché à chaque **push**. Ce workflow comportera **deux jobs** et vous permettra d’observer comment les jobs s’exécutent indépendamment.

---

## 🚀 Objectif
Créer un workflow avec **deux jobs** pour manipuler des fichiers et observer leur persistance entre les jobs.

---

## 📌 Instructions

1. **Créez un nouveau workflow**.
2. **Ajoutez un événement `push`** pour déclencher le workflow.
3. **Implémentez deux jobs distincts** :

### **🔹 Premier job **
Ce job effectuera plusieurs actions :
- Vérifier l’utilisateur connecté sur le runner.
- Récupérer le dépôt.
- Créer un répertoire dans le dépôt.
- Ajouter un fichier texte dans ce répertoire.
- Lister les fichiers à la racine et dans le répertoire créé.

### **🔹 Deuxième job**
Ce job vérifiera la présence du répertoire et du fichier :
- Récupérer à nouveau le dépôt.
- Lister les fichiers pour voir si le répertoire et le fichier sont toujours là.

---

## 💡 Commandes utiles

| Commande | Description |
|----------|------------|
| `ls` | Lister les fichiers et dossiers du répertoire actuel |
| `whoami` | Afficher l’utilisateur actuel exécutant les commandes |
| `mkdir nom_du_repertoire` | Créer un répertoire |
| `echo "texte à ajouter" > nom_du_fichier.txt` | Créer un fichier et y écrire du texte |

---