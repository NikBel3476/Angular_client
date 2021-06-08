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
  clock = new THREE.Clock();
  canvas?: HTMLCanvasElement;
  renderer: any;
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  cameraDirection = new THREE.Vector3(0, 0, 0);
  stats = new Stats();


  plane1 = this.createPlane({ x: 0, y: 15, z: -30 }, { l: 50, h: 50, b: 10 }, "#FFFFFF");
  plane2 = this.createPlane({ x: -30, y: 15, z: 0 }, { l: 10, h: 60, b: 100 });
  plane3 = this.createPlane({ x: 30, y: 15, z: 0 }, { l: 10, h: 60, b: 100 }, '#FF00FF');
  plane4 = this.createPlane({ x: 0, y: 45, z: 0 }, { l: 50, h: 10, b: 100 }, '#BB00BB');
  plane5 = this.createPlane({ x: 0, y: -15, z: 0 }, { l: 50, h: 10, b: 100 }, '#BB00BB');

  cube = this.createCube();
  sphere = this.createSphere();
  plane = this.createPlane();

  sceneElems = [
    this.cube,
    this.sphere,
    this.plane,
    this.plane1,
    this.plane2,
    this.plane4,
    this.plane5,
    this.plane3
  ];

  EVENTS = this.serverService.getEvents();

  room: string = "";

  // обработка нажатия клавиши
  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 't':
        this.chatIsVisible = true;
        break;
      case 'Escape':
        this.chatIsVisible ? this.chatIsVisible = false : console.log('You open Menu!');
        break;
      case 'w':
        this.serverService.move(Direction.Forward);
        break;
      case 'a':
        this.serverService.move(Direction.Left);
        break;
      case 's':
        this.serverService.move(Direction.Back);
        break;
      case 'd':
        this.serverService.move(Direction.Right);
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
    this.cameraDirection.x += event.movementX / 25;
    this.cameraDirection.y -= event.movementY / 25;
    this.camera.lookAt(this.cameraDirection);
    this.serverService.changeDirection(event.movementX, -event.movementY);
  }

  constructor(
    private router: Router,
    private serverService: ServerService,
    private cookieService: CookieService
  ) {
    // stats
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    // sockets
    serverService.on(this.EVENTS.LEAVE_ROOM, (result: any) => this.onLeaveRoom(result));

    // инициализация игры
    // camera
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
    
    //create the scene
    this.scene.background = new THREE.Color(0xbfd1e5);

    //create camera
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.2, 5000);
    this.camera.position.set(0, 10, 30);
    this.camera.lookAt(new THREE.Vector3(0, 5, 0));

    //Add hemisphere light
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
    hemiLight.color.setHSL(0.6, 0.6, 0.6);
    hemiLight.groundColor.setHSL(0.1, 1, 0.4);
    hemiLight.position.set(0, 50, 0);
    this.scene.add(hemiLight);

    //Add directional light
    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-1, 1.75, 1);
    dirLight.position.multiplyScalar(100);
    this.scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    let d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 13500;

    //Setup the renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0xbfd1e5);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    this.renderer.shadowMap.enabled = true;

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

  createPlane(coords = { x: 0, y: 0, z: 0 }, scale = { l: 0, h: 0, b: 0 }, color = '#FF0000') {

    //threeJS Section
    let blockPlane = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshPhongMaterial({ color: color }));

    blockPlane.position.set(coords.x, coords.y, coords.z);
    blockPlane.scale.set(scale.l, scale.h, scale.b);

    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;

    return blockPlane;
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