---
title: Paramètres et dictionnaires
sidebar_label: Paramètres et dictionnaires
toc_max_heading_level: 3
draft: false
---


## 1. Paramètres

**A)** Écrivez un script `Multiplier.ps1` qui écrit dans le pipeline le résultat de la multiplication de deux termes passés en paramètre. (Par exemple, ".\Multiplier.ps1 -Terme1 3 -Terme2 5" écrirait le résultat de 3x5)

<ConsoleWindow noCopy="true" backgroundColor="#000046">
```text
PS C:\Scripts> .\multiplier.ps1 -Terme1 3 -Terme2 5
15
```
</ConsoleWindow>

**B)** Réécrivez le script précédent, mais de sorte que les paramètres soient obligatoires.

<ConsoleWindow noCopy="true" backgroundColor="#000046">
```text
PS C:\Scripts> .\multiplier.ps1 -Terme1 3

cmdlet multiplier.ps1 at command pipeline position 1
Supply values for the following parameters:
Terme2: 5
15
```
</ConsoleWindow>

**C)** Réécrivez le script précédent, mais de sorte qu'il puisse admettre un nombre illimité de nombres.

<ConsoleWindow noCopy="true" backgroundColor="#000046">
```text
PS C:\Scripts> .\multiplier.ps1 -Termes 3, 5, 2
30
```
</ConsoleWindow>

## 2. Dictionnaires

**A)** Dans une variable, créez la structure suivante:

<ConsoleWindow noCopy="true" backgroundColor="#000046">
```text
PS C:\Scripts> $Luke | Format-List

Nom        : Skywalker
Prenom     : Luke
Profession : Jedi
```
</ConsoleWindow>

**B)** Faites une variable qui contient ces trois personnages:

<ConsoleWindow noCopy="true" backgroundColor="#000046">
```text
PS C:\Scripts> $Personnages

Nom       Prenom  Profession
---       ------  ----------
Skywalker Luke    Jedi
Kenobi    Obi Wan Jedi
Yoda      Minch   Jedi
```
</ConsoleWindow>

**C)** Ajoutez Darth Vader à ce tableau.

<ConsoleWindow noCopy="true" backgroundColor="#000046">
```text
PS C:\Scripts> $Personnages

Nom       Prenom  Profession
---       ------  ----------
Skywalker Luke    Jedi
Kenobi    Obi Wan Jedi
Yoda      Minch   Jedi
Vader     Darth   Sith
```
</ConsoleWindow>

**D)** Dressez la liste de tous les jedis seulement.

<ConsoleWindow noCopy="true" backgroundColor="#000046">
```text
Nom       Prenom  Profession
---       ------  ----------
Skywalker Luke    Jedi
Kenobi    Obi Wan Jedi
Yoda      Minch   Jedi
```
</ConsoleWindow>


**E)** Faites un **script** qui produit un personnage et l'envoie dans le pipeline.

<ConsoleWindow noCopy="true" backgroundColor="#000046">
```text
PS C:\Scripts> .\monscript.ps1 -Nom "Solo" -Prenom "Han" -Profession "Contrebandier" | Format-List

Nom        : Solo
Prenom     : Han
Profession : Contrebandier


PS C:\Scripts> .\monscript.ps1 -Nom "Organa" -Prenom "Leia" -Profession "Princesse" | Format-Table

Nom    Prenom Profession
---    ------ ----------
Organa Leia   Princesse
```
</ConsoleWindow>

**F)** Appelez ce script en utilisant la technique du ***Splatting***.



## 3. Validation des paramètres


Le script suivant est utilisé par les policiers lorsqu'ils interpellent un(e) automobiliste pour excès de vitesse. Il produit en sortie un objet qui contiennent l'information de l'incident,

```powershell showLineNumbers
Param(
    [string] $Nom,              # Nom de l'automobiliste
    [string] $Prenom,           # Prénom de l'automobiliste
    [string] $NoPermis,         # Numéro de permis (X9999-999999-99)
    [string] $TypeVehicule,     # Le type de véhicule (Voiture, Camion, Moto, Autobus, Autre)
    [string] $Immatriculation,  # Le numéro de plaque d'immatriculation
    [switch] $Confiscation,     # Spécifie si le véhicule doit être confisqué
    [string] $Infraction,       # Le détail de l'infraction
    [int]    $Points            # Le nombre de points d'inaptitude à ajouter au dossier
)


[PSCustomObject]@{
    Nom = $Nom
    Prenom = $Prenom
    NoPermis = $NoPermis
    TypeVehicule = $TypeVehicule
    Immatriculation = $Immatriculation
    Confiscation = $Confiscation
    Infraction = $Infraction
    Points = $Points
}

```

Modifiez ce script pour qu'il effectue les validations suivantes:

**A)** Le nom et le prénom doivent être obligatoires

**B)** Le nombre de points d'inaptitude doit être un nombre entier compris entre 0 et 30

**C)** Le type du véhicule doit être l'un des 5 suivants: Voiture, Camion, Moto, Autobus, Autre

**D)** Le numéro de plaque, s'il est spécifié, doit être une chaîne de 2 à 7 caractères.

**E)** Le numéro de permis de conduire, s'il est spécifié, doit correspondre à la nomenclature suivante:

    > `1 lettre` , `4 chiffres` , `trait d'union` , `6 chiffres` , `trait d'union` , `2 chiffres`
