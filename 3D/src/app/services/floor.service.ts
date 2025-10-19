import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { FloorSpec, Vec2 } from '../models/house.type';

@Injectable({ providedIn: 'root' })
export class FloorService {

  build(spec: FloorSpec): THREE.Mesh {
  const shape = this.shapeFrom(spec.contour);
  const geom = new THREE.ExtrudeGeometry(shape, { depth: spec.thickness, bevelEnabled: false });
  geom.rotateX(-Math.PI / 2);

  const mesh = new THREE.Mesh(geom, new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
  mesh.position.set(0, spec.z - spec.thickness, 0);
  mesh.name = 'Floor';
  return mesh;
}

  shapeFrom(poly: Vec2[]): THREE.Shape {
    const s = new THREE.Shape();
    s.moveTo(poly[0].x, poly[0].y);
    for (let i = 1; i < poly.length; i++) 
      s.lineTo(poly[i].x, poly[i].y);
    s.lineTo(poly[0].x, poly[0].y); 
    return s;
  }
}
