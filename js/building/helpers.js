import { THREE } from '../three-global.js';
import { edgeLineMat, monolithMat, monolithEdgeMat } from '../materials.js';

    function createBox(w, h, d, mat, group, castShadow = true, receiveShadow = true) {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      
      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, edgeLineMat);
      mesh.add(line);

      group.add(mesh);
      return mesh;
    }

    function createMonolithBox(w, h, d, group) {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geom, monolithMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, monolithEdgeMat);
      mesh.add(line);

      group.add(mesh);
      return mesh;
    }

    function createBoxWithMetricUV(w, h, d, mat, group, castShadow = true, receiveShadow = true, tileScale = 0.70) {
      const geom = new THREE.BoxGeometry(w, h, d);
      const uv = geom.attributes.uv;

      const uScale = [
        d / tileScale, d / tileScale,
        w / tileScale, w / tileScale,
        w / tileScale, w / tileScale
      ];
      const vScale = [
        h / tileScale, h / tileScale,
        d / tileScale, d / tileScale,
        h / tileScale, h / tileScale
      ];

      for (let f = 0; f < 6; f++) {
        for (let v = 0; v < 4; v++) {
          const idx = (f * 4 + v) * 2;
          uv.array[idx] *= uScale[f];
          uv.array[idx + 1] *= vScale[f];
        }
      }
      uv.needsUpdate = true;

      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;

      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, edgeLineMat);
      mesh.add(line);

      group.add(mesh);
      return mesh;
    }


export function createCylinder(rTop, rBot, height, segs, mat, group) {
  const geom = new THREE.CylinderGeometry(rTop, rBot, height, segs);
  const mesh = new THREE.Mesh(geom, mat);
  if (group) group.add(mesh);
  return mesh;
}

export { createBox, createMonolithBox, createBoxWithMetricUV };
