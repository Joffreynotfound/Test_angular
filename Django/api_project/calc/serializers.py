"""
serializers.py — Sérialiseurs de l’API Hejaus (calculs de surface et résistance thermique)

Ce module définit les classes de sérialisation utilisées pour :
- Valider les données d’entrée des requêtes (payload JSON)
- Structurer les réponses JSON renvoyées par l’API
- Gérer la création d’utilisateurs pour l’authentification JWT

Les serializers DRF permettent de transformer les données Python (dict, objets)
en formats JSON valides, et inversement.
"""

from rest_framework import serializers
from django.contrib.auth.models import User


# -------------------------------------------------------------------------
# Sérialiseurs pour le calcul de surface
# -------------------------------------------------------------------------
class SurfaceInputSerializer(serializers.Serializer):
    """
    Sérialiseur d’entrée pour le calcul de surface.

    Valide les dimensions nécessaires au calcul :
    - `width` : largeur (m)
    - `height` : hauteur (m)

    Exemple de payload :
    ```json
    {
      "width": 5,
      "height": 3
    }
    ```
    """
    width = serializers.FloatField(min_value=0)
    height = serializers.FloatField(min_value=0)


class SurfaceOutputSerializer(serializers.Serializer):
    """
    Sérialiseur de sortie pour le calcul de surface.

    Structure la réponse renvoyée à l’utilisateur :
    - `surface` : surface calculée (m²)

    Exemple de réponse :
    ```json
    {
      "surface": 15.0
    }
    ```
    """
    surface = serializers.FloatField()


# -------------------------------------------------------------------------
# Sérialiseurs pour le calcul de résistance thermique
# -------------------------------------------------------------------------
class LayerSerializer(serializers.Serializer):
    """
    Sérialiseur représentant une couche de matériau dans une paroi.

    Chaque couche contient :
    - `material` : nom du matériau (ex. "polystyrene")
    - `thickness` : épaisseur de la couche en mètres (m)
    - `lambda` : conductivité thermique (W/m·K)

    Exemple :
    ```json
    {
      "material": "brique",
      "thickness": 0.2,
      "lambda": 0.8
    }
    ```
    """
    material = serializers.CharField()
    thickness = serializers.FloatField(min_value=0)  # en mètres

    def __init__(self, *args, **kwargs):
        """
        Redéfinition du constructeur pour ajouter un champ nommé 'lambda'
        dynamiquement, car 'lambda' est un mot réservé en Python.
        """
        super().__init__(*args, **kwargs)
        self.fields["lambda"] = serializers.FloatField(min_value=1e-12)  # W/m·K


class ResistanceInputSerializer(serializers.Serializer):
    """
    Sérialiseur d’entrée pour le calcul de résistance thermique.

    Contient une liste de couches, chacune validée par `LayerSerializer`.

    Exemple :
    ```json
    {
      "layers": [
        { "material": "polystyrene", "thickness": 0.1, "lambda": 0.035 },
        { "material": "brique", "thickness": 0.2, "lambda": 0.8 }
      ]
    }
    ```
    """
    layers = LayerSerializer(many=True)


class ResistanceLayerOutSerializer(serializers.Serializer):
    """
    Sérialiseur de sortie pour une couche de matériau,
    contenant les résultats intermédiaires du calcul.

    Champs :
    - `material` : nom du matériau
    - `r` : résistance thermique de la couche (m²·K/W)

    Exemple :
    ```json
    {
      "material": "polystyrene",
      "r": 2.857
    }
    ```
    """
    material = serializers.CharField()
    r = serializers.FloatField()


class ResistanceOutputSerializer(serializers.Serializer):
    """
    Sérialiseur de sortie global pour le calcul de résistance thermique.

    Contient :
    - `r_total` : résistance thermique totale (somme des résistances unitaires)
    - `details` : liste des résistances par couche

    Exemple de réponse :
    ```json
    {
      "r_total": 3.11,
      "details": [
        {"material": "polystyrene", "r": 2.857},
        {"material": "brique", "r": 0.25}
      ]
    }
    ```
    """
    r_total = serializers.FloatField()
    details = ResistanceLayerOutSerializer(many=True)


# -------------------------------------------------------------------------
# Sérialiseur pour l’inscription utilisateur (authentification JWT)
# -------------------------------------------------------------------------
class RegisterSerializer(serializers.ModelSerializer):
    """
    Sérialiseur permettant la création d’un nouvel utilisateur.

    Basé sur le modèle `User` fourni par Django.
    Il gère :
    - la validation du `username`
    - le hachage sécurisé du `password` avant enregistrement

    Exemple de payload :
    ```json
    {
      "username": "hejaus",
      "password": "StrongPass!234"
    }
    ```
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "password")

    def create(self, validated_data):
        """
        Crée un nouvel utilisateur Django avec un mot de passe chiffré.

        Args:
            validated_data (dict): Données validées contenant `username` et `password`.

        Returns:
            User: Instance de l’utilisateur créé et sauvegardé en base.
        """
        user = User(username=validated_data["username"])
        user.set_password(validated_data["password"])  # Hash du mot de passe
        user.save()
        return user
