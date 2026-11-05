/* Maënis Studio : préparation des photos dans le téléphone avant l'envoi
   (réduites à 2000 px, en JPEG, avec un contrôle de taille et de netteté). Utilisé par la fiche et par « Mon espace ». */
window.MaenisPhotos = (() => {
  const charger = (file) => new Promise((ok, ko) => {
    const url = URL.createObjectURL(file), img = new Image();
    img.onload = () => ok({ img, url });
    img.onerror = () => ko(new Error("illisible"));
    img.src = url;
  });

  // Netteté : variance du laplacien sur une petite version en gris (plus c'est haut, plus c'est net)
  const nettete = (img, w, h) => {
    const s = 360 / Math.max(w, h), cw = Math.max(8, Math.round(w * s)), ch = Math.max(8, Math.round(h * s));
    const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
    const cx = cv.getContext("2d", { willReadFrequently: true }); cx.drawImage(img, 0, 0, cw, ch);
    const d = cx.getImageData(0, 0, cw, ch).data, g = new Float32Array(cw * ch);
    for (let i = 0; i < cw * ch; i++) g[i] = d[i * 4] * .299 + d[i * 4 + 1] * .587 + d[i * 4 + 2] * .114;
    let n = 0, m = 0, m2 = 0;
    for (let y = 1; y < ch - 1; y++) for (let x = 1; x < cw - 1; x++) {
      const i = y * cw + x, l = g[i - 1] + g[i + 1] + g[i - cw] + g[i + cw] - 4 * g[i];
      n++; m += l; m2 += l * l;
    }
    m /= n; return Math.round(m2 / n - m * m);
  };

  const preparer = async (file, max = 2000) => {
    const { img, url } = await charger(file);
    const w = img.naturalWidth, h = img.naturalHeight, r = Math.min(1, max / Math.max(w, h));
    const cv = document.createElement("canvas"); cv.width = Math.round(w * r); cv.height = Math.round(h * r);
    cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
    return { data: cv.toDataURL("image/jpeg", .86).split(",")[1], mime: "image/jpeg", largeur: w, hauteur: h, nettete: nettete(img, w, h), apercu: url, nom: file.name };
  };

  const avis = (p) => Math.min(p.largeur, p.hauteur) < 700 ? { ok: false, texte: "Trop petite" }
    : p.nettete < 35 ? { ok: true, attention: true, texte: "Un peu floue ?" } : { ok: true, texte: "Parfaite" };

  const brut = (file) => new Promise((ok) => { const fr = new FileReader(); fr.onload = () => ok(String(fr.result).split(",")[1]); fr.readAsDataURL(file); });

  return { preparer, avis, brut };
})();
