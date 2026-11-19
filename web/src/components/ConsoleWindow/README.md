# ConsoleWindow

Le composant affiche le texte de son bloc de code ou de sa propriété `text`.
La propriété `foregroundColor` définit la couleur par défaut.

## Retours à la ligne

La propriété `wrap` contrôle les retours automatiques :

| Valeur | Comportement |
| --- | --- |
| `"word"` (par défaut) | Retour aux limites des mots, comme auparavant. |
| `"character"` | Retour au caractère qui dépasse la largeur disponible, même au milieu d'un mot, sans privilégier les espaces ou les traits d'union. |
| `"none"` | Aucun retour automatique; une barre de défilement horizontale apparaît si le texte dépasse. |

```mdx
<ConsoleWindow wrap="none" text="Une très longue ligne à faire défiler…" />
<ConsoleWindow wrap="character" text="Une très longue ligne à couper au caractère près…" />
```

Les sauts de ligne écrits dans le texte sont conservés dans les trois modes.
Ces options fonctionnent aussi avec les couleurs et la propriété `language`.

## Couleurs

Pour colorer une partie du texte, entourez-la de `¶(couleur)` et `¶` :

````mdx
<ConsoleWindow title="PowerShell" backgroundColor="#012456">
```
texte normal ¶(#ff0000)texte en rouge¶ texte normal
¶(orange)Une ligne entière en orange.¶
¶(#ff0000)Un message en rouge
sur plusieurs lignes.¶
```
</ConsoleWindow>
````

Les couleurs acceptent les codes hexadécimaux CSS (`#RGB`, `#RGBA`, `#RRGGBB`,
`#RRGGBBAA`), les noms CSS (`red`, `orange`, etc.) et les fonctions `rgb()`,
`rgba()`, `hsl()` et `hsla()`.

Les marqueurs disparaissent du texte affiché et du texte copié. Après le marqueur
de fermeture, le texte retrouve sa couleur habituelle. Plusieurs passages colorés
peuvent se suivre, mais ils ne peuvent pas être imbriqués. Un marqueur incomplet
reste affiché tel quel.

La syntaxe fonctionne aussi avec la propriété `text` et avec `language` : la
couleur explicite prend alors la priorité sur la coloration syntaxique du passage.
