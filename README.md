# Test_angular – Maquette 3D & API métier

Ce dépôt regroupe deux projets complémentaires :

- **`3D/`** : une application Angular (CLI v19) qui affiche la maquette d’une maison en 3D à l’aide de Three.js.  

---

## Aperçu rapide

- Maquette maison 3D interactive : navigation orbitale, affichage progressif des éléments (sol, murs, toit, fenêtres).  
- Services Angular modulaires (`FloorService`, `WallService`, `RoofService`, etc.) pour générer les géométries Three.js à partir de spécifications TypeScript.  
- API REST sécurisée par JWT : calcul surface rectangle (public) et calcul de résistance thermique multicouche (protégé).  
- Prête pour l’extension (ajout d’éléments 3D ou de nouveaux endpoints métiers).

---

## Prérequis

| Module | Outils nécessaires |
| --- | --- |
| Angular (`3D/`) | Node.js 18+ (ou 20), npm, Angular CLI (installé localement via `npm install`) |
| Django (`Django/api_project/`) | Python 3.10+, pip, virtualenv (fortement recommandé) |

---

## Installation & démarrage – Front 3D

```bash
cd 3D
npm install
npm start        # lance ng serve sur http://localhost:4200
```

Fonctionnalités principales :

- Contrôles caméra : clic gauche pour orbiter, molette pour zoomer (OrbitControls).  
- Boutons dans l’UI pour afficher/masquer sol, murs, toit, fenêtres.  
- Géométries générées depuis des spécifications dans `src/app/data/house.sample.ts`.

Pour modifier la scène, ajustez les specs (par exemple largeur des murs) et les services dans `src/app/services/`.

Tests front :

```bash
cd 3D
npm test
```

---

## Installation & démarrage – API Django

```bash
cd Django/api_project
python3 -m venv env
source env/bin/activate           # env\Scripts\activate sous Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver         # http://127.0.0.1:8000
```

Tests back :

```bash
cd Django/api_project
python manage.py test
```

---

## Organisation des répertoires

- `3D/src/app/house/house.component.ts` : initialisation Three.js (scène, caméra, renderer) et gestion des actions utilisateur.  
- `3D/src/app/services/*.ts` : génération des éléments (sol, murs, toit, fenêtres, portes) à partir des specs.  
- `3D/src/app/models/house.type.ts` : types TypeScript utilisés par les services.  
