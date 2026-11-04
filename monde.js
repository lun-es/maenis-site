/* =====================================================================
   Maënis Studio · interactions de la refonte « Un studio, mille univers »
   - la ronde des personnages autour du logo (on peut la faire tourner au doigt)
   - le voyage horizontal dans les mondes (défilement, glissement, flèches)
   - la pile de héros à glisser et à retourner
   - les effets au toucher (feux d'artifice de formes) et le curseur
   ===================================================================== */
(() => {
  "use strict";
  const C = window.MAENIS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const Z = () => window.__z || 1; // agrandissement de la page sur grand écran
  const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tactile = matchMedia("(hover: none)").matches;
  const echap = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PERSOS = Object.fromEntries((C.personnages || []).map((p) => [p.image, p]));
  const COULEURS = ["#FF5C8A", "#F5B82E", "#1FB5A8", "#7A1230", "#6B4BC4", "#2F8F4E", "#E2731E"];

  /* ---------------- Effets au toucher ---------------- */
  const cv = $(".feux"), ctx = cv.getContext("2d");
  let W = 0, H = 0, R = Math.min(devicePixelRatio || 1, 2);
  const taille = () => { W = cv.width = innerWidth * R; H = cv.height = innerHeight * R; };
  taille(); addEventListener("resize", taille);
  const parts = [];
  const forme = (x, y, n = 18, force = 1) => {
    if (calme) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, v = (2 + Math.random() * 5) * force * R;
      parts.push({ x: x * R, y: y * R, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2 * R, r: (4 + Math.random() * 7) * R, rot: Math.random() * 6, vr: (Math.random() - .5) * .3,
        c: COULEURS[i % COULEURS.length], t: ["etoile", "rond", "carre", "triangle", "coeur"][Math.floor(Math.random() * 5)], vie: 1 });
    }
    if (!anime) { anime = true; requestAnimationFrame(window.__maenisBoucle || boucle); }
  };
  const dessine = (p) => {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = Math.max(p.vie, 0); ctx.fillStyle = p.c;
    const r = p.r; ctx.beginPath();
    if (p.t === "rond") ctx.arc(0, 0, r * .6, 0, 6.28);
    else if (p.t === "carre") ctx.rect(-r * .5, -r * .5, r, r);
    else if (p.t === "triangle") { ctx.moveTo(0, -r * .7); ctx.lineTo(r * .65, r * .5); ctx.lineTo(-r * .65, r * .5); ctx.closePath(); }
    else if (p.t === "coeur") { ctx.moveTo(0, r * .5); ctx.bezierCurveTo(-r, -r * .2, -r * .4, -r * .9, 0, -r * .35); ctx.bezierCurveTo(r * .4, -r * .9, r, -r * .2, 0, r * .5); }
    else { for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * .35 : r * .8, a = i * Math.PI / 5 - Math.PI / 2; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); }
    ctx.fill(); ctx.restore();
  };
  let anime = false;
  const boucle = () => {
    ctx.clearRect(0, 0, W, H);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.x += p.vx; p.y += p.vy; p.vx *= .96; p.vy = p.vy * .96 + .25 * R; p.rot += p.vr; p.vie -= .018;
      if (p.vie <= 0) parts.splice(i, 1); else dessine(p);
    }
    if (parts.length) requestAnimationFrame(boucle); else { anime = false; ctx.clearRect(0, 0, W, H); }
  };
  addEventListener("pointerdown", (e) => {
    if (e.target.closest("input, select, textarea, label, dialog")) return;
    forme(e.clientX, e.clientY, e.target.closest("a, button, .carte, .monde-perso, .ronde-perso") ? 26 : 16);
  }, { passive: true });

  // curseur rond qui grossit sur les liens (ordinateur seulement)
  if (!tactile && !calme) {
    const cur = document.createElement("div"); cur.className = "curseur"; document.body.appendChild(cur);
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy, dernier = 0;
    addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      cur.classList.toggle("sur-lien", !!e.target.closest("a, button, .carte, .monde-perso, .ronde-perso, .carte-heros"));
      const t = performance.now();
      if (t - dernier > 70 && !e.target.closest("dialog, input, textarea, select")) { dernier = t; parts.push({ x: tx * R, y: ty * R, vx: 0, vy: .4 * R, r: 4 * R, rot: 0, vr: .1, c: COULEURS[Math.floor(Math.random() * 3)], t: "etoile", vie: .7 }); if (!anime) { anime = true; requestAnimationFrame(window.__maenisBoucle || boucle); } }
    });
    const suivre = () => { cx += (tx - cx) * .22; cy += (ty - cy) * .22; cur.style.transform = `translate(${cx / Z()}px, ${cy / Z()}px)`; requestAnimationFrame(suivre); };
    suivre();
    // boutons aimantés
    $$(".bouton, .btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .18}px ${(e.clientY - r.top - r.height / 2) * .25}px`; });
      b.addEventListener("pointerleave", () => (b.style.translate = ""));
    });
  }

  /* ---------------- Bandeau des noms ---------------- */
  const piste = $(".noms__piste");
  if (piste) {
    const noms = (C.personnages || []).map((p) => `<span>${echap(p.nom)}</span><i>✦</i>`).join("");
    piste.innerHTML = noms + noms;
  }

  /* ---------------- Ronde des personnages autour du logo ---------------- */
  const ronde = $(".intro__ronde");
  if (ronde && !calme) {
    const choix = ["zara-etoiles", "dino-tchomp", "mama-tokpa", "bip", "princesse-ayo", "capitaine-koumba", "fee-liya", "samy-but", "roi-kito", "sirene-maya", "chevaliere-nala", "papillon-pepin", "lion-acier", "rin"];
    const els = choix.filter((k) => PERSOS[k]).map((k, i) => {
      const img = document.createElement("img");
      img.src = `images/perso-${k}.webp`; img.alt = PERSOS[k].nom; img.className = "ronde-perso"; img.draggable = false;
      img.dataset.k = k; ronde.appendChild(img);
      img.addEventListener("click", () => {
        img.animate([{ transform: img.style.transform }, { transform: img.style.transform + " translateY(-30%) rotate(-8deg)" }, { transform: img.style.transform }], { duration: 600, easing: "cubic-bezier(.34,1.56,.64,1)" });
        bulleFlottante(img, PERSOS[k].phrase || PERSOS[k].texte);
      });
      return img;
    });
    let angle = 0, vitesse = .0025, tire = null;
    const intro = $(".intro");
    intro.addEventListener("pointerdown", (e) => { if (!e.target.closest("a, button")) tire = { x: e.clientX, a: angle, t: performance.now() }; });
    addEventListener("pointermove", (e) => { if (tire) { angle = tire.a + (e.clientX - tire.x) * .006; vitesse = 0; } });
    addEventListener("pointerup", (e) => { if (tire) { const dt = Math.max(16, performance.now() - tire.t); vitesse = Math.max(-.03, Math.min(.03, (e.clientX - tire.x) * .006 / dt * 16 / 6)) || .0025; tire = null; } });
    let visible = true;
    new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(intro);
    const centre = $(".intro__centre");
    let zone = null;
    const majZone = () => { const r = centre.getBoundingClientRect(), ri = intro.getBoundingClientRect(); zone = { l: r.left - ri.left - 20, r: r.right - ri.left + 20, t: r.top - ri.top - 10, b: r.bottom - ri.top + 10 }; };
    addEventListener("resize", majZone); setTimeout(majZone, 300); setTimeout(majZone, 2000);
    const tourne = () => {
      if (visible) {
        angle += vitesse; vitesse += (.0025 - vitesse) * .01;
        const rx = Math.min(innerWidth * .46, 620), ry = Math.min(innerHeight * .34, 300);
        els.forEach((img, i) => {
          const a = angle + i / els.length * Math.PI * 2, x = Math.cos(a) * rx, y = Math.sin(a) * ry, prof = (Math.sin(a) + 1) / 2;
          const s = .55 + prof * .6;
          img.style.transform = `translate(calc(-50% + ${x}px), calc(-100% + ${y}px)) scale(${s})`;
          img.style.zIndex = prof > .62 ? 3 : 1;
          // un personnage qui passe devant le logo ou les boutons devient presque transparent
          let cache = false;
          if (zone) {
            const hp = img.offsetHeight * s, wp = img.offsetWidth * s, cxp = intro.clientWidth / 2 + x, bas = intro.clientHeight * .52 + y;
            cache = cxp + wp / 2 > zone.l && cxp - wp / 2 < zone.r && bas > zone.t && bas - hp < zone.b;
          }
          img.style.opacity = cache ? .1 : .45 + prof * .55;
          img.style.pointerEvents = cache ? "none" : "auto";
          img.style.filter = prof < .4 ? `blur(${(.4 - prof) * 5}px) drop-shadow(0 10px 12px rgba(26,10,14,.2))` : "";
        });
      }
      requestAnimationFrame(tourne);
    };
    tourne();
  }

  /* bulle temporaire au-dessus d'un élément */
  const bulleFlottante = (el, texte) => {
    const r = el.getBoundingClientRect();
    const b = document.createElement("div");
    b.className = "bulle"; b.textContent = texte;
    Object.assign(b.style, { position: "fixed", left: `${Math.min(innerWidth - 250, Math.max(10, r.left + r.width / 2 - 110)) / Z()}px`, top: `${Math.max(70, r.top - 50) / Z()}px`, zIndex: 95, whiteSpace: "normal", maxWidth: "230px", animation: "apparait .35s both" });
    document.body.appendChild(b);
    setTimeout(() => { b.style.transition = "opacity .3s"; b.style.opacity = 0; setTimeout(() => b.remove(), 300); }, 2600);
  };

  /* ---------------- Voyage horizontal dans les mondes ---------------- */
  const voyage = $("#voyage"), pisteV = $("#voyage-piste");
  if (voyage && C.mondes) {
    const N = C.mondes.length;
    pisteV.innerHTML = C.mondes.map((m, i) => `
      <article class="monde ${m.style ? "monde--" + m.style : ""}" style="--c:${m.couleur}" data-i="${i}" aria-label="${echap(m.titre)}">
        <div class="monde__fond" ${m.fond ? `style="background-image:url('${m.fond}')"` : ""}></div>
        ${m.style === "etoiles" ? `<span class="planete" style="width:22vmin;height:22vmin;right:8%;top:12%;background:radial-gradient(circle at 30% 30%,#ffd27a,#e2731e 60%,#7a1230)"></span><span class="planete" style="width:9vmin;height:9vmin;right:40%;top:20%;background:radial-gradient(circle at 30% 30%,#9ff,#1fb5a8 70%)"></span>` : ""}
        <div class="monde__texte">
          <span class="monde__num">MONDE ${String(i + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}</span>
          <h2 class="monde__titre">${m.titre.split(" ").map((mot) => `<span class="mot-entier">${[...mot].map((l) => `<span class="lettre">${echap(l)}</span>`).join("")}</span>`).join(" ")}</h2>
          <p class="monde__accroche">${echap(m.accroche)}</p>
          <p class="monde__indice"><span aria-hidden="true">👆</span> Touchez un personnage pour découvrir son histoire</p>
          <a class="bouton monde__bouton" href="#offre-dessin-anime-enfant" data-univers="${echap(m.titre)}">Mon enfant dans ce monde <span aria-hidden="true">→</span></a>
        </div>
        <div class="monde__scene">${m.persos.filter((k) => PERSOS[k]).map((k) => `
          <div class="monde-perso" data-k="${k}" role="button" tabindex="0" aria-label="${echap(PERSOS[k].nom)}">
            <div class="bulle">${echap(PERSOS[k].texte)}</div>
            <img src="images/perso-${k}.webp" alt="${echap(PERSOS[k].nom)}" loading="lazy" draggable="false">
            <span class="anneau" aria-hidden="true"></span>
            <span class="nom"><span class="nom__doigt" aria-hidden="true">👆</span>${echap(PERSOS[k].nom)}</span>
          </div>`).join("")}</div>
      </article>`).join("");
    // délai en cascade des lettres
    $$(".monde__titre", pisteV).forEach((t) => $$(".lettre", t).forEach((l, i) => (l.style.transitionDelay = `${i * 28}ms`)));
    const points = $("#voyage-points");
    points.innerHTML = C.mondes.map((m, i) => `<button aria-label="Aller au monde ${echap(m.titre)}" data-i="${i}"></button>`).join("");
    const barre = document.createElement("div"); barre.className = "voyage__barre"; $(".voyage__ecran").appendChild(barre);
    const mondes = $$(".monde", pisteV), fonds = $$(".monde__fond", pisteV);
    // Téléphone : l'écran du voyage garde la hauteur d'un iPad (1100 px), centré ; 600 px de défilement par monde pour un voyage plus court
    const tel = () => document.documentElement.classList.contains("mode-tel");
    const ecranH = () => (tel() ? 1100 : innerHeight);
    const hauteur = () => { voyage.style.height = tel() ? `${(N - 1) * 600 + 1100}px` : `${N * innerHeight / Z()}px`; };
    hauteur(); addEventListener("resize", hauteur);
    // mesures en pixels d'écran (justes aussi quand la page est agrandie sur grand écran)
    const etendue = () => voyage.getBoundingClientRect().height - ecranH();
    const debut = () => voyage.getBoundingClientRect().top + scrollY - (innerHeight - ecranH()) / 2;
    let actif = -1, pLisse = 0;
    let decouverts = 0, indices = 0;
    function indiceMonde(m) {
      if (!m || decouverts > 2 || indices > 4) return;
      clearTimeout(m._ind);
      m._ind = setTimeout(function essai() {
        const rv = voyage.getBoundingClientRect();
        if (!m.classList.contains("actif") || rv.top > 5 || rv.bottom < innerHeight - 5) { m._ind = setTimeout(() => indiceMonde(m), 1500); return; }
        const el = $(".monde-perso:not(.decouvert)", m);
        if (!el || el.classList.contains("parle")) return;
        indices++;
        $(".bulle", el).textContent = "👆 Touchez-moi pour découvrir qui je suis !";
        el.classList.add("parle", "appelle");
        setTimeout(() => el.classList.remove("parle", "appelle"), 2800);
      }, 1100);
    }
    const majVoyage = () => {
      const p = Math.min(1, Math.max(0, (scrollY - debut()) / etendue()));
      pLisse += (p - pLisse) * (calme ? 1 : .14);
      const pos = pLisse * (N - 1);
      pisteV.style.transform = `translate3d(${-pos * innerWidth / Z()}px,0,0)`;
      fonds.forEach((f, i) => (f.style.transform = `translate3d(${(pos - i) * innerWidth / Z() * .22}px,0,0) scale(1.05)`));
      barre.style.width = `${p * 100}%`;
      const a = Math.round(pos);
      if (a !== actif) {
        actif = a;
        mondes.forEach((m, i) => m.classList.toggle("actif", i === a));
        indiceMonde(mondes[a]);
        $$("button", points).forEach((b, i) => b.classList.toggle("actif", i === a));
      }
      requestAnimationFrame(majVoyage);
    };
    majVoyage();
    const allerA = (i) => {
      i = Math.max(0, Math.min(N - 1, i));
      document.documentElement.style.scrollBehavior = "smooth";
      scrollTo({ top: debut() + etendue() * i / (N - 1), behavior: "smooth" });
    };
    $$(".voyage__fleche").forEach((b) => b.addEventListener("click", () => allerA(actif + Number(b.dataset.monde))));
    points.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) allerA(Number(b.dataset.i)); });
    // glisser horizontalement (doigt ou souris) = changer de monde
    let g = null;
    const ecran = $(".voyage__ecran");
    ecran.addEventListener("pointerdown", (e) => { if (!e.target.closest("a, button, .monde-perso")) g = { x: e.clientX, y: e.clientY, s: scrollY }; });
    addEventListener("pointermove", (e) => {
      if (!g) return;
      const dx = e.clientX - g.x, dy = e.clientY - g.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 6) {
        document.documentElement.style.scrollBehavior = "auto";
        scrollTo(0, g.s - dx * etendue() / ((N - 1) * innerWidth) * 1.4);
      }
    });
    addEventListener("pointerup", () => { if (g) { g = null; allerA(Math.round(pLisse * (N - 1))); } });
    ecran.addEventListener("wheel", (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); scrollBy(0, e.deltaX); } }, { passive: false });
    // personnages : saut + bulle
    $$(".monde-perso", pisteV).forEach((el) => {
      const jouer = () => {
        el.classList.add("decouvert"); decouverts++;
        $(".bulle", el).textContent = PERSOS[el.dataset.k].texte;
        el.classList.remove("saute"); void el.offsetWidth; el.classList.add("saute", "parle");
        clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove("parle"), 3200);
      };
      el.addEventListener("click", jouer);
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); jouer(); } });
    });
    // « Mon enfant dans ce monde » : l'univers est noté dans la fiche
    $$("[data-univers]", pisteV).forEach((a) => a.addEventListener("click", () => { window.universChoisi = a.dataset.univers; }));
  }

  /* les promeneurs ne passent pas devant l'accueil ni les mondes */
  const zonesCalmes = [$(".intro"), $("#voyage")].filter(Boolean);
  const etat = new Map();
  const obsCalme = new IntersectionObserver((es) => {
    es.forEach((e) => etat.set(e.target, e.isIntersecting && e.intersectionRect.height > innerHeight * .4));
    document.body.classList.toggle("sans-promeneur", [...etat.values()].some(Boolean));
  }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
  zonesCalmes.forEach((z) => obsCalme.observe(z));

  /* ---------------- Pile de héros ---------------- */
  const pile = $("#pile");
  if (pile) {
    const liste = (C.personnages || []).slice();
    const cartes = liste.map((p, i) => {
      const f = document.createElement("figure");
      f.className = "carte-heros"; f.style.setProperty("--c", COULEURS[i % COULEURS.length]);
      f.innerHTML = `
        <div class="carte-heros__face"><img src="images/galerie-${p.image}.webp" alt="${echap(p.nom)}" loading="lazy">
          <figcaption><span>${echap(p.univers || "")}</span><strong>${echap(p.nom)}</strong></figcaption></div>
        <div class="carte-heros__dos"><span class="etiquette" style="color:#fff">${echap(p.univers || "")}</span><strong>${echap(p.nom)}</strong><p>${echap(p.texte)}</p>
          <a href="#offre-dessin-anime-enfant" data-univers="${echap(p.nom)}">Avec mon enfant →</a></div>`;
      pile.appendChild(f);
      $("a", f).addEventListener("click", (e) => { window.universChoisi = "avec " + p.nom; e.stopPropagation(); });
      return f;
    });
    let ordre = cartes.map((_, i) => i), retournee = false;
    const placer = () => {
      ordre.forEach((idx, rang) => {
        const c = cartes[idx];
        c.style.zIndex = 100 - rang;
        c.style.opacity = rang < 4 ? 1 : 0;
        c.style.pointerEvents = rang === 0 ? "auto" : "none";
        const rot = rang === 0 ? 0 : (rang % 2 ? 6 : -5) * Math.min(rang, 3);
        c.style.transform = `translate(-50%, -50%) translate(${rang * 14}px, ${rang * 10}px) rotate(${rot}deg) scale(${1 - rang * .04}) ${rang === 0 && retournee ? "rotateY(180deg)" : ""}`;
      });
    };
    const suivante = (sens) => {
      const c = cartes[ordre[0]];
      retournee = false;
      c.style.transform = `translate(-50%, -50%) translate(${sens * 140}%, -10%) rotate(${sens * 25}deg)`;
      c.style.opacity = 0;
      setTimeout(() => { if (sens > 0) ordre.push(ordre.shift()); else ordre.unshift(ordre.pop()); placer(); }, 260);
    };
    const retourner = () => { retournee = !retournee; placer(); };
    placer();
    $$("[data-carte]").forEach((b) => b.addEventListener("click", () => { const v = Number(b.dataset.carte); v === 0 ? retourner() : suivante(v); }));
    // glisser la carte du dessus
    let d = null;
    pile.addEventListener("pointerdown", (e) => {
      const c = e.target.closest(".carte-heros"); if (!c || c !== cartes[ordre[0]] || e.target.closest("a")) return;
      d = { c, x: e.clientX, y: e.clientY }; c.classList.add("tire"); c.setPointerCapture(e.pointerId);
    });
    pile.addEventListener("pointermove", (e) => {
      if (!d) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      d.c.style.transform = `translate(-50%, -50%) translate(${dx / Z()}px, ${dy / Z()}px) rotate(${dx / 14}deg) ${retournee ? "rotateY(180deg)" : ""}`;
    });
    const fin = (e) => {
      if (!d) return;
      const dx = e.clientX - d.x, dy = e.clientY - d.y;
      d.c.classList.remove("tire");
      if (Math.abs(dx) > 90) suivante(dx > 0 ? 1 : -1);
      else if (Math.abs(dx) < 6 && Math.abs(dy) < 6) retourner();
      else placer();
      d = null;
    };
    pile.addEventListener("pointerup", fin);
    pile.addEventListener("pointercancel", fin);
  }

  /* ================= La nuit Maënis : vagues, reflet, Marie hôtesse ================= */
  // vagues de lumière au toucher (anneaux qui s'élargissent, comme sur l'eau)
  const vagues = [];
  const vague = (x, y, force = 1, couleur) => {
    if (calme) return;
    for (let k = 0; k < 3; k++) vagues.push({ x: x * R, y: y * R, r: 4 * R, v: (5.5 - k * 1.2) * R * force, vie: 1, delai: k * 7, c: couleur || COULEURS[(Math.random() * 3) | 0], l: (3 - k) * R });
    relance();
  };
    // on remplace la boucle pour dessiner aussi les vagues
  const boucle2 = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (let i = vagues.length - 1; i >= 0; i--) {
      const w = vagues[i];
      if (w.delai > 0) { w.delai--; continue; }
      w.r += w.v; w.v *= .975; w.vie -= .016;
      if (w.vie <= 0) { vagues.splice(i, 1); continue; }
      ctx.globalAlpha = w.vie * .9; ctx.strokeStyle = w.c; ctx.lineWidth = w.l; ctx.shadowColor = w.c; ctx.shadowBlur = 18 * R;
      ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, 6.28); ctx.stroke();
    }
    ctx.restore();
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.x += q.vx; q.y += q.vy; q.vx *= .96; q.vy = q.vy * .96 + .25 * R; q.rot += q.vr; q.vie -= .018;
      if (q.vie <= 0) parts.splice(i, 1); else dessine(q);
    }
    if (parts.length || vagues.length) requestAnimationFrame(boucle2); else { anime = false; ctx.clearRect(0, 0, W, H); }
  };
  // toute nouvelle animation passe par boucle2
  const relance = () => { if (!anime) { anime = true; requestAnimationFrame(boucle2); } };
  window.__maenisRelance = relance;
  window.__maenisBoucle = boucle2;
  let appui = false, dernierePos = 0;
  addEventListener("pointerdown", (e) => {
    if (e.target.closest("input, select, textarea, label, dialog")) return;
    appui = true; vague(e.clientX, e.clientY, 1.2);
  }, { passive: true });
  addEventListener("pointerup", () => (appui = false), { passive: true });
  addEventListener("pointercancel", () => (appui = false), { passive: true });
  addEventListener("pointermove", (e) => {
    const t = performance.now();
    reflet.style.transform = `translate(${e.clientX / Z()}px, ${e.clientY / Z()}px)`;
    if (appui && t - dernierePos > 60 && !e.target.closest("dialog, input, textarea, select")) {
      dernierePos = t;
      vagues.push({ x: e.clientX * R, y: e.clientY * R, r: 2 * R, v: 3 * R, vie: .7, delai: 0, c: COULEURS[(Math.random() * 3) | 0], l: 2 * R });
      relance();
    }
  }, { passive: true });
  // reflet doux qui suit le doigt ou la souris
  const reflet = document.createElement("div"); reflet.className = "reflet"; document.body.appendChild(reflet);
  addEventListener("pointerdown", (e) => { reflet.style.transform = `translate(${e.clientX / Z()}px, ${e.clientY / Z()}px)`; reflet.classList.add("on"); }, { passive: true });
  if (tactile) addEventListener("pointerup", () => setTimeout(() => reflet.classList.remove("on"), 400), { passive: true });
  else addEventListener("pointermove", () => reflet.classList.add("on"), { passive: true, once: true });
  // vagues d'ambiance sur l'accueil, même sans toucher
  const introEl = $(".intro");
  let introVisible = true;
  if (introEl) new IntersectionObserver(([en]) => (introVisible = en.isIntersecting)).observe(introEl);
  if (!calme) setInterval(() => {
    if (!introVisible || document.hidden || document.querySelector("dialog[open]")) return;
    vague(innerWidth * (.15 + Math.random() * .7), innerHeight * (.2 + Math.random() * .6), .55, ["#F5B82E", "#FF5C8A", "#22C5B6"][(Math.random() * 3) | 0]);
  }, 2200);

  // Marie, hôtesse de l'accueil : elle parle, et réagit quand on la touche
  const hote = $("#hote"), bulleH = $("#hote-bulle");
  const h = new Date().getHours();
  const salut = h < 5 || h >= 18 ? "Bonsoir" : "Bonjour";
  const LIGNES = [
    `${salut} et bienvenue chez Maënis Studio ! Moi c'est Marie 👋`,
    "Ici, votre enfant devient le héros de son propre dessin animé.",
    "Touchez l'écran… vous voyez les vagues de lumière ? ✨",
    "Et tous ces personnages autour de moi ? Ils sont nés au studio !",
    "Venez, je vous fais visiter mes mondes 👇"
  ];
  let ligne = 0, ecrit = null;
  const dire = (texte) => {
    if (!bulleH) return;
    clearInterval(ecrit);
    bulleH.classList.add("visible");
    let n = 0;
    bulleH.innerHTML = '<span class="curseur-texte"></span>';
    ecrit = setInterval(() => {
      n++;
      bulleH.innerHTML = echap(texte.slice(0, n)) + (n < texte.length ? '<span class="curseur-texte"></span>' : "");
      if (n >= texte.length) clearInterval(ecrit);
    }, calme ? 0 : 28);
  };
  if (hote) {
    let auto = setTimeout(function suite() {
      dire(LIGNES[ligne]); ligne++;
      if (ligne < LIGNES.length) auto = setTimeout(suite, 4200);
    }, 1600);
    hote.addEventListener("click", (e) => {
      clearTimeout(auto);
      hote.classList.remove("salue"); void hote.offsetWidth; hote.classList.add("salue");
      const r = hote.getBoundingClientRect();
      forme(r.left + r.width / 2, r.top + r.height * .3, 30, 1.2); vague(e.clientX, e.clientY, 1.4, "#F5B82E");
      dire(LIGNES[ligne % LIGNES.length]); ligne++;
    });
  }

  // Marie guide, en bas à gauche, une fois l'accueil passé
  const guide = $("#guide-marie"), bulleG = $("#guide-bulle");
  const CONSEILS = {
    studio: "Bienvenue dans mon atelier ! Voici qui nous sommes 😊",
    voyage: "Glissez sur le côté pour changer de monde, et touchez les personnages !",
    heros: "Glissez les cartes… et touchez-en une pour lire son histoire.",
    catalogue: "Choisissez une création : la fiche de contact est à l'intérieur.",
    realisations: "Touchez une vidéo pour la regarder en grand, avec le son 🎬",
    etapes: "Suivez-moi sur le chemin : six étapes et c'est prêt !",
    paiement: "Orange Money ou PayPal : 50 % à la commande, le reste à la livraison.",
    fidelite: "Gardez bien votre numéro client : il vous rapporte des points 🪙",
    faq: "Une question ? Touchez-moi, je vous réponds sur WhatsApp.",
    contact: "Remplissez la fiche, je vous confirme le rendez-vous très vite 💬"
  };
  let sectionGuide = "", tGuide = null;
  const parleGuide = (texte, ms = 3800) => {
    bulleG.textContent = texte; guide.classList.add("parle");
    clearTimeout(tGuide); tGuide = setTimeout(() => guide.classList.remove("parle"), ms);
  };
  if (guide && introEl) {
    new IntersectionObserver(([en]) => guide.classList.toggle("visible", !en.isIntersecting), { threshold: .15 }).observe(introEl);
    const obs = new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting && en.target.id !== sectionGuide && CONSEILS[en.target.id]) { sectionGuide = en.target.id; if (guide.classList.contains("visible")) parleGuide(CONSEILS[sectionGuide]); }
    }), { rootMargin: "-45% 0px -45% 0px" });
    $$("main > section[id]").forEach((sct) => obs.observe(sct));
    guide.addEventListener("click", () => {
      if (guide.classList.contains("parle") && sectionGuide === "faq") { window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent("Bonjour Marie, j'ai une question :")}`, "_blank", "noopener"); return; }
      parleGuide(CONSEILS[sectionGuide] || "Je suis là si vous avez besoin de moi !");
    });
  }

  /* ================= Les personnages qui guettent ================= */
  // 1. derrière chaque offre du catalogue : la tête dépasse du haut de la carte
  const offresParId = Object.fromEntries((C.offres || []).map((o) => [o.id, o]));
  $$("#grille .carte").forEach((carte) => {
    const o = offresParId[carte.dataset.id];
    if (!o || !o.guetteur || !PERSOS[o.guetteur]) return;
    const g = document.createElement("img");
    g.className = "guette-carte"; g.src = `images/perso-${o.guetteur}.webp`; g.alt = ""; g.draggable = false;
    g.style.left = `${55 + Math.random() * 20}%`;
    carte.prepend(g);
    const sortir = () => { carte.classList.add("guette"); clearTimeout(carte._g); carte._g = setTimeout(() => carte.classList.remove("guette"), 2600); };
    carte.addEventListener("pointerenter", sortir);
    new IntersectionObserver(([en]) => { if (en.intersectionRatio > .6) setTimeout(sortir, 300 + Math.random() * 900); }, { threshold: [0, .6] }).observe(carte);
  });

  // 2. sur le côté de l'écran : un personnage passe la tête, regarde, dit un mot, puis se cache
  const cote = document.createElement("div");
  cote.className = "guette-cote"; cote.innerHTML = '<img alt="" draggable="false"><div class="bulle"></div>';
  document.body.appendChild(cote);
  const imgC = $("img", cote), bulleC = $(".bulle", cote);
  const guetteurs = (C.personnages || []).filter((p) => p.balade);
  const pause = (ms) => new Promise((r) => setTimeout(r, ms));
  const zonesTranquilles = () => document.body.classList.contains("sans-promeneur") || document.querySelector("dialog[open]") || document.hidden;
  let cache = null;
  cote.addEventListener("click", () => { const r = cote.getBoundingClientRect(); forme(r.left + r.width / 2, r.top + r.height / 3, 22); cote.classList.remove("visible"); if (cache) cache(); });
  const guetter = async () => {
    if (calme) return;
    await pause(6000);
    let i = Math.floor(Math.random() * guetteurs.length);
    for (;;) {
      while (zonesTranquilles()) await pause(1500);
      const p = guetteurs[i++ % guetteurs.length];
      const gauche = Math.random() < .5;
      imgC.src = `images/perso-${p.image}.webp`;
      await new Promise((r) => (imgC.complete ? r() : (imgC.onload = r)));
      cote.classList.toggle("gauche", gauche); cote.classList.toggle("droite", !gauche);
      cote.style.top = `${28 + Math.random() * 36}%`;
      bulleC.textContent = p.phrase || p.texte;
      cote.classList.add("visible");
      await Promise.race([pause(1100), new Promise((r) => (cache = r))]);
      if (cote.classList.contains("visible")) { cote.classList.add("parle"); await Promise.race([pause(3200), new Promise((r) => (cache = r))]); }
      cote.classList.remove("parle", "visible");
      await pause(9000 + Math.random() * 8000);
    }
  };
  guetter();

  /* ================= Mur des réalisations ================= */
  const mur = $("#mur"), lecteur = $("#lecteur");
  if (mur && C.realisations) {
    mur.innerHTML = C.realisations.map((r, i) => `
      <button class="video-carte" type="button" data-i="${i}" aria-label="Regarder : ${echap(r.titre)}">
        <div class="video-carte__ecran"><img src="${r.poster}" alt="" loading="lazy"><video muted loop playsinline preload="none" data-src="${r.video}"></video></div>
        <span class="video-carte__type">${echap(r.type)}</span><strong>${echap(r.titre)}</strong>
      </button>`).join("");
    // les vidéos jouent en silence quand elles sont bien visibles
    const obsV = new IntersectionObserver((es) => es.forEach((en) => {
      const v = $("video", en.target);
      if (en.intersectionRatio > .6 && !calme) { if (!v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause();
    }), { threshold: [0, .6] });
    $$(".video-carte", mur).forEach((c) => obsV.observe(c));
    // glisser à la souris
    let gm = null;
    mur.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse") gm = { x: e.clientX, s: mur.scrollLeft, bouge: false }; });
    addEventListener("pointermove", (e) => { if (gm) { const dx = e.clientX - gm.x; if (Math.abs(dx) > 5) gm.bouge = true; mur.scrollLeft = gm.s - dx; } });
    addEventListener("pointerup", () => setTimeout(() => (gm = null), 0));
    const vL = $("video", lecteur);
    mur.addEventListener("click", (e) => {
      const c = e.target.closest(".video-carte"); if (!c || (gm && gm.bouge)) return;
      const r = C.realisations[Number(c.dataset.i)];
      vL.src = r.video; vL.poster = r.poster; vL.muted = false;
      $(".lecteur__type", lecteur).textContent = r.type; $(".lecteur__titre", lecteur).textContent = r.titre;
      $(".lecteur__offre", lecteur).href = "#offre-" + r.offre;
      lecteur.showModal(); vL.play().catch(() => {});
    });
    const fermerL = () => { vL.pause(); if (lecteur.open) lecteur.close(); };
    $(".lecteur__fermer", lecteur).addEventListener("click", fermerL);
    lecteur.addEventListener("click", (e) => { if (e.target === lecteur) fermerL(); });
    lecteur.addEventListener("close", () => vL.pause());
    $(".lecteur__offre", lecteur).addEventListener("click", () => { vL.pause(); lecteur.close(); });
  }

  /* ================= Le chemin de Marie (comment ça marche) ================= */
  const chemin = $("#chemin"), cheminPath = $("#chemin-path"), marieChemin = $("#chemin-marie");
  if (chemin && cheminPath) {
    const svg = $(".chemin__trace", chemin), L = cheminPath.getTotalLength();
    const obsS = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) en.target.classList.add("vue"); }), { threshold: .45 });
    $$(".station", chemin).forEach((st) => obsS.observe(st));
    const suivre = () => {
      const r = chemin.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const p = Math.min(1, Math.max(0, (innerHeight * .55 - r.top) / r.height));
        const pt = cheminPath.getPointAtLength(p * L);
        const rs = svg.getBoundingClientRect();
        const x = rs.left - r.left + pt.x / 100 * rs.width, y = pt.y / 600 * rs.height;
        marieChemin.style.left = `${x / Z()}px`; marieChemin.style.top = `${y / Z()}px`;
        const pt2 = cheminPath.getPointAtLength(Math.min(L, p * L + 4));
        marieChemin.style.transform = `scaleX(${pt2.x < pt.x ? -1 : 1}) rotate(${Math.sin(p * 80) * 4}deg)`;
      }
      requestAnimationFrame(suivre);
    };
    suivre();
  }

  /* ================= La tirelire de fidélité ================= */
  const tire = $("#tirelire");
  if (tire) {
    const F = C.fidelite, curseur = $("#sim-montant"), pieces = $("#sim-pieces");
    const fmt = (n) => Math.round(n).toLocaleString("fr-FR").replace(/ /g, " ");
    let dejaPts = 0, debloque = false;
    const maj = () => {
      const m = Number(curseur.value), pts = Math.floor(m / F.fcfaParPoint), reducs = Math.floor(pts / F.palier);
      // économie : 10 % sur une commande moyenne de 25 000 FCFA à chaque palier atteint
      const eco = reducs * 25000 * F.reduction / 100;
      $("#sim-montant-txt").textContent = fmt(m) + " FCFA";
      $("#sim-points").textContent = fmt(pts);
      $("#sim-reducs").textContent = reducs;
      $("#sim-eco").textContent = fmt(eco) + " FCFA";
      $("#sim-jauge").style.width = `${Math.min(100, (pts % F.palier) / F.palier * 100 + (reducs && pts % F.palier === 0 ? 100 : 0))}%`;
      $("#sim-note").textContent = reducs ? `🎉 ${reducs} réduction${reducs > 1 ? "s" : ""} de ${F.reduction} % débloquée${reducs > 1 ? "s" : ""} ! Et avec le parrainage (+${F.parrainage} points par ami), ça va encore plus vite.` : `Encore ${F.palier - pts} points avant votre première réduction de ${F.reduction} %.`;
      // pièces qui tombent dans le bocal (une pièce pour 4 points, 40 au maximum)
      const voulues = Math.min(40, Math.floor(pts / 4));
      while (pieces.children.length < voulues) {
        const n = pieces.children.length, sp = document.createElement("span");
        const col = n % 5, rang = Math.floor(n / 5);
        sp.style.left = `${8 + col * 28 + (rang % 2) * 12}px`; sp.style.bottom = `${4 + rang * 22}px`;
        pieces.appendChild(sp);
      }
      while (pieces.children.length > voulues) pieces.lastChild.remove();
      if (reducs && !debloque) {
        debloque = true; tire.classList.add("debloque");
        const r = tire.getBoundingClientRect(); forme(r.left + r.width * .75, r.top + r.height / 2, 40, 1.4);
        vague(r.left + r.width * .75, r.top + r.height / 2, 1.6, "#F5B82E");
      }
      if (!reducs) { debloque = false; tire.classList.remove("debloque"); }
      dejaPts = pts;
    };
    curseur.addEventListener("input", () => { auto = false; maj(); });
    // démonstration automatique quand la tirelire apparaît : le curseur monte tout seul jusqu'à 60 000 FCFA
    let auto = true, joue = false;
    new IntersectionObserver(([en]) => {
      if (!en.isIntersecting || joue) return;
      joue = true;
      const cible = 60000, t0 = performance.now(), duree = calme ? 0 : 3500;
      const pas = (t) => {
        if (!auto) return;
        const k = duree ? Math.min(1, (t - t0) / duree) : 1;
        curseur.value = Math.round(cible * (1 - Math.pow(1 - k, 3)) / 2500) * 2500; maj();
        if (k < 1) requestAnimationFrame(pas);
      };
      requestAnimationFrame(pas);
    }, { threshold: .5 }).observe(tire);
    maj();
  }

  /* ================= Qui sommes-nous ================= */
  const S = C.studio || {};
  $$("[data-studio]").forEach((el) => { if (S[el.dataset.studio]) el.textContent = el.dataset.studio === "lancement" ? S.lancement.toLowerCase() : S[el.dataset.studio]; });
  const chiffres = $("#studio-chiffres");
  if (chiffres) {
    const donnees = [
      [S.lancement || "", "lancement"],
      [String((C.personnages || []).length), "personnages originaux"],
      [String((C.mondes || []).length), "mondes à explorer"],
      [String((C.offres || []).length), "créations au catalogue"]
    ].filter((d) => d[0]);
    // chaque chiffre reste avec son mot (jamais « 22 » seul en fin de ligne)
    chiffres.innerHTML = [`Depuis ${(S.lancement || "").toLowerCase()}`, `${(C.personnages || []).length} personnages originaux`, `${(C.mondes || []).length} mondes`].map((t) => `<span class="chiffre">${t}</span>`).join('<i aria-hidden="true"> · </i>');
  }
})();

/* ---------- Écriture vivante : la phrase « fait maison » et le titre Maënis Tech ---------- */
(() => {
  const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

  // 1. « Ce site aussi est fait maison… » s'écrit lettre par lettre quand on arrive dessus
  const bloc = document.getElementById("fait-main");
  const texte = bloc && bloc.querySelector("[data-ecrire]");
  if (bloc && texte) {
    const lettres = [];
    const decouper = (noeud) => {
      [...noeud.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          [...n.textContent].forEach((ch) => { const sp = document.createElement("span"); sp.className = "lettre"; sp.textContent = ch; frag.appendChild(sp); lettres.push(sp); });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) decouper(n);
      });
    };
    const etat = bloc.querySelector(".fait-main__etat");
    const finir = () => { lettres.forEach((l) => l.classList.add("vue")); lettres.forEach((l) => l.classList.remove("curseur-ici")); bloc.classList.add("fini"); if (etat) etat.textContent = "✓ fait main"; };
    if (calme) { bloc.classList.add("fini"); if (etat) etat.textContent = "✓ fait main"; }
    else {
      decouper(texte);
      let parti = false;
      new IntersectionObserver(async ([en], obs) => {
        if (!en.isIntersecting || parti) return;
        parti = true; obs.disconnect(); bloc.classList.add("ok");   // le croquis du carnet se dessine pendant que le texte s'écrit
        await attendre(500);
        for (let i = 0; i < lettres.length; i++) {
          if (i) lettres[i - 1].classList.remove("curseur-ici");
          lettres[i].classList.add("vue", "curseur-ici");
          const ch = lettres[i].textContent;
          const enGras = lettres[i].closest(".fait-main__cle");
          await attendre(/[.:,]/.test(ch) ? 180 : ch === " " ? 30 : (enGras ? 38 : 16) + Math.random() * 20);
        }
        await attendre(350);
        finir();
      }, { threshold: .6 }).observe(bloc);
    }
  }

  // 2. Titre Maënis Tech : la fin de la phrase s'écrit, s'efface et se réécrit
  const ecrit = document.querySelector(".tech__ecrit");
  if (ecrit && !calme) {
    const mots = ecrit.querySelector(".tech__mots");
    let phrases; try { phrases = JSON.parse(ecrit.dataset.phrases); } catch (_) { phrases = [mots.textContent]; }
    let visible = false;
    new IntersectionObserver(([en]) => (visible = en.isIntersecting)).observe(ecrit);
    (async () => {
      let i = 0;
      mots.textContent = "";
      while (true) {
        while (!visible) await attendre(300);
        const p = phrases[i % phrases.length];
        for (const ch of p) { mots.textContent += ch; await attendre(ch === " " ? 70 : 55 + Math.random() * 60); }
        await attendre(2300);
        while (mots.textContent.length) { mots.textContent = mots.textContent.slice(0, -1); await attendre(28); }
        await attendre(350);
        i++;
      }
    })();
  }
})();
