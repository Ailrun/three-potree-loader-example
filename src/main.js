import $ from 'jquery';
import Rx from 'rxjs';
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

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(90, NaN, 0.001, 100000);
  camera.position.x = 292;
  camera.position.y = 143;
  camera.position.z = 364;

  const controls = new OrbitControls(camera, el);

  const potree = new threePotree.Potree();

  updateSize();
  el.appendChild(renderer.domElement);

  const pocObs = Rx.Observable.from(potree.loadPointCloud(serverConfig.cloudjs, serverConfig.makeURL))
        .map((pco) => {
          pco.material = new threePotree.PointCloudMaterial({
            size: 3,
            maxSize: 20,
            minSize: 3,
          });
          pco.toTreeNode(pco.root);
          scene.add(pco);
        })
        .catch((err) => {
          console.log(err);
        });

  let prevNums = 0;

  const renderObs = Rx.Observable.interval(0, Rx.Scheduler.animationFrame)
        .map(() => {
          renderer.render(scene, camera);
        });

  const resizeObs = Rx.Observable.fromEvent(window, 'resize')
        .map(updateSize);

  Rx.Observable
    .merge(pocObs, renderObs, resizeObs)
    .subscribe();

  function updateSize() {
    const { width, height } = el.getBoundingClientRect();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
});
