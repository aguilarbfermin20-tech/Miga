(() => {
  const PIEZAS = [
    {id: "hogaza", nombre: "Hogaza de campo", precio: 6800, peso: "1 kg", horario: "7:00", desc: "78 % de hidratación. Corteza crocante, miga abierta y una acidez apenas marcada.", foto: "hogaza.jpg", alt: "Hogaza de campo con corteza dorada y cortes"},
    {id: "medialunas", nombre: "Medialunas de manteca", precio: 950, peso: "60 g", horario: "7:40", desc: "Laminadas a mano en tres días, con manteca de tambo. Se venden por unidad.", foto: "medialunas.jpg", alt: "Medialunas de manteca sobre fondo oscuro"},
    {id: "baguette", nombre: "Baguette de tradición", precio: 2900, peso: "280 g", horario: "8:00", desc: "Harina francesa T65 y fermentación en frío. Agotada por hoy: la reservás para mañana.", foto: "baguette.jpg", alt: "Baguettes doradas sobre la mesada", agotado: true},
    {id: "centeno", nombre: "Centeno y semillas", precio: 7400, peso: "900 g", horario: "9:30", desc: "50 % centeno con lino, girasol y sésamo tostado. Dura una semana entera.", foto: "centeno.jpg", alt: "Pan de centeno cortado en rodajas"},
    {id: "integral", nombre: "Hogaza integral", precio: 7100, peso: "900 g", horario: "11:00", desc: "70 % harina integral molida a piedra. Miga húmeda y corteza fina.", foto: "hogaza-integral.jpg", alt: "Hogaza integral cortada sobre una tabla"},
    {id: "rolls", nombre: "Roll de canela", precio: 2300, peso: "110 g", horario: "16:00", desc: "Masa brioche, canela de Ceilán y glaseado de queso crema.", foto: "rolls.jpg", alt: "Rolls de canela espolvoreados con azúcar"}
  ];
  const DIAS = [["Lunes", null, null], ["Martes", "07:00", "20:00"], ["Miércoles", "07:00", "20:00"], ["Jueves", "07:00", "20:00"], ["Viernes", "07:00", "20:00"], ["Sábado", "08:00", "20:00"], ["Domingo", "08:00", "14:00"]];
  const WHATSAPP = "5491100000000";
  const VOCES = [
    {txt: "La hogaza me dura toda la semana. Ya no compro pan en <em>otro lado.</em>", who: "Martina · vecina de Villa Crespo"},
    {txt: "Encargo la caja el viernes y el sábado a las ocho está <em>lista y tibia.</em>", who: "Diego · cliente desde 2021"},
    {txt: "El de centeno es el único pan que le cae bien <em>a mi viejo.</em>", who: "Paula · reseña en Google"}
  ];

  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = s => document.querySelector(s);
  const money = n => "$ " + n.toLocaleString("es-AR");
  const toMin = h => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
  const pad = n => String(n).padStart(2, "0");

  /* ---------- hora de Buenos Aires ---------- */
  const parts = new Intl.DateTimeFormat("es-AR", {timeZone: "America/Argentina/Buenos_Aires", weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false}).formatToParts(new Date());
  const g = t => parts.find(p => p.type === t)?.value;
  const diaHoy = g("weekday").replace(/^./, c => c.toUpperCase());
  const minHoy = (+g("hour") % 24) * 60 + +g("minute");
  const hoy = DIAS.find(d => d[0] === diaHoy) || DIAS[1];
  const abierto = !!hoy[1] && minHoy >= toMin(hoy[1]) && minHoy < toMin(hoy[2]);
  $("#hoy-fecha").textContent = new Intl.DateTimeFormat("es-AR", {timeZone: "America/Argentina/Buenos_Aires", weekday: "long", day: "numeric", month: "long"}).format(new Date());

  /* ---------- vitrina ---------- */
  const lista = $("#piezas");
  PIEZAS.forEach((p, i) => {
    const salio = !p.agotado && abierto && minHoy >= toMin(p.horario);
    const estado = p.agotado ? "Agotada · vuelve mañana" : salio ? "En vitrina" : `Sale a las ${p.horario}`;
    const li = document.createElement("li");
    li.className = "pieza" + (p.agotado ? " is-agotado" : "");
    li.innerHTML = `
      <figure class="pieza-foto"><img src="img/${p.foto}" alt="${p.alt}" loading="lazy" width="600" height="600"></figure>
      <div class="pieza-txt">
        <p class="pieza-meta mono"><span>N° ${pad(i + 1)}</span><span class="${salio ? "live" : ""}">${estado}</span></p>
        <h3>${p.nombre}</h3>
        <p class="pieza-desc">${p.desc}</p>
        <div class="pieza-acc">
          <p class="mono"><b>${money(p.precio)}</b> · ${p.peso}</p>
          <button type="button" class="add" data-id="${p.id}" aria-pressed="false" aria-label="Sumar ${p.nombre} a la caja">Sumar</button>
        </div>
      </div>`;
    lista.appendChild(li);
  });

  /* ---------- la caja ---------- */
  const caja = new Map();
  try { JSON.parse(sessionStorage.getItem("miga-caja") || "[]").forEach(([k, v]) => { if (PIEZAS.some(p => p.id === k)) caja.set(k, v); }); } catch (e) {}
  const col = $("#caja-col"), box = $("#caja"), slots = $("#slots"), lineas = $("#lineas");
  const enviar = $("#enviar"), toggle = $("#caja-toggle");
  $("#caja-num").textContent = pad(new Date().getDate()) + pad(new Date().getMonth() + 1);
  const pieza = id => PIEZAS.find(p => p.id === id);

  function render(nuevo) {
    const n = [...caja.values()].reduce((a, b) => a + b, 0);
    let total = 0;

    // lugares de la caja: de a seis, se agranda sola
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
        if (nuevo && id === nuevo && k === fichas.lastIndexOf(id) && !reduce) s.classList.add("cae");
      }
      slots.appendChild(s);
    }

    lineas.innerHTML = n ? "" : `<li class="vacio">Todavía no elegiste nada.</li>`;
    for (const [id, q] of caja) {
      const p = pieza(id); const sub = p.precio * q; total += sub;
      const li = document.createElement("li");
      li.innerHTML = `<span class="ln">${p.nombre}${p.agotado ? "<small>para mañana</small>" : ""}</span>
        <span class="qty"><button type="button" data-q="-1" data-id="${id}" aria-label="Sacar una ${p.nombre}">−</button><output aria-label="Cantidad de ${p.nombre}">${q}</output><button type="button" data-q="1" data-id="${id}" aria-label="Sumar una ${p.nombre}">+</button></span>
        <span class="sub mono">${money(sub)}</span>`;
      lineas.appendChild(li);
    }
    $("#total").textContent = money(total);
    $("#ct-total").textContent = money(total);
    $("#ct-n").textContent = n;
    const bc = $("#box-count"); bc.textContent = n;
    if (nuevo && !reduce) { bc.classList.remove("bump"); void bc.offsetWidth; bc.classList.add("bump"); }
    col.classList.toggle("has-items", n > 0);

    document.querySelectorAll(".add").forEach(b => {
      const q = caja.get(b.dataset.id) || 0; const p = pieza(b.dataset.id);
      b.setAttribute("aria-pressed", q > 0);
      b.textContent = q ? `En la caja · ${q}` : (p.agotado ? "Reservar" : "Sumar");
      b.setAttribute("aria-label", q ? `${p.nombre}: ${q} en la caja. Sumar otra` : `Sumar ${p.nombre} a la caja`);
    });

    enviar.setAttribute("aria-disabled", n ? "false" : "true");
    $("#nota").textContent = n ? "Se abre WhatsApp con el pedido escrito. Lo confirmás vos." : "Tu caja está vacía. Sumá una pieza de la vitrina.";
    if (!n) cerrar();
    try { sessionStorage.setItem("miga-caja", JSON.stringify([...caja])); } catch (e) {}

    const retiro = document.querySelector('input[name="retiro"]:checked').value;
    const nombre = $("#nombre").value.trim();
    let msg = "¡Hola Miga! Quiero encargar esta caja:\n";
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
    (lineas.querySelector(`[data-id="${b.dataset.id}"][data-q="${b.dataset.q}"]`) || enviar).focus();
  });
  document.querySelectorAll('input[name="retiro"]').forEach(r => r.addEventListener("change", () => render()));
  $("#nombre").addEventListener("input", () => render());
  enviar.addEventListener("click", e => { if (enviar.getAttribute("aria-disabled") === "true") e.preventDefault(); });

  /* hoja inferior en celular y tablet */
  const mq = matchMedia("(max-width: 1023px)");
  function abrir() { col.classList.add("is-open"); toggle.setAttribute("aria-expanded", "true"); box.focus(); }
  function cerrar() { col.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
  toggle.addEventListener("click", () => col.classList.contains("is-open") ? cerrar() : abrir());
  document.addEventListener("keydown", e => { if (e.key === "Escape" && col.classList.contains("is-open")) { cerrar(); toggle.focus(); } });
  document.addEventListener("click", e => { if (mq.matches && col.classList.contains("is-open") && !col.contains(e.target) && !e.target.closest("#box-btn,#ver-caja,.add")) cerrar(); });
  function verCaja() {
    const go = () => $("#vitrina").scrollIntoView({behavior: reduce ? "auto" : "smooth"});
    if (mq.matches) { caja.size ? abrir() : go(); }
    else { go(); setTimeout(() => box.focus({preventScroll: true}), reduce ? 0 : 600); }
  }
  $("#box-btn").addEventListener("click", verCaja);
  $("#ver-caja").addEventListener("click", verCaja);
  render();

  /* ---------- revelados al scrollear ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), {threshold: .2});
  document.querySelectorAll(".pieza, .tiempo, .manifiesto p, .visita-foto").forEach(el => { el.classList.add("reveal"); io.observe(el); });

  /* nav: fondo sólido al bajar */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-solid", scrollY > 24);
  addEventListener("scroll", onScroll, {passive: true}); onScroll();

  /* ---------- voces ---------- */
  const vNav = $("#voz-nav");
  let vi = 0;
  function voz(i) {
    vi = i;
    $("#voz-txt").innerHTML = `“${VOCES[i].txt}”`;
    $("#voz-who").textContent = VOCES[i].who;
    vNav.querySelectorAll("button").forEach((b, k) => b.setAttribute("aria-pressed", k === i));
  }
  VOCES.forEach((v, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = pad(i + 1);
    b.setAttribute("aria-label", `Reseña ${i + 1} de ${VOCES.length}`);
    b.addEventListener("click", () => voz(i));
    vNav.appendChild(b);
  });
  voz(0);

  /* ---------- visita ---------- */
  $("#horarios").innerHTML = DIAS.map(d => `<tr class="${d[0] === diaHoy ? "hoy" : ""}"><th scope="row">${d[0]}${d[0] === diaHoy ? " <span class='mono'>· hoy</span>" : ""}</th><td class="mono">${d[1] ? d[1] + " — " + d[2] : "Cerrado"}</td></tr>`).join("");
  $("#estado").classList.add(abierto ? "abierto" : "cerrado");
  $("#estado-txt").textContent = abierto ? `Abierto ahora · cierra a las ${hoy[2]}` : "Cerrado ahora · tomamos encargos por WhatsApp";
})();
