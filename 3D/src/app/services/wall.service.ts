import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { DoorService } from './door.service';
import { WindowService } from './window.service';
import { DoorSpec, WindowSpec, WallSpec } from '../models/house.type';

type Openings = { doors?: DoorSpec[]; windows?: WindowSpec[] };

@Injectable({ providedIn: 'root' })
export class WallService {
  constructor(private doors: DoorService, private windows: WindowService) {}

  build(spec: WallSpec, openings?: Openings): THREE.Group {
    const group = new THREE.Group();
    group.name = 'Wall';

    const length = this.dist(spec.start, spec.end);

    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(length, 0);
    shape.lineTo(length, spec.height);
    shape.lineTo(0, spec.height);
    shape.lineTo(0, 0);

    const holesDoors = openings?.doors ?? spec.doors ?? [];
    const holesWindows = openings?.windows ?? spec.windows ?? [];

    const eps = spec.thickness / 2;
    holesDoors.forEach((d) => {
      const base = d.z ?? 0;
      const doorG = this.doors.build(d);
      doorG.position.set(d.x, base, eps);
      group.add(doorG);
    });
    group.updateMatrixWorld(true);

    holesWindows.forEach((w) => {
      const winG = this.windows.build(w);
      winG.position.set(w.x, w.z + w.height / 2, eps);
      group.add(winG);
    });

    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: spec.thickness,
      bevelEnabled: false,
    });

    geom.translate(0, 0, -spec.thickness / 2);

    const wallMesh = new THREE.Mesh(
      geom,
      new THREE.MeshStandardMaterial({ color: 0xc9c9c9 })
    );
    wallMesh.name = 'WallBody';
    group.add(wallMesh);

    const dx = spec.end.x - spec.start.x;
    const dy = spec.end.y - spec.start.y;

    const dir = new THREE.Vector3(dx, 0, -dy).normalize();

    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(1, 0, 0),
      dir
    );
    group.quaternion.copy(q);

    group.position.set(spec.start.x, 0, -spec.start.y);
    console.log('Openings:', {
      doors: holesDoors.length,
      windows: holesWindows.length,
    });

    group.updateMatrixWorld(true);
    console.log(
      'Wall children after add:',
      group.children.map((c) => c.name)
    );

    return group;
  }

  dist(a: { x: number; y: number }, b: { x: number; y: number }) {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }
}
