# Plan de test - Exemple

- **Équipe :** Paul Meilleur, Agnès Toutant
- **Date :** 2026-11-16
- **Script et version:** Valider-Comptes.ps1 (v1)
- **Portée:** Lecture des CSV, validation des champs, génération des identifiants et objets renvoyés.
- **Environnement:** Microsoft Windows 10.0.26300, PowerShell Core 7.6.9
- **Risques:** Un employé admissible peut être écarté de la liste des comptes à créer.
- **Critères d'acceptation:** Les huit cas obligatoires réussissent sur la même version et aucun défaut connu ne contrevient aux exigences.

## Cas de test

Dupliquez cette fiche pour chaque cas. Remplissez cette partie **avant** l'exécution du script.

### T01 - Cas usuels

#### Exigences visées

E1 à E4 et E6

#### Catégorie (usuel, limite, erreur, intégration)

Usuel

#### Procédure

Lancer les lignes suivantes dans la console PowerShell:

```powershell
$comptes = @(.\Valider-Comptes.ps1 -Entree '.\donnees\1-usuels.csv')
$comptes.Count
$comptes | Format-Table
```

#### Données

Jeu de données: `1-usuel.csv`

```
Prenom,Nom,Departement
 Alice , Roy , ti 
Emile,Nguyen,RH
Nora,Gagnon,FIN
```

#### Résultat attendu

- Aucun avertissement
- 3 objets dans l'ordre:

| Identifiant | Prenom | Nom    | Departement |
| ----------- | ------ | ------ | ----------- |
| aroy        | Alice  | Roy    | TI          |
| enguyen     | Emile  | Nguyen | RH          |
| ngagnon     | Nora   | Gagnon | FIN         |

### T02 - Prénom d'une seule lettre

#### Exigences visées

E4 et E6

Un prénom d'une lettre devrait être valide selon les exigences et doit donner lieu à un objet si les autres champs sont valides.

#### Catégorie (usuel, limite, erreur, intégration)

Limite

#### Procédure

Lancer les lignes suivantes dans la console PowerShell:

```powershell
$comptes = @(.\Valider-Comptes.ps1 -Entree '.\donnees\2-prenom-court.csv')
$comptes.Count
$comptes | Format-Table
```

#### Données

Jeu de données: `2-prenom-court.csv`

```
Prenom,Nom,Departement
A,Roy,TI
```

#### Résultat attendu

- Aucun avertissement
- 1 objet:

| Identifiant | Prenom | Nom | Departement |
| ----------- | ------ | --- | ----------- |
| aroy        | A      | Roy | TI          |

### T__ - Nom du cas de test

(ajoutez des cas de test pour les autres jeux de données)

## Journal d'exécution

Ajoutez une ligne par essai. Gardez les résultats de chaque version. Utilisez **Réussi**, **Échoué** ou **Bloqué**.

| Cas | Version | Résultat obtenu                                                                 | Statut | Défaut       |
| --- | ------- | ------------------------------------------------------------------------------- | ------ | ------------ |
| T01 | v1      | Les trois comptes attendus sont renvoyés dans le bon ordre. Aucun avertissement | Réussi |              |
| T02 | v1      | Aucun objet. Avertissement "Enregistrement 1: identifiant invalide              | Échoué | D01          |
| T02 | v2      | Un objet: aroy, A, Roy, TI. Aucun avertissement                                 | Réussi | D01 vérifié  |
| T01 | v2      | Aucun objet. Avertissement "Enregistrement 1: identifiant invalide              | Réussi | (Régression) |
| ... |         |                                                                                 |        |              |

## Registre des défauts et des corrections

| Défaut                    | Cause                                   | Correction et version           | Essais               | Statut après correction |
| ------------------------- | --------------------------------------- | ------------------------------- | -------------------- | ----------------------- |
| D01 - Prénom court rejeté | Le seuil de longueur exige 2 caractères | Supprimer le bloc du seuil (v2) | Restester T02 et T01 | Réussi                  |
| ...                       |                                         |                                 |                      |                         |
