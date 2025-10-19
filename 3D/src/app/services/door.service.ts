import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { DoorSpec } from '../models/house.type';

@Injectable({ providedIn: 'root' })
export class DoorService {
  constructor() {}

  build(spec: DoorSpec): THREE.Group {
    const g = new THREE.Group();
    g.name = 'Door';

    const frameThickness = 0.05;
    const frameDepth = 0.1;

    const frameGeom = new THREE.BoxGeometry(spec.width, spec.height, frameDepth);
    const frameMat  = new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.6 });
    const frame = new THREE.Mesh(frameGeom, frameMat);
    frame.position.set(0, spec.height / 2, 0);
    frame.name = 'DoorFrame';
    g.add(frame);

    return g;
  }

 // DoorService
holePath(d: DoorSpec): THREE.Path {
  const x0 = d.x - d.width / 2;
  const x1 = d.x + d.width / 2;
  const y0 = d.z ?? 0;
  const y1 = y0 + d.height;
  const p = new THREE.Path();
  p.moveTo(x0, y0); p.lineTo(x1, y0); p.lineTo(x1, y1); p.lineTo(x0, y1); p.lineTo(x0, y0);
  return p;
}

}

