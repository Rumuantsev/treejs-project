import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

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

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "0px";
labelRenderer.domElement.style.pointerEvents = "none";
document.body.appendChild(labelRenderer.domElement);

const xA = 0;
const yA = 0;
const zA = 0;
const xB = 4;
const yB = 4;
const zB = 4;

const pA = document.createElement("p");
pA.textContent = "A";
pA.style.background = "#8B0000";
pA.style.color = "white";
pA.style.padding = "4px";
let labelA = new CSS2DObject(pA);
scene.add(labelA);
labelA.position.set(xA, yA, zA);

let pB = document.createElement("p");
pB.textContent = "B";
pB.style.background = "#8B0000";
pB.style.color = "white";
pB.style.padding = "4px";
let labelB = new CSS2DObject(pB);
scene.add(labelB);
labelA.position.set(xB, yB, zB);

const A = new THREE.Vector3(xA, yA, zA);
const B = new THREE.Vector3(xB, yB, zB);

const geometryAB = new THREE.BufferGeometry().setFromPoints([A, B]);

const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x8b0000 });

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

  AB.subVectors(pointB.position, pointA.position);

  labelA = new CSS2DObject(pA);
  scene.add(labelA);
  labelA.position.set(pointA.position.x, pointA.position.y, pointA.position.z);

  labelB = new CSS2DObject(pB);
  scene.add(labelB);
  labelB.position.set(pointB.position.x, pointB.position.y, pointB.position.z);

  const normalXY = new THREE.Vector3(0, 0, 1);
  const angleToNormal = AB.angleTo(normalXY);
  const angleToPlane = 90 - THREE.MathUtils.radToDeg(angleToNormal);
  document.getElementById("angle").innerText = angleToPlane.toFixed(2);

  const projectionABonXY = new THREE.Vector3(AB.x, AB.y, 0);
  const yAxis = new THREE.Vector3(0, 1, 0);
  const azimuthRad = projectionABonXY.angleTo(yAxis);
  const azimuthDeg = THREE.MathUtils.radToDeg(azimuthRad);
  document.getElementById("azimuth").innerText = azimuthDeg.toFixed(2);
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

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera); // <-- Рендерим 2D-объекты
}

animate();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
render();
