---
title: Assurance-qualité et plans de test
sidebar_label: Assurance-qualité et tests
toc_max_heading_level: 2
draft: false
---

Une entreprise veut vérifier une liste d'employés avant de créer leurs comptes. Votre mandat est de tester le script fourni, de relever les écarts et de vérifier les corrections.

## Préparation

Téléchargez le fichier zip pour cette activité puis extrayez-le dans un répertoire (par exemple, `C:\EspaceLabo\`).

:link: ![exercice20.zip](https://github.com/departement-info-cem/3t5-automatisation/raw/refs/heads/main/stock/exercice20.zip)

Ouvrez une console PowerShell dans le dossier qui contient `Valider-Comptes.ps1` (vous pouvez aussi ouvrir Visual Studio Code et utiliser le terminal intégré). Le script prend un seul paramètre, `-Entree`. Chaque compte accepté est renvoyé sous forme d'objet PowerShell. Les rejets s'affichent comme avertissements (avec la commande `Write-Warning`).

Pour vous préparer, lisez le contenu du jeu usuel avec `Get-Content .\donnees\1-usuels.csv`. Gardez la commande suivante pour l'exécution, après avoir écrit vos valeurs attendues.

```powershell
$comptes = @(.\Valider-Comptes.ps1 -Entree '.\donnees\1-usuels.csv')
$comptes.Count
$comptes | Format-Table
```

:::tip
Avec `@(...)`, vous obtenez un tableau même si le script renvoie zéro ou un seul compte. Les avertissements s'affichent séparément.
:::

## Règles à vérifier (exigences)

Le tableau suivant répertorie les **exigences** auxquelles le script doit se conformer:

| ID  | Le script doit... |
| --- | :-- |
| **E1**  | Lire un fichier CSV dont l'en-tête est exactement `Prenom,Nom,Departement`. |
| **E2**  | Retirer les espaces aux extrémités des champs. Rejeter une ligne dont un champ est vide après nettoyage avec `CHAMP_MANQUANT`. |
| **E3**  | Accepter seulement `TI`, `RH` et `FIN`, sans égard à la casse. Renvoyer le département en majuscules. Rejeter les autres valeurs non vides avec `DEPARTEMENT_INVALIDE`. |
| **E4**  | Former l'identifiant en accolant la première lettre du prénom au nom, puis en passant le tout en minuscules. Un prénom d'une lettre est valide. |
| **E5**  | Garder le premier compte admissible pour chaque identifiant. Rejeter les suivants avec `DOUBLON`. |
| **E6**  | Renvoyer un objet avec les propriétés `Identifiant`, `Prenom`, `Nom`, `Departement` pour chaque compte accepté, dans l'ordre du CSV. Un fichier avec en-tête seul ou un lot entièrement rejeté produit zéro objet. |
| **E7**  | Afficher un avertissement `Enregistrement N : CODE` par rejet, puis poursuivre. La première ligne de données porte le numéro 1. Vérifier les champs, puis le département, puis le doublon après avoir calculé l'identifiant. |
| **E8**  | Si le fichier est absent ou si l'en-tête est invalide, arrêter avec une erreur contenant respectivement `ENTREE_ABSENTE` ou `ENTETE_INVALIDE`. Dans ces deux cas, zéro objet doit être émis. |

## Rédiger le plan de test

Ouvrez `plan-de-test.md`. Pour chaque cas, lisez le CSV, indiquez la règle visée et écrivez les résultats attendus avant l'essai. Précisez le nombre de comptes, leurs valeurs, leur ordre et les diagnostics attendus.

| Jeu de données               | Situation                                                                 |
| ---------------------------- | ------------------------------------------------------------------------- |
| `1-usuels.csv`               | Comptes valides, dont un avec des espaces et un département en minuscules |
| `2-prenom-court.csv`         | Prénom d'une seule lettre                                                 |
| `3-champ-manquant.csv`       | Champ manquant suivi d'un compte valide                                   |
| `4-departement-invalide.csv` | Département inconnu                                                       |
| `5-doublon.csv`              | Deux employés produisent le même identifiant                              |
| `6-vide.csv`                 | En-tête seul                                                              |
| `7-mixte.csv`                | Lot qui combine plusieurs règles                                          |
| `8-introuvable.csv`          | Fichier volontairement absent                                             |

## Exécuter et recueillir les preuves

Identifiez le script fourni comme **v1**. Reprenez la commande de démarrage avec chaque jeu. Pour le fichier absent, exécutez la commande sans affectation et relevez l'erreur.

Dans le journal, consignez la commande, le nombre de comptes et les valeurs obtenues, ainsi que les avertissements ou l'erreur. Vous pouvez copier la sortie de la console dans le journal. Pour obtenir une vue détaillée à copier, utilisez `$comptes | Format-List`. Indiquez si le cas est **réussi**, **échoué** ou **bloqué**. L'erreur attendue quand le fichier est absent correspond à un cas réussi si le message est conforme.

Pour chaque écart, indiquez l'identifiant du test. Si plusieurs écarts proviennent du même défaut, regroupez-les dans le registre.

## Corriger et vérifier

Copiez le script sous le nom `Valider-Comptes-v2.ps1`. Choisissez deux défauts, relevez leurs causes dans le code et corrigez-les. Rejouez les cas touchés et au moins un cas qui réussissait déjà en v1. Ce dernier sert de test de régression. Ajoutez les résultats de v2 au journal, en conservant ceux de v1.

## Décider et faire valider

Montrez le plan, le journal, le registre des corrections et votre copie du script au professeur. Indiquez le verdict pour v2 et les essais encore nécessaires. Le script est acceptable si les huit cas réussissent sur la même version et qu'aucun défaut connu ne contrevient aux règles.
