/* ===================== Maënis Studio : interactions ===================== */
(() => {
  "use strict";
  const C = window.MAENIS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const calme = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const echap = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fr = (n) => n.toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g, " ");
  // Prix en euros : conversion FCFA → euro (taux fixe) + frais, arrondi à l'euro supérieur (réglages dans config.js : euro)
  const euros = (n) => (n && C.euro ? Math.ceil((n / C.euro.taux) * (1 + C.euro.frais / 100)) : 0);
  const prix = (n) => (n ? fr(n) + " FCFA" + (C.euro ? ` <em class="euro">≈ ${fr(euros(n))} €</em>` : "") : "Sur devis");
  const prixTexte = (n) => (n ? fr(n) + " FCFA" + (C.euro ? ` (≈ ${fr(euros(n))} €)` : "") : "Sur devis");
  const prixF = (f) => (f.apartir && f.prix ? `<small class="apartir">à partir de</small> ` : "") + prix(f.prix);
  const lienWA = (texte) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(texte)}`;
  const NOMS_CAT = { enfants: "Pour les enfants", "pop-art": "Pop art", pro: "Pour les pros" };

  /* ---------- Chargement ---------- */
  const pret = () => document.body.classList.add("pret");
  addEventListener("load", pret);
  setTimeout(pret, 1800);

  /* ---------- Textes et liens issus des réglages ---------- */
  $$("[data-texte]").forEach((el) => (el.textContent = C[el.dataset.texte] || ""));
  $$('[data-lien="whatsapp"]').forEach((a) => (a.href = lienWA("Bonjour Marie, je viens du site Maënis Studio.")));
  $$('[data-lien="email"]').forEach((a) => (a.href = "mailto:" + C.email));
  $$("[data-annee]").forEach((el) => (el.textContent = new Date().getFullYear()));
  const reseaux = [["instagram", "Instagram"], ["tiktok", "TikTok"], ["facebook", "Facebook"], ["youtube", "YouTube"]]
    .filter(([k]) => C.reseaux[k])
    .map(([k, n]) => `<a href="${echap(C.reseaux[k])}" target="_blank" rel="noopener">${n}</a>`).join("")
    + `<a href="${lienWA("Bonjour Marie !")}" target="_blank" rel="noopener">WhatsApp</a>`;
  $$(".reseaux").forEach((el) => (el.innerHTML = reseaux));
  $$(".acompte-texte").forEach((el) => (el.textContent = `${C.paiement.acompte} % à la commande`));
  const om = $('[data-paiement="orangeMoney"]');
  if (C.paiement.orangeMoney) om.innerHTML = `Numéro : <strong>${echap(C.paiement.orangeMoney)}</strong><br>Après la confirmation du rendez-vous.`;
  const pp = $('[data-paiement="paypal"]');
  if (C.paiement.paypal) pp.innerHTML = `<a href="${echap(C.paiement.paypal)}" target="_blank" rel="noopener">Payer avec PayPal</a><br>Après la confirmation du rendez-vous.`;

  /* ---------- Fidélité ---------- */
  const F = C.fidelite;
  const valeursFid = { fcfaParPoint: fr(F.fcfaParPoint), palier: F.palier, reduction: F.reduction, reduction2: F.reduction, seuil: fr(F.palier * F.fcfaParPoint), parrainage: F.parrainage, anniversaire: F.anniversaire };
  $$("[data-fid]").forEach((el) => (el.textContent = valeursFid[el.dataset.fid]));
  const memoire = { lire: (k) => { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }, ecrire: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
  $("#mes-points").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target, res = $(".mes-points__resultat", f);
    if (!C.backendUrl) { res.innerHTML = `L'espace « Mes points » arrive bientôt. En attendant, demandez votre solde <a href="${lienWA("Bonjour Marie, combien de points de fidélité ai-je ? Mon numéro client : " + f.client.value)}" target="_blank" rel="noopener">sur WhatsApp</a>.`; return; }
    res.textContent = "Recherche…";
    try {
      const u = `${C.backendUrl}?action=points&client=${encodeURIComponent(f.client.value.trim())}&code=${encodeURIComponent(f.code.value.trim())}`;
      const j = await (await fetch(u)).json();
      res.innerHTML = j.ok
        ? `Bonjour ${echap(j.prenom)}, vous avez <strong>${j.points} points</strong>. ${j.reductions > 0 ? `🎉 Vous avez droit à <strong>${F.reduction} % de réduction</strong> sur votre prochaine commande&nbsp;!` : `Encore ${j.reste} points avant vos ${F.reduction} % de réduction.`}`
        : j.erreur === "bloque"
          ? `Trop d'essais : réessayez dans ${j.minutes} minutes, ou demandez votre code sur WhatsApp.`
          : `Numéro client ou code secret incorrect.${j.restants >= 0 ? ` Encore ${j.restants} essai${j.restants > 1 ? "s" : ""}.` : ""}`;
      f.code.value = "";
    } catch (_) { res.textContent = "Impossible de vérifier pour l'instant. Réessayez plus tard."; }
  });
  const parrainLien = (new URLSearchParams(location.search).get("parrain") || "").trim().toUpperCase();
  if (/^MS-[0-9-]+$/.test(parrainLien)) memoire.ecrire("maenis-parrain", parrainLien);
  const numClientMemo = memoire.lire("maenis-numero-client");
  if (numClientMemo) $("#mes-points").client.value = numClientMemo;

  /* ---------- Galerie des personnages ---------- */
  const grillePersos = $("#persos-grille");
  if (grillePersos) {
    grillePersos.innerHTML = (C.personnages || []).map((p, i) => `
      <figure class="perso-carte reveal" style="--i:${i}">
        <div class="perso-carte__img"><img src="images/galerie-${p.image}.webp" alt="${echap(p.nom)}" loading="lazy"></div>
        <figcaption><strong>${echap(p.nom)}</strong><span>${echap(p.texte)}</span></figcaption>
      </figure>`).join("");
  }

  /* ---------- Avis des clients ---------- */
  if (C.avis && C.avis.length) {
    const sec = $("#avis");
    $(".avis__grille", sec).innerHTML = C.avis.map((a) => `
      <figure class="avis-carte reveal">
        <div class="avis-carte__note" aria-label="${a.note || 5} sur 5">${"★".repeat(a.note || 5)}</div>
        <blockquote>« ${echap(a.texte)} »</blockquote>
        <figcaption><strong>${echap(a.nom)}</strong>${a.offre ? `<span>${echap(a.offre)}</span>` : ""}</figcaption>
      </figure>`).join("");
    sec.hidden = false;
  }

  /* ---------- En-tête ---------- */
  const top = $(".top");
  const surDefile = () => top.classList.toggle("colle", scrollY > 40);
  addEventListener("scroll", surDefile, { passive: true });
  surDefile();
  $(".top__burger").addEventListener("click", () => {
    const o = top.classList.toggle("ouvert");
    $(".top__burger").setAttribute("aria-expanded", o);
  });
  $$(".top__nav a").forEach((a) => a.addEventListener("click", () => top.classList.remove("ouvert")));
  const liensNav = $$(".top__nav a");
  const obsNav = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) liensNav.forEach((a) => a.classList.toggle("actif", a.hash === "#" + e.target.id));
  }), { rootMargin: "-45% 0px -50% 0px" });
  $$("main > section[id]").forEach((s) => obsNav.observe(s));

  /* ---------- Apparitions au défilement ---------- */
  const obsVu = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("vu"); obsVu.unobserve(e.target); }
  }), { threshold: 0.12 });
  const observer = (root = document) => $$(".reveal:not(.vu)", root).forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 70}ms`;
    obsVu.observe(el);
  });

  /* ---------- Étincelles de l'accueil ---------- */
  const cv = $(".etincelles");
  if (cv && !calme) {
    const ctx = cv.getContext("2d");
    let W, H, pts;
    const taille = () => {
      W = cv.width = cv.offsetWidth * devicePixelRatio;
      H = cv.height = cv.offsetHeight * devicePixelRatio;
      pts = Array.from({ length: Math.round(W * H / 26000 / devicePixelRatio) }, () => ({
        x: Math.random() * W, y: Math.random() * H, r: (Math.random() * 1.6 + .4) * devicePixelRatio,
        v: Math.random() * .25 + .05, p: Math.random() * 6.28
      }));
    };
    taille(); addEventListener("resize", taille);
    let visible = true;
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(cv);
    const anime = (t) => {
      if (visible) {
        ctx.clearRect(0, 0, W, H);
        for (const p of pts) {
          p.y -= p.v * devicePixelRatio; if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
          const a = .35 + .35 * Math.sin(t / 700 + p.p);
          ctx.fillStyle = `rgba(245,197,66,${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28); ctx.fill();
        }
      }
      requestAnimationFrame(anime);
    };
    requestAnimationFrame(anime);
  }

  /* ---------- Effet 3D au survol ---------- */
  const incliner = (el, force = 10) => {
    if (calme || matchMedia("(hover: none)").matches) return;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `${el.dataset.base || ""} perspective(900px) rotateY(${x * force}deg) rotateX(${-y * force}deg)`;
    });
    el.addEventListener("pointerleave", () => (el.style.transform = el.dataset.base || ""));
  };
  const tel = $(".tel");
  if (tel) { tel.dataset.base = "translate(-50%, -50%)"; incliner(tel, 14); }
  // parallaxe légère des images flottantes
  if (!calme && $(".hero")) {
    const scene = $(".hero__scene");
    $(".hero").addEventListener("pointermove", (e) => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      $$(".flottant", scene).forEach((f, i) => (f.style.translate = `${x * (20 + i * 14)}px ${y * (20 + i * 14)}px`));
    });
  }

  /* ---------- Catalogue ---------- */
  const grille = $("#grille");
  grille.innerHTML = C.offres.map((o) => `
    <button class="carte reveal" data-id="${o.id}" data-cat="${o.categorie}" style="--c:${o.couleur}" aria-label="Découvrir : ${echap(o.titre)}">
      <div class="carte__media">
        <div class="carte__flou" style="background-image:url('${o.image}')" aria-hidden="true"></div>
        ${o.mosaique ? `<div class="carte__mosaique">${o.mosaique.map((m, i) => `<img src="${m}" alt="" loading="lazy" style="--d:${i * .45}s">`).join("")}</div>` : `<img class="carte__img" src="${o.image}" alt="" loading="lazy">`}
        ${o.video ? `<video data-src="${o.video}" muted loop playsinline preload="none"></video><span class="carte__lecture" aria-hidden="true">▶</span>` : ""}
        <span class="carte__tag">${NOMS_CAT[o.categorie] || ""}</span>
      </div>
      <div class="carte__apercus" aria-hidden="true">${o.galerie.filter((g) => g !== o.image).slice(0, 4).map((g) => `<img src="${g}" alt="" loading="lazy">`).join("")}${o.galerie.length > 5 ? `<span>+${o.galerie.length - 5}</span>` : ""}</div>
      <div class="carte__corps">
        <h3>${echap(o.titre)}</h3>
        <p>${echap(o.accroche)}</p>
        <div class="carte__bas">
          <span class="prix"><small>${o.des ? "À partir de" : "Tarif"}</small>${prix(o.des)}</span>
          <span class="carte__voir">Voir l'offre <span class="carte__fleche" aria-hidden="true">→</span></span>
        </div>
      </div>
    </button>`).join("");
  $$(".carte", grille).forEach((c) => {
    incliner(c, 6);
    const v = $("video", c);
    if (v) {
      const jouer = () => { if (!v.src) v.src = v.dataset.src; v.play().then(() => c.classList.add("joue")).catch(() => {}); };
      const stop = () => { v.pause(); c.classList.remove("joue"); };
      c.addEventListener("pointerenter", jouer);
      c.addEventListener("pointerleave", stop);
      // sur téléphone : la vidéo se lance quand la carte est bien visible
      if (matchMedia("(hover: none)").matches && !calme) {
        new IntersectionObserver(([e]) => (e.intersectionRatio > .7 ? jouer() : stop()), { threshold: [0, .7] }).observe(c);
      }
    }
    c.addEventListener("click", () => { location.hash = "offre-" + c.dataset.id; });
  });
  $$(".filtre").forEach((f) => f.addEventListener("click", () => {
    $$(".filtre").forEach((x) => { x.classList.toggle("actif", x === f); x.setAttribute("aria-selected", x === f); });
    $$(".carte", grille).forEach((c) => {
      const ok = f.dataset.filtre === "tout" || c.dataset.cat === f.dataset.filtre;
      c.classList.toggle("cache", !ok);
      if (ok) { c.classList.remove("vu"); requestAnimationFrame(() => c.classList.add("vu")); }
    });
  }));

  /* ---------- Fiche de contact ---------- */
  const aujourdhui = new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
  let compteurFiche = 0;
  const champHTML = (ch, uid) => {
    const id = `${uid}-${ch.nom}`;
    const req = ch.requis ? " required" : "";
    const lab = `<label for="${id}">${echap(ch.label)}${ch.requis ? ' <span class="req">*</span>' : ""}</label>`;
    if (ch.type === "select") return `<div class="champ">${lab}<select id="${id}" name="d_${ch.nom}"${req}><option value="">Choisir…</option>${ch.options.map((o) => `<option>${echap(o)}</option>`).join("")}</select></div>`;
    if (ch.type === "textarea") return `<div class="champ champ--plein">${lab}<textarea id="${id}" name="d_${ch.nom}"${req}></textarea></div>`;
    if (ch.type === "chips") return `<div class="champ champ--plein"><span class="label">${echap(ch.label)}</span><div class="puces">${ch.options.map((o) => `<label class="puce"><input type="checkbox" name="d_${ch.nom}" value="${echap(o)}"><span>${echap(o)}</span></label>`).join("")}</div></div>`;
    return `<div class="champ">${lab}<input id="${id}" name="d_${ch.nom}" type="text"${req}></div>`;
  };

  const construireFiche = (offre) => {
    const uid = "f" + ++compteurFiche;
    let etape = 0;
    const n = () => ++etape;
    const choixOffre = offre ? `<input type="hidden" name="offre" value="${echap(offre.titre)}">` : `
      <div class="champ champ--plein"><label for="${uid}-offre">Ce qui vous intéresse <span class="req">*</span></label>
        <select id="${uid}-offre" name="offre" required><option value="">Choisir…</option>${C.offres.map((o) => `<option>${echap(o.titre)}</option>`).join("")}${C.tech ? `<optgroup label="Maënis Tech">${C.tech.offres.map((o) => `<option>Maënis Tech : ${echap(o.titre)}</option>`).join("")}<option>Maënis Tech : ${echap(C.tech.pack.titre)}</option></optgroup>` : ""}<option>Autre chose</option></select></div>`;
    const formules = offre ? `
      <fieldset><legend><span class="num">${n()}</span>Choisissez la formule</legend><div class="formules-choix">
        ${offre.formules.map((f, i) => `<div class="formule-choix"><input type="radio" id="${uid}-fo${i}" name="formule" value="${echap(f.nom)} (${f.apartir && f.prix ? "à partir de " : ""}${prixTexte(f.prix)})" ${f.populaire ? "checked" : ""} required><label for="${uid}-fo${i}"><span>${echap(f.nom)}<small>${echap(f.detail)}</small></span><b>${prixF(f)}</b></label></div>`).join("")}
        <div class="formule-choix"><input type="radio" id="${uid}-fox" name="formule" value="Je veux en parler en rendez-vous"><label for="${uid}-fox"><span>Je ne sais pas encore<small>On en parle pendant le rendez-vous</small></span><b>…</b></label></div>
      </div></fieldset>` : "";
    const niveau = champHTML({ nom: "niveau", label: "Niveau de création", type: "select", options: ["1. Catalogue : un modèle du catalogue à mon nom", "2. Personnalisé : on adapte un élément du catalogue", "3. Création unique : mon univers de A à Z", "Je ne sais pas, conseillez-moi"] }, uid);
    const specifiques = offre ? `<fieldset><legend><span class="num">${n()}</span>Parlez-moi de votre projet</legend><div class="champs">${niveau}${(offre.champs || []).map((c) => champHTML(c, uid)).join("")}</div></fieldset>` : "";
    return `
    <form class="fiche" novalidate>
      <h3>Fiche de prise de contact</h3>
      <p class="fiche__sous">${offre ? echap(offre.titre) + " · " : ""}Réponse et confirmation du rendez-vous sur WhatsApp.</p>
      ${formules}
      ${specifiques}
      <fieldset><legend><span class="num">${n()}</span>Vos coordonnées</legend><div class="champs">
        ${choixOffre}
        <div class="champ"><label for="${uid}-nom">Nom et prénom <span class="req">*</span></label><input id="${uid}-nom" name="nom" autocomplete="name" required></div>
        <div class="champ"><label for="${uid}-wa">Numéro WhatsApp <span class="req">*</span></label><input id="${uid}-wa" name="whatsapp" type="tel" autocomplete="tel" placeholder="+237 6…" required pattern="[+0-9 ().-]{8,}"></div>
        <div class="champ"><label for="${uid}-mail">Adresse mail</label><input id="${uid}-mail" name="email" type="email" autocomplete="email"></div>
        <div class="champ"><label for="${uid}-ville">Ville et pays <span class="req">*</span></label><input id="${uid}-ville" name="ville" autocomplete="address-level2" required></div>
        <div class="champ"><label for="${uid}-num">Votre numéro client <small>(si vous en avez déjà un)</small></label><input id="${uid}-num" name="numero_client" placeholder="MS-0001" autocomplete="off" value="${echap(memoire.lire("maenis-numero-client"))}"></div>
        <div class="champ"><label for="${uid}-anniv">Date d'anniversaire <small>(+${F.anniversaire} points cadeaux)</small></label><input id="${uid}-anniv" name="anniversaire" type="date" max="${aujourdhui}"></div>
        <div class="champ champ--plein"><label for="${uid}-parrain">Code parrainage <small>(le numéro client de l'ami qui vous envoie, ex. MS-0001)</small></label><input id="${uid}-parrain" name="parrain" autocomplete="off" value="${echap(memoire.lire("maenis-parrain"))}"></div>
      </div></fieldset>
      <fieldset><legend><span class="num">${n()}</span>Proposez un rendez-vous</legend><div class="champs">
        <div class="champ"><label for="${uid}-date">Jour <span class="req">*</span></label><input id="${uid}-date" name="rdv_date" type="date" min="${aujourdhui}" required></div>
        <div class="champ"><label for="${uid}-cr">Moment <span class="req">*</span></label><select id="${uid}-cr" name="rdv_creneau" required><option value="">Choisir…</option><option>Matin (9 h - 12 h)</option><option>Après-midi (12 h - 17 h)</option><option>Soir (17 h - 20 h)</option></select></div>
        <div class="champ"><label for="${uid}-moy">Comment&nbsp;?</label><select id="${uid}-moy" name="rdv_moyen"><option>Appel WhatsApp</option><option>Visio</option><option>Messages WhatsApp</option></select></div>
        <div class="champ"><label for="${uid}-pay">Paiement prévu</label><select id="${uid}-pay" name="paiement"><option>Orange Money</option><option>PayPal</option><option>Je ne sais pas encore</option></select></div>
        <div class="champ champ--plein"><label for="${uid}-msg">Autre chose à me dire</label><textarea id="${uid}-msg" name="message" placeholder="Occasion, date souhaitée pour la livraison, idées…">${echap(window.universChoisi ? "Univers souhaité : " + window.universChoisi : "")}</textarea></div>
      </div></fieldset>
      <input class="piege" name="site_web" tabindex="-1" autocomplete="off" aria-hidden="true">
      <p class="fiche__derniere"><span class="num">${n()}</span>Cochez la case, puis appuyez sur le bouton <span class="fleche-bas" aria-hidden="true">↓</span></p>
      <label class="consent"><input type="checkbox" name="accord" required> <span>J'ai compris que le rendez-vous sera confirmé par Marie, et qu'un acompte de ${C.paiement.acompte} % est demandé avant le début de la création. Mes informations servent uniquement à traiter ma demande.</span></label>
      <button class="btn btn--bordeaux fiche__envoi" type="submit">Envoyer ma fiche et recevoir mon numéro <span aria-hidden="true">→</span></button>
      <p class="fiche__erreur" role="alert"></p>
      <p class="fiche__bas">Les photos s'envoient ensuite sur WhatsApp ou par mail.</p>
    </form>`;
  };

  const LABELS = {};
  C.offres.forEach((o) => (o.champs || []).forEach((c) => (LABELS[c.nom] = c.label)));
  const lireFiche = (form) => {
    const fd = new FormData(form);
    const d = { details: {} };
    for (const [k, v] of fd.entries()) {
      if (k.startsWith("d_")) {
        if (!v) continue;
        const champ = form.querySelector(`[name="${k}"]`)?.closest(".champ");
        const n = (champ && $("label, .label", champ)?.textContent.replace("*", "").trim()) || LABELS[k.slice(2)] || k.slice(2);
        d.details[n] = d.details[n] ? d.details[n] + ", " + v : v;
      } else d[k] = v;
    }
    d.fuseau = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    return d;
  };

  const resume = (d, id) => {
    const l = [`Bonjour Marie ! Voici ma fiche de contact${id ? " (client " + id.client + ", commande " + id.commande + ")" : ""} :`, "",
      `• Création : ${d.offre}`];
    if (d.formule) l.push(`• Formule : ${d.formule}`);
    for (const [k, v] of Object.entries(d.details)) l.push(`• ${k} : ${v}`);
    l.push(`• Nom : ${d.nom}`, `• WhatsApp : ${d.whatsapp}`);
    if (d.email) l.push(`• Mail : ${d.email}`);
    l.push(`• Ville : ${d.ville}`, `• Rendez-vous souhaité : ${new Date(d.rdv_date + "T12:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}, ${d.rdv_creneau}, ${d.rdv_moyen}`,
      `• Paiement prévu : ${d.paiement}`);
    if (d.anniversaire) l.push(`• Anniversaire : ${new Date(d.anniversaire + "T12:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`);
    if (d.parrain) l.push(`• Parrainé par : ${d.parrain}`);
    if (d.message) l.push(`• Message : ${d.message}`);
    return l.join("\n");
  };

  // Sans le programme Google : numéro client gardé dans le navigateur, sinon créé à partir de la date.
  const idLocal = (d) => {
    const t = new Date();
    let client = (d.numero_client || "").trim().toUpperCase() || memoire.lire("maenis-numero-client");
    if (!client) client = `MS-${String(t.getFullYear()).slice(2)}${String(t.getMonth() + 1).padStart(2, "0")}${String(t.getDate()).padStart(2, "0")}${Math.floor(10 + Math.random() * 90)}`;
    const rang = Number(memoire.lire("maenis-nb-commandes-" + client) || 0) + 1;
    memoire.ecrire("maenis-nb-commandes-" + client, rang);
    return { client, commande: `${client}-${String(rang).padStart(2, "0")}`, nouveau: !d.numero_client && !memoire.lire("maenis-numero-client"), points: null };
  };

  const envoyer = async (form) => {
    const err = $(".fiche__erreur", form);
    err.textContent = "";
    if (!form.checkValidity()) {
      form.reportValidity();
      const premier = $(":invalid", form);
      err.textContent = "Il manque une information (en rouge).";
      premier?.focus();
      return;
    }
    const d = lireFiche(form);
    if (d.site_web) return; // robot
    delete d.site_web;
    const bouton = $(".fiche__envoi", form);
    bouton.disabled = true;
    bouton.textContent = "Envoi en cours…";
    let id = null, enregistre = false;
    if (C.backendUrl) {
      try {
        const r = await fetch(C.backendUrl, { method: "POST", body: JSON.stringify(d) });
        const j = await r.json();
        if (j.ok && j.idClient) { id = { client: j.idClient, commande: j.idCommande, nouveau: j.nouveau, points: j.points, code: j.code }; enregistre = true; }
      } catch (e) { /* on passe par WhatsApp */ }
    }
    if (!id) id = idLocal(d);
    memoire.ecrire("maenis-numero-client", id.client);
    bouton.disabled = false;
    bouton.innerHTML = 'Envoyer ma fiche et recevoir mon numéro <span aria-hidden="true">→</span>';
    afficherMerci(id, d, enregistre);
    form.reset();
  };

  const afficherMerci = (id, d, enregistre) => {
    const dlg = $("#merci");
    $("#merci-id").textContent = id.client;
    $("#merci-commande").textContent = id.commande;
    $("#merci-bulle").textContent = `Merci pour votre rendez-vous, ${d.nom} ! 🎉`;
    $("#merci-garder").innerHTML = id.nouveau === false && id.points != null
      ? `Ravie de vous revoir&nbsp;! Vous avez déjà <strong>${id.points} points</strong> de fidélité.`
      : `<strong>Gardez bien votre numéro client</strong> (faites une capture d'écran)&nbsp;: il est à vous pour toujours et cumule vos points de fidélité.`;
    $("#merci-info").innerHTML = enregistre
      ? "Votre demande est bien enregistrée. Je vous confirme le rendez-vous sur WhatsApp. Indiquez votre numéro de commande dans le message du paiement."
      : "Pour que je reçoive votre fiche, envoyez-la-moi sur WhatsApp. Je vous confirme ensuite le rendez-vous.";
    $("#merci-guide").hidden = enregistre;
    $("#merci-code").hidden = !id.code;
    if (id.code) $("#merci-code-val").textContent = id.code;
    $("#merci-parrain-code").textContent = id.client;
    $("#merci-parrain").hidden = !enregistre; // un numéro provisoire ne peut pas servir de code parrainage
    const lienSite = location.origin + location.pathname + "?parrain=" + encodeURIComponent(id.client);
    $("#merci-parrain").href = "https://wa.me/?text=" + encodeURIComponent(`Je viens de réserver ma création chez Maënis Studio 🎨 Dessins animés, pop art, coloriages… Mon code parrainage : ${id.client}. Il est déjà rempli avec ce lien : ${lienSite}`);
    const wa = $("#merci-whatsapp");
    wa.href = lienWA(resume(d, id));
    wa.textContent = enregistre ? "M'écrire sur WhatsApp" : "Envoyer sur WhatsApp";
    if ($("#feuille").open) $("#feuille").close();
    dlg.showModal();
    if (!calme) feuArtifice($(".feu", dlg), () => dlg.open);
  };

  /* Feu d'artifice : fusées qui montent puis éclatent en étincelles dorées et colorées */
  const feuArtifice = (cv, actif) => {
    const ctx = cv.getContext("2d"), r = devicePixelRatio || 1;
    const W = (cv.width = innerWidth * r), H = (cv.height = innerHeight * r);
    const couleurs = ["#F5C542", "#FFE08A", "#E8457A", "#52B8E8", "#7FD17A", "#FFFFFF", "#B48CF0"];
    const fusees = [], eclats = [];
    let t0 = performance.now(), dernier = 0;
    const lancer = () => fusees.push({ x: W * (.15 + Math.random() * .7), y: H, vy: -(H / 75) * (0.9 + Math.random() * .35), cible: H * (.12 + Math.random() * .3), c: couleurs[Math.floor(Math.random() * couleurs.length)] });
    const eclater = (f) => {
      const n = 70 + Math.floor(Math.random() * 40);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2, v = (Math.random() * .6 + .7) * 5.5 * r;
        eclats.push({ x: f.x, y: f.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vie: 1, c: Math.random() < .3 ? "#F5C542" : f.c });
      }
    };
    const pas = (t) => {
      if (!actif()) { ctx.clearRect(0, 0, W, H); return; }
      const ecoule = t - t0;
      if (ecoule < 6000 && t - dernier > 420) { lancer(); if (Math.random() < .5) lancer(); dernier = t; }
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      for (let i = fusees.length - 1; i >= 0; i--) {
        const f = fusees[i]; f.y += f.vy; f.vy *= .985;
        ctx.fillStyle = f.c; ctx.beginPath(); ctx.arc(f.x, f.y, 2.6 * r, 0, 6.28); ctx.fill();
        if (f.y <= f.cible || f.vy > -1) { eclater(f); fusees.splice(i, 1); }
      }
      for (let i = eclats.length - 1; i >= 0; i--) {
        const e = eclats[i]; e.x += e.vx; e.y += e.vy; e.vx *= .965; e.vy = e.vy * .965 + .09 * r; e.vie -= .013;
        if (e.vie <= 0) { eclats.splice(i, 1); continue; }
        ctx.globalAlpha = e.vie; ctx.fillStyle = e.c; ctx.beginPath(); ctx.arc(e.x, e.y, 2 * r, 0, 6.28); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (ecoule < 9000 || eclats.length) requestAnimationFrame(pas); else ctx.clearRect(0, 0, W, H);
    };
    requestAnimationFrame(pas);
  };
  $("#merci-copier").addEventListener("click", async (e) => {
    const b = e.currentTarget;
    try { await navigator.clipboard.writeText($("#merci-id").textContent); b.textContent = "Numéro copié ✓"; }
    catch (_) { b.textContent = $("#merci-id").textContent; }
    setTimeout(() => (b.textContent = "Copier mon numéro client"), 2500);
  });
  $(".merci__fermer").addEventListener("click", () => $("#merci").close());

  const brancherFiche = (racine) => $$("form.fiche", racine).forEach((f) => f.addEventListener("submit", (e) => { e.preventDefault(); envoyer(f); }));
  $("#fiche-generale").innerHTML = construireFiche(null);
  brancherFiche($("#fiche-generale"));

  /* ---------- Maënis Tech ---------- */
  if (C.tech && $("#tech-offres")) {
    const T = C.tech;
    const vers = (titre) => `<a class="bouton bouton--plein tech__btn" href="#contact" data-tech="Maënis Tech : ${echap(titre)}">Demander un rendez-vous <span aria-hidden="true">→</span></a>`;
    $("#tech-offres").innerHTML = T.offres.map((o) => `
      <article class="tech-carte reveal" id="tech-${o.id}">
        <span class="tech-carte__ico" aria-hidden="true">${o.ico}</span>
        <h3>${echap(o.titre)}</h3>
        <p class="tech-carte__change">${echap(o.change)}</p>
        <ul data-plus="Détails">${o.points.map((x) => `<li>${echap(x)}</li>`).join("")}</ul>
        <p class="tech-carte__prix"><small>à partir de</small><b>${prix(o.prix)}</b><span>suivi à partir de ${prix(o.suivi)} / mois</span></p>
        ${vers(o.titre)}
      </article>`).join("");
    const P = T.pack;
    $("#tech-pack").innerHTML = `
      <div><p class="tech__pack-tag">✦ ${echap(P.titre)}</p><h3>${echap(P.detail)}</h3>
      <p>Tout pour lancer votre activité en ligne : le site, les commandes rangées automatiquement et une pub vidéo pour vous faire connaître.</p></div>
      <div class="tech__pack-prix"><small>à partir de</small><b>${prix(P.prix)}</b><s>${prix(P.sansPack)} séparément</s><span>suivi à partir de ${prix(P.suivi)} / mois</span>${vers(P.titre)}</div>`;
    const S = T.suivi;
    $("#tech-suivi").innerHTML = `
      <h3>Le suivi mensuel</h3>
      <div class="tech__formules">
        <p><strong>Suivi Essentiel</strong>${echap(S.essentiel)}.</p>
        <p><strong>Suivi Prioritaire</strong>${echap(S.prioritaire)}.</p>
      </div>
      <p class="tech__regles">${echap(S.regles)}</p>`;
    $$("[data-tech]").forEach((b) => b.addEventListener("click", () => {
      const sel = $("#fiche-generale select[name=offre]");
      if (sel) { sel.value = b.dataset.tech; sel.dispatchEvent(new Event("change", { bubbles: true })); }
    }));
  }

  /* ---------- Feuille d'une offre ---------- */
  const feuille = $("#feuille");
  let minuteur = null;
  const ouvrirOffre = (o) => {
    const medias = [...(o.video ? [{ v: o.video, p: o.poster }] : []), ...o.galerie.map((i) => ({ i }))];
    $(".feuille__media", feuille).innerHTML = `
      <div class="galerie">${medias.map((m, k) => m.v
        ? `<video src="${m.v}" poster="${m.p}" playsinline controls muted loop class="${k ? "" : "actif"}"></video>`
        : `<img src="${m.i}" alt="Exemple : ${echap(o.titre)}" class="${k ? "" : "actif"}">`).join("")}</div>
      ${medias.length > 1 ? `<div class="vignettes">${medias.map((m, k) => `<button type="button" class="${k ? "" : "actif"}" aria-label="Exemple ${k + 1}">${m.v ? `<img src="${m.p}" alt="">` : `<img src="${m.i}" alt="">`}</button>`).join("")}</div>` : ""}`;
    $(".feuille__texte", feuille).innerHTML = `
      <p class="sur-titre">${NOMS_CAT[o.categorie] || ""}</p>
      <h2 id="feuille-titre">${echap(o.titre)}</h2>
      <p class="feuille__accroche">${echap(o.accroche)}</p>
      <div class="tarifs">${o.formules.map((f) => `<div class="tarif ${f.populaire && o.formules.length > 1 ? "pop" : ""}"><span><strong>${echap(f.nom)}</strong><small>${echap(f.detail)}</small></span><b>${prixF(f)}</b></div>`).join("")}</div>${C.euro && C.euro.note ? `<p class="note-euro">${echap(C.euro.note)}</p>` : ""}
      <ul class="inclus"><li><strong>Rendez-vous conseil inclus</strong> : on choisit ensemble ce qui vous ressemble</li>${o.inclus.map((i) => `<li>${echap(i)}</li>`).join("")}</ul>
      <span class="delai">⏱ ${echap(o.delai)}</span>
      <a class="guide" href="#" data-vers-fiche><span class="guide__texte">Ça vous plaît&nbsp;? Remplissez la fiche juste en dessous</span><span class="guide__fleche" aria-hidden="true">↓</span></a>
      ${construireFiche(o)}
      <button class="btn btn--or flottant-fiche" type="button" data-vers-fiche>Remplir la fiche <span aria-hidden="true">↓</span></button>`;
    brancherFiche(feuille);
    const texte = $(".feuille__texte", feuille), ficheO = $("form.fiche", texte), bouton = $(".flottant-fiche", feuille);
    $$("[data-vers-fiche]", feuille).forEach((b) => b.addEventListener("click", (e) => {
      e.preventDefault();
      const cible = matchMedia("(max-width: 980px)").matches ? $(".feuille__contenu", feuille) : texte;
      cible.scrollTo({ top: ficheO.offsetTop - 20 + (cible === texte ? 0 : texte.offsetTop), behavior: "smooth" });
      setTimeout(() => $("input:not([type=hidden]), select", ficheO)?.focus({ preventScroll: true }), 600);
    }));
    new IntersectionObserver(([e]) => bouton.classList.toggle("cache", e.isIntersecting), { root: null, threshold: 0.05 }).observe(ficheO);
    const items = $$(".galerie > *", feuille), vigs = $$(".vignettes button", feuille);
    let cur = 0;
    const montrer = (k) => {
      items[cur].classList.remove("actif"); vigs[cur]?.classList.remove("actif");
      if (items[cur].tagName === "VIDEO") items[cur].pause();
      cur = k;
      items[cur].classList.add("actif"); vigs[cur]?.classList.add("actif");
      if (items[cur].tagName === "VIDEO") items[cur].play().catch(() => {});
    };
    vigs.forEach((b, k) => b.addEventListener("click", () => { clearInterval(minuteur); montrer(k); }));
    if (items[0]?.tagName === "VIDEO") items[0].play().catch(() => {});
    clearInterval(minuteur);
    if (items.length > 1 && items[0].tagName !== "VIDEO") minuteur = setInterval(() => montrer((cur + 1) % items.length), 3800);
    feuille.showModal();
    $(".feuille__texte", feuille).scrollTop = 0;
    $(".feuille__fermer", feuille).focus();
  };
  const fermerOffre = () => {
    clearInterval(minuteur);
    $$("video", feuille).forEach((v) => v.pause());
    if (location.hash.startsWith("#offre-")) history.replaceState(null, "", "#catalogue");
  };
  feuille.addEventListener("close", fermerOffre);
  $(".feuille__fermer").addEventListener("click", () => feuille.close());
  feuille.addEventListener("click", (e) => { if (e.target === feuille) feuille.close(); });
  $("#merci").addEventListener("click", (e) => { if (e.target.id === "merci") e.target.close(); });
  const routeur = () => {
    const m = location.hash.match(/^#offre-(.+)$/);
    if (!m) return;
    const o = C.offres.find((x) => x.id === m[1]);
    if (o) { if (feuille.open) feuille.close(); ouvrirOffre(o); history.replaceState(null, "", "#offre-" + o.id); }
  };
  addEventListener("hashchange", routeur);
  routeur();

  /* ---------- Défilement des univers ---------- */
  const defile = $("[data-defile]");
  if (defile) {
  const pasDefile = () => defile.firstElementChild.offsetWidth + 22;
  $("[data-defile-prec]").addEventListener("click", () => defile.scrollBy({ left: -pasDefile(), behavior: "smooth" }));
  $("[data-defile-suiv]").addEventListener("click", () => defile.scrollBy({ left: pasDefile(), behavior: "smooth" }));
  let glisse = null;
  defile.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse") { glisse = { x: e.clientX, s: defile.scrollLeft }; defile.style.scrollSnapType = "none"; } });
  addEventListener("pointermove", (e) => { if (glisse) defile.scrollLeft = glisse.s - (e.clientX - glisse.x); });
  addEventListener("pointerup", () => { if (glisse) { glisse = null; defile.style.scrollSnapType = ""; } });
  }

  /* ---------- Personnages qui se baladent ---------- */
  const promeneur = $(".promeneur");
  const MARIES = [
    { profil: "images/perso-marie-profil.webp", face: "images/perso-marie-face.webp", nom: "Marie" },
    { profil: "images/perso-figurine-profil.webp", face: "images/perso-figurine.webp", nom: "Marie en figurine" },
    { profil: "images/perso-popart.webp", face: "images/perso-popart.webp", nom: "Pop", sautille: true }
  ];
  const AMIS = (C.personnages || []).filter((p) => p.balade).map((p) => ({
    profil: `images/perso-${p.image}.webp`, face: `images/perso-${p.image}.webp`, nom: p.nom, phrase: p.phrase, vole: p.vole, sautille: !p.vole
  })).sort(() => Math.random() - .5);
  // Marie, un ami, Marie en figurine, un ami, Pop, un ami…
  const PERSOS = [];
  for (let i = 0; i < Math.max(MARIES.length, AMIS.length); i++) {
    if (MARIES[i % MARIES.length] && i < AMIS.length + MARIES.length) PERSOS.push(MARIES[i % MARIES.length]);
    if (AMIS[i]) PERSOS.push(AMIS[i]);
  }
  const PHRASES = {
    accueil: ["Bienvenue au studio !", "Bonjour ! Je vous fais visiter ?"],
    catalogue: ["Cliquez sur une création pour tout voir 👀", "Le pop art, c'est mon préféré !", "Votre enfant en héros ? Je m'en occupe !"],
    univers: ["Tous ces personnages sont nés ici ✨", "Le prochain, c'est peut-être le vôtre !"],
    etapes: ["Simple : une fiche, un rendez-vous, et c'est parti !"],
    personnages: ["Vous me reconnaissez ? Je suis dans la galerie 😄", "Votre enfant peut nous rejoindre !"],
    fidelite: ["Gardez bien votre numéro client 🪙", "Parrainez un ami : +10 points !"],
    paiement: ["Orange Money ou PayPal, comme vous préférez 💳"],
    faq: ["Une question ? Écrivez-moi sur WhatsApp !"],
    contact: ["Remplissez la fiche, je vous réponds vite 💬"]
  };
  let sectionVue = "accueil";
  const obsSection = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) sectionVue = e.target.id; }), { rootMargin: "-40% 0px -55% 0px" });
  $$("main > section[id]").forEach((s) => obsSection.observe(s));
  const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
  const img = $("img", promeneur), bulle = $(".bulle--promeneur", promeneur);
  let x = -200;
  const corps = $(".promeneur__corps", promeneur);
  let ombre = $(".promeneur__ombre", promeneur);
  if (!ombre) { ombre = document.createElement("div"); ombre.className = "promeneur__ombre"; promeneur.prepend(ombre); }
  const marcher = (de, a, vitesse) => new Promise((res) => {
    promeneur.classList.add("marche");
    promeneur.classList.toggle("gauche", a < de);
    const duree = Math.abs(a - de) / vitesse * 1000;
    const t0 = performance.now();
    const pas = (t) => {
      const k = Math.min(1, (t - t0) / duree);
      // vitesse douce au départ et à l'arrivée, petits sauts réguliers comme un jouet
      const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      x = de + (a - de) * e;
      promeneur.style.transform = `translateX(${x}px)`;
      const vole = promeneur.classList.contains("vole");
      const phase = Math.abs(x - de) / (vole ? 90 : 34);
      const saut = vole ? Math.sin(phase) * 18 : Math.abs(Math.sin(phase * Math.PI / 2)) * 16;
      const sens = a < de ? -1 : 1;
      corps.style.transform = `translateY(${-saut}px) rotate(${sens * (vole ? 6 : 4) + Math.sin(phase * Math.PI) * 3}deg)`;
      ombre.style.transform = `scale(${1 - saut / 40})`;
      if (k < 1 && !promeneur.dataset.stop) requestAnimationFrame(pas); else { promeneur.classList.remove("marche"); corps.style.transform = ""; ombre.style.transform = ""; res(); }
    };
    requestAnimationFrame(pas);
  });
  const parler = async (texte, ms = 3200) => {
    bulle.textContent = texte;
    promeneur.classList.add("parle");
    await attendre(ms);
    promeneur.classList.remove("parle");
  };
  promeneur.addEventListener("click", () => {
    promeneur.classList.add("saute");
    setTimeout(() => promeneur.classList.remove("saute"), 1000);
    parler("Envie d'une création ? La fiche est en bas 👇", 2600);
  });
  const promenade = async () => {
    if (calme) return;
    await attendre(4500);
    let n = 0;
    for (;;) {
      const p = PERSOS[n++ % PERSOS.length];
      const L = innerWidth, w = L < 640 ? 70 : 100;
      const versDroite = n % 2 === 1;
      img.src = p.profil;
      img.alt = "";
      promeneur.classList.toggle("vole", !!p.vole);
      const depart = versDroite ? -w - 40 : L + 40, arret = L * (0.25 + Math.random() * 0.45), fin = versDroite ? L + 60 : -w - 60;
      const ouvert = () => document.querySelector("dialog[open]");
      while (ouvert()) await attendre(1000);
      await marcher(depart, arret, L < 640 ? 70 : 110);
      img.src = p.face;
      promeneur.classList.toggle("gauche", false);
      if (p.sautille) { promeneur.classList.add("saute"); setTimeout(() => promeneur.classList.remove("saute"), 1000); }
      const liste = PHRASES[sectionVue] || PHRASES.accueil;
      await parler(p.phrase && Math.random() < .6 ? p.phrase : liste[Math.floor(Math.random() * liste.length)]);
      await attendre(500);
      img.src = p.profil;
      await marcher(arret, fin, L < 640 ? 80 : 130);
      await attendre(5000 + Math.random() * 5000);
    }
  };
  // promenade(); remplacée par les personnages qui guettent (monde.js)

  observer();

  /* ---------- Téléphone : parties secondaires repliées derrière un bouton « Plus » ---------- */
  const replier = () => {
    if (!document.documentElement.classList.contains("mode-tel")) return;
    $$("[data-plus]").forEach((el) => {
      if (el.dataset.plusPret) return;
      el.dataset.plusPret = "1";
      const b = document.createElement("button");
      b.type = "button"; b.className = "plus-btn"; b.textContent = el.dataset.plus; b.setAttribute("aria-expanded", "false");
      el.hidden = true; el.before(b);
      b.addEventListener("click", () => { const ouvert = el.hidden; el.hidden = !ouvert; b.setAttribute("aria-expanded", String(ouvert)); });
    });
  };
  replier();
})();
