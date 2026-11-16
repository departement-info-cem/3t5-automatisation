param(
    [Parameter(Mandatory)]
    [string]$Entree
)

if (-not (Test-Path -LiteralPath $Entree -PathType Leaf)) {
    throw 'ENTREE_ABSENTE : le fichier source est introuvable.'
}

$entete = Get-Content -LiteralPath $Entree -TotalCount 1 -ErrorAction Stop
if ($entete -ne 'Prenom,Nom,Departement') {
    throw 'ENTETE_INVALIDE : en-tête attendu Prenom,Nom,Departement.'
}

$employes = Import-Csv -LiteralPath $Entree -ErrorAction Stop
$identifiantsVus = @()
$numero = 0

foreach ($employe in $employes) {
    $numero++
    $prenom = ([string]$employe.Prenom).Trim()
    $nom = ([string]$employe.Nom).Trim()
    $departement = ([string]$employe.Departement).Trim().ToUpper()

    if (-not $prenom -or -not $nom -or -not $departement) {
        Write-Warning "Enregistrement $($numero) : CHAMP_MANQUANT"
        break
    }

    if ($departement -notin @('TI', 'RH', 'FIN', 'VENTES')) {
        Write-Warning "Enregistrement $($numero) : DEPARTEMENT_INVALIDE"
        continue
    }

    if ($prenom.Length -lt 2) {
        Write-Warning "Enregistrement $($numero) : IDENTIFIANT_INVALIDE"
        continue
    }

    $identifiant = ($prenom.Substring(0, 1) + $nom).ToLower()
    if ($identifiant -in $identifiantsVus) {
        Write-Warning "Enregistrement $($numero) : DOUBLON"
        continue
    }

    [pscustomobject]@{
        Identifiant = $identifiant
        Prenom      = $prenom
        Nom         = $nom
        Departement = $departement
    }
}
