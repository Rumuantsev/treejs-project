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
document.body.appendChild(labelRenderer.domElement);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
orbit.addEventListener("change", render);
camera.position.set(-10, 2.5, 10);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const xA = 0;
const yA = 0;
const zA = 0;
const xB = 4;
const yB = 4;
const zB = 4;

const pA = document.createElement("p");
pA.textContent = "A";
pA.classList.add("label");
let labelA = new CSS2DObject(pA);
scene.add(labelA);
labelA.position.set(xA, yA, zA);

const pB = document.createElement("p");
pB.textContent = "B";
pB.classList.add("label");
let labelB = new CSS2DObject(pB);
scene.add(labelB);
labelB.position.set(xB, yB, zB);

const A = new THREE.Vector3(xA, yA, zA);
const B = new THREE.Vector3(xB, yB, zB);

const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x8b0000 });

const pointA = new THREE.Mesh(sphereGeometry, sphereMaterial);
pointA.position.set(xA, yA, zA);
scene.add(pointA);

const pointB = new THREE.Mesh(sphereGeometry, sphereMaterial);
pointB.position.set(xB, yB, zB);
scene.add(pointB);

let geometryAB = new THREE.BufferGeometry().setFromPoints([A, B]);
const materialLines = new THREE.LineBasicMaterial({ color: 0xff0000 });
let lineAB = new THREE.Line(geometryAB, materialLines);
scene.add(lineAB);

const AB = new THREE.Vector3().subVectors(B, A);

const planeGeometry = new THREE.PlaneGeometry(10, 10);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

function updateLineAndVector() {
  lineAB.geometry.setFromPoints([pointA.position, pointB.position]);
  lineAB.geometry.attributes.position.needsUpdate = true;
  AB.subVectors(pointB.position, pointA.position);

  labelA.position.set(
    pointA.position.x,
    pointA.position.y - 0.2,
    pointA.position.z
  );
  labelB.position.set(
    pointB.position.x,
    pointB.position.y - 0.2,
    pointB.position.z
  );

  //Расчет угла наклона
  const normalXY = new THREE.Vector3(0, 0, 1);
  const angleToNormal = AB.angleTo(normalXY);
  const angleToPlane = 90 - THREE.MathUtils.radToDeg(angleToNormal);
  document.getElementById("angle").innerText = Math.abs(
    angleToPlane.toFixed(2)
  );

  //Расчет азимута
  const projectionABonXY = new THREE.Vector3(AB.x, AB.y, 0);
  let azimuthDeg360;
  const yAxis = new THREE.Vector3().subVectors(
    new THREE.Vector3(pointA.position.x, pointA.position.y, pointA.position.z),
    new THREE.Vector3(
      pointA.position.x,
      pointA.position.y - 1,
      pointA.position.z
    )
  );
  if (pointB.position.x < pointA.position.x) {
    yAxis.negate();
    const azimuthRad = projectionABonXY.angleTo(yAxis);
    const azimuthDeg = THREE.MathUtils.radToDeg(azimuthRad);
    azimuthDeg360 = azimuthDeg + 180;
  } else {
    const azimuthRad = projectionABonXY.angleTo(yAxis);
    const azimuthDeg = THREE.MathUtils.radToDeg(azimuthRad);
    azimuthDeg360 = azimuthDeg;
  }
  document.getElementById("azimuth").innerText = azimuthDeg360.toFixed(2);
}

const TrasformControl = new TransformControls(camera, renderer.domElement);
TrasformControl.addEventListener("change", () => {
  updateLineAndVector();
});
TrasformControl.addEventListener("dragging-changed", (event) => {
  orbit.enabled = !event.value;
});
TrasformControl.attach(pointB);

window.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "a":
      TrasformControl.attach(pointA);
      break;

    case "b":
      TrasformControl.attach(pointB);
      break;
  }
});

const gizmo = TrasformControl.getHelper();
scene.add(gizmo);

const gridHelper = new THREE.GridHelper(10, 10);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}
render();
