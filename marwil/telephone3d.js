// Téléphone en 3D (three.js), posé dans un conteneur de la page. Il tourne au doigt et prend la couleur choisie.
// Modèles (CC BY 4.0) : « iPhone 16 Ultramarine » par EV_car2013 (forme classique), « iPhone 17 Pro » par Ranguel (forme pro).
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

const BASE = new URL(".", import.meta.url).href;
const FICHIERS = { classique: BASE + "modeles/iphone-16.glb", pro: BASE + "modeles/iphone-pro.glb" };
const cache = {};
function charger(forme) {
  if (!cache[forme]) {
    const l = new GLTFLoader(); l.setMeshoptDecoder(MeshoptDecoder);
    // le .glb d'abord ; si l'hébergeur ne le sert pas, la même chose en .json (base64)
    const glb = () => fetch(FICHIERS[forme]).then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); });
    const json = () => fetch(FICHIERS[forme].replace(".glb", ".json")).then(r => r.json()).then(j => Uint8Array.from(atob(j.glb), c => c.charCodeAt(0)).buffer);
    cache[forme] = glb().catch(json).then(b => new Promise((ok, ko) => l.parse(b, "", ok, ko)));
  }
  return cache[forme];
}

// pièces du modèle classique qui portent la couleur
const PIECES = { WUYxwatEaLwQKYC: "dos", guTcKQwdaToGoMi_001: "logo", DdWdzDpAESzZMHT_001: "cadre", RbixOJvwPDAnJgY: "cadre", wwdjrsOZDspvrxe_001: "cadre", FsqNMRNvIFvfMyT_001: "cadre", MXxDtuFlfXWRstO_001: "cadre", pMTAaHJdVwYXgSm: "bague", rlvJaAxZokQwvfU: "bague", RmyubFjMaxDJSTu_001: "plateau", QqdCrHxuCzexUxf: "plateau" };

function preparer(gltf, forme) {
  const m = gltf.scene.clone(true);
  // matériaux propres à cette copie (deux téléphones peuvent cohabiter)
  const vus = new Map();
  m.traverse(o => { if (!o.isMesh) return; const arr = Array.isArray(o.material) ? o.material : [o.material];
    const neuf = arr.map(mt => { if (!vus.has(mt)) vus.set(mt, mt.clone()); return vus.get(mt); });
    o.material = Array.isArray(o.material) ? neuf : neuf[0]; });
  let box = new THREE.Box3().setFromObject(m), s = box.getSize(new THREE.Vector3());
  m.scale.multiplyScalar(0.16 / s.y);
  box = new THREE.Box3().setFromObject(m); m.position.sub(box.getCenter(new THREE.Vector3()));
  const tenue = new THREE.Group(); tenue.add(m);
  if (forme === "pro") tenue.rotation.y = Math.PI;
  const teintes = [];
  vus.forEach(mt => {
    if (forme === "classique") {
      const p = PIECES[mt.name], c = mt.color;
      if (p) { if (p === "plateau") mt.map = null; mt.envMapIntensity = p === "dos" ? 0.3 : 0.6; if (p === "dos") { mt.roughness = 0.5; mt.metalness = 0; } teintes.push([mt, p]); }
      else if (c && !mt.map && c.b > 0.2 && c.b > c.r * 1.4) { mt.envMapIntensity = 0.45; teintes.push([mt, "bague"]); }
    } else {
      if (mt.name === "Aluminum") { mt.metalness = 0.85; mt.roughness = 0.32; teintes.push([mt, "alu"]); }
      if (mt.name === "Tint_back_glass" || mt.name === "Frosted_glass") { mt.map = null; mt.roughness = 0.5; mt.metalness = 0; mt.transparent = false; mt.opacity = 1; mt.envMapIntensity = 0.25; teintes.push([mt, "verre"]); }
      if (mt.name === "Plastic_antena") { mt.roughness = 0.5; teintes.push([mt, "antenne"]); }
    }
  });
  return { tenue, teintes };
}

function peindre(teintes, c) {
  teintes.forEach(([mt, p]) => {
    if (p === "dos" || p === "verre") mt.color.set(c.dos);
    else if (p === "logo") mt.color.set(c.dos).multiplyScalar(0.92);
    else if (p === "cadre" || p === "alu") mt.color.set(c.cadre);
    else if (p === "bague" || p === "plateau") mt.color.set(c.bague);
    else if (p === "antenne") mt.color.set(c.cadre).multiplyScalar(0.72);
  });
}

// options : forme, couleur (id du catalogue), angle (rotation de départ), interactif, fixe (aucun balancement), photo (rendu unique)
export async function telephone(conteneur, o) {
  const rendu = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: !!o.photo });
  rendu.setPixelRatio(Math.min(2, devicePixelRatio));
  rendu.outputColorSpace = THREE.SRGBColorSpace;
  rendu.toneMapping = THREE.LinearToneMapping; rendu.toneMappingExposure = 1.75;
  const cv = rendu.domElement; cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  conteneur.appendChild(cv);
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(rendu).fromScene(new RoomEnvironment(), 0.04).texture;
  const cam = new THREE.PerspectiveCamera(26, 1, 0.01, 10); cam.position.set(0, 0, o.recul || 0.5);
  [[0xffffff, 1.8, [0.5, 0.6, 0.8]], [0xffffff, 3.0, [-0.8, 0.2, -0.5]], [0xffffff, 2.0, [0.9, -0.1, -0.4]]].forEach(([c, i, p]) => { const l = new THREE.DirectionalLight(c, i); l.position.set(...p); scene.add(l); });
  const pivot = new THREE.Group(); scene.add(pivot);

  let modele = null, forme = null, vise = null;
  async function montrer(f, couleur) {
    vise = couleur;
    if (f !== forme) {
      forme = f; const g = await charger(f); if (forme !== f) return;
      if (modele) pivot.remove(modele.tenue);
      modele = preparer(g, f); pivot.add(modele.tenue);
    }
    peindre(modele.teintes, MARWIL.couleurs[vise]); dessiner = true;
  }
  let dessiner = true;
  function taille() { const r = conteneur.getBoundingClientRect(); if (!r.width) return; rendu.setSize(r.width, r.height, false); cam.aspect = r.width / r.height; cam.updateProjectionMatrix(); dessiner = true; }
  new ResizeObserver(taille).observe(conteneur); taille();

  // au doigt
  let tire = false, lx = 0, vit = 0, main = o.angle || 0;
  if (o.interactif) {
    conteneur.style.touchAction = "pan-y"; conteneur.style.cursor = "grab";
    conteneur.addEventListener("pointerdown", e => { tire = true; lx = e.clientX; conteneur.setPointerCapture(e.pointerId); });
    conteneur.addEventListener("pointermove", e => { if (!tire) return; vit = (e.clientX - lx) * 0.012; lx = e.clientX; main += vit; });
    const lache = () => tire = false; conteneur.addEventListener("pointerup", lache); conteneur.addEventListener("pointercancel", lache);
  }
  const calme = matchMedia("(prefers-reduced-motion: reduce)").matches || o.fixe;
  let visible = true;
  new IntersectionObserver(es => es.forEach(e => visible = e.isIntersecting)).observe(conteneur);
  const t0 = performance.now(), base = o.angle == null ? -0.42 : o.angle;
  function boucle(now) {
    requestAnimationFrame(boucle);
    if (!visible || !modele) return;
    const t = (now - t0) / 1000;
    if (!tire) { vit *= 0.94; main += vit; if (o.interactif) main *= 0.985; }
    const bal = calme ? 0 : Math.sin(t * 0.5) * 0.35;
    pivot.rotation.set(-0.08 + (calme ? 0 : Math.sin(t * 0.7) * 0.02), base + bal + (o.interactif ? main : 0), 0.05);
    pivot.position.y = calme ? 0 : Math.sin(t * 1.1) * 0.002;
    if (calme && !dessiner) return;
    rendu.render(scene, cam); dessiner = false;
  }
  requestAnimationFrame(boucle);
  if (o.forme) await montrer(o.forme, o.couleur);
  return { montrer, toile: cv, rendre: () => rendu.render(scene, cam) };
}
