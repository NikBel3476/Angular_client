import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  
  // инициализация 
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  renderer = new THREE.WebGLRenderer( /* { antialias: true } */ );

  cube = this.createCube();
  sphere = this.createSphere();
  plane = this.createPlane();

  sceneElems = [
    this.cube,
    this.sphere,
    this.plane
  ];
 
  constructor(private router: Router) {
    // инициализация игры
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor('#808080');
    document.body.appendChild( this.renderer.domElement );
    this.camera.position.y = 10;
    this.camera.position.z = 30;
    this.camera.position.x = -10;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.initElems();
    this.addLight();
    this.addAmbientLight();
    this.createAxesHelper();
    this.animate();
  }


  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['authorization']);
    }
  }

  addLight() {
    this.renderer.shadowMap.enabled = true;
    const light = new THREE.DirectionalLight( 0xffffff, 0.75);
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
    const light = new THREE.AmbientLight( 0xffffff, 0.25 );
    this.scene.add( light );
  }

  initElems() {
    this.sceneElems.forEach(elem => this.scene.add(elem));
  }

  createCube() {
    const geometry = new THREE.TorusGeometry( 1.5, 0.5, 8, 20);
    const material = new THREE.MeshStandardMaterial({
      color: 0xfcc742,
      emissive: 0x111111,
      //specular: 0xffffff,
      metalness: 1,
      roughness: 0.55
    });
    const cube = new THREE.Mesh( geometry, material );
    cube.castShadow = true;
    cube.receiveShadow = true;
    return cube;
  }

  createSphere() {
    const geometry = new THREE.SphereGeometry( 4, 50, 50 );
    const material = new THREE.MeshPhongMaterial({
      color: 0x0da520,
      emissive: 0x000000,
      specular: 0xbcbcbc,
    });
    const sphere = new THREE.Mesh( geometry, material );
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
    requestAnimationFrame( this.animate.bind(this) );
    this.sceneElems[0].rotation.x += 0.01;
		this.sceneElems[0].rotation.y += 0.01;
    this.renderer.render( this.scene, this.camera );
  }

  logout() {
    localStorage.clear();
    document.querySelector('canvas')?.remove();
  }

  ngOnDestroy() {
    document.querySelector('canvas')?.remove();
  }
}
