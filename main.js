(() => {
  const PIEZAS = [
    {id: "hogaza", nombre: "Hogaza de campo", precio: 6800, peso: "1 kg", horario: "7:00", desc: "78 % de hidratación. Corteza que cruje, miga abierta, acidez apenas marcada.", foto: "hogaza.jpg", w: 1100, h: 733, alt: "Hogaza de campo con cortes, en una olla de hierro oscura"},
    {id: "medialunas", nombre: "Medialuna de manteca", precio: 950, peso: "60 g", horario: "7:40", desc: "Laminada a mano durante tres días con manteca de tambo.", foto: "medialunas.jpg", w: 1100, h: 880, alt: "Dos medialunas con harina cayendo sobre fondo negro"},
    {id: "baguette", nombre: "Baguette de tradición", precio: 2900, peso: "280 g", horario: "8:00", desc: "Harina T65 y fermentación en frío. Agotada por hoy: la reservás para mañana.", foto: "baguette.jpg", w: 1100, h: 1650, alt: "Baguette con cortes sobre una superficie negra", agotado: true},
    {id: "centeno", nombre: "Centeno y semillas", precio: 7400, peso: "900 g", horario: "9:30", desc: "50 % centeno con lino, girasol y sésamo tostado. Dura una semana.", foto: "centeno.jpg", w: 1100, h: 1661, alt: "Pan de semillas cortado en rodajas sobre tela negra"},
    {id: "integral", nombre: "Hogaza integral", precio: 7100, peso: "900 g", horario: "11:00", desc: "70 % harina integral molida a piedra. Miga húmeda, corteza fina.", foto: "integral.jpg", w: 1100, h: 1648, alt: "Hogaza integral abierta a mano mostrando la miga"}
  ];
  const DIAS = [["Lunes", null, null], ["Martes", "07:00", "20:00"], ["Miércoles", "07:00", "20:00"], ["Jueves", "07:00", "20:00"], ["Viernes", "07:00", "20:00"], ["Sábado", "08:00", "20:00"], ["Domingo", "08:00", "14:00"]];
  const WHATSAPP = "5491100000000";

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = s => document.querySelector(s);
  const money = n => "$ " + n.toLocaleString("es-AR");
  const toMin = h => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
  const pad = n => String(n).padStart(2, "0");

  /* hora de Buenos Aires */
  const parts = new Intl.DateTimeFormat("es-AR", {timeZone: "America/Argentina/Buenos_Aires", weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false}).formatToParts(new Date());
  const g = t => parts.find(p => p.type === t)?.value;
  const diaHoy = g("weekday").replace(/^./, c => c.toUpperCase());
  const minHoy = (+g("hour") % 24) * 60 + +g("minute");
  const hoy = DIAS.find(d => d[0] === diaHoy) || DIAS[1];
  const abierto = !!hoy[1] && minHoy >= toMin(hoy[1]) && minHoy < toMin(hoy[2]);

  /* ---------- colección ---------- */
  const lista = $("#piezas");
  PIEZAS.forEach((p, i) => {
    const salio = !p.agotado && abierto && minHoy >= toMin(p.horario);
    const estado = p.agotado ? "Agotada · mañana 8:00" : salio ? "En el mostrador" : `Sale a las ${p.horario}`;
    const li = document.createElement("li");
    li.className = "pieza" + (p.agotado ? " is-agotado" : "");
    li.innerHTML = `
      <figure class="pieza-foto"><img src="img/${p.foto}" alt="${p.alt}" loading="lazy" width="${p.w}" height="${p.h}"></figure>
      <p class="pieza-meta label"><span>${pad(i + 1)}</span><span class="${salio ? "live" : ""}">${estado}</span></p>
      <h3>${p.nombre}</h3>
      <p class="pieza-desc">${p.desc}</p>
      <div class="pieza-acc">
        <p class="precio">${money(p.precio)} <span>· ${p.peso}</span></p>
        <button type="button" class="add" data-id="${p.id}" aria-pressed="false">Añadir</button>
      </div>`;
    lista.appendChild(li);
  });
  const cta = document.createElement("li");
  cta.className = "pieza-cta";
  cta.innerHTML = `<p class="label num">Tu caja</p><p>Combiná las piezas que quieras. Te la guardamos hasta las 20 h o la preparamos para mañana.</p><button type="button" class="btn btn-line" id="cta-caja">Ver mi caja</button>`;
  lista.appendChild(cta);

  /* ---------- la caja ---------- */
  const caja = new Map();
  try { JSON.parse(sessionStorage.getItem("miga-caja") || "[]").forEach(([k, v]) => { if (PIEZAS.some(p => p.id === k)) caja.set(k, v); }); } catch (e) {}
  const panel = $("#caja"), velo = $("#velo"), slots = $("#slots"), lineas = $("#lineas");
  const enviar = $("#enviar"), pill = $("#pill"), btn = $("#caja-btn");
  $("#caja-num").textContent = "N° " + pad(new Date().getDate()) + pad(new Date().getMonth() + 1);
  const pieza = id => PIEZAS.find(p => p.id === id);

  function render(nuevo) {
    const n = [...caja.values()].reduce((a, b) => a + b, 0);
    let total = 0;

    const lugares = Math.max(6, Math.ceil(n / 6) * 6);
    const fichas = [];
    for (const [id, q] of caja) for (let k = 0; k < q; k++) fichas.push(id);
    slots.innerHTML = "";
    for (let k = 0; k < lugares; k++) {
      const s = document.createElement("span");
      s.className = "slot";
      const id = fichas[k];
      if (id) {
        s.classList.add("lleno");
        s.style.backgroundImage = `url(img/${pieza(id).foto})`;
        if (nuevo === id && k === fichas.lastIndexOf(id) && !reduce) s.classList.add("cae");
      }
      slots.appendChild(s);
    }

    lineas.innerHTML = n ? "" : `<li class="vacio">Todavía no elegiste ninguna pieza.</li>`;
    for (const [id, q] of caja) {
      const p = pieza(id); const sub = p.precio * q; total += sub;
      const li = document.createElement("li");
      li.innerHTML = `<span class="ln">${p.nombre}${p.agotado ? "<small>Para mañana</small>" : ""}</span>
        <span class="sub">${money(sub)}</span>
        <span class="qty"><button type="button" data-q="-1" data-id="${id}" aria-label="Quitar una ${p.nombre}">−</button><output aria-label="Cantidad de ${p.nombre}">${q}</output><button type="button" data-q="1" data-id="${id}" aria-label="Añadir una ${p.nombre}">+</button></span>`;
      lineas.appendChild(li);
    }
    $("#total").textContent = money(total);
    $("#caja-n").textContent = n;
    $("#pill-n").textContent = n;
    $("#pill-total").textContent = money(total);
    pill.hidden = n === 0 || !panel.hidden;
    if (nuevo && !reduce) { pill.classList.remove("bump"); void pill.offsetWidth; pill.classList.add("bump"); }

    document.querySelectorAll(".add").forEach(b => {
      const q = caja.get(b.dataset.id) || 0; const p = pieza(b.dataset.id);
      b.setAttribute("aria-pressed", q > 0);
      b.textContent = q ? `En la caja · ${q}` : (p.agotado ? "Reservar" : "Añadir");
      b.setAttribute("aria-label", q ? `${p.nombre}: ${q} en la caja. Añadir otra` : `Añadir ${p.nombre} a la caja`);
    });

    enviar.setAttribute("aria-disabled", n ? "false" : "true");
    $("#nota").textContent = n ? "Se abre WhatsApp con el pedido escrito. Lo confirmás vos." : "Tu caja está vacía.";
    try { sessionStorage.setItem("miga-caja", JSON.stringify([...caja])); } catch (e) {}

    const retiro = document.querySelector('input[name="retiro"]:checked').value;
    const nombre = $("#nombre").value.trim();
    let msg = "Hola Miga, quiero encargar esta caja:\n";
    for (const [id, q] of caja) { const p = pieza(id); msg += `• ${q} × ${p.nombre}${p.agotado ? " (para mañana)" : ""} · ${money(p.precio * q)}\n`; }
    msg += `Total: ${money(total)}\nRetiro: ${retiro === "hoy" ? "hoy, antes de las 20 h" : "mañana"}`;
    if (nombre) msg += `\nA nombre de: ${nombre}`;
    enviar.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
  }

  function cambiar(id, d) {
    const q = (caja.get(id) || 0) + d;
    if (q <= 0) caja.delete(id); else caja.set(id, q);
    render(d > 0 ? id : null);
  }
  lista.addEventListener("click", e => { const b = e.target.closest(".add"); if (b) cambiar(b.dataset.id, 1); });
  lineas.addEventListener("click", e => {
    const b = e.target.closest("[data-q]"); if (!b) return;
    cambiar(b.dataset.id, +b.dataset.q);
    (lineas.querySelector(`[data-id="${b.dataset.id}"][data-q="${b.dataset.q}"]`) || $("#cerrar")).focus();
  });
  document.querySelectorAll('input[name="retiro"]').forEach(r => r.addEventListener("change", () => render()));
  $("#nombre").addEventListener("input", () => render());
  enviar.addEventListener("click", e => { if (enviar.getAttribute("aria-disabled") === "true") e.preventDefault(); });

  /* panel: abrir, cerrar, foco atrapado */
  let volver = null;
  function abrir(origen) {
    volver = origen || document.activeElement;
    panel.hidden = false; velo.hidden = false;
    requestAnimationFrame(() => { panel.classList.add("is-open"); velo.classList.add("is-open"); });
    btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("lock");
    pill.hidden = true;
    panel.focus();
  }
  function cerrar() {
    if (panel.hidden) return;
    panel.classList.remove("is-open"); velo.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("lock");
    setTimeout(() => { panel.hidden = true; velo.hidden = true; render(); }, reduce ? 0 : 400);
    if (volver && document.contains(volver)) volver.focus();
  }
  btn.addEventListener("click", () => abrir(btn));
  pill.addEventListener("click", () => abrir(btn));
  $("#cta-caja").addEventListener("click", e => abrir(e.currentTarget));
  $("#cerrar").addEventListener("click", cerrar);
  velo.addEventListener("click", cerrar);
  document.addEventListener("keydown", e => {
    if (panel.hidden) return;
    if (e.key === "Escape") { cerrar(); return; }
    if (e.key !== "Tab") return;
    const f = [...panel.querySelectorAll("button, a[href], input")].filter(el => !el.disabled && el.offsetParent !== null);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  render();

  /* nav sólida al bajar */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-solid", scrollY > 40);
  addEventListener("scroll", onScroll, {passive: true}); onScroll();

  /* revelados */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), {threshold: .15});
  document.querySelectorAll(".pieza, .intro-big, .pasos li, .oficio-foto, .banda-q").forEach(el => { el.classList.add("reveal"); io.observe(el); });

  /* visita */
  $("#horarios").innerHTML = DIAS.map(d => `<tr class="${d[0] === diaHoy ? "hoy" : ""}"><th scope="row">${d[0]}${d[0] === diaHoy ? " · hoy" : ""}</th><td>${d[1] ? d[1] + " — " + d[2] : "Cerrado"}</td></tr>`).join("");
  $("#estado").classList.add(abierto ? "abierto" : "cerrado");
  $("#estado-txt").textContent = abierto ? `Abierto · cierra a las ${hoy[2]}` : "Cerrado · encargos por WhatsApp";
})();
