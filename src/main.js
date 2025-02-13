import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

const xA = 5;
const yA = 3;
const zA = 0;
const xB = 9;
const yB = 5;
const zB = 5;

const A = new THREE.Vector3(xA, yA, zA);
const B = new THREE.Vector3(xB, yB, zB);

const geometry = new THREE.BufferGeometry().setFromPoints([A, B]);
const materialPoints = new THREE.PointsMaterial({ color: 0xff0000, size: 0.2 });
const points = new THREE.Points(geometry, materialPoints);
scene.add(points);

const materialLines1 = new THREE.LineBasicMaterial({ color: 0xff0000 });
const lineAB = new THREE.Line(geometry, materialLines1);
scene.add(lineAB);

const AB = new THREE.Vector3().subVectors(B, A);

const materialLines2 = new THREE.LineBasicMaterial({ color: 0x000000 });
const start = new THREE.Vector3(xA, yA, 0);
const yAxis = new THREE.Vector3(xA, 1, 0);
const geometryY = new THREE.BufferGeometry().setFromPoints([start, yAxis]);
const lineY = new THREE.Line(geometryY, materialLines2);
scene.add(lineY);

const normalXY = new THREE.Vector3(0, 0, 1);
const cosAngle = AB.dot(normalXY) / (AB.length() * normalXY.length());
const angleToNormal = Math.acos(cosAngle);
const angleToPlane = 90 - THREE.MathUtils.radToDeg(angleToNormal);
console.log("Угол наклона отрезка к XY:", angleToPlane);

const projectionABonXY = new THREE.Vector3(AB.x, AB.y, 0);
const xAxis = new THREE.Vector3(1, 0, 0);
const cosAzimuth = AB.dot(xAxis) / (projectionABonXY.length() * xAxis.length());
const azimuthToNormal = Math.acos(cosAzimuth);
const azimuthDeg = 90 - THREE.MathUtils.radToDeg(azimuthToNormal);
console.log("Азимут:", azimuthDeg);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(plane);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 3, 12);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
