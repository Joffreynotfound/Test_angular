import {Component,ElementRef,ViewChild,AfterViewInit,inject} from '@angular/core';
import * as THREE from 'three';
import {HOUSE_FLOORS,HOUSE_WINDOWS,HOUSE_ROOF,HOUSE_WALLS,HOUSE_DOORS} from '../data/house.sample';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FloorService } from '../services/floor.service';
import { WindowService } from '../services/window.service';
import { RoofService } from '../services/roof.service';
import { WallService } from '../services/wall.service';
import { DoorService } from '../services/door.service';

type Part = 'floor' | 'walls' | 'roof' | 'windows' | 'doors';

@Component({
  selector: 'app-house',
  standalone: true,
  templateUrl: './house.component.html',
  styleUrl: './house.component.css',
})
export class HouseComponent implements AfterViewInit {
  @ViewChild('canvasContainer', { static: true })
  canvasContainer!: ElementRef<HTMLDivElement>;

  private floorMesh?: THREE.Mesh;
  private wallsGroup?: THREE.Group;
  private roofMesh?: THREE.Mesh;
  private windowMesh?: THREE.Mesh;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  private floorService = inject(FloorService);
  private windowService = inject(WindowService);
  private roofService = inject(RoofService);
  private wallService = inject(WallService);
  private doorService = inject(DoorService);


  ngAfterViewInit(): void {
    this.initThree();
    this.addhouse();
    this.animate();
  }

  initThree() {
    const el = this.canvasContainer.nativeElement;
    const w = el.clientWidth;
    const h = el.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf5f5f5);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    this.camera.position.set(10, 8, 15);
    this.camera.lookAt(0, 1.5, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    el.appendChild(this.renderer.domElement);

    // Controls : pour tourner/zoomer la caméra
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(0, 1.5, 0);
    this.controls.update();

    // Lumières + grille
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(10, 15, 10);
    this.scene.add(dir, new THREE.GridHelper(40, 40));
  }

  addFloor() {
    const floorMesh = this.floorService.build(HOUSE_FLOORS);
    this.scene.add(floorMesh);
  }

  addRoof() {
    const roofMesh = this.roofService.build(HOUSE_ROOF);
    this.scene.add(roofMesh);
  }

  addWindows() {
    const windowMesh = this.windowService.build(HOUSE_WINDOWS[0]);
    windowMesh.position.set(6.5, 0.9 + 1.2 / 2, 0);
    this.scene.add(windowMesh);
  }

  addWall() {
    const wallsGroup = new THREE.Group();
    const wallAB = this.wallService.build(HOUSE_WALLS[0], {
      doors: HOUSE_DOORS,
      windows: HOUSE_WINDOWS,
    });
    wallsGroup.add(wallAB);
    HOUSE_WALLS.slice(1).forEach((w) =>
      wallsGroup.add(this.wallService.build(w))
    );
    this.scene.add(wallsGroup);
  }

  renderOnce() {
    this.renderer.render(this.scene, this.camera);
  }

  addhouse() {
    const houseGroup = new THREE.Group();
    this.scene.add(houseGroup);

    // Sol
    this.floorMesh = this.floorService.build(HOUSE_FLOORS);
    houseGroup.add(this.floorMesh);

    // Toit
    this.roofMesh = this.roofService.build(HOUSE_ROOF);
    houseGroup.add(this.roofMesh);

    // Murs
    this.wallsGroup = new THREE.Group();

    // Mur AB AVEC ouvertures
    const wallAB = this.wallService.build(HOUSE_WALLS[0], {
      doors: Array.isArray(HOUSE_DOORS) ? HOUSE_DOORS : [HOUSE_DOORS],
      windows: Array.isArray(HOUSE_WINDOWS) ? HOUSE_WINDOWS : [HOUSE_WINDOWS],
    });
    this.wallsGroup.add(wallAB);

    // Les 3 autres murs, pleins
    HOUSE_WALLS.slice(1).forEach((w) =>
      this.wallsGroup!.add(this.wallService.build(w))
    );

    houseGroup.add(this.wallsGroup);

    // Centrer la maison autour de (0,0,0)
    houseGroup.position.set(-10 / 2, 0, 8 / 2);

    // Masquer tout au départ
    this.floorMesh.visible = false;
    this.roofMesh.visible = false;
    this.wallsGroup.visible = false;
    if (this.windowMesh) this.windowMesh.visible = false;
  }

  togglePart(part: string) {
    switch (part) {
      case 'floor':
        if (this.floorMesh) this.floorMesh.visible = !this.floorMesh.visible;
        break;
      case 'walls':
        if (this.wallsGroup) this.wallsGroup.visible = !this.wallsGroup.visible;
        break;
      case 'roof':
        if (this.roofMesh) this.roofMesh.visible = !this.roofMesh.visible;
        break;
      case 'windows':
        if (this.windowMesh) this.windowMesh.visible = !this.windowMesh.visible;
        break;
    }
    this.renderOnce();
  }

  showAll() {
    if (this.floorMesh) this.floorMesh.visible = true;
    if (this.wallsGroup) this.wallsGroup.visible = true;
    if (this.roofMesh) this.roofMesh.visible = true;
    if (this.windowMesh) this.windowMesh.visible = true;
    this.renderOnce();
  }
  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };
}
