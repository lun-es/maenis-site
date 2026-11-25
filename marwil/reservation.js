// Maison Marwil : la réservation. Un panneau s'ouvre, le client donne son nom, son WhatsApp et sa ville ;
// la commande part dans le carnet (Google Sheets) et il reçoit son numéro de commande et son numéro client.
// Sans carnet configuré (MARWIL.api vide), la même demande part directement sur WhatsApp.
(function () {
  const M = window.MARWIL;
  const css = `
  .resa { border: 0; padding: 0; margin: auto; width: min(560px, 100vw); max-height: 100dvh; background: var(--fond); color: var(--encre); }
  .resa::backdrop { background: rgba(23, 19, 15, .45); backdrop-filter: blur(4px); }
  @media (max-width: 600px) { .resa { margin: auto 0 0; width: 100vw; max-width: 100vw; } }
  .resa .in { padding: 28px max(20px, env(safe-area-inset-left)) calc(28px + env(safe-area-inset-bottom)); display: flex; flex-direction: column; gap: 22px; }
  .resa .haut { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
  .resa h2 { font-size: clamp(28px, 6vw, 36px); }
  .resa .x { width: 44px; height: 44px; margin: -8px -10px 0 0; border: 0; background: none; cursor: pointer; flex: none; }
  .resa .choix { font-family: var(--f-display); font-size: 19px; line-height: 1.35; padding: 16px 0; border-block: 1px solid var(--filet); display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .resa .choix span:last-child { font-family: var(--f-body); font-size: 15px; }
  .resa form { display: flex; flex-direction: column; gap: 16px; }
  .resa label { display: flex; flex-direction: column; gap: 6px; font-size: 13px; color: var(--gris); }
  .resa input, .resa select { font: inherit; font-size: 16px; color: var(--encre); min-height: 52px; padding: 0 14px; border: 1px solid var(--filet); border-radius: 1px; background: var(--papier); }
  .resa input:focus-visible, .resa select:focus-visible { outline: 1px solid var(--encre); outline-offset: 0; border-color: var(--encre); }
  .resa .deux { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .resa .tel { display: grid; grid-template-columns: 86px 1fr; gap: 8px; }
  .resa .piege { position: absolute; left: -9999px; }
  .resa .note { font-size: 13px; color: var(--gris); }
  .resa .err { font-size: 14px; min-height: 1.4em; }
  .resa .num { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--filet); border: 1px solid var(--filet); }
  .resa .num div { background: var(--fond); padding: 16px; display: flex; flex-direction: column; gap: 4px; }
  .resa .num b { font-family: var(--f-display); font-weight: 400; font-size: 22px; letter-spacing: .02em; }
  .resa .num span { font-size: 12px; color: var(--gris); }
  .resa ol { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; color: var(--gris); font-size: 15px; }
  .resa ol b { color: var(--encre); font-weight: 500; }`;
  const st = document.createElement("style"); st.textContent = css; document.head.append(st);

  const dlg = document.createElement("dialog"); dlg.className = "resa"; dlg.setAttribute("aria-labelledby", "resaT");
  document.body.append(dlg);
  const fermer = '<button class="x" type="button" aria-label="Fermer" data-fermer><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
  dlg.addEventListener("click", e => { if (e.target === dlg || e.target.closest("[data-fermer]")) dlg.close(); });
  let cmd = null;

  M.reserver = function (c) {
    cmd = c;
    const memo = (() => { try { return JSON.parse(localStorage.getItem("mm-client") || "{}"); } catch (e) { return {}; } })();
    dlg.innerHTML = `<div class="in">
      <div class="haut"><div><p class="eyebrow">Commande</p><h2 id="resaT">Vos coordonnées</h2></div>${fermer}</div>
      <p class="choix"><span>${[c.modele, c.stockage, c.teinte, c.etat, c.express ? "livraison express" : ""].filter(Boolean).join(", ")}</span><span>${c.prix ? (c.estime ? "environ " : "") + M.fcfa(c.prix) : "prix sur demande"}</span></p>
      <form id="resaF" novalidate>
        <label>Nom et prénom<input name="nom" autocomplete="name" required value="${(memo.nom || "").replace(/"/g, "")}"></label>
        <label>Numéro WhatsApp<span class="tel"><input name="ind" value="${(memo.ind || "+237").replace(/"/g, "")}" inputmode="tel" aria-label="Indicatif"><input name="tel" inputmode="tel" aria-label="Numéro WhatsApp, sans l’indicatif" autocomplete="tel-national" placeholder="6 90 00 00 00" required value="${(memo.tel || "").replace(/"/g, "")}"></span></label>
        <div class="deux">
          <label>Ville<select name="ville" required>${M.villes.split(/ et |, /).map(v => `<option${memo.ville === v ? " selected" : ""}>${v}</option>`).join("")}</select></label>
          <label>Quartier<input name="quartier" autocomplete="address-level3" value="${(memo.quartier || "").replace(/"/g, "")}"></label>
        </div>
        <label class="piege" aria-hidden="true">Site<input name="site" tabindex="-1" autocomplete="off"></label>
        <p class="note">Vous ne payez rien maintenant. ${c.estime ? "Nous vous confirmons le prix exact et la disponibilité sur WhatsApp, puis vous payez la moitié par Orange Money ou MoMo." : `Nous confirmons la disponibilité sur WhatsApp, puis vous payez ${c.prix ? "l’acompte de " + M.fcfa(Math.round(c.prix / 2000) * 1000) : "l’acompte"} par Orange Money ou MoMo.`}</p>
        <p class="err" id="resaE" role="alert"></p>
        <button class="btn plein" type="submit" id="resaB">Envoyer ma commande</button>
      </form></div>`;
    dlg.showModal();
    { const f0 = [...dlg.querySelectorAll("#resaF input[required]")].find(i => !i.value); if (f0) f0.focus(); }
    dlg.querySelector("#resaF").addEventListener("submit", envoyer);
  };

  async function envoyer(e) {
    e.preventDefault();
    const f = e.target, err = dlg.querySelector("#resaE"), b = dlg.querySelector("#resaB");
    const v = Object.fromEntries(new FormData(f));
    const tel = (v.ind + v.tel).replace(/\D/g, "");
    if (v.nom.trim().length < 2) { err.textContent = "Indiquez votre nom et prénom."; f.nom.focus(); return; }
    if (v.tel.replace(/\D/g, "").length < 8) { err.textContent = "Indiquez votre numéro WhatsApp, sans l’indicatif (par exemple 6 90 00 00 00)."; f.tel.focus(); return; }
    err.textContent = "";
    try { localStorage.setItem("mm-client", JSON.stringify({ nom: v.nom.trim(), ind: v.ind, tel: v.tel, ville: v.ville, quartier: v.quartier })); } catch (x) {}
    const demande = [cmd.modele, cmd.stockage, cmd.teinte, cmd.etat].filter(Boolean).join(", ") + (cmd.prix ? ` (${M.fcfa(cmd.prix)})` : "");
    if (!M.api) {   // pas encore de carnet : tout part sur WhatsApp
      open(M.wa(`Bonjour Maison Marwil, je souhaite commander : ${demande}. Je suis ${v.nom.trim()}, à ${v.ville}${v.quartier ? ", " + v.quartier : ""}.`), "_blank", "noopener");
      dlg.close(); return;
    }
    b.disabled = true; b.textContent = "Enregistrement…";
    try {
      const r = await M.envoyer({ nom: v.nom, tel, ville: v.ville, quartier: v.quartier, site: v.site, modeleId: cmd.modeleId, etatCle: cmd.etatCle, sto: cmd.sto, modele: cmd.modele, teinte: cmd.teinte, etat: cmd.etat, stockage: cmd.stockage, prix: cmd.prix, express: !!cmd.express });
      if (!r.ok) throw new Error(r.erreur);
      merci(r, v, demande);
    } catch (x) {
      b.disabled = false; b.textContent = "Envoyer ma commande";
      err.innerHTML = `La commande n’a pas pu être enregistrée. Réessayez, ou <a href="${M.wa("Bonjour Maison Marwil, je souhaite commander : " + demande + ".")}" target="_blank" rel="noopener">écrivez-nous sur WhatsApp</a>.`;
    }
  }

  function merci(r, v, demande) {
    const msg = `Bonjour Maison Marwil, je viens de commander sur le site : commande ${r.commande}, client ${r.client}. ${demande}. ${v.nom.trim()}, ${v.ville}.`;
    dlg.innerHTML = `<div class="in">
      <div class="haut"><div><p class="eyebrow">Commande enregistrée</p><h2 id="resaT">Merci, ${v.nom.trim().split(" ")[0]}.</h2></div>${fermer}</div>
      <div class="num"><div><span>Votre numéro de commande</span><b>${r.commande}</b></div><div><span>Votre numéro client</span><b>${r.client}</b></div></div>
      <ol>
        <li><b>Envoyez-nous le message de confirmation sur WhatsApp.</b></li>
        <li>Payez ${r.acompte ? "l’acompte de <b>" + M.fcfa(r.acompte) + "</b>" : "l’acompte"} par Orange Money ou MoMo.</li>
        <li>Suivez votre commande avec son numéro.</li>
      </ol>
      <a class="btn plein" href="${M.wa(msg)}" target="_blank" rel="noopener">Confirmer sur WhatsApp</a>
      <a class="link" href="suivi.html?n=${r.commande}" style="justify-content:center">Suivre ma commande</a>
    </div>`;
  }
})();
