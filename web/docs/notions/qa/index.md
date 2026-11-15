---
title: Assurance-qualité et plans de test
sidebar_label: Assurance-qualité
description: Assurance-qualité
sidebar-position: 6
---

Dans un script d'administration, un **test** consiste à comparer un résultat observé à un résultat attendu dans des conditions définies. 

On appelle **assurance-qualité** le processus qui consiste à valider l'inocuité d'un script, l'absence de cas d'erreurs. Elle englobe la préparation des essais, la documentation des écarts et la vérification des corrections. Ces pratiques contribuent à la **robustesse** du script, par exemple lorsqu'un import doit signaler une donnée invalide et poursuivre le traitement.

Lorsque vous développez un script, et à plus forte raison un script qui vise à être exécuté de manière autonome et sur des systèmes en production, vous avez intérèt à le tester exhaustivement, et pas seulement dans des conditions normales. Vous voulez identifier tous les cas potentiellement problématiques.

Voici une méthode recommandée:

- Identifier les **exigences** (E) de votre script
- Élaborer des **cas de tests** (T) pour valider le respect des exigences dans des cas limites et identifier le **résultat attendu**
- Exécuter les cas de tests et comparer le résultat à celui attendu; s'il diffère, noter un défaut (D)
- Modifier le script en tenant compte des défauts et relancer le plan de test
- Répéter l'exercice jusqu'à ce que tous les cas de test soient complétés sans défaut

## Portée, criticité et environnement

La **portée** indique les comportements à vérifier.

La **criticité** aide à déterminer l'ordre des essais selon la probabilité d'un problème et la gravité de ses conséquences. Par exemple, un identifiant en double peut compromettre la création des comptes. Un message de progression imprécis gêne surtout la lecture.

| Environnement | Rôle                                            | Exemple                                                                            |
| ------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------- |
| Développement | Modifier le code et essayer une correction      | Travailler sur une copie du script                                                 |
| Test          | Reproduire un essai dans des conditions connues | Utiliser des CSV fictifs et noter la version de PowerShell                         |
| Production    | Exécuter le traitement réel                     | Observer les effets sur les comptes et prévoir un retour arrière selon l'opération |

## Niveaux de test

| Niveau      | Ce qu'on vérifie                               | Exemple                                                                        |
| ----------- | ---------------------------------------------- | ------------------------------------------------------------------------------ |
| Composant   | Le comportement d'une partie du code isolée    | Appeler une fonction de validation IPv4 avec une adresse précise               |
| Intégration | Le fonctionnement de plusieurs étapes ensemble | Lire un lot mixte et vérifier que la validation se poursuit après un rejet     |
| Résultat    | La conformité de la sortie                     | Vérifier le nombre, les propriétés, les valeurs et l'ordre des objets renvoyés |

## Choix des scénarios et des données

Un **scénario** décrit une situation. Un **cas de test** précise les données, les préconditions, la procédure et le résultat attendu. Pour choisir les données, pensez aux groupes d'entrées qui devraient se comporter de la même façon, puis examinez leurs frontières.

| Catégorie    | Exemple dans le laboratoire                                                                  |
| ------------ | -------------------------------------------------------------------------------------------- |
| Cas usuel    | Un employé valide du département TI                                                          |
| Cas limite   | Un prénom d'une lettre, soit la longueur minimale acceptée                                   |
| Cas d'erreur | Un fichier source absent                                                                     |
| Lot mixte    | Des lignes valides et invalides dans un même fichier, pour vérifier la poursuite de l'import |

Pour une règle "supprimer les fichiers de plus de 30 jours", des fichiers de 29, 30 et 31 jours vérifient les deux côtés du seuil ainsi que la valeur exacte. En jours entiers, seuls les fichiers de 31 jours doivent être supprimés parmi ces trois cas. Utilisez une date de référence fixe pour reproduire l'essai.

## Plan de test, preuves et décision

Un **plan de test** regroupe la portée, les priorités, les conditions d'exécution, les cas à vérifier et les critères d'acceptation. Rédigez chaque attendu à partir des exigences **avant** d'exécuter le script. Pour un import, précisez le nombre d'objets, leurs valeurs et leur ordre, ainsi que les avertissements ou erreurs attendus.

Dans le journal, indiquez la version du script, la commande exécutée, le résultat obtenu et la preuve. Une copie de la sortie PowerShell peut servir de preuve si elle montre les valeurs ou les diagnostics qui justifient le statut.

- **Réussi.** Le résultat correspond à l'attendu. Une erreur prévue compte comme une réussite si le script produit le diagnostic prévu.
- **Échoué.** L'essai révèle un écart que vous pouvez décrire.
- **Bloqué.** Un prérequis absent empêche de mener l'essai à terme.

Après une correction, rejouez le cas qui a révélé le défaut. Rejouez aussi un cas qui réussissait déjà pour vérifier que la modification n'a pas introduit de **régression**. Dans le laboratoire, les huit cas doivent réussir sur la même version pour satisfaire les critères d'acceptation du script.

## Exemple de plan de test

Un script nommé `Trouver-FichiersAArchiver.ps1` renvoie les fichiers d'un dossier dont la dernière modification date de **plus de 30 jours entiers**. L'équipe d'exploitation utilise cette liste pour préparer un archivage.

```powershell title="Trouver-FichiersAArchiver.ps1"
param(
    [Parameter(Mandatory)]
    [string]$Dossier,

    [datetime]$DateReference = (Get-Date)
)

if (-not (Test-Path -LiteralPath $Dossier -PathType Container)) {
    throw "DOSSIER_ABSENT : le dossier '$Dossier' est introuvable."
}

$fichiers = Get-ChildItem -LiteralPath $Dossier -File -ErrorAction Stop

foreach ($fichier in $fichiers) {
    $age = $DateReference - $fichier.LastWriteTime
    $ageJours = [math]::Floor($age.TotalDays)

    if ($ageJours -gt 30) {
        [pscustomobject]@{
            Nom      = $fichier.Name
            AgeJours = $ageJours
        }
    }
}
```

### Informations générales

| Champ                  | Valeur                                                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Objectif               | Vérifier la sélection des fichiers avant de transmettre la liste à l'équipe d'exploitation                                                           |
| Versions               | v1 pour les premiers essais, v2 après correction                                                                                                     |
| Portée                 | Calcul de l'âge, sélection des fichiers à la racine, contenu de la sortie et erreur si le dossier est absent                                         |
| Hors portée            | Archivage, déplacement et suppression des fichiers                                                                                                   |
| Environnement          | Windows, PowerShell 7, dossier d'essai local avec des fichiers fictifs                                                                               |
| Risque prioritaire     | Signaler par erreur un fichier de 30 jours et provoquer son archivage prématuré                                                                      |
| Critères d'acceptation | Tous les cas T01 à T05 réussissent sur la même version. Chaque résultat est associé à une preuve et aucun défaut connu ne contrevient aux exigences. |

### Exigences

- **E1.** Calculer l'âge en jours entiers depuis la dernière modification jusqu'à la date de référence. Renvoyer uniquement les fichiers de plus de 30 jours.
- **E2.** Examiner uniquement les fichiers à la racine du dossier. Renvoyer un objet par fichier retenu avec les propriétés `Nom` et `AgeJours`. Un dossier vide produit zéro objet.
- **E3.** Si le dossier est absent, arrêter avant toute sortie avec une erreur contenant `DOSSIER_ABSENT`.

### Données et préconditions

Le script d'exemple reçoit `-Dossier` et `-DateReference`. Pour reproduire les âges, fixer la date de référence au **15 octobre 2026 à 12 h**, en heure locale. Dans un dossier de travail neuf, préparer les données suivantes. Le dossier `absent` ne doit pas exister.

```powershell
$reference = [datetime]'2026-10-15T12:00:00'
New-Item -ItemType Directory -Path './usuel', './limites', './vide', './racine' |
    Out-Null
New-Item -ItemType Directory -Path './racine/sous-dossier' | Out-Null

$fichiers = @{
    './usuel/ancien.log'                = 45
    './usuel/recent.log'                = 10
    './limites/j29.log'                 = 29
    './limites/j30.log'                 = 30
    './limites/j31.log'                 = 31
    './racine/visible.log'              = 40
    './racine/sous-dossier/interne.log' = 40
}

foreach ($chemin in $fichiers.Keys) {
    $fichier = New-Item -ItemType File -Path $chemin
    $fichier.LastWriteTime = $reference.AddDays(-$fichiers[$chemin])
}
```

### Cas de test

**Procédure commune.** Pour T01 à T04, remplacer `./usuel` par le dossier indiqué dans la fiche, exécuter la commande et relever le nombre et les valeurs des objets. Pour T05, appeler le script avec `-Dossier './absent'` sans affectation et relever le diagnostic. Consigner tout avertissement ou toute erreur inattendue.

```powershell
$resultats = @(./Trouver-FichiersAArchiver.ps1 -Dossier './usuel' -DateReference $reference)
$resultats.Count
$resultats | Format-Table Nom, AgeJours
```

| Cas | Catégorie et niveau  | Exigences | Dossier et scénario                                                       | Attendu avant l'exécution                                  |
| --- | -------------------- | --------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| T01 | Usuel - Résultat     | E1, E2    | `usuel` - Un fichier ancien et un récent                                  | Un objet `ancien.log`, âge 45. Aucun diagnostic.           |
| T02 | Limite - Résultat    | E1        | `limites` - Fichiers de 29, 30 et 31 jours                                | Un objet `j31.log`, âge 31. Aucun diagnostic.              |
| T03 | Limite - Résultat    | E2        | `vide` - Aucun fichier                                                    | Zéro objet. Aucun diagnostic.                              |
| T04 | Usuel - Intégration  | E1, E2    | `racine` - Un fichier ancien à la racine et un autre dans un sous-dossier | Un objet `visible.log`, âge 40. Aucun diagnostic.          |
| T05 | Erreur - Intégration | E3        | `absent` - Chemin inexistant                                              | Zéro objet et erreur bloquante contenant `DOSSIER_ABSENT`. |

T02 est prioritaire, car il vérifie le seuil qui détermine si un fichier peut être archivé. T01 sert aussi de cas de régression.

### Journal d'exécution et preuves

Les observations suivantes sont **illustratives**. Chaque cellule présente le résultat et la preuve à conserver. Le couple entre parenthèses indique le nom et l'âge affichés par PowerShell. Dans un journal réel, joindre la sortie brute et inscrire la date, le nom de la personne et la version exacte de PowerShell.

| Cas | v1 - Observation et preuve                                    | Statut v1    | v2 - Observation et preuve                    | Statut v2 |
| --- | ------------------------------------------------------------- | ------------ | --------------------------------------------- | --------- |
| T01 | 1 objet `(ancien.log, 45)`, aucun diagnostic                  | Réussi       | 1 objet `(ancien.log, 45)`, aucun diagnostic  | Réussi    |
| T02 | 2 objets `(j30.log, 30)` et `(j31.log, 31)`, aucun diagnostic | Échoué - D01 | 1 objet `(j31.log, 31)`, aucun diagnostic     | Réussi    |
| T03 | Compteur à 0, aucun diagnostic                                | Réussi       | Compteur à 0, aucun diagnostic                | Réussi    |
| T04 | 1 objet `(visible.log, 40)`, aucun diagnostic                 | Réussi       | 1 objet `(visible.log, 40)`, aucun diagnostic | Réussi    |
| T05 | Aucun objet, erreur `DOSSIER_ABSENT`                          | Réussi       | Aucun objet, erreur `DOSSIER_ABSENT`          | Réussi    |

### Registre des défauts et des corrections

#### D01

- **Gravité:** Élevée - Le fichier de 30 jours est retenu
- **Cas et preuve initiale:** T02 en v1 - La sortie contient `j30.log`
- **Cause:** Le filtre utilise `$ageJours -ge 30`, qui inclut le jour 30
- **Correction et vérification:** En v2, utiliser `$ageJours -gt 30`. T02 confirme la correction et T01 confirme que la sélection usuelle fonctionne encore.

### Décision

La **v1 est refusée** parce que T02 révèle une violation du seuil d'archivage. La **v2 est acceptée dans la portée du plan** après avoir rejoué les cinq cas sur cette version. T02 vérifie la correction et T01 fournit une preuve de régression sur le cas usuel.