# API – Calculs de Surface et Résistance Thermique

Ce projet Django REST Framework fournit une API REST sécurisée pour :

- **Calculer des surfaces** (endpoint public)
- **Calculer des résistances thermiques** (endpoint protégé par JWT)
- **Gérer l’inscription et la connexion des utilisateurs**

---

## 1. Installation et lancement du projet

### Prérequis

- Python **3.10+**
- pip (installé avec Python)
- virtualenv (optionnel mais recommandé)

---

### Étapes d’installation

1. **Cloner le projet ou copier le dossier**

```bash
git clone <ton_repo_git>
cd api_project
```
2. **Créer l’environnement virtuel**

```bash
python3 -m venv env
```

3. **Activer l’environnement**

```bash
source env/bin/activate          # macOS / Linux
env\Scripts\activate             # Windows PowerShell
```

4. **Installer les dépendances**

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

5. **Appliquer les migrations**

```bash
python manage.py migrate
```

6. **(Optionnel) Créer un superutilisateur Django**

```bash
python manage.py createsuperuser
```

7. **Lancer le serveur de développement**

```bash
python manage.py runserver
```

Ouvre ensuite http://127.0.0.1:8000/ pour vérifier que le projet tourne. L’API est disponible sous le préfixe `/api/`.

---

## 2. Endpoints disponibles

| Méthode | Route               | Authentification | Description |
|---------|--------------------|------------------|-------------|
| POST    | `/api/surface/`    | Aucune           | Calcule la surface en m² d’un rectangle à partir de `width` et `height`. |
| POST    | `/api/resistance/` | JWT (Bearer)     | Calcule la résistance thermique totale et les détails par couche. |
| POST    | `/api/register/`   | Aucune           | Inscription d’un nouvel utilisateur (username + password). |
| POST    | `/api/login/`      | Aucune           | Récupère un jeton JWT (`access`, `refresh`) via `username` et `password`. |
| POST    | `/api/token/refresh/` | Aucune        | Rafraîchit un jeton `access` à partir d’un jeton `refresh`. |

---

## 3. Authentification JWT

1. **Inscription**

```bash
curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "MotDePasse!2024"}'
```

2. **Connexion**

```bash
curl -X POST http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "MotDePasse!2024"}'
```

Réponse :

```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

3. **Consommer l’endpoint protégé**

```bash
curl -X POST http://127.0.0.1:8000/api/resistance/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
        "layers": [
          { "material": "polystyrene", "thickness": 0.1, "lambda": 0.035 },
          { "material": "brique", "thickness": 0.2, "lambda": 0.8 }
        ]
      }'
```

---

## 4. Calculs disponibles

- **Surface** : `surface = width * height`. Les valeurs doivent être positives et peuvent être décimales.
- **Résistance thermique** : pour chaque couche `r = thickness / lambda`, la réponse retourne `r_total` et les détails par couche.

Les règles de validation sont gérées par les serializers DRF, qui renvoient des erreurs 400 en cas de données manquantes ou invalides.

---


