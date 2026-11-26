(() => {
  const PRODUCTOS = [
    {id:"hogaza",nombre:"Hogaza de campo",precio:6800,descripcion:"1 kg, 78 % de hidratación. Corteza crocante y miga abierta.",horario:"7:00",etiqueta:"Recién salida",recienSalido:true,agotado:false,foto:"hogaza.jpg",alt:"Hogaza de campo con corteza dorada y cortes"},
    {id:"medialunas",nombre:"Medialunas",precio:950,descripcion:"Laminadas a mano con manteca. La docena sale $ 10.500.",horario:"7:40",etiqueta:"Recién salidas",recienSalido:true,agotado:false,foto:"medialunas.jpg",alt:"Medialunas de manteca sobre fondo oscuro"},
    {id:"centeno",nombre:"Centeno y semillas",precio:7400,descripcion:"50 % centeno, lino, girasol y sésamo. Dura una semana.",horario:"9:30",etiqueta:"Sale a las 9:30",recienSalido:false,agotado:false,foto:"centeno.jpg",alt:"Pan de centeno cortado en rodajas"},
    {id:"integral",nombre:"Hogaza integral",precio:7100,descripcion:"70 % harina integral, miga húmeda y corteza fina. 900 g.",horario:"11:00",etiqueta:"Sale a las 11:00",recienSalido:false,agotado:false,foto:"hogaza-integral.jpg",alt:"Hogaza integral cortada sobre una tabla"},
    {id:"rolls",nombre:"Rolls de canela",precio:2300,descripcion:"Masa brioche y glaseado de queso crema.",horario:"16:00",etiqueta:"Sale a las 16:00",recienSalido:false,agotado:false,foto:"rolls.jpg",alt:"Rolls de canela espolvoreados con azúcar"},
    {id:"baguette",nombre:"Baguette",precio:2900,descripcion:"Agotada por hoy. Sumala y te la guardamos para mañana.",horario:"8:00",etiqueta:"Vuelve mañana 8:00",recienSalido:false,agotado:true,foto:"baguette.jpg",alt:"Baguettes doradas sobre la mesada"}
  ];
  const HORARIOS = {whatsapp:"5491100000000",dias:[["Lunes",null,null],["Martes","07:00","20:00"],["Miércoles","07:00","20:00"],["Jueves","07:00","20:00"],["Viernes","07:00","20:00"],["Sábado","08:00","20:00"],["Domingo","08:00","14:00"]]};
  const RESENAS = [
    {texto:"La hogaza me dura toda la semana. Ya no compro pan en",destacado:"otro lado.",autor:"Martina, vecina de Villa Crespo"},
    {texto:"Armo el pedido el viernes y el sábado está",destacado:"listo y calentito.",autor:"Diego, cliente desde 2021"},
    {texto:"El de centeno es el único pan que le cae bien",destacado:"a mi viejo.",autor:"Paula, reseña en Google"}
  ];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = s => document.querySelector(s);
  const money = n => "$ " + n.toLocaleString("es-AR");
  const toMin = h => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };

  /* hora de Buenos Aires */
  function ahoraBA() {
    const parts = new Intl.DateTimeFormat("es-AR", {timeZone: "America/Argentina/Buenos_Aires", weekday: "long", hour: "2-digit", minute: "2-digit", hour12: false}).formatToParts(new Date());
    const g = t => parts.find(p => p.type === t)?.value;
    const dia = g("weekday"); const h = +g("hour") % 24; const m = +g("minute");
    return {dia: dia.charAt(0).toUpperCase() + dia.slice(1), min: h * 60 + m, txt: String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0")};
  }
  const now = ahoraBA();
  const hoy = HORARIOS.dias.find(d => d[0] === now.dia) || HORARIOS.dias[1];
  const abierto = hoy[1] && now.min >= toMin(hoy[1]) && now.min < toMin(hoy[2]);

  /* ---------- pizarra ---------- */
  const line = $("#line");
  const orden = [...PRODUCTOS].sort((a, b) => toMin(a.horario) - toMin(b.horario));
  const D0 = 7 * 60, D1 = 20 * 60;
  orden.forEach(p => {
    const li = document.createElement("li");
    const salio = !p.agotado && hoy[1] && now.min >= toMin(p.horario);
    li.className = (salio ? "salio" : "") + (p.agotado ? " agotado" : "");
    li.innerHTML = `<b>${p.horario}</b>${p.nombre}`;
    line.appendChild(li);
  });
  const salieron = orden.filter(p => !p.agotado && hoy[1] && now.min >= toMin(p.horario));
  const proximo = orden.find(p => !p.agotado && now.min < toMin(p.horario));
  $("#ahora-clock").textContent = now.txt;
  const st = $("#ahora-status");
  if (!abierto) {
    st.classList.add("cerrado");
    $("#ahora-txt").textContent = "Horno apagado. Tomamos encargos por WhatsApp para mañana.";
  } else {
    $("#ahora-txt").textContent = `Ya salieron ${salieron.length} de ${PRODUCTOS.length}.` + (proximo ? ` Lo próximo: ${proximo.nombre.toLowerCase()} a las ${proximo.horario}.` : " Ya salió todo lo del día.");
  }
  // cada horneada ocupa una columna; "ahora" se ubica entre la anterior y la siguiente
  const ts = orden.map(p => toMin(p.horario)).concat(D1);
  let pct = 0;
  for (let i = 0; i < orden.length; i++) if (now.min >= ts[i]) pct = (i + Math.min(1, (now.min - ts[i]) / (ts[i + 1] - ts[i]))) / orden.length;
  requestAnimationFrame(() => line.style.setProperty("--p", (abierto ? pct * 100 : 0) + "%"));
  if (!abierto) line.querySelector(".now").style.display = "none";

  /* ---------- menú ---------- */
  const menu = $("#menu");
  PRODUCTOS.forEach(p => {
    const li = document.createElement("li");
    li.className = "item" + (p.agotado ? " is-agotado" : "");
    li.innerHTML = `
      <p class="hora">${p.horario}<small class="${p.recienSalido ? "fresh" : ""}">${p.recienSalido ? "● " : ""}${p.etiqueta}</small></p>
      <div class="foto"><img src="img/${p.foto}" alt="${p.alt}" loading="lazy" width="300" height="300"></div>
      <div><h3>${p.nombre}</h3><p class="desc">${p.descripcion}</p></div>
      <div class="acc"><span class="precio">${money(p.precio)}</span>
        <button type="button" class="add" data-id="${p.id}" aria-pressed="false">${p.agotado ? "+ Encargar para mañana" : "+ Sumar al pedido"}</button></div>`;
    menu.appendChild(li);
  });

  /* ---------- ticket ---------- */
  const cart = new Map();
  try { JSON.parse(sessionStorage.getItem("miga-cart") || "[]").forEach(([k, v]) => cart.set(k, v)); } catch (e) {}
  const col = $("#ticket-col"), ticket = $("#ticket"), lines = $("#t-lines");
  const send = $("#t-send"), toggle = $("#ticket-toggle");
  const fecha = new Intl.DateTimeFormat("es-AR", {timeZone: "America/Argentina/Buenos_Aires", weekday: "short", day: "2-digit", month: "2-digit"}).format(new Date());
  $("#t-fecha").textContent = fecha;

  function render(changedId) {
    const n = [...cart.values()].reduce((a, b) => a + b, 0);
    let total = 0;
    lines.innerHTML = "";
    if (!n) lines.innerHTML = `<li class="t-empty">Tu ticket está en blanco.</li>`;
    for (const [id, q] of cart) {
      const p = PRODUCTOS.find(x => x.id === id); const sub = p.precio * q; total += sub;
      const li = document.createElement("li");
      li.className = "t-line";
      if (id !== changedId) li.style.animation = "none";
      li.innerHTML = `<span class="n">${p.nombre}${p.agotado ? "<small>para mañana</small>" : ""}</span><span class="sub">${money(sub)}</span>
        <span class="qty"><button type="button" data-q="-1" data-id="${id}" aria-label="Sacar una ${p.nombre}">−</button><output aria-label="Cantidad de ${p.nombre}">${q}</output><button type="button" data-q="1" data-id="${id}" aria-label="Sumar una ${p.nombre}">+</button></span>`;
      lines.appendChild(li);
    }
    $("#t-total").textContent = money(total);
    $("#tt-total").textContent = money(total);
    $("#tt-n").textContent = n;
    const bc = $("#bag-count"); bc.textContent = n;
    if (changedId && !reduce) { bc.classList.remove("bump"); void bc.offsetWidth; bc.classList.add("bump"); }
    ticket.classList.toggle("has-items", n > 0);
    col.classList.toggle("has-items", n > 0);
    document.querySelectorAll(".add").forEach(b => {
      const q = cart.get(b.dataset.id) || 0; const p = PRODUCTOS.find(x => x.id === b.dataset.id);
      b.setAttribute("aria-pressed", q > 0);
      b.textContent = q ? `✓ En tu pedido (${q})` : (p.agotado ? "+ Encargar para mañana" : "+ Sumar al pedido");
    });
    send.setAttribute("aria-disabled", n ? "false" : "true");
    $("#t-note").textContent = n ? "Se abre WhatsApp con el pedido escrito. Lo confirmás vos." : "Sumá algo del horno para armar el ticket.";
    if (!n) closeSheet();
    try { sessionStorage.setItem("miga-cart", JSON.stringify([...cart])); } catch (e) {}
    buildLink(total);
  }
  function buildLink(total) {
    const retiro = document.querySelector('input[name="retiro"]:checked').value;
    const nombre = $("#t-nombre").value.trim();
    let msg = "¡Hola Miga! Quiero encargar:\n";
    for (const [id, q] of cart) { const p = PRODUCTOS.find(x => x.id === id); msg += `• ${q} × ${p.nombre}${p.agotado ? " (para mañana)" : ""} · ${money(p.precio * q)}\n`; }
    msg += `Total: ${money(total)}\nRetiro: ${retiro === "hoy" ? "hoy, antes de las 20 h" : "mañana"}`;
    if (nombre) msg += `\nA nombre de: ${nombre}`;
    send.href = `https://wa.me/${HORARIOS.whatsapp}?text=${encodeURIComponent(msg)}`;
  }
  function change(id, d) {
    const q = (cart.get(id) || 0) + d;
    if (q <= 0) cart.delete(id); else cart.set(id, q);
    render(d > 0 ? id : null);
  }
  menu.addEventListener("click", e => { const b = e.target.closest(".add"); if (b) change(b.dataset.id, 1); });
  lines.addEventListener("click", e => {
    const b = e.target.closest("[data-q]"); if (!b) return;
    const id = b.dataset.id; change(id, +b.dataset.q);
    const again = lines.querySelector(`[data-id="${id}"][data-q="${b.dataset.q}"]`);
    (again || send).focus();
  });
  document.querySelectorAll('input[name="retiro"]').forEach(r => r.addEventListener("change", () => render()));
  $("#t-nombre").addEventListener("input", () => render());
  send.addEventListener("click", e => { if (send.getAttribute("aria-disabled") === "true") e.preventDefault(); });

  /* hoja en celular */
  const mq = matchMedia("(max-width: 1060px)");
  function openSheet() { col.classList.add("is-open"); toggle.setAttribute("aria-expanded", "true"); document.body.classList.add("sheet-open"); ticket.focus(); }
  function closeSheet() { col.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); document.body.classList.remove("sheet-open"); }
  toggle.addEventListener("click", () => col.classList.contains("is-open") ? closeSheet() : openSheet());
  document.addEventListener("keydown", e => { if (e.key === "Escape" && col.classList.contains("is-open")) { closeSheet(); toggle.focus(); } });
  document.addEventListener("click", e => { if (mq.matches && col.classList.contains("is-open") && !col.contains(e.target) && !e.target.closest("#bag-btn,#ver-pedido,.add,[data-q]")) closeSheet(); });
  function showTicket() {
    if (mq.matches) { if (cart.size) openSheet(); else $("#horno").scrollIntoView({behavior: reduce ? "auto" : "smooth"}); }
    else { $("#horno").scrollIntoView({behavior: reduce ? "auto" : "smooth"}); setTimeout(() => ticket.focus({preventScroll: true}), reduce ? 0 : 500); }
  }
  $("#bag-btn").addEventListener("click", showTicket);
  $("#ver-pedido").addEventListener("click", showTicket);
  render();

  /* ---------- proceso: cada paso se enciende al llegar, como un reloj que avanza ---------- */
  const pasos = [...document.querySelectorAll(".paso")];
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-on"); io.unobserve(e.target); } }), {threshold: .55});
  pasos.forEach(p => io.observe(p));

  /* ---------- reseñas ---------- */
  $("#notas").innerHTML = RESENAS.map(r => `<li class="nota"><p class="estrellas" aria-label="5 de 5">★★★★★</p><blockquote><p>“${r.texto} <em>${r.destacado}</em>”</p></blockquote><p class="who">${r.autor}</p></li>`).join("");

  /* ---------- visitanos ---------- */
  $("#horarios").innerHTML = HORARIOS.dias.map(d => `<tr class="${d[0] === now.dia ? "hoy" : ""}"><td>${d[0]}${d[0] === now.dia ? " · hoy" : ""}</td><td>${d[1] ? d[1] + " a " + d[2] : "Cerrado"}</td></tr>`).join("");
  const est = $("#estado");
  est.classList.add(abierto ? "abierto" : "cerrado");
  $("#estado-txt").textContent = abierto ? `Abierto ahora · cierra a las ${hoy[2]}` : "Cerrado ahora · tomamos encargos por WhatsApp";
})();
