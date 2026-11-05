/* Maënis Studio : pages « Mon espace » (suivi, dépôt de la capture de paiement, photos) et « Atelier » (prestataires). */
(() => {
  const C = window.MAENIS || {}, URL_PROG = C.backendUrl;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const echap = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fr = (n) => Math.round(Number(n) || 0).toLocaleString("fr-FR").replace(/[  ]/g, " ");
  const fcfa = (n) => fr(n) + " FCFA";
  const jour = (iso) => iso ? new Date(iso + "T12:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) : "";
  const p = new URLSearchParams(location.search);
  const app = $("#app");
  const wa = (t) => `https://wa.me/${C.whatsapp || "237690164222"}?text=${encodeURIComponent(t)}`;
  const memoire = { lire: (k) => { try { return localStorage.getItem(k) || ""; } catch (e) { return ""; } }, ecrire: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };

  const lire = async (params) => { const r = await fetch(URL_PROG + "?" + new URLSearchParams(params)); return r.json(); };
  const poster = async (o) => { const r = await fetch(URL_PROG, { method: "POST", body: JSON.stringify(o) }); return r.json(); };
  const attente = (t) => { app.innerHTML = `<p class="chargement">${echap(t)}</p>`; };
  const oups = (t) => { app.innerHTML = `<div class="carte"><h2>Oups</h2><p>${t}</p><a class="btn" href="${wa("Bonjour Marie, j'ai un souci avec mon espace Maënis Studio.")}">M'écrire sur WhatsApp</a></div>`; };

  /* =====================================================================
     MON ESPACE
     ===================================================================== */
  const FRISE = ["Demande reçue", "Prix fixé", "Acompte confirmé", "En création", "Prête", "Livrée"];
  const rangFrise = (e) => ({ "Nouvelle demande": 1, "RDV fait": 1, "Acompte demandé": 2, "Acompte confirmé": 3, "En création": 3, "Solde demandé": 4, "Soldé": 5, "Livrée": 6, "Annulée": -1 })[e] ?? 1;
  const ETAT_ART = { "En attente de l'acompte": "En attente de l'acompte", "Pas commencé": "Va bientôt commencer", "En création": "En création", "Aperçu envoyé": "Aperçu envoyé : à vous de me dire !",
    "Retouches": "Retouches en cours", "Version définitive validée": "Terminée ✓", "Chez le prestataire": "En impression / encadrement", "Prêt": "Prête ✓", "Livraison programmée": "Livraison programmée", "Livré": "Livrée ✓", "Annulé": "Annulée" };

  const vueCommande = (k, prenom) => {
    const r = rangFrise(k.etape);
    const frise = r < 0 ? `<p class="info info--erreur">Cette commande est annulée.</p>` :
      `<ol class="frise">${FRISE.map((e, i) => `<li class="${i < r ? "fait" : i === r ? "ici" : ""}">${e}</li>`).join("")}</ol>`;
    const arts = k.articles.map((a) => {
      const pc = a.etape === "Annulé" ? 0 : parseInt(a.avancement) || (/Livré|Prêt|Version définitive/.test(a.etape) ? 100 : /Chez le prestataire/.test(a.etape) ? 85 : 0);
      const recues = parseInt(a.photos) || 0, manque = a.photosRequises && recues < a.photosRequises;
      const besoinPhotos = a.avisPhotos === "À refaire" || (manque && !/Supprimées/.test(a.photos));
      return `<div class="art" data-article="${echap(a.id)}">
        <div class="art__haut"><h3>${echap(a.creation)}</h3>${a.cadeau ? `<span class="badge">🎁 Cadeau</span>` : ""}</div>
        <p class="art__formule">${echap(a.formule || "")}${k.prixConfirme && a.prix ? " · " + fcfa(a.prix) : ""}</p>
        <div class="barre" aria-hidden="true"><i style="width:${pc}%"></i></div>
        <p class="art__etat"><strong>${echap(ETAT_ART[a.etape] || a.etape)}</strong>${a.date && !/Livré|Annulé/.test(a.etape) ? ` · prévue pour le ${jour(a.date)}` : ""}</p>
        <div class="art__liens">
          ${a.apercu ? `<a class="btn btn--petit" href="${echap(a.apercu)}" target="_blank" rel="noopener">👀 Voir l'aperçu</a>` : ""}
          ${a.fichier ? `<a class="btn btn--petit" href="${echap(a.fichier)}" target="_blank" rel="noopener">⬇️ Mon fichier final</a>` : ""}
        </div>
        ${besoinPhotos ? `<div class="payer" style="background:#FFF4F6;border-color:rgba(232,69,122,.45)">
          <p><strong>${a.avisPhotos === "À refaire" ? "J'ai besoin de nouvelles photos 📷" : `Il manque des photos (${recues} / ${a.photosRequises})`}</strong></p>
          ${a.consigne ? `<p style="font-size:.92rem">${echap(a.consigne)}</p>` : `<p style="font-size:.92rem">De face, de profil, de trois quarts et en entier. De jour, près d'une fenêtre, sans filtre.</p>`}
          <label class="fichier"><input type="file" accept="image/*" multiple data-photos="${echap(a.id)}"><span>📷 Choisir mes photos</span></label>
          <div class="miniatures"></div>
          <button class="btn btn--bordeaux" type="button" data-envoyer-photos="${echap(a.id)}" hidden>Envoyer mes photos</button>
          <p class="etat-photos" aria-live="polite"></p>
        </div>` : ""}
      </div>`;
    }).join("");
    const montants = k.prixConfirme ? `<dl class="montants">
        <dt>Total</dt><dd>${fcfa(k.total)}</dd>
        <dt>Acompte (50 %)</dt><dd>${fcfa(k.acompte)}</dd>
        <dt>Déjà réglé</dt><dd>${fcfa(k.paye)}</dd>
        <dt class="fort">Reste à payer</dt><dd class="fort">${fcfa(Math.max(k.reste, 0))}</dd></dl>`
      : `<p class="info info--attente">Prix de départ : <strong>${fcfa(k.depart)}</strong>. Le prix final est fixé ensemble pendant le rendez-vous, puis vous recevez le récapitulatif par mail.</p>`;
    const payer = k.du > 0 ? `<div class="payer" id="payer-${echap(k.id)}">
        <p class="sous" style="margin-top:0">À régler maintenant · ${echap(k.typeDu)}</p>
        <p class="payer__du">${fcfa(k.du)}</p>
        <ol>
          <li>Payez par ${k.paiement.orange ? `<strong>Orange Money au ${echap(k.paiement.orange)}</strong>` : "<strong>Orange Money</strong>"}${k.paiement.paypal ? (/^https?:/.test(k.paiement.paypal) ? ` ou <a href="${echap(k.paiement.paypal)}" target="_blank" rel="noopener"><strong>PayPal</strong></a>` : ` ou <strong>PayPal : ${echap(k.paiement.paypal)}</strong>`) : " ou <strong>PayPal</strong>"}${k.paiement.orange || k.paiement.paypal ? "" : " (numéro ou lien envoyé sur WhatsApp)"}.</li>
          <li>Dans le message du paiement, écrivez votre <strong>numéro de commande : ${echap(k.id)}</strong>.</li>
          <li>Faites une <strong>capture d'écran</strong> de la confirmation.</li>
          <li>Déposez-la ici : je vérifie et je vous confirme.</li>
        </ol>
        <form class="preuve" data-commande="${echap(k.id)}" data-jeton="${echap(k.jeton)}">
          <div class="champ"><label for="m-${echap(k.id)}">Montant payé (FCFA)</label><input id="m-${echap(k.id)}" name="montant" inputmode="numeric" value="${k.du}" required></div>
          <div class="champ"><label for="mo-${echap(k.id)}">Payé par</label><select id="mo-${echap(k.id)}" name="moyen"><option>Orange Money</option><option>PayPal</option><option>Autre</option></select></div>
          <label class="fichier"><input type="file" name="capture" accept="image/*,application/pdf" required><span>📎 Choisir ma capture d'écran</span></label>
          <div class="champ" style="margin-top:12px"><label for="me-${echap(k.id)}">Un mot pour Marie <small>(facultatif)</small></label><textarea id="me-${echap(k.id)}" name="message" placeholder="Ex. payé depuis le numéro de ma sœur"></textarea></div>
          <button class="btn btn--bordeaux" type="submit">Envoyer ma capture</button>
          <p class="etat-preuve" aria-live="polite"></p>
        </form>
      </div>` : "";
    const verif = k.enVerification ? `<p class="info info--attente">⏳ Capture reçue : je vérifie le paiement et je vous confirme très vite.</p>` : "";
    return `<section class="carte">
      <h2>Commande ${echap(k.id)}</h2>
      <span class="pastille ${/Soldé|Livrée/.test(k.etape) ? "pastille--ok" : ""}">${echap(k.etape === "RDV fait" ? "Rendez-vous fait" : k.etape)}</span>
      ${k.date && !/Livrée|Annulée/.test(k.etape) ? `<p class="date">Date prévue : <strong>${jour(k.date)}</strong></p>` : ""}
      ${frise}
      <p class="sous">${k.articles.length > 1 ? k.articles.length + " créations" : "Votre création"}</p>
      ${arts}
      <p class="sous">Paiement</p>
      ${montants}${verif}${payer}
    </section>`;
  };

  const brancherCommande = (racine, recharger) => {
    $$("form.preuve", racine).forEach((f) => {
      const fichier = $("input[type=file]", f);
      fichier.addEventListener("change", () => { const l = fichier.closest(".fichier"); l.classList.toggle("choisi", !!fichier.files[0]); $("span", l).textContent = fichier.files[0] ? "✓ " + fichier.files[0].name : "📎 Choisir ma capture d'écran"; });
      f.addEventListener("submit", async (e) => {
        e.preventDefault();
        const etat = $(".etat-preuve", f), b = $("button[type=submit]", f), file = fichier.files[0];
        if (!file) { etat.textContent = "Choisissez la capture d'écran du paiement."; return; }
        b.disabled = true; b.textContent = "Envoi…"; etat.textContent = "";
        try {
          let data, mime;
          if (/pdf/.test(file.type)) { data = await window.MaenisPhotos.brut(file); mime = "application/pdf"; }
          else { const x = await window.MaenisPhotos.preparer(file, 1800); data = x.data; mime = x.mime; }
          const r = await poster({ action: "preuve", commande: f.dataset.commande, jeton: f.dataset.jeton, montant: f.montant.value, moyen: f.moyen.value, message: f.message.value, data, mime });
          if (!r.ok) throw new Error(r.erreur);
          f.closest(".payer").innerHTML = `<p class="info">✅ Merci ! Votre capture est bien arrivée. Je vérifie le paiement et je vous confirme par mail.</p>`;
        } catch (err) { etat.innerHTML = `L'envoi n'a pas marché. Réessayez, ou <a href="${wa("Bonjour Marie, voici ma capture de paiement pour " + f.dataset.commande)}">envoyez-la sur WhatsApp</a>.`; b.disabled = false; b.textContent = "Envoyer ma capture"; }
      });
    });
    $$("input[data-photos]", racine).forEach((inp) => {
      const zone = inp.closest(".payer"), liste = [];
      inp.addEventListener("change", async () => {
        $(".etat-photos", zone).textContent = "Préparation…";
        for (const file of [...inp.files].slice(0, 10)) { try { const x = await window.MaenisPhotos.preparer(file); x.avis = window.MaenisPhotos.avis(x); liste.push(x); } catch (e) { /* illisible */ } }
        inp.value = "";
        $(".miniatures", zone).innerHTML = liste.map((x) => `<img src="${x.apercu}" alt="" class="${x.avis.ok ? "" : "non"}">`).join("");
        const bonnes = liste.filter((x) => x.avis.ok).length;
        $(".etat-photos", zone).textContent = `${bonnes} photo${bonnes > 1 ? "s" : ""} prête${bonnes > 1 ? "s" : ""}` + (liste.length > bonnes ? " (les photos trop petites ne seront pas envoyées)" : "");
        $("[data-envoyer-photos]", zone).hidden = !bonnes;
      });
      $("[data-envoyer-photos]", zone).addEventListener("click", async (e) => {
        const b = e.currentTarget, cmd = racine.dataset.commande || inp.closest("[data-commande-id]")?.dataset.commandeId, jeton = inp.closest("[data-jeton]")?.dataset.jeton;
        const bonnes = liste.filter((x) => x.avis.ok); let rate = 0;
        b.disabled = true;
        for (let i = 0; i < bonnes.length; i++) {
          b.textContent = `Envoi ${i + 1} / ${bonnes.length}…`;
          const x = bonnes[i];
          try { const r = await poster({ action: "photo", commande: cmd, jeton, article: inp.dataset.photos, index: i + 1, mime: x.mime, data: x.data, largeur: x.largeur, hauteur: x.hauteur, nettete: x.nettete, renvoi: true }); if (!r.ok) rate++; } catch (err) { rate++; }
        }
        zone.innerHTML = rate ? `<p class="info info--erreur">${rate} photo(s) ne sont pas passées. Réessayez dans un instant.</p>` : `<p class="info">✅ Merci ! Vos photos sont bien arrivées.</p>`;
      });
    });
  };

  const afficherCommandes = (cmds, prenom, entete) => {
    app.innerHTML = entete + cmds.map((k) => `<div data-commande-id="${echap(k.id)}" data-jeton="${echap(k.jeton)}">${vueCommande(k, prenom)}</div>`).join("");
    brancherCommande(app);
  };

  const parLien = async () => {
    attente("Je retrouve votre commande…");
    try {
      const r = await lire({ action: "commande", commande: p.get("c"), jeton: p.get("j") });
      if (!r.ok) return oups("Ce lien ne fonctionne pas (ou plus). Vérifiez qu'il est complet, ou demandez-m'en un nouveau.");
      memoire.ecrire("maenis-numero-client", r.client);
      afficherCommandes([r.commande], r.prenom, `<h1>Bonjour <em>${echap(r.prenom)}</em> 👋</h1><p class="e-intro">Voici où en est votre commande. Cette page se met à jour toute seule à chaque étape.</p>`);
    } catch (e) { oups("La page n'arrive pas à joindre le studio. Vérifiez votre connexion et réessayez."); }
  };

  const connexion = (msg = "") => {
    app.innerHTML = `<h1>Mon <em>espace</em></h1><p class="e-intro">Suivez vos commandes, déposez vos captures de paiement et voyez vos points de fidélité.</p>
      <form class="carte" id="connexion">
        <div class="champ"><label for="cl">Numéro client</label><input id="cl" name="client" placeholder="MS-0001" autocapitalize="characters" autocomplete="username" value="${echap(memoire.lire("maenis-numero-client"))}" required></div>
        <div class="champ"><label for="co">Code secret <small>(4 chiffres)</small></label><input id="co" name="code" inputmode="numeric" maxlength="4" autocomplete="current-password" required></div>
        <button class="btn btn--bordeaux" type="submit">Voir mes commandes</button>
        <p class="etat" aria-live="polite">${msg}</p>
        <button class="lien" type="button" id="oubli">Code oublié ?</button>
        <div id="oubli-zone" hidden>
          <div class="champ" style="margin-top:10px"><label for="qui">Votre numéro client, votre mail ou votre WhatsApp</label><input id="qui" name="qui" autocomplete="email"></div>
          <button class="btn" type="button" id="oubli-envoyer">Recevoir mon code par mail</button>
        </div>
      </form>`;
    const f = $("#connexion");
    $("#oubli").addEventListener("click", () => { $("#oubli-zone").hidden = false; $("#qui").value = f.client.value; $("#qui").focus(); });
    $("#oubli-envoyer").addEventListener("click", async (e) => {
      const q = $("#qui").value.trim(); if (!q) return;
      e.currentTarget.disabled = true;
      try { await poster({ action: "code-oublie", qui: q }); } catch (err) { /* même message */ }
      $("#oubli-zone").innerHTML = `<p class="info">Si ce compte existe, votre code vient de partir par mail à l'adresse enregistrée. Pensez à regarder dans les spams.</p>`;
    });
    f.addEventListener("submit", async (e) => {
      e.preventDefault();
      const etat = $(".etat", f);
      etat.textContent = "Un instant…";
      try {
        const r = await lire({ action: "suivi", client: f.client.value.trim().toUpperCase(), code: f.code.value.trim() });
        if (!r.ok) { etat.textContent = r.erreur === "bloque" ? `Trop d'essais : réessayez dans ${r.minutes} minutes.` : `Numéro ou code incorrect${r.restants >= 0 ? ` (encore ${r.restants} essai${r.restants > 1 ? "s" : ""})` : ""}.`; return; }
        memoire.ecrire("maenis-numero-client", r.client);
        const pts = `<section class="carte"><p class="sous" style="margin-top:0">Mes points de fidélité</p><div class="points"><b>${r.points}</b><span>${r.reductions ? `🎉 Vous avez droit à <strong>${r.reductions} réduction${r.reductions > 1 ? "s" : ""} de 10 %</strong> : dites-le à Marie au prochain rendez-vous.` : `Encore <strong>${r.reste} points</strong> avant votre réduction de 10 %.`}</span></div></section>`;
        afficherCommandes(r.commandes, r.prenom, `<h1>Bonjour <em>${echap(r.prenom)}</em> 👋</h1><p class="e-intro">Client ${echap(r.client)} · ${r.commandes.length} commande${r.commandes.length > 1 ? "s" : ""}</p>${pts}` +
          (r.commandes.length ? "" : `<p class="carte">Pas encore de commande. <a href="./#contact">Remplir la fiche</a></p>`));
      } catch (err) { etat.textContent = "La page n'arrive pas à joindre le studio. Réessayez dans un instant."; }
    });
  };

  /* =====================================================================
     ATELIER (prestataires)
     ===================================================================== */
  const atelier = async () => {
    attente("Je retrouve la commande…");
    let r;
    try { r = await lire({ action: "fab", r: p.get("r"), j: p.get("j") }); } catch (e) { return oups("La page n'arrive pas à joindre le studio. Réessayez dans un instant."); }
    if (!r.ok) return oups("Ce lien ne fonctionne pas. Vérifiez qu'il est complet.");
    app.innerHTML = `<h1>Bonjour <em>${echap(r.prestataire)}</em></h1><p class="e-intro">Commande <strong>${echap(r.ref)}</strong> pour Maënis Studio. Un clic suffit pour me dire où elle en est. Merci !</p>
      <section class="carte">
        <h2>${echap(r.ref)}</h2>
        <span class="pastille pastille--attente">${echap(r.statut)}</span>
        <p class="sous">La commande</p>
        <p style="margin:0 0 8px"><strong>${echap(r.creation)}</strong><br>${echap(r.formule)}</p>
        <p class="details">${echap(r.details)}</p>
        ${r.souhaite ? `<p class="date">Souhaitée pour le <strong>${jour(r.souhaite)}</strong></p>` : ""}
        ${r.pretPrevu ? `<p class="date">Vous avez prévu : <strong>${jour(r.pretPrevu)}</strong></p>` : ""}
        <form id="fab">
          <p class="sous">Où en est-elle ?</p>
          <div class="choix-statut">
            ${["Reçu", "Commencé", "Prêt", "Problème"].map((s) => `<label><input type="radio" name="statut" value="${s}" ${s === r.statut ? "checked" : ""} required><span>${{ "Reçu": "📥 Reçu", "Commencé": "🛠️ Commencé", "Prêt": "✅ Prêt", "Problème": "⚠️ Problème" }[s]}</span></label>`).join("")}
          </div>
          <div class="champ"><label for="delai">Prêt dans combien de jours ?</label><select id="delai" name="delai"><option value="">—</option>${[1, 2, 3, 4, 5, 6, 7, 10, 14].map((d) => `<option value="${d}">${d} jour${d > 1 ? "s" : ""}</option>`).join("")}</select></div>
          <div class="champ"><label for="msg">Un message pour Marie <small>(prix, question…)</small></label><textarea id="msg" name="message"></textarea></div>
          <button class="btn btn--bordeaux" type="submit">Envoyer</button>
          <p class="etat" aria-live="polite"></p>
        </form>
      </section>`;
    $("#fab").addEventListener("submit", async (e) => {
      e.preventDefault();
      const f = e.currentTarget, b = $("button", f);
      if (!f.statut.value) { $(".etat", f).textContent = "Choisissez où en est la commande."; return; }
      b.disabled = true; b.textContent = "Envoi…";
      try {
        const x = await poster({ action: "fab", ref: r.ref, jeton: p.get("j"), statut: f.statut.value, delai: f.delai.value, message: f.message.value });
        if (!x.ok) throw new Error();
        f.innerHTML = `<p class="info">✅ Merci ! Marie est prévenue${f.statut.value === "Prêt" ? " : elle passe récupérer la commande très vite." : "."}</p>`;
      } catch (err) { b.disabled = false; b.textContent = "Envoyer"; $(".etat", f).textContent = "L'envoi n'a pas marché. Réessayez, ou répondez au mail avec la référence."; }
    });
  };

  if (!URL_PROG) return oups("Cette page n'est pas encore active.");
  if (document.body.dataset.page === "atelier") atelier();
  else if (p.get("c") && p.get("j")) parLien();
  else connexion();
})();
