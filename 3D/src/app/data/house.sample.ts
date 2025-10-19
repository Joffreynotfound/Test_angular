import {FloorSpec,RoofSpec,WallSpec,WindowSpec,DoorSpec} from '../models/house.type';

// Contour de la maison
export const HOUSE_CONTOUR = [
  { x: 0, y: 0 },
  { x: 10, y: 0 },
  { x: 10, y: 8 },
  { x: 0, y: 8 },
];

// sol

export const HOUSE_FLOORS: FloorSpec = {
  contour: HOUSE_CONTOUR,
  thickness: 0.2,
  z: 0,
};

// toit
export const HOUSE_ROOF: RoofSpec = {
  contour: HOUSE_CONTOUR,
  thickness: 0.2,
  z: 3.2,
  overhang: 0.5,
};

// murs
const H = 3;
const T = 0.2;

export const HOUSE_WALLS: WallSpec[] = [
  {
    start: { x: 0, y: 0 },
    end: { x: 10, y: 0 },
    height: H,
    thickness: T,
  },

  // Mur BC : (10,0) -> (10,8)
  {
    start: { x: 10, y: 0 },
    end: { x: 10, y: 8 },
    height: H,
    thickness: T,
  },

  // Mur CD : (10,8) -> (0,8)
  {
    start: { x: 10, y: 8 },
    end: { x: 0, y: 8 },
    height: H,
    thickness: T,
  },

  // Mur DA : (0,8) -> (0,0)
  {
    start: { x: 0, y: 8 },
    end: { x: 0, y: 0 },
    height: H,
    thickness: T,
  },
];
// fenêtres
export const HOUSE_WINDOWS: WindowSpec[] = [
  { x: 6.5, width: 1, height: 1.2, z: 0.9 },
];

// portes
export const HOUSE_DOORS: DoorSpec[] = [
  { x: 2.5, width: 1, height: 2.1 },
];

