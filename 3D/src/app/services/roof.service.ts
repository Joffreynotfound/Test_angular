import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { RoofSpec, Vec2 } from '../models/house.type';

@Injectable({ providedIn: 'root' })

export class RoofService {

  build(spec: RoofSpec): THREE.Mesh {
  const expanded = this.expandRect(spec.contour, spec.overhang);
  const shape = this.shapeFrom(expanded);
  const geom = new THREE.ExtrudeGeometry(shape, { depth: spec.thickness, bevelEnabled: false });
  geom.rotateX(-Math.PI / 2);

  const mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color: 0x888888 }));
  mesh.position.set(0, spec.z - spec.thickness, 0);
  mesh.name = 'Roof';
  return mesh;
}


   shapeFrom(poly: Vec2[]): THREE.Shape {
    const s = new THREE.Shape();
    s.moveTo(poly[0].x, poly[0].y);
    for (let i = 1; i < poly.length; i++) s.lineTo(poly[i].x, poly[i].y);
    s.lineTo(poly[0].x, poly[0].y);
    return s;
  }


   expandRect(poly: Vec2[], d: number): Vec2[] {
    const xs = poly.map(p => p.x);
    const ys = poly.map(p => p.y);
    const minX = Math.min(...xs) - d;
    const maxX = Math.max(...xs) + d;
    const minY = Math.min(...ys) - d;
    const maxY = Math.max(...ys) + d;
    return [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
    ];
  }
}
