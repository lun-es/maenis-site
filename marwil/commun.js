// Maison Marwil : en-tête (avec le menu de la collection), pied de page, univers de couleur et apparitions, communs à toutes les pages.
(function () {
  const M = window.MARWIL, page = document.body.dataset.page || "";
  const memo = { lire(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, ecrire(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  // mélange de deux couleurs : t = part de la première
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => "#" + rgb(a).map((v, i) => Math.round(v * t + rgb(b)[i] * (1 - t)).toString(16).padStart(2, "0")).join("");
  M.mix = mix;
  const PAPIER = "#FAF7F2";
  // teintes du studio pour une couleur d'iPhone : pâle (centre) et un peu plus soutenue (bords)
  M.studio = id => { const d = M.couleurs[id].dos; return { pale: mix(d, PAPIER, .22), pale2: mix(d, PAPIER, .36) }; };

  // L'univers : le studio prend la teinte de l'iPhone, la page entière se réchauffe vers elle
  M.univers = function (id, garder) {
    const c = M.couleurs[id]; if (!c) return;
    const s = M.studio(id), r = document.documentElement.style;
    r.setProperty("--pale", s.pale); r.setProperty("--pale-2", s.pale2); r.setProperty("--teinte", c.dos);
    r.setProperty("--fond", mix(c.dos, PAPIER, .06));
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = mix(c.dos, PAPIER, .06);
    if (garder !== false) memo.ecrire("mm-couleur", id);
  };
  M.couleurGardee = () => { const k = memo.lire("mm-couleur"); return M.couleurs[k] ? k : null; };
  M.univers(document.body.dataset.couleur || M.couleurGardee() || "bourgogne", false);

  const bonjour = "Bonjour Maison Marwil, j’ai une question.";
  // le monogramme (MW et la main qui offre) accompagne le nom ; il sert aussi d'icône d'onglet
  const mono = window.MARWIL_MONO ? `<span class="mono" aria-hidden="true">${window.MARWIL_MONO}</span>` : "";
  const nomLogo = `${mono}<span>Maison Marwil</span>`;
  if (!document.querySelector('link[rel="icon"]')) { const l = document.createElement("link"); l.rel = "icon"; l.type = "image/svg+xml"; l.href = "images/monogramme.svg"; document.head.append(l); }
  const icoWa = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M4 20l1.3-3.9A8 8 0 1 1 8.2 19z"/></svg>';
  const fleche = '<svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true"><path d="M1 3.5l4 3.5 4-3.5"/></svg>';
  const cur = k => k === page ? ' aria-current="page"' : "";
  const marques = [...new Set(M.categories.map(c => c.marque))];
  const lienCat = c => `<a href="collection.html?cat=${c.id}">${c.nom}${c.dispo ? "" : "<small>Bientôt</small>"}</a>`;
  const groupes = [["Apple", M.categories.filter(c => c.marque === "Apple")], ["Autres marques", M.categories.filter(c => c.marque !== "Apple")]];

  const tete = document.createElement("div");
  tete.innerHTML = (M.offre ? `<p class="essai offre"></p>` : "") + (M.essai ? `<p class="essai">Version d’essai : les prix affichés sont provisoires.</p>` : "") + `
  <header class="top gut" id="top">
    <div class="wrap">
      <div class="top-g">
        <button class="menu-b" type="button" aria-label="Ouvrir le menu" aria-expanded="false" id="menuB"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M3 8h18M3 16h18"/></svg></button>
        <nav class="nav" aria-label="Menu">
          <button type="button" class="nav-col" id="colB" aria-expanded="false" aria-controls="mega"${page === "collection" ? ' aria-current="page"' : ""}>Produits ${fleche}</button>
          <a href="comment.html"${cur("comment")}>Comment ça marche</a>
        </nav>
      </div>
      <a class="logo" href="index.html" aria-label="Maison Marwil, accueil">${nomLogo}</a>
      <div class="top-d">
        <nav class="nav" aria-label="Menu, suite" style="margin-right:28px"><a href="suivi.html"${cur("suivi")}>Suivre ma commande</a></nav>
        <a class="contact" href="${M.wa(bonjour)}" target="_blank" rel="noopener" aria-label="Nous écrire sur WhatsApp">${icoWa}<span>Nous écrire</span></a>
      </div>
    </div>
    <div class="mega" id="mega" hidden>
      <div class="wrap">
        ${groupes.map(([t, cs]) => `<div class="mega-g"><p class="eyebrow">${t}</p>${cs.map(lienCat).join("")}</div>`).join("")}
        <a class="mega-vedette" href="collection.html?cat=iphone"><span class="vis" style="--kp:${M.studio("bourgogne").pale};--kp2:${M.studio("bourgogne").pale2}"><img src="images/iphone-18-pro-bourgogne.webp" alt="" loading="lazy"></span><span>Voir les iPhone</span></a>
      </div>
    </div>
  </header>
  <div class="tiroir" id="tiroir" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="haut"><span></span><a class="logo" href="index.html" aria-label="Maison Marwil, accueil">${nomLogo}</a><button class="menu-b" type="button" aria-label="Fermer le menu" id="menuF" style="justify-self:end;margin:0 -10px 0 0"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <nav aria-label="Menu">
      <details class="t-col" open><summary>Produits</summary><div>${groupes.map(([t, cs]) => `<p class="eyebrow">${t}</p>${cs.map(lienCat).join("")}`).join("")}</div></details>
      <a href="suivi.html">Suivre ma commande</a>
      <a href="comment.html">Comment ça marche</a>
    </nav>
    <div class="bas"><a class="btn plein" href="${M.wa(bonjour)}" target="_blank" rel="noopener">Nous écrire sur WhatsApp</a><p style="text-align:center">Paris, ${M.villes}</p></div>
  </div>`;
  document.body.prepend(...tete.childNodes);
  const of = document.querySelector(".essai.offre"); if (of) of.textContent = M.offre;

  const pied = document.createElement("footer"); pied.className = "pied gut";
  pied.innerHTML = `<div class="wrap">
    <div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start"><a class="logo logo-pied" href="index.html" aria-label="Maison Marwil, accueil">${mono}<span>Maison Marwil</span></a><p class="gris" style="max-width:34ch;font-size:14px">Appareils achetés à Paris, livrés à ${M.villes}.</p><a class="link" href="${M.wa(bonjour)}" target="_blank" rel="noopener">Nous écrire sur WhatsApp</a>${Object.entries(M.reseaux || {}).filter(([, u]) => /^https:\/\//.test(u)).map(([n, u]) => `<a class="link" href="${u}" target="_blank" rel="noopener">${n[0].toUpperCase() + n.slice(1)}</a>`).join("")}</div>
    <ul>${M.categories.filter(c => c.dispo).map(c => `<li><a href="collection.html?cat=${c.id}">${c.nom}</a></li>`).join("")}</ul>
    <ul><li><a href="comment.html">Comment ça marche</a></li><li><a href="suivi.html">Suivre ma commande</a></li><li><a href="mentions.html">Mentions légales</a></li></ul>
    <div class="legal"><p>Maison Marwil est une maison indépendante, sans lien avec Apple, Samsung ou Lenovo, dont les noms sont des marques de leurs propriétaires.</p><p>Modèles 3D : « iPhone 16 Ultramarine » par EV_car2013, « iPhone 17 Pro » par Ranguel, licence CC BY 4.0.</p></div>
  </div>`;
  document.body.append(pied);

  const top = document.getElementById("top");
  const hdr = () => document.documentElement.style.setProperty("--hdr", top.querySelector(".wrap").offsetHeight + "px");
  hdr(); addEventListener("resize", hdr);
  addEventListener("scroll", () => top.classList.toggle("colle", scrollY > 8), { passive: true });

  // le menu de la collection (ordinateur) : au clic, au survol, fermé par Échap ou en cliquant ailleurs
  const colB = document.getElementById("colB"), mega = document.getElementById("mega");
  let ferme = null, survol = 0;
  const megaOuvrir = v => { clearTimeout(ferme); mega.hidden = !v; colB.setAttribute("aria-expanded", v); top.classList.toggle("mega-ouvert", v); };
  // un clic juste après l'ouverture au survol ne doit pas refermer le menu
  colB.addEventListener("click", () => { if (mega.hidden) megaOuvrir(true); else if (Date.now() - survol > 600) megaOuvrir(false); });
  colB.addEventListener("pointerenter", e => { if (e.pointerType === "mouse" && mega.hidden) { survol = Date.now(); megaOuvrir(true); } });
  top.addEventListener("pointerleave", e => { if (e.pointerType === "mouse") ferme = setTimeout(() => megaOuvrir(false), 250); });
  top.addEventListener("pointerenter", () => clearTimeout(ferme));
  document.addEventListener("click", e => { if (!mega.hidden && !top.contains(e.target)) megaOuvrir(false); });

  // le tiroir (téléphone)
  const tir = document.getElementById("tiroir"), mb = document.getElementById("menuB");
  const ouvrir = v => { tir.classList.toggle("ouvert", v); mb.setAttribute("aria-expanded", v); document.body.style.overflow = v ? "hidden" : ""; (v ? document.getElementById("menuF") : mb).focus(); };
  mb.addEventListener("click", () => ouvrir(true));
  document.getElementById("menuF").addEventListener("click", () => ouvrir(false));
  addEventListener("keydown", e => { if (e.key !== "Escape") return; if (tir.classList.contains("ouvert")) ouvrir(false); if (!mega.hidden) { megaOuvrir(false); colB.focus(); } });

  // apparitions au défilement
  M.reveler = racine => {
    const els = (racine || document).querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove("attente"); io.unobserve(e.target); } }), { threshold: .12 });
    els.forEach(e => { e.classList.add("attente"); io.observe(e); });
  };
  M.reveler();

  // tuiles des catégories (accueil)
  M.tuiles = function (el) {
    el.innerHTML = M.categories.filter(c => c.dispo).map(c => {
      const m = M.modeles.find(x => x.categorie === c.id), k = m && m.couleurs[0], s = k ? M.studio(k) : null;
      return `<a class="tuile reveal" href="collection.html?cat=${c.id}">
        <span class="vis" style="${s ? `--kp:${s.pale};--kp2:${s.pale2}` : ""}">${m ? `<img src="images/${m.id}-${k}.webp" alt="" loading="lazy">` : ""}</span>
        <span class="nom">${c.nom}</span><span class="etat">${c.accroche}</span></a>`;
    }).join("");
    M.reveler(el);
  };

  // cartes de la collection
  M.cartes = function (grille, sauf, limite) {
    grille.innerHTML = M.modeles.filter(m => m !== sauf).slice(0, limite || 99).map(m => {
      const c0 = m.couleurs[0], p = M.aPartir(m), s = M.studio(c0);
      return `<a class="carte reveal" href="produit.html?m=${m.id}&c=${c0}" style="--kp:${s.pale};--kp2:${s.pale2}">
        <div class="vis">${(M.disponibles || []).includes(m.id) ? `<span class="dispo sur">Disponible à Douala</span>` : ""}${m.couleurs.map((c, i) => `<img ${i ? "data-src" : "src"}="images/${m.id}-${c}.webp" alt="${i ? "" : m.nom + ", " + M.couleurs[c].nom}" loading="lazy" style="opacity:${i ? 0 : 1}" data-c="${c}">`).join("")}</div>
        <div class="txt">
          <div class="ligne"><h3>${m.nom}</h3><p class="prix">${p == null ? "Prix sur demande" : "À partir de " + M.fcfa(p)}</p></div>
          <p class="gris" style="font-size:14px">${m.infos || ""}</p>
          <div class="pts" aria-hidden="true">${m.couleurs.map(c => `<i style="--c:${M.couleurs[c].dos}"></i>`).join("")}</div>
          <span class="suite">Voir</span>
        </div></a>`;
    }).join("");
    // au survol, la carte passe d'une teinte à l'autre, son studio aussi
    grille.querySelectorAll(".carte").forEach(a => {
      const ims = [...a.querySelectorAll("img")], vis = a.querySelector(".vis"); let i = 0, t = null;
      const montre = k => { ims.forEach((im, j) => im.style.opacity = j === k ? 1 : 0); const s = M.studio(ims[k].dataset.c); vis.style.setProperty("--kp", s.pale); vis.style.setProperty("--kp2", s.pale2); };
      vis.style.transition = "background 1s ease";
      a.addEventListener("pointerenter", e => { if (e.pointerType !== "mouse") return; ims.forEach(im => { if (im.dataset.src) { im.src = im.dataset.src; im.removeAttribute("data-src"); } }); t = setInterval(() => { i = (i + 1) % ims.length; montre(i); }, 1100); });
      a.addEventListener("pointerleave", () => { clearInterval(t); i = 0; montre(0); });
    });
    M.reveler(grille);
  };

  // typographie française sur tout le texte affiché, y compris ce qui s'ajoute après coup :
  // espace insécable avant : ; ? ! et entre un nombre et son unité
  const typo = n => {
    if (n.nodeType === 3) {
      const p = n.parentElement; if (!p || p.closest("script,style,textarea,input")) return;
      const t = n.nodeValue.replace(/(\S) ([:])(?=\s|$)/g, "$1\u00a0$2").replace(/(\S) ([?!;])(?=\s|$|[»)])/g, "$1\u202f$2")
        .replace(/(\d) (FCFA|Go|To|%|kg|h|jours|mois|ans?|pouces)\b/g, "$1\u00a0$2").replace(/'/g, "\u2019");
      if (t !== n.nodeValue) n.nodeValue = t; return;
    }
    if (n.nodeType === 1 || n.nodeType === 11) { if (n.nodeType === 1 && n.closest("script,style")) return; n.childNodes.forEach(typo); }
  };
  M.typo = typo;
  const lancerTypo = () => { typo(document.body); new MutationObserver(l => l.forEach(m => m.type === "characterData" ? typo(m.target) : m.addedNodes.forEach(typo))).observe(document.body, { childList: true, subtree: true, characterData: true }); };
  if (document.body) lancerTypo(); else document.addEventListener("DOMContentLoaded", lancerTypo);
})();
