import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as THREE from 'three';
import * as Stats from 'stats.js';
import { ServerService } from '../server.service';
import { Direction } from '../Enum';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  // показать/скрыть чат
  chatIsVisible = false;

  // инициализация three.js
  scene = new THREE.Scene();
  canvas?: HTMLCanvasElement;
  renderer: any;
  // камера
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraDirection = new THREE.Vector3(0, 0, 0);
  // fps
  stats = new Stats();
  

  cube = this.createCube();
  sphere = this.createSphere();
  plane = this.createPlane();

  sceneElems = [
    this.cube,
    this.sphere,
    this.plane
  ];

  EVENTS = this.serverService.getEvents();

  room: string = "";

  // обработка нажатия клавиши
  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 't' || 'е':
        this.chatIsVisible = true;
        break;
      case 'Escape':
        this.chatIsVisible ? this.chatIsVisible = false : console.log('You open Menu!');
        break;
      case 'w' || 'ц':
        this.serverService.move(Direction.Forward);
        this.camera.position.z -= 0.1;
        break;
      case 'a' || 'ф':
        this.serverService.move(Direction.Left);
        this.camera.position.x -= 0.1;
        break;
      case 's' || 'ы':
        this.serverService.move(Direction.Back);
        this.camera.position.z += 0.1;
        break;
      case 'd' || 'в':
        this.serverService.move(Direction.Right);
        this.camera.position.x += 0.1;    
        break;
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    switch (event.key) {
      case 'w':
        this.serverService.stopMove();
        break;
      case 'a':
        this.serverService.stopMove();
        break;
      case 's':
        this.serverService.stopMove();
        break;
      case 'd':
        this.serverService.stopMove();          
        break;
    }
  }

  @HostListener('document:mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    this.cameraDirection.x += event.movementX / 50;
    this.cameraDirection.y -= event.movementY / 50;
    this.camera.lookAt(this.cameraDirection);
    this.serverService.changeDirection(event.movementX, -event.movementY);
  }

  constructor(
    private router: Router,
    private serverService: ServerService,
    private cookieService: CookieService
  ) {
    // THREE.JS
    // --------------------------------
    // stats
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    // sockets
    serverService.on(this.EVENTS.LEAVE_ROOM, (result: any) => this.onLeaveRoom(result));

    // инициализация игры
    // camera
    this.camera.position.y = 10;
    this.camera.position.z = 30;
    this.camera.position.x = -10;
    this.camera.lookAt(this.cameraDirection);

    // renderer
    this.renderer = new THREE.WebGLRenderer();

    // geometry
    this.initElems();
    this.addLight();
    this.addAmbientLight();
    this.createAxesHelper();
  }

  ngOnInit(): void {
    if (!this.cookieService.get('token')) {
      this.router.navigate(['authorization']);
    }

    // scene initialization
    // renderer
    this.canvas = document.getElementById('gameScene') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor('#808080');

    this.animate();
  }

  leaveRoom() {
    this.serverService.leaveRoom(localStorage.getItem('room'));
  }

  onLeaveRoom(data: any) {
    if (data.result) {
      this.router.navigate(['rooms']);
      localStorage.removeItem('room');
    }
  }

  addLight() {
    this.renderer.shadowMap.enabled = true;
    const light = new THREE.DirectionalLight(0xffffff, 0.75);
    light.shadow.autoUpdate = true;
    light.position.set(3, 3, 3);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    this.scene.add(light);
    this.scene.add(light.target);

    const lightHelper = new THREE.DirectionalLightHelper(light);
    this.scene.add(lightHelper);

    // const helper = new THREE.CameraHelper( light.shadow.camera );
    // this.scene.add( helper );
  }

  addAmbientLight() {
    const light = new THREE.AmbientLight(0xffffff, 0.25);
    this.scene.add(light);
  }

  initElems() {
    this.sceneElems.forEach(elem => this.scene.add(elem));
  }

  createCube() {
    const geometry = new THREE.TorusGeometry(1.5, 0.5, 8, 20);
    const material = new THREE.MeshStandardMaterial({
      color: 0xfcc742,
      emissive: 0x111111,
      //specular: 0xffffff,
      metalness: 1,
      roughness: 0.55
    });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    return cube;
  }

  createSphere() {
    const geometry = new THREE.SphereGeometry(4, 50, 50);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0da520,
      emissive: 0x000000,
      specular: 0xbcbcbc,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(-5, -5, -5);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    return sphere;
  }

  createPlane() {
    const geometry = new THREE.PlaneGeometry(50, 50, 2, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x000000,
      specular: 0xbcbcbc
    })
    const plane = new THREE.Mesh(geometry, material);
    plane.rotateX(Math.PI / 2);
    plane.rotateY(Math.PI);
    plane.position.set(0, -10, 0);
    plane.castShadow = true;
    plane.receiveShadow = true;
    return plane;
  }

  createAxesHelper() {
    const axesHelper = new THREE.AxesHelper(15);
    this.scene.add(axesHelper);
  }

  animate() {
    this.stats.begin();
    this.sceneElems[0].rotation.x += 0.01;
    this.sceneElems[0].rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
	  this.stats.end();
    requestAnimationFrame(this.animate.bind(this));
  }

  ngOnDestroy() {
    document.querySelector('canvas')?.remove();
  }
}
