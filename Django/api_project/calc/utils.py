def compute_surface(width: float, height: float) -> float:
    """
    Calcule la surface d'un rectangle à partir de sa largeur et de sa hauteur.

    Ce calcul est utilisé par l'endpoint `/api/surface/` pour renvoyer
    la surface d'une paroi, d'un mur ou de toute autre surface plane.

    Args:
        width (float): Largeur en mètres.
        height (float): Hauteur en mètres.

    Returns:
        float: Surface totale en mètres carrés (m²).

    Example:
        >>> compute_surface(5, 3)
        15.0
    """
    # On force la conversion en float pour éviter les erreurs de typage (ex: str venant du JSON)
    return float(width) * float(height)


def compute_resistances(layers: list[dict]) -> tuple[float, list[dict]]:
    """
    Calcule la résistance thermique totale et les résistances unitaires
    d'une paroi multicouche.

    Chaque couche est définie par son matériau, son épaisseur et sa conductivité
    thermique (lambda). La formule utilisée est :
        R = épaisseur / lambda
    où :
        - R est la résistance thermique en m²·K/W
        - épaisseur en mètres
        - lambda en W/m·K

    Args:
        layers (list[dict]): Liste de couches de matériaux au format :
            [
                {"material": "polystyrene", "thickness": 0.1, "lambda": 0.035},
                {"material": "brique", "thickness": 0.2, "lambda": 0.8}
            ]

    Returns:
        tuple:
            - float: Résistance thermique totale (somme des R).
            - list[dict]: Détails des résistances individuelles, par matériau.

    Example:
        >>> layers = [
        ...     {"material": "polystyrene", "thickness": 0.1, "lambda": 0.035},
        ...     {"material": "brique", "thickness": 0.2, "lambda": 0.8}
        ... ]
        >>> compute_resistances(layers)
        (3.11, [{'material': 'polystyrene', 'r': 2.857}, {'material': 'brique', 'r': 0.25}])
    """
    details = []
    r_total = 0.0

    for L in layers:
        # Extraction et typage des valeurs
        material = L["material"]
        thickness = float(L["thickness"])
        lamb = float(L["lambda"])

        # Calcul de la résistance thermique individuelle
        r = thickness / lamb  # unité : m²·K/W

        # Ajout au tableau des résultats détaillés
        details.append({
            "material": material,
            "r": round(r, 3)
        })

        # Accumulation pour obtenir la résistance totale
        r_total += r

    # Retourne la somme totale et les détails arrondis
    return round(r_total, 2), details
