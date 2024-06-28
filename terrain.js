import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(50, 50, 50).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

function generateRandomHeight() {
  return Math.random() * 25;
}

const geometry = new THREE.PlaneGeometry(200, 200, 20, 10);

const material = new THREE.LineBasicMaterial({
  color: 0xffffff, // Set wireframe color to black
  linewidth: 1, // Set line width to a smaller value
  transparent: true,
  opacity: 0.2, // Set opacity to 70%
});

function createRandomWireframe() {
  const vertices = geometry.attributes.position.array;
  for (let i = 0; i < vertices.length; i += 3) {
    vertices[i + 2] = generateRandomHeight();
  }
  geometry.computeVertexNormals();

  const wireframe = new THREE.WireframeGeometry(geometry);
  const line = new THREE.LineSegments(wireframe, material);
  line.rotation.x = -Math.PI / 2;
  return line;
}

let line = createRandomWireframe();
scene.add(line);

camera.position.y = 50;
camera.position.z = 50;
camera.lookAt(line.position);

camera.fov = 100;
camera.updateProjectionMatrix();

function animate() {
  requestAnimationFrame(animate);
  line.rotation.z += 0.001;
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
