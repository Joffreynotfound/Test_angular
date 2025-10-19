export type Vec2 = { x: number; y: number };

export interface DoorSpec {
  x: number;           // position depuis l'origine du mur (en m)
  width: number;       // largeur (m)
  height: number;      // hauteur (m)
    z?: number; // hauteur du bas de la porte (par défaut 0)
}

export interface WindowSpec {
  x: number;           // position depuis l'origine du mur (m)
  width: number;
  height: number;
  z: number;           // allège (m) = hauteur bas de fenêtre
}

export interface WallSpec {
  start: Vec2;         // point A (x,y)
  end: Vec2;           // point B (x,y)
  height: number;      // (m)
  thickness: number;   // (m) épaisseur mur
  doors?: DoorSpec[];
  windows?: WindowSpec[];
}

export interface FloorSpec {
  contour: Vec2[];     // polygone dans (x,y)
  thickness: number;   // (m)
  z: number;           // (m) position Z du bas (ex: 0 pour sol)
}

export interface RoofSpec {
  contour: Vec2[];     // même forme que le sol
  thickness: number;   // (m)
  z: number;           // (m) position Z du bas (ex: 3.2 pour toit plat)
  overhang: number;    // débord (m)
}
