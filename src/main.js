import * as THREE from 'three';
import * as threePotree from '@pix4d/three-potree-loader';

import { OrbitControls } from './lib/orbitControls';

const serverConfig = {
  cloudjs: 'cloud.js',
  makeURL(path) {
    return `http://localhost:4000/${path}`;
  },
};

main();

function main() {
  const el = document.getElementById('target');

  const renderer = new THREE.WebGLRenderer();
  const camera = new THREE.PerspectiveCamera(90, NaN, 0.001, 100000);
  const orbitControls = new OrbitControls(camera, el);
  const scene = new THREE.Scene();

  updateSize(renderer, camera, el);
  // Add resize listener
  window.addEventListener('resize', () => {
    updateSize(renderer, camera, el);
  });

  el.appendChild(renderer.domElement);

  const potree = new threePotree.Potree();

  load(serverConfig, potree, (pco) => {
    camera.position.copy(pco.boundingBox.getCenter());
    // Set valid direction of 'sky'
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(scene.position);
    orbitControls.update();
    scene.add(pco);

    render(renderer, scene, camera, potree, pco);
  });
}

function load(config, potree, afterLoad) {
  potree.loadPointCloud(config.cloudjs, config.makeURL)
    .then((pco) => {
      pco.toTreeNode(pco.root);
      afterLoad(pco);

      return pco;
    })
    .catch((err) => {
      console.error(err);
    });
}

function render(renderer, scene, camera, potree, pco) {
  requestAnimationFrame(_render);

  function _render() {
    requestAnimationFrame(_render);

    potree.updatePointClouds([pco], camera, renderer);

    renderer.clear();
    renderer.render(scene, camera);
  }
}

function updateSize(renderer, camera, el) {
  const { width, height } = el.getBoundingClientRect();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
