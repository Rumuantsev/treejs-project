import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const xA = 0;
const yA = 0;
const zA = 0;
const xB = 5;
const yB = 5;
const zB = 5;

const A = new THREE.Vector3(xA, yA, zA);
const B = new THREE.Vector3(xB, yB, zB);

const geometryA = new THREE.BufferGeometry().setFromPoints([A]);
const geometryB = new THREE.BufferGeometry().setFromPoints([B]);
const geometryAB = new THREE.BufferGeometry().setFromPoints([A, B]);

const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

const pointA = new THREE.Mesh(sphereGeometry, sphereMaterial);
pointA.position.set(xA, yA, zA);
scene.add(pointA);

const pointB = new THREE.Mesh(sphereGeometry, sphereMaterial);
pointB.position.set(xB, yB, zB);
scene.add(pointB);

const materialLines1 = new THREE.LineBasicMaterial({ color: 0xff0000 });
const lineAB = new THREE.Line(geometryAB, materialLines1);
scene.add(lineAB);

const AB = new THREE.Vector3().subVectors(B, A);

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

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
orbit.addEventListener("change", render);
camera.position.set(0, 3, 12);

function updateLineAndVector() {
  const positions = lineAB.geometry.attributes.position.array;
  positions[0] = pointA.position.x;
  positions[1] = pointA.position.y;
  positions[2] = pointA.position.z;
  positions[3] = pointB.position.x;
  positions[4] = pointB.position.y;
  positions[5] = pointB.position.z;
  lineAB.geometry.attributes.position.needsUpdate = true;
  console.clear();
  AB.subVectors(pointB.position, pointA.position);
  const normalXY = new THREE.Vector3(0, 0, 1);
  const cosAngle = AB.dot(normalXY) / (AB.length() * normalXY.length());
  const angleToNormal = Math.acos(cosAngle);
  const angleToPlane = 90 - THREE.MathUtils.radToDeg(angleToNormal);
  console.log("Угол наклона отрезка к XY:", angleToPlane);

  const projectionABonXY = new THREE.Vector3(AB.x, AB.y, 0);
  const xAxis = new THREE.Vector3(1, 0, 0);
  const cosAzimuth =
    AB.dot(xAxis) / (projectionABonXY.length() * xAxis.length());
  const azimuthToNormal = Math.acos(cosAzimuth);
  const azimuthDeg = 90 - THREE.MathUtils.radToDeg(azimuthToNormal);
  console.log("Азимут:", azimuthDeg);
}

const controlA = new TransformControls(camera, renderer.domElement);
controlA.addEventListener("change", () => {
  updateLineAndVector();
  render();
});
controlA.addEventListener("dragging-changed", (event) => {
  orbit.enabled = !event.value;
});
controlA.attach(pointA);
window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "a":
      controlA.attach(pointA);
      break;

    case "b":
      controlA.attach(pointB);
      break;
  }
});

const gizmo = controlA.getHelper();
scene.add(gizmo);

const controlB = new TransformControls(camera, renderer.domElement);
controlB.addEventListener("change", () => {
  render();
});
controlB.addEventListener("dragging-changed", (event) => {
  orbit.enabled = !event.value;
});

//controlB.attach(pointB);

//scene.add(controlA);
//scene.add(controlB);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
console.log("Точка A:", pointA);
console.log("Точка B:", pointB);
const materialLines2 = new THREE.LineBasicMaterial({ color: 0x000000 });
const start = new THREE.Vector3(xA, yA, 0);
const yAxis = new THREE.Vector3(xA, 1, 0);
const geometryY = new THREE.BufferGeometry().setFromPoints([start, yAxis]);
const lineY = new THREE.Line(geometryY, materialLines2);
//scene.add(lineY);
