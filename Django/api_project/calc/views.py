from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    SurfaceInputSerializer, SurfaceOutputSerializer,
    ResistanceInputSerializer, ResistanceOutputSerializer,
    RegisterSerializer
)
from .utils import compute_surface, compute_resistances


@api_view(["POST"])
@permission_classes([AllowAny])
def surface_view(request):
    """
    POST /api/surface/

    ### Description
    Endpoint **public** permettant de calculer la surface d’un rectangle 
    à partir de sa largeur et de sa hauteur.

    ### Payload attendu
    ```json
    {
      "width": 5,
      "height": 3
    }
    ```

    ### Réponse
    ```json
    {
      "surface": 15.0
    }
    ```

    ### Codes de statut
    - 200 OK : succès du calcul
    - 400 Bad Request : données invalides
    """
    # Désérialisation et validation des données d’entrée
    ser_in = SurfaceInputSerializer(data=request.data)
    if not ser_in.is_valid():
        return Response(ser_in.errors, status=status.HTTP_400_BAD_REQUEST)

    # Calcul de la surface via la fonction utilitaire
    surface = compute_surface(**ser_in.validated_data)

    # Sérialisation de la réponse
    ser_out = SurfaceOutputSerializer({"surface": surface})
    return Response(ser_out.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def resistance_view(request):
    """
    POST /api/resistance/

    ### Description
    Endpoint **protégé par authentification JWT**, qui calcule la 
    résistance thermique totale d’une paroi composée de plusieurs couches.

    Chaque couche est définie par :
    - `material` : nom du matériau
    - `thickness` : épaisseur en mètres
    - `lambda` : conductivité thermique en W/m·K

    ### Formule
    R = épaisseur / lambda  
    R_total = somme(R_i)

    ### Payload attendu
    ```json
    {
      "layers": [
        { "material": "polystyrene", "thickness": 0.1, "lambda": 0.035 },
        { "material": "brique", "thickness": 0.2, "lambda": 0.8 }
      ]
    }
    ```

    ### Réponse
    ```json
    {
      "r_total": 3.11,
      "details": [
        { "material": "polystyrene", "r": 2.857 },
        { "material": "brique", "r": 0.25 }
      ]
    }
    ```

    ### Codes de statut
    - 200 OK : succès du calcul
    - 400 Bad Request : données invalides
    - 401 Unauthorized : absence ou invalidité du token JWT
    """
    # Vérifie et valide le payload JSON
    ser_in = ResistanceInputSerializer(data=request.data)
    if not ser_in.is_valid():
        return Response(ser_in.errors, status=status.HTTP_400_BAD_REQUEST)

    # Calcule la résistance totale et les détails par couche
    r_total, details = compute_resistances(ser_in.validated_data["layers"])

    # Sérialise et renvoie la réponse
    ser_out = ResistanceOutputSerializer({"r_total": r_total, "details": details})
    return Response(ser_out.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_view(request):
    """
    POST /api/register/

    ### Description
    Endpoint **public** permettant de créer un nouvel utilisateur
    dans le système. Il sert à l’inscription avant authentification.

    ### Payload attendu
    ```json
    {
      "username": "hejaus",
      "password": "StrongPass!234"
    }
    ```

    ### Réponse
    ```json
    {
      "message": "User created"
    }
    ```

    ### Codes de statut
    - 201 Created : inscription réussie
    - 400 Bad Request : validation échouée (ex. utilisateur déjà existant)
    """
    # Valide et enregistre l’utilisateur
    ser = RegisterSerializer(data=request.data)
    if ser.is_valid():
        ser.save()
        return Response({"message": "User created"}, status=status.HTTP_201_CREATED)

    # Retourne les erreurs de validation si échec
    return Response(ser.errors, status=status.HTTP_400_BAD_REQUEST)
