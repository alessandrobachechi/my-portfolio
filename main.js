import "./style.css";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";

import * as THREE from "three";
import Splitting from "splitting";
import gsap from "gsap";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const experience = {};
const mouse = { x: 0, y: 0 };

document.addEventListener("DOMContentLoaded", () => {
  experience.state = "title";

  experience.scene = createScene();
  experience.scene.background = new THREE.Color("hsl(0, 0%, 4%)");
  experience.clock = new THREE.Clock();
  experience.camera = createCamera();
  experience.camera.position.set(0, 1, 3);
  experience.camera.rotation.set(0, 0, 0);
  experience.renderer = createRenderer();
  experience.animationGroup = new THREE.AnimationObjectGroup();
  experience.mixer = new THREE.AnimationMixer(experience.animationGroup);

  Splitting({
    target: "h1",
    by: "chars",
  });

  gsap.from("h1 .char", {
    y: "5%",
    opacity: 0,
    duration: 2,
    ease: "expo.inOut",
    stagger: 0.1,
  });

  const chars = document.querySelectorAll(".char");
  const firstChar = chars[0].getBoundingClientRect();
  const lastChar = chars[chars.length - 1].getBoundingClientRect();
  const target = { x: firstChar.x, y: -100 };

  const timeline = gsap.timeline();
  timeline
    .to(target, {
      x: lastChar.x,
      duration: 2 + chars.length * 0.1,
      ease: "expo.inOut",
      onUpdate: () => {
        if (experience.neck && experience.spine) {
          moveJoint(target, experience.neck, 50);
          moveJoint(target, experience.spine, 30);
        }
      },
    })
    .to(target, {
      x: () => mouse.x,
      y: () => mouse.y,
      duration: 2,
      ease: "expo.inOut",
      onUpdate: () => {
        if (experience.neck && experience.spine) {
          moveJoint(target, experience.neck, 50);
          moveJoint(target, experience.spine, 30);
        }
      },
      onComplete: () => {
        experience.state = "cursor";
      },
    });

  setupScene(experience);

  window.addEventListener("resize", () => handleResize(experience));
  document.addEventListener("mousemove", function (event) {
    updateMousePosition(event);
  });

  experience.renderer.setAnimationLoop(() => {
    render(experience);
  });
});

const createScene = () => {
  return new THREE.Scene();
};

const createCamera = () => {
  return new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
};

const createRenderer = () => {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.body.appendChild(renderer.domElement);
  return renderer;
};

const setupScene = (experience) => {
  const loader = new GLTFLoader();
  /* const light = new THREE.AmbientLight(0xffffff); // soft white light
  experience.scene.add(light); */

  // Add lights
  let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
  hemiLight.position.set(0, 50, 0);
  // Add hemisphere light to scene
  experience.scene.add(hemiLight);

  let d = 8.25;
  let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
  dirLight.position.set(-8, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 1500;
  dirLight.shadow.camera.left = d * -1;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = d * -1;
  // Add directional Light to scene
  experience.scene.add(dirLight);

  loader.load(
    "backup.glb",
    (gltf) => {
      const model = gltf.scene;

      experience.scene.add(model);
      model.position.set(0, -1, 0);
      model.rotation.set(
        THREE.MathUtils.degToRad(-15),
        THREE.MathUtils.degToRad(30),
        THREE.MathUtils.degToRad(0)
      );

      experience.animationGroup.add(model);

      model.traverse(function (node) {
        if (node.isBone && node.name === "Neck") experience.neck = node;
        if (node.isBone && node.name === "Spine") experience.spine = node;
      });

      const clip = filterAnimation(gltf.animations[0]);
      const action = experience.mixer.clipAction(clip);

      action.play();
    },
    null,
    null
  );
};

const handleResize = (experience) => {
  experience.camera.aspect = window.innerWidth / window.innerHeight;
  experience.camera.updateProjectionMatrix();

  experience.renderer.setSize(window.innerWidth, window.innerHeight);
  experience.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

const render = (experience) => {
  const delta = experience.clock.getDelta();

  if (experience.state == "cursor" && experience.neck && experience.spine) {
    moveJoint(mouse, experience.neck, 50);
    moveJoint(mouse, experience.spine, 30);
  }

  experience.mixer.update(delta);
  experience.renderer.render(experience.scene, experience.camera);
};

const filterAnimation = (animation) => {
  animation.tracks = animation.tracks.filter((track) => {
    return (
      track.name !== "Neck.quaternion" && track.name !== "Spine.quaternion"
    );
  });

  return animation;
};

const updateMousePosition = (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
};

const moveJoint = (mouse, joint, degreeLimit) => {
  let degrees = getMouseDegrees(mouse.x, mouse.y, degreeLimit);
  joint.rotation.y = THREE.MathUtils.degToRad(degrees.x);
  joint.rotation.x = THREE.MathUtils.degToRad(degrees.y);
};

const getMouseDegrees = (x, y, degreeLimit) => {
  let dx = 0,
    dy = 0,
    xdiff,
    xPercentage,
    ydiff,
    yPercentage;

  let w = { x: window.innerWidth, y: window.innerHeight };

  // Left (Rotates neck left between 0 and -degreeLimit)

  // 1. If cursor is in the left half of screen
  if (x <= w.x / 2) {
    // 2. Get the difference between middle of screen and cursor position
    xdiff = w.x / 2 - x;
    // 3. Find the percentage of that difference (percentage toward edge of screen)
    xPercentage = (xdiff / (w.x / 2)) * 100;
    // 4. Convert that to a percentage of the maximum rotation we allow for the neck
    dx = ((degreeLimit * xPercentage) / 100) * -1;
  }
  // Right (Rotates neck right between 0 and degreeLimit)
  if (x >= w.x / 2) {
    xdiff = x - w.x / 2;
    xPercentage = (xdiff / (w.x / 2)) * 100;
    dx = (degreeLimit * xPercentage) / 100;
  }
  // Up (Rotates neck up between 0 and -degreeLimit)
  if (y <= w.y / 2) {
    ydiff = w.y / 2 - y;
    yPercentage = (ydiff / (w.y / 2)) * 100;
    // Note that I cut degreeLimit in half when she looks up
    dy = ((degreeLimit * 0.5 * yPercentage) / 100) * -1;
  }

  // Down (Rotates neck down between 0 and degreeLimit)
  if (y >= w.y / 2) {
    ydiff = y - w.y / 2;
    yPercentage = (ydiff / (w.y / 2)) * 100;
    dy = (degreeLimit * yPercentage) / 100;
  }
  return { x: dx, y: dy };
};
