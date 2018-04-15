import $ from 'jquery';
import * as THREE from 'three';
import * as threePotree from '@pix4d/three-potree-loader';

import { OrbitControls } from './lib/orbitControls';

const serverConfig = {
  cloudjs: 'cloud.js',
  makeURL(path) {
    return `http://localhost:4000/${path}`;
  },
};

$(() => {
  const el = $('#target')[0];

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(0, 0);

  const camera = new THREE.PerspectiveCamera(90, NaN, 0.001, 100000);
  camera.position.x = 292;
  camera.position.y = 143;
  camera.position.z = 364;

  const controls = new OrbitControls(camera, el);

  updateSize(renderer, camera, el);
  window.addEventListener('resize', () => {
    updateSize(renderer, camera, el);
  });

  el.appendChild(renderer.domElement);

  const potree = new threePotree.Potree();

  const scene = new THREE.Scene();

  potree.loadPointCloud(serverConfig.cloudjs, serverConfig.makeURL)
    .then((pco) => {
      pco.material = new threePotree.PointCloudMaterial({
        size: 3,
        maxSize: 20,
        minSize: 3,
      });
      pco.toTreeNode(pco.root);

      return pco;
    })
    .then((pco) => {
      scene.add(pco);

      render(renderer, scene, camera);
    })
    .catch((err) => {
      console.error(err);
    });
});

function render(renderer, scene, camera, potree, pco) {
  requestAnimationFrame(_render);

  function _render() {
    requestAnimationFrame(_render);

    renderer.render(scene, camera);
  }
}

function updateSize(renderer, camera, el) {
  const { width, height } = el.getBoundingClientRect();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}
