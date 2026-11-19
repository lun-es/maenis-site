/* ===================== Maënis Studio : page des kits =====================
   Tout le contenu (noms, prix, liens) vient de config.js, partie « kits ».
   Lien de paiement vide : bouton « Réserver au prix de lancement » vers WhatsApp (message déjà écrit).
   Lien de paiement rempli : bouton « Je prends ce kit » vers la page de paiement. */
(() => {
  "use strict";
  document.documentElement.classList.add("js");
  const C = window.MAENIS || {}, K = C.kits || {}, R = window.MAENIS_REF || { id: "", compte: "", lienWA: (t) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t)}` };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const echap = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sansInsecable = (t) => t.replace(/[  ]/g, " ");
  const fr = (n) => sansInsecable(Number(n).toLocaleString("fr-FR"));
  const fcfa = (n) => fr(n) + " FCFA";
  const euros = (n) => (n ? "≈ " + sansInsecable(Number(n).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })) + " €" : "");
  const racine = document.documentElement.dataset.racine || "";
  const ouvert = (p) => /^https:\/\//.test((p && p.lien) || "");            // un vrai lien de paiement est renseigné
  const enPreparation = (p) => !ouvert(p) && !p.disponible;
  const avecArticle = (nom) => (/^(Kit|Pack)\b/.test(nom) ? "le " + nom : nom.charAt(0).toLowerCase() + nom.slice(1));
  const liste = K.liste || [], pack = K.pack, guide = K.guide, formation = K.formation || {};
  const payants = liste.concat(pack ? [pack] : []);
  const modeReservation = !payants.some(ouvert);

  /* ---------- Boutons ---------- */
  const bouton = (p, classes = "") => (ouvert(p)
    ? `<a class="bouton bouton--plein ${classes}" href="${echap(p.lien)}" target="_blank" rel="noopener" data-produit="${echap(p.id)}" data-mode="paiement">${echap(p.bouton || "Je prends ce kit")}</a>`
    : `<a class="bouton bouton--plein ${classes}" href="${echap(R.lienWA(`Bonjour Maënis Studio, je réserve ${avecArticle(p.nom)} (${fcfa(p.prix)}).`))}" target="_blank" rel="noopener" data-produit="${echap(p.id)}" data-mode="reservation">Réserver au prix de lancement</a>`);
  const prix = (p) => `<p class="k-prix"><strong>${fcfa(p.prix)}</strong>${p.euro ? `<span>${euros(p.euro)}</span>` : ""}</p>`;
  const puces = (lignes) => `<ul class="k-liste">${(lignes || []).map((l) => `<li>${echap(l)}</li>`).join("")}</ul>`;

  /* ---------- Bienvenue (visiteur venu d'une bio) ---------- */
  if (R.compte) { const b = $("#k-bienvenue"); b.innerHTML = `Bienvenue, tu viens de <em>${echap(R.compte)}</em>`; b.hidden = false; }

  /* ---------- En bref ---------- */
  $("#k-puces").innerHTML = (modeReservation
    ? ["Paiement unique", "Sans abonnement", "Guide gratuit"].map((t) => `<li>${t}</li>`).join("") + `<li class="bientot">Orange Money, MTN MoMo et carte : très bientôt</li>`
    : ["Orange Money", "MTN MoMo", "Carte bancaire", "Paiement unique", "Sans abonnement"].map((t) => `<li>${t}</li>`).join(""));

  /* ---------- Guide gratuit ---------- */
  if (guide) {
    const pret = ouvert(guide);
    $("#k-guide").innerHTML = `
      <div class="k-couverture" aria-hidden="true"><small>Maënis Studio</small><div><b>${echap(guide.chiffre || "")}</b><i>${echap(guide.chiffreMot || "")}</i></div><small>Guide gratuit</small></div>
      <div>
        <p class="etiquette">Gratuit</p>
        <h3>${echap(guide.nom)}</h3>
        <p>${echap(guide.resume)}</p>
        ${pret
          ? `<a class="bouton bouton--plein" href="${echap(guide.lien)}" target="_blank" rel="noopener" data-produit="${echap(guide.id)}" data-mode="lien">Recevoir le guide</a>`
          : `<a class="bouton bouton--plein" href="${echap(R.lienWA(`Bonjour Maënis Studio, je voudrais recevoir le guide gratuit « ${guide.nom} ».`))}" target="_blank" rel="noopener" data-produit="${echap(guide.id)}" data-mode="whatsapp">Recevoir le guide</a>`}
        ${pret ? "" : `<p class="k-petit">${guide.disponible ? "Tu le demandes sur WhatsApp, on te l'envoie." : "Le guide est en cours de finition : demande-le sur WhatsApp, on te l'envoie dès qu'il est prêt."}</p>`}
      </div>`;
  }

  /* ---------- Les kits ---------- */
  const dessinMontage = `<div class="k-dessin" aria-hidden="true">
      <div class="k-dessin__tel"><p>Coupe, sous-titre, <b>publie</b></p><div class="k-dessin__piste"><i style="width:30%"></i><i style="width:14%"></i><i style="width:26%"></i><i style="width:18%"></i></div></div>
      <div class="k-dessin__table"><small>Montage</small>
        <div class="k-dessin__ligne"><i style="width:34%"></i><i style="width:12%"></i><i style="width:28%"></i><i style="width:20%"></i></div>
        <div class="k-dessin__ligne son"><i style="width:100%"></i></div>
        <div class="k-dessin__onde">${[30, 70, 45, 90, 55, 80, 35, 65, 50, 85, 40, 60].map((h) => `<i style="height:${h}%"></i>`).join("")}</div>
      </div></div>`;
  $("#k-grille").innerHTML = liste.map((k) => `
    <article class="k-kit reveal" id="${echap(k.id)}">
      <div class="k-kit__visuel">
        ${k.image ? `<img src="${echap(racine + k.image)}" alt="${echap(k.alt || "")}" width="720" height="450" loading="lazy">` : dessinMontage}
        ${k.niveau ? `<span class="k-niveau">${echap(k.niveau)}</span>` : ""}
        ${enPreparation(k) ? `<span class="k-etat">En préparation</span>` : ""}
      </div>
      <div class="k-kit__corps">
        <h3>${echap(k.nom)}</h3>
        <p class="k-kit__promesse">${echap(k.resume)}</p>
        <h4>Tu reçois</h4>
        ${puces(k.contenu)}
        ${k.besoin ? `<p class="k-kit__besoin">${echap(k.besoin)}</p>` : ""}
        ${prix(k)}
        ${bouton(k, "bouton--large")}
      </div>
    </article>`).join("");

  const note = $("#k-note");
  if (K.note && payants.some((p) => !ouvert(p))) { note.textContent = K.note; note.hidden = false; }

  /* ---------- Le Pack ---------- */
  if (pack) {
    const recette = liste.find((k) => k.id === "recette");
    const separement = (pack.kits || []).reduce((s, id) => s + ((liste.find((k) => k.id === id) || {}).prix || 0), 0) + (pack.recettes || 0) * ((recette && recette.prix) || 0);
    const mots = (pack.nom || "").split(" ");
    const titre = mots.length > 1 ? `${echap(mots.slice(0, -1).join(" "))} <em>${echap(mots[mots.length - 1])}</em>` : echap(pack.nom);
    $("#k-pack").innerHTML = `
      <div>
        <p class="etiquette">${echap(pack.etiquette || "Le pack")}</p>
        <h3 id="${echap(pack.id)}">${titre}${enPreparation(pack) ? ` <span class="k-etat">En préparation</span>` : ""}</h3>
        ${puces(pack.contenu)}
      </div>
      <div>
        ${prix(pack)}
        ${separement > pack.prix ? `<p class="k-pack__compare">${fcfa(separement)} si tu prends chaque élément séparément.</p>` : ""}
        ${bouton(pack, "bouton--large")}
      </div>`;
  }

  /* ---------- Comment ça marche et questions : selon que les paiements sont ouverts ou non ---------- */
  $$("[data-etapes]").forEach((el) => (el.hidden = el.dataset.etapes !== (modeReservation ? "reservation" : "paiement")));

  /* ---------- Liste d'attente de la formation ---------- */
  $("#k-formation-resume").textContent = formation.resume || "";
  $("#k-formation-regles").innerHTML = (formation.regles || []).map(([a, b]) => `<li><b>${echap(a)}</b><span>${echap(b)}</span></li>`).join("");
  $("#k-formation-actions").innerHTML =
    `<a class="bouton bouton--plein" href="${echap(R.lienWA("Bonjour Maënis Studio, FORMATION : je veux être prévenu(e) de la date de la formation en direct."))}" target="_blank" rel="noopener" data-produit="liste-attente" data-mode="whatsapp">Je m'inscris sur WhatsApp</a>`
    + (ouvert(formation) ? `<a class="bouton bouton--trait" href="${echap(formation.lien)}" target="_blank" rel="noopener" data-produit="liste-attente-email" data-mode="lien">Je m'inscris par e-mail</a>` : "");

  /* ---------- Pied de page ---------- */
  const reseaux = [["instagram", "Instagram"], ["tiktok", "TikTok"], ["facebook", "Facebook"], ["youtube", "YouTube"]]
    .filter(([k]) => C.reseaux && C.reseaux[k])
    .map(([k, n]) => `<a href="${echap(C.reseaux[k])}" target="_blank" rel="noopener">${n}</a>`).join("");
  $("#k-reseaux").innerHTML = reseaux;
  $("#k-whatsapp").href = R.lienWA("Bonjour Maënis Studio, j'ai une question sur les kits.");
  $("#k-numero").textContent = C.whatsappAffiche || "";
  $("#k-mail").textContent = C.email || ""; $("#k-mail").href = "mailto:" + (C.email || "");
  $("#k-annee").textContent = new Date().getFullYear();
  const prixMini = Math.min(...liste.map((k) => k.prix).filter(Boolean));
  if (isFinite(prixMini)) $("#k-des").textContent = fcfa(prixMini);

  /* ---------- Bandeau pour les navigateurs intégrés aux applis ---------- */
  if (/TikTok|musical_ly|Bytedance|Instagram|FBAN|FBAV|FB_IAB/i.test(navigator.userAgent || "")) $("#k-app").hidden = false;
  $("#k-copier").addEventListener("click", (e) => {
    const url = location.href.split("#")[0], fini = () => (e.currentTarget.textContent = "Lien copié");
    const secours = () => window.prompt("Copie ce lien :", url);
    try { navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(url).then(fini, secours) : secours(); } catch (_) { secours(); }
  });

  /* ---------- Apparition au défilement ---------- */
  const aReveler = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("vu"); obs.unobserve(e.target); } }), { rootMargin: "0px 0px -6% 0px" });
    aReveler.forEach((el) => obs.observe(el));
  } else aReveler.forEach((el) => el.classList.add("vu"));

  /* ---------- Barre du bas : après l'accroche, cachée quand les kits ou le pied de page sont à l'écran ---------- */
  const barre = $("#k-barre"), zone = $("#kits"), pied = $(".pied");
  const majBarre = () => {
    const r = zone.getBoundingClientRect(), p = pied.getBoundingClientRect();
    const dansKits = r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.3;
    barre.classList.toggle("visible", scrollY > 520 && !dansKits && p.top > innerHeight);
  };
  addEventListener("scroll", majBarre, { passive: true });
  majBarre();
})();
