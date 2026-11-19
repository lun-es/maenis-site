/* ===================== Maënis Studio : visiteurs venus des bios (?ref=…) =====================
   Chargé après config.js et avant app.js (accueil), et sur la page des kits.
   - retient le code ?ref= pendant la visite (sessionStorage) ;
   - l'ajoute aux messages WhatsApp (« Je viens de @fait.en.code. ») ;
   - garde le code sur les liens qui mènent à la page des kits ;
   - sur l'accueil : panneau de bienvenue avec deux chemins (une vidéo, ou apprendre avec les kits).
   Les comptes reconnus sont dans config.js (partie « bios »). */
(() => {
  "use strict";
  const C = window.MAENIS || {};
  const BIOS = C.bios || {};
  const memoire = {
    lire: (k) => { try { return sessionStorage.getItem(k) || ""; } catch (e) { return ""; } },
    ecrire: (k, v) => { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };
  const propre = (r) => { r = String(r || "").trim().toLowerCase(); return /^[a-z0-9][a-z0-9-]{0,39}$/.test(r) ? r : ""; };
  const echap = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fr = (n) => n.toLocaleString("fr-FR").replace(/[  ]/g, " ");

  const dansAdresse = propre(new URLSearchParams(location.search).get("ref"));
  if (dansAdresse) memoire.ecrire("maenis-ref", dansAdresse);
  const id = dansAdresse || propre(memoire.lire("maenis-ref"));
  const bio = BIOS[id] || null;
  const compte = bio ? bio.compte : "";
  const phrase = !id ? "" : compte ? `Je viens de ${compte}.` : `Je viens du lien « ${id} ».`;
  // Message d'une ligne : la phrase est ajoutée à la fin. Message de plusieurs lignes (fiche) : une ligne en plus.
  const signer = (texte) => (!phrase ? texte : /\n/.test(texte) ? `${texte}\n• Venu par : ${compte || id}` : `${texte} ${phrase}`);
  const lienWA = (texte) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(signer(texte))}`;
  const racine = document.documentElement.dataset.racine || "";
  const lienKits = () => racine + "kits/" + (id ? "?ref=" + encodeURIComponent(id) : "");
  window.MAENIS_REF = { id, compte, dansAdresse, signer, lienWA, lienKits };

  /* ---------- Liens vers la page des kits (le code ?ref= suit le visiteur) et prix le plus bas ---------- */
  document.querySelectorAll("a[data-kits]").forEach((a) => (a.href = lienKits()));
  const prixKits = ((C.kits && C.kits.liste) || []).map((k) => k.prix).filter(Boolean);
  if (prixKits.length) document.querySelectorAll("[data-kits-des]").forEach((el) => (el.textContent = fr(Math.min(...prixKits)) + " FCFA"));

  /* ---------- Accueil : panneau de bienvenue ---------- */
  if (!document.getElementById("accueil") || !dansAdresse || memoire.lire("maenis-bienvenue-fermee")) return;
  const offres = C.offres || [];
  const ancre = (location.hash.match(/^#offre-([a-z0-9-]+)$/) || [])[1] || "";
  const offre = offres.find((o) => o.id === ancre) || (bio && offres.find((o) => o.id === bio.offre)) || null;
  // Le lien de la bio ouvrait tout de suite la fiche de l'offre : on la retient, le visiteur choisit d'abord son chemin.
  if (offre && offre.id === ancre) history.replaceState(null, "", location.pathname + location.search);

  const panneau = document.createElement("aside");
  panneau.className = "bienvenue";
  panneau.id = "bienvenue";
  panneau.setAttribute("aria-label", "Bienvenue");
  panneau.innerHTML = `
    <button class="bienvenue__fermer" type="button" aria-label="Fermer le message de bienvenue">✕</button>
    <p class="bienvenue__titre">${compte ? `Bienvenue, tu viens de <em>${echap(compte)}</em>` : `Bienvenue chez <em>Maënis Studio</em>`}</p>
    <div class="bienvenue__choix">
      <a class="bouton bouton--plein" data-chemin="video" href="${offre ? "#offre-" + echap(offre.id) : "#catalogue"}">Je veux une vidéo comme ça</a>
      <a class="bouton bouton--trait" data-chemin="kits" href="${echap(lienKits())}">Je veux apprendre à le faire</a>
    </div>`;
  document.body.appendChild(panneau);
  const mesurer = () => document.documentElement.style.setProperty("--bienvenue-h", panneau.offsetHeight + "px");
  const fermer = () => {
    memoire.ecrire("maenis-bienvenue-fermee", "1");
    panneau.classList.remove("visible");
    document.body.classList.remove("bienvenue-ouverte");
    removeEventListener("resize", mesurer);
    setTimeout(() => panneau.remove(), 500);
  };
  panneau.querySelector(".bienvenue__fermer").addEventListener("click", fermer);
  panneau.querySelectorAll("[data-chemin]").forEach((a) => a.addEventListener("click", fermer));
  addEventListener("keydown", (e) => { if (e.key === "Escape" && panneau.isConnected && !document.querySelector("dialog[open]")) fermer(); });
  addEventListener("resize", mesurer);
  // Il arrive juste après l'écran de chargement, en douceur
  setTimeout(() => { if (!panneau.isConnected) return; mesurer(); panneau.classList.add("visible"); document.body.classList.add("bienvenue-ouverte"); }, 1300);
})();
