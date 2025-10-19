import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { WindowSpec } from '../models/house.type';

@Injectable({ providedIn: 'root' })
export class WindowService {
  build(spec: WindowSpec): THREE.Group {
    const g = new THREE.Group();
    g.name = 'Window';

    const frameDepth = 0.05;
    const frameGeom = new THREE.BoxGeometry(
      spec.width,
      spec.height,
      frameDepth
    );
    const frameMat = new THREE.MeshPhysicalMaterial({
      color: 0xff0000, // teinte rouge
      transparent: true,
      opacity: 0.4, // transparence visible
      transmission: 0.9, // laisse passer la lumière
      thickness: 0.02, // donne de la profondeur optique
      roughness: 0.05, // un peu de flou
      clearcoat: 1.0, // brillance
      clearcoatRoughness: 0.1,
    });

    const frame = new THREE.Mesh(frameGeom, frameMat);
    frame.name = 'WindowFrame';

    frame.position.set(0, spec.height / 2, 0);
    g.add(frame);
    return g;
  }

  holePath(spec: WindowSpec): THREE.Path {
    const left = spec.x - spec.width / 2;
    const right = spec.x + spec.width / 2;
    const bottom = spec.z;
    const top = spec.z + spec.height;

    const p = new THREE.Path();
    p.moveTo(left, bottom);
    p.lineTo(right, bottom);
    p.lineTo(right, top);
    p.lineTo(left, top);
    p.lineTo(left, bottom);
    return p;
  }
}
