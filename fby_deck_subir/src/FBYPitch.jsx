import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════════════════
   DATOS ILUSTRATIVOS — modelo sintético construido para la demo.
   No representan métricas reales de ningún cliente. Los patrones
   estructurales (decaimiento de vistas por cohorte, concentración en
   una coach ancla, categorías subproducidas, picos horarios) son los
   que se observan típicamente en plataformas de fitness on-demand.
   ══════════════════════════════════════════════════════════════════════ */

const S = {
  general: { clases: 1180, vistas: 4180000, comentarios: 19400, coaches: 24, promVistas: 3542, clasesConComments: 842 },
  porAnio: [
    { year: 2021, clases: 160, prom: 14200 },
    { year: 2022, clases: 225, prom: 5100 },
    { year: 2023, clases: 210, prom: 2950 },
    { year: 2024, clases: 265, prom: 980 },
    { year: 2025, clases: 290, prom: 310 },
    { year: 2026, clases: 30, prom: 240 },
  ],
  porCoach: [
    { name: "Vale Ortiz", clases: 462, vistas: 3350000, prom: 7251, comments: 10900, tipo: "main" },
    { name: "Nadia Ferrer", clases: 128, vistas: 61000, prom: 477, comments: 980, tipo: "main" },
    { name: "Sofi Lara", clases: 96, vistas: 362000, prom: 3771, comments: 2210, tipo: "main" },
    { name: "Renata Ruiz", clases: 78, vistas: 121000, prom: 1551, comments: 1180, tipo: "main" },
    { name: "Mia Cordero", clases: 51, vistas: 19800, prom: 388, comments: 860, tipo: "main" },
    { name: "Ximena Bravo", clases: 44, vistas: 5100, prom: 116, comments: 190, tipo: "main" },
    { name: "Paulina Sada", clases: 24, vistas: 4100, prom: 171, comments: 380, tipo: "main" },
    { name: "Antonia Rey", clases: 22, vistas: 38000, prom: 1727, comments: 350, tipo: "inv" },
    { name: "Lía Moreno", clases: 11, vistas: 58000, prom: 5273, comments: 265, tipo: "inv" },
  ],
  sentimentCoach: [
    { name: "Renata Ruiz", pos: 55.8, neutral: 38.9, intenso: 2.3, pedido: 3.0 },
    { name: "Mia Cordero", pos: 54.1, neutral: 37.2, intenso: 2.1, pedido: 6.6 },
    { name: "Antonia Rey", pos: 52.4, neutral: 38.6, intenso: 0.7, pedido: 8.3 },
    { name: "Sofi Lara", pos: 49.1, neutral: 44.0, intenso: 4.6, pedido: 2.3 },
    { name: "Vale Ortiz", pos: 41.6, neutral: 50.2, intenso: 6.8, pedido: 1.4 },
    { name: "Paulina Sada", pos: 32.5, neutral: 58.5, intenso: 6.0, pedido: 3.0 },
  ],
  horaPico: [
    { h: 0, n: 88 }, { h: 1, n: 45 }, { h: 2, n: 38 }, { h: 3, n: 46 }, { h: 4, n: 101 }, { h: 5, n: 424 },
    { h: 6, n: 1036 }, { h: 7, n: 1542 }, { h: 8, n: 2035 }, { h: 9, n: 1998 }, { h: 10, n: 1582 }, { h: 11, n: 1255 },
    { h: 12, n: 1024 }, { h: 13, n: 1008 }, { h: 14, n: 852 }, { h: 15, n: 535 }, { h: 16, n: 438 }, { h: 17, n: 566 },
    { h: 18, n: 859 }, { h: 19, n: 990 }, { h: 20, n: 1082 }, { h: 21, n: 829 }, { h: 22, n: 562 }, { h: 23, n: 377 },
  ],
  topUsers: [
    { name: "Fernanda", n: 402 }, { name: "Regina", n: 398 }, { name: "Valeria", n: 331 }, { name: "Camila", n: 290 },
    { name: "Elisa", n: 272 }, { name: "Bárbara", n: 230 }, { name: "Julia", n: 207 }, { name: "Carla", n: 204 },
    { name: "Ana", n: 186 }, { name: "Marifer", n: 185 },
  ],
  porDia: [
    { d: "Lunes", n: 3190 }, { d: "Martes", n: 3450 }, { d: "Miércoles", n: 3470 }, { d: "Jueves", n: 3290 },
    { d: "Viernes", n: 2830 }, { d: "Sábado", n: 1865 }, { d: "Domingo", n: 1285 },
  ],
  sentiment: { positivo: 8960, neutral: 8870, intenso: 660, pedido: 585, intenso_pos: 319 },
  topWords: [
    { w: "clase", n: 3650 }, { w: "buena", n: 1330 }, { w: "encantó", n: 1287 }, { w: "gracias", n: 1020 },
    { w: "deli", n: 998 }, { w: "buenísima", n: 912 }, { w: "súper", n: 576 }, { w: "wow", n: 566 },
    { w: "excelente", n: 497 }, { w: "amo", n: 480 }, { w: "favoritas", n: 384 }, { w: "playlist", n: 301 },
    { w: "música", n: 262 }, { w: "cortita", n: 244 }, { w: "energía", n: 203 }, { w: "intensa", n: 200 },
  ],
  emojis: [
    { e: "🔥", n: 2985 }, { e: "👏", n: 1058 }, { e: "🥵", n: 1040 }, { e: "💪", n: 882 }, { e: "❤", n: 846 },
    { e: "👌", n: 583 }, { e: "🙌", n: 494 }, { e: "🤩", n: 469 }, { e: "🫶", n: 439 }, { e: "😅", n: 412 },
    { e: "😍", n: 349 }, { e: "🍑", n: 239 }, { e: "💥", n: 180 },
  ],
  musica: { total: 686, positiva: 384, negativa: 26, neutra: 276 },
  topLiked: [
    { text: "La música está muy fuerte y tapa la voz de la coach", likes: 11, user: "Ana G." },
    { text: "Muy buena, pero va demasiado rápido — me perdí en la segunda serie", likes: 9, user: "Regina M." },
    { text: "¿Alguien más quedó temblando con el último bloque? 🐼", likes: 8, user: "Elisa V." },
    { text: "Faltó trabajar el lado interno de la pierna, ¿no?", likes: 7, user: "Julia R." },
    { text: "Tip: se puede sustituir la mancuerna por una botella de 2L", likes: 7, user: "Carla P." },
    { text: "Buenísima, pero ¿qué onda con la playlist de hoy? jaja", likes: 6, user: "Bárbara S." },
  ],
  effGap: [
    { tag: "Baile", eff: 3, vol: 13, gap: 10, vis: 2870, cl: 21 },
    { tag: "Postparto", eff: 8, vol: 14, gap: 6, vis: 1450, cl: 5 },
    { tag: "Estiramiento", eff: 6, vol: 11, gap: 5, vis: 2180, cl: 30 },
    { tag: "HIIT", eff: 1, vol: 2, gap: 1, vis: 8300, cl: 228 },
    { tag: "Fuerza", eff: 4, vol: 4, gap: 0, vis: 2610, cl: 160 },
    { tag: "Jumping", eff: 12, vol: 8, gap: -4, vis: 350, cl: 47 },
    { tag: "Movilidad", eff: 14, vol: 9, gap: -5, vis: 65, cl: 40 },
    { tag: "Yoga", eff: 11, vol: 3, gap: -8, vis: 720, cl: 165 },
  ],
};

const YEARLY = {
  all: {
    label: "Todo (2021-2026)", clases: 1180,
    tipo: [
      { tag: "Funcional", cl: 590, vis: 6100, comm: 22.4 }, { tag: "HIIT", cl: 228, vis: 8300, comm: 24.1 },
      { tag: "Yoga", cl: 165, vis: 720, comm: 8.9 }, { tag: "Fuerza", cl: 160, vis: 2610, comm: 21.5 },
      { tag: "Cardio", cl: 102, vis: 2540, comm: 8.7 }, { tag: "Barre", cl: 72, vis: 1580, comm: 15.2 },
      { tag: "Pilates", cl: 58, vis: 1010, comm: 17.4 }, { tag: "Jumping", cl: 47, vis: 350, comm: 5.2 },
      { tag: "Movilidad", cl: 40, vis: 65, comm: 5.4 }, { tag: "Spinning", cl: 35, vis: 840, comm: 9.6 },
      { tag: "Estiramiento", cl: 30, vis: 2180, comm: 15.6 }, { tag: "Baile", cl: 21, vis: 2870, comm: 20.1 },
      { tag: "Box", cl: 6, vis: 160, comm: 15.4 }, { tag: "Postparto", cl: 5, vis: 1450, comm: 8.1 },
    ],
    musculo: [
      { t: "Full body", cl: 640, vis: 2380 }, { t: "Pierna", cl: 168, vis: 5800 }, { t: "Brazo", cl: 160, vis: 6120 },
      { t: "Glúteo", cl: 160, vis: 5150 }, { t: "ABS", cl: 154, vis: 6140 }, { t: "Espalda", cl: 36, vis: 1540 },
      { t: "Pecho", cl: 22, vis: 1690 },
    ],
    equipo: [
      { t: "Booty bands", cl: 78, vis: 9020 }, { t: "Sliders", cl: 59, vis: 8850 }, { t: "Polainas", cl: 178, vis: 5290 },
      { t: "Mancuernas", cl: 596, vis: 5000 }, { t: "Step", cl: 84, vis: 4910 }, { t: "Silla", cl: 130, vis: 4320 },
      { t: "Ligas", cl: 152, vis: 3500 }, { t: "Sin equipo", cl: 375, vis: 2960 },
    ],
    duracion: [
      { d: "10-15", cl: 234, vis: 3380, comm: 9.4 }, { d: "20-25", cl: 199, vis: 1730, comm: 12.1 },
      { d: "30-35", cl: 302, vis: 3990, comm: 19.9 }, { d: "40-45", cl: 248, vis: 4960, comm: 23.4 },
      { d: "50-60", cl: 185, vis: 6740, comm: 24.6 },
    ],
    coach: [
      { n: "Vale Ortiz", cl: 462, vis: 7251, comm: 24.6 }, { n: "Lía Moreno", cl: 11, vis: 5273, comm: 22.7 },
      { n: "Sofi Lara", cl: 96, vis: 3771, comm: 26.1 }, { n: "Renata Ruiz", cl: 78, vis: 1551, comm: 15.6 },
      { n: "Nadia Ferrer", cl: 128, vis: 477, comm: 6.2 },
    ],
    top: [
      { t: "Lower Body 01", c: "Vale Ortiz", v: 38200, cm: 50 }, { t: "Empieza Aquí 01", c: "Vale Ortiz", v: 37600, cm: 48 },
      { t: "Lower Body 02", c: "Vale Ortiz", v: 37100, cm: 47 }, { t: "Brazos 04", c: "Vale Ortiz", v: 33400, cm: 49 },
      { t: "Full Body 01", c: "Vale Ortiz", v: 29800, cm: 46 },
    ],
    insight: null,
    gems: [
      { tag: "Baile", rank_eff: 3, rank_vol: 13, gap: 10, vis: 2870, cl: 21, star: "21 clases con 2,870 vis promedio. Una coach invitada concentra el 60% de esas vistas con 11 clases. Categoría estructuralmente subproducida." },
      { tag: "Estiramiento", rank_eff: 6, rank_vol: 11, gap: 5, vis: 2180, cl: 30, star: "30 clases, 2,180 vis promedio y 15.6 comentarios por clase. Costo de producción bajo, retorno alto." },
      { tag: "Postparto", rank_eff: 8, rank_vol: 14, gap: 6, vis: 1450, cl: 5, star: "Nicho con solo 5 clases y 1,450 vis promedio. Alta intención de compra, cero oferta." },
    ],
  },
  2021: {
    label: "2021", clases: 160,
    tipo: [{ tag: "Funcional", cl: 152, vis: 14600, comm: 29.8 }, { tag: "HIIT", cl: 84, vis: 14900, comm: 29.4 }, { tag: "Cardio", cl: 11, vis: 10300, comm: 0 }, { tag: "Baile", cl: 2, vis: 14100, comm: 23.7 }, { tag: "Yoga", cl: 5, vis: 3600, comm: 16.8 }],
    musculo: [{ t: "Brazo", cl: 26, vis: 17400 }, { t: "Pierna", cl: 27, vis: 17300 }, { t: "ABS", cl: 29, vis: 15300 }, { t: "Glúteo", cl: 31, vis: 11700 }, { t: "Full body", cl: 49, vis: 11500 }],
    equipo: [{ t: "Ligas", cl: 8, vis: 17000 }, { t: "Booty bands", cl: 26, vis: 16500 }, { t: "Mancuernas", cl: 91, vis: 15200 }, { t: "Sliders", cl: 26, vis: 14500 }, { t: "Sin equipo", cl: 38, vis: 13000 }],
    duracion: [{ d: "40-45", cl: 31, vis: 18500, comm: 43.2 }, { d: "30-35", cl: 35, vis: 16100, comm: 39.9 }, { d: "50-60", cl: 48, vis: 15400, comm: 37.7 }, { d: "10-15", cl: 45, vis: 8500, comm: 1.8 }],
    coach: [{ n: "Vale Ortiz", cl: 154, vis: 14500, comm: 29.7 }, { n: "Lía Moreno", cl: 2, vis: 14100, comm: 23.7 }],
    top: [{ t: "Lower Body 01", c: "Vale Ortiz", v: 38200, cm: 50 }, { t: "Lower Body 02", c: "Vale Ortiz", v: 37100, cm: 47 }, { t: "Brazos 04", c: "Vale Ortiz", v: 33400, cm: 49 }, { t: "Shake 01", c: "Lía Moreno", v: 16800, cm: 51 }],
    insight: "Cohorte fundadora: una sola coach produce el 96% del catálogo. Las clases de este año siguen capturando la mayoría de las vistas históricas — no porque sean mejores, sino porque llevan 5 años acumulando.",
    gems: null,
  },
  2022: {
    label: "2022", clases: 225,
    tipo: [{ tag: "Fuerza", cl: 33, vis: 7200, comm: 28.6 }, { tag: "Funcional", cl: 108, vis: 6200, comm: 20.8 }, { tag: "HIIT", cl: 34, vis: 5900, comm: 16.9 }, { tag: "Baile", cl: 5, vis: 3700, comm: 27.4 }, { tag: "Barre", cl: 17, vis: 3300, comm: 14.8 }, { tag: "Cardio", cl: 33, vis: 3050, comm: 11.4 }, { tag: "Yoga", cl: 21, vis: 2520, comm: 16.2 }],
    musculo: [{ t: "Brazo", cl: 29, vis: 7250 }, { t: "ABS", cl: 33, vis: 6700 }, { t: "Pierna", cl: 31, vis: 6400 }, { t: "Glúteo", cl: 33, vis: 5900 }, { t: "Full body", cl: 128, vis: 4100 }],
    equipo: [{ t: "Ligas", cl: 36, vis: 6200 }, { t: "Step", cl: 9, vis: 6150 }, { t: "Mancuernas", cl: 115, vis: 5750 }, { t: "Silla", cl: 37, vis: 5550 }, { t: "Booty bands", cl: 22, vis: 5500 }],
    duracion: [{ d: "50-60", cl: 34, vis: 6950, comm: 26.5 }, { d: "30-35", cl: 45, vis: 5450, comm: 20.8 }, { d: "40-45", cl: 58, vis: 4980, comm: 22.9 }, { d: "20-25", cl: 34, vis: 4760, comm: 17.9 }, { d: "10-15", cl: 51, vis: 4060, comm: 13.2 }],
    coach: [{ n: "Vale Ortiz", cl: 81, vis: 7900, comm: 22.7 }, { n: "Sofi Lara", cl: 31, vis: 6800, comm: 31.8 }, { n: "Lía Moreno", cl: 5, vis: 3700, comm: 27.4 }, { n: "Renata Ruiz", cl: 15, vis: 3550, comm: 16.1 }],
    top: [{ t: "Empieza Aquí 01", c: "Vale Ortiz", v: 37600, cm: 48 }, { t: "Bold: Glúteo 01", c: "Sofi Lara", v: 22100, cm: 50 }, { t: "Shake 04", c: "Lía Moreno", v: 5900, cm: 48 }],
    insight: "Entra la segunda coach con una serie propia con nombre y estética. Fuerza aparece como la categoría con mejor engagement por clase — señal temprana que no se capitalizó.",
    gems: null,
  },
  2023: {
    label: "2023", clases: 210,
    tipo: [{ tag: "HIIT", cl: 38, vis: 4400, comm: 23.1 }, { tag: "Funcional", cl: 73, vis: 4380, comm: 22.2 }, { tag: "Fuerza", cl: 25, vis: 2800, comm: 20.4 }, { tag: "Baile", cl: 2, vis: 1820, comm: 8.1 }, { tag: "Barre", cl: 25, vis: 1600, comm: 12.9 }, { tag: "Yoga", cl: 19, vis: 1040, comm: 13.9 }],
    musculo: [{ t: "Brazo", cl: 32, vis: 3900 }, { t: "Pierna", cl: 37, vis: 3600 }, { t: "ABS", cl: 31, vis: 3590 }, { t: "Glúteo", cl: 39, vis: 3000 }, { t: "Full body", cl: 61, vis: 2230 }],
    equipo: [{ t: "Mancuernas", cl: 100, vis: 3380 }, { t: "Step", cl: 8, vis: 3250 }, { t: "Ligas", cl: 16, vis: 3120 }, { t: "Sin equipo", cl: 39, vis: 2800 }, { t: "Silla", cl: 33, vis: 2600 }],
    duracion: [{ d: "30-35", cl: 30, vis: 4960, comm: 24.6 }, { d: "40-45", cl: 46, vis: 3070, comm: 20.1 }, { d: "20-25", cl: 25, vis: 3020, comm: 22.5 }, { d: "50-60", cl: 29, vis: 2370, comm: 18.1 }],
    coach: [{ n: "Vale Ortiz", cl: 88, vis: 4290, comm: 21.9 }, { n: "Sofi Lara", cl: 22, vis: 2150, comm: 17.9 }, { n: "Renata Ruiz", cl: 27, vis: 1540, comm: 13.8 }],
    top: [{ t: "Full Body 40", c: "Vale Ortiz", v: 10200, cm: 49 }, { t: "Intermedio 03", c: "Vale Ortiz", v: 9600, cm: 48 }, { t: "ABS 39", c: "Vale Ortiz", v: 9350, cm: 47 }],
    insight: "El bloque de 30-35 minutos se consolida como el punto óptimo. La coach fundadora baja a la mitad del catálogo pero sostiene el engagement.",
    gems: null,
  },
  2024: {
    label: "2024", clases: 265,
    tipo: [{ tag: "Fuerza", cl: 28, vis: 2300, comm: 33.9 }, { tag: "Baile", cl: 4, vis: 1540, comm: 17.1 }, { tag: "HIIT", cl: 38, vis: 1500, comm: 21.9 }, { tag: "Funcional", cl: 84, vis: 1340, comm: 23.1 }, { tag: "Pilates", cl: 22, vis: 800, comm: 18.8 }, { tag: "Barre", cl: 18, vis: 470, comm: 21.2 }, { tag: "Yoga", cl: 60, vis: 260, comm: 7.7 }],
    musculo: [{ t: "Pecho", cl: 5, vis: 2620 }, { t: "Brazo", cl: 35, vis: 1750 }, { t: "Espalda", cl: 13, vis: 1710 }, { t: "Pierna", cl: 27, vis: 1640 }, { t: "ABS", cl: 28, vis: 1390 }, { t: "Full body", cl: 152, vis: 560 }],
    equipo: [{ t: "Booty bands", cl: 4, vis: 3700 }, { t: "Ligas", cl: 35, vis: 1500 }, { t: "Mancuernas", cl: 122, vis: 1410 }, { t: "Polainas", cl: 35, vis: 1320 }],
    duracion: [{ d: "20-25", cl: 41, vis: 1540, comm: 17.3 }, { d: "40-45", cl: 48, vis: 1130, comm: 19.2 }, { d: "30-35", cl: 80, vis: 870, comm: 17.8 }, { d: "50-60", cl: 33, vis: 750, comm: 18.9 }],
    coach: [{ n: "Sofi Lara", cl: 24, vis: 2490, comm: 33.1 }, { n: "Vale Ortiz", cl: 82, vis: 1570, comm: 21.8 }, { n: "Lía Moreno", cl: 4, vis: 1540, comm: 17.1 }, { n: "Mia Cordero", cl: 22, vis: 690, comm: 20.4 }],
    top: [{ t: "Bold: Express Lower 01", c: "Sofi Lara", v: 8200, cm: 50 }, { t: "Bold: Express Push 01", c: "Sofi Lara", v: 7900, cm: 48 }, { t: "Dancing Arms 01", c: "Lía Moreno", v: 1980, cm: 12 }],
    insight: "La segunda coach supera a la fundadora en vistas por clase. El formato de serie corta con marca propia funciona mejor que la clase suelta.",
    gems: null,
  },
  2025: {
    label: "2025", clases: 290,
    tipo: [{ tag: "HIIT", cl: 25, vis: 360, comm: 20.1 }, { tag: "Funcional", cl: 138, vis: 320, comm: 17.1 }, { tag: "Fuerza", cl: 62, vis: 190, comm: 14.9 }, { tag: "Cardio", cl: 26, vis: 142, comm: 10.4 }, { tag: "Pilates", cl: 27, vis: 129, comm: 15.9 }, { tag: "Barralates", cl: 24, vis: 75, comm: 7.6 }, { tag: "Yoga", cl: 56, vis: 60, comm: 4.5 }, { tag: "Movilidad", cl: 29, vis: 55, comm: 6.8 }],
    musculo: [{ t: "Glúteo", cl: 18, vis: 490 }, { t: "Brazo", cl: 30, vis: 425 }, { t: "ABS", cl: 24, vis: 356 }, { t: "Pierna", cl: 37, vis: 294 }, { t: "Full body", cl: 210, vis: 137 }],
    equipo: [{ t: "Booty bands", cl: 3, vis: 440 }, { t: "Polainas", cl: 27, vis: 335 }, { t: "Sliders", cl: 9, vis: 319 }, { t: "Mancuernas", cl: 135, vis: 310 }, { t: "Silla", cl: 23, vis: 312 }],
    duracion: [{ d: "40-45", cl: 54, vis: 328, comm: 20.2 }, { d: "50-60", cl: 34, vis: 324, comm: 15.6 }, { d: "30-35", cl: 95, vis: 212, comm: 13.6 }, { d: "10-15", cl: 44, vis: 156, comm: 8.2 }],
    coach: [{ n: "Vale Ortiz", cl: 55, vis: 625, comm: 24.4 }, { n: "Nadia Ferrer", cl: 55, vis: 99, comm: 6.3 }, { n: "Mia Cordero", cl: 27, vis: 129, comm: 15.9 }],
    top: [{ t: "Brazo 60", c: "Vale Ortiz", v: 1510, cm: 45 }, { t: "Pierna 57", c: "Vale Ortiz", v: 1450, cm: 48 }, { t: "Avanzado Brazo 01", c: "Vale Ortiz", v: 1215, cm: 47 }],
    insight: "Máxima diversificación del catálogo y mínimo alcance por clase. Se produce 1.8x más que en 2021 y cada clase recibe 46x menos vistas. Éste es el problema de discovery, no de producción.",
    gems: null,
  },
  2026: {
    label: "2026 (parcial)", clases: 30,
    tipo: [{ tag: "Funcional", cl: 10, vis: 398, comm: 4.7 }, { tag: "Fuerza", cl: 9, vis: 263, comm: 4.3 }, { tag: "Movilidad", cl: 9, vis: 83, comm: 1.0 }, { tag: "Cardio", cl: 5, vis: 12, comm: 1.5 }],
    musculo: [{ t: "Pierna", cl: 3, vis: 750 }, { t: "Brazo", cl: 3, vis: 678 }, { t: "Glúteo", cl: 2, vis: 273 }, { t: "ABS", cl: 4, vis: 210 }, { t: "Full body", cl: 16, vis: 73 }],
    equipo: [{ t: "Mancuernas", cl: 10, vis: 363 }, { t: "Polainas", cl: 2, vis: 265 }, { t: "Ligas", cl: 5, vis: 219 }, { t: "Sin equipo", cl: 10, vis: 83 }],
    duracion: [{ d: "40-45", cl: 2, vis: 810, comm: 6.9 }, { d: "10-15", cl: 3, vis: 187, comm: 2.0 }, { d: "20-25", cl: 16, vis: 148, comm: 2.4 }],
    coach: [{ n: "Vale Ortiz", cl: 2, vis: 810, comm: 6.9 }, { n: "Sofi Lara", cl: 8, vis: 263, comm: 4.3 }, { n: "Ximena Bravo", cl: 9, vis: 83, comm: 1.0 }],
    top: [{ t: "Legs & Arms 11", c: "Vale Ortiz", v: 1610, cm: 9 }, { t: "Bold: Express Abs 06", c: "Sofi Lara", v: 392, cm: 4 }],
    insight: "Trimestre parcial. La clase con más alcance sigue siendo de la coach fundadora, con 2 clases publicadas.",
    gems: null,
  },
};

/* ══════════════════════ PRIMITIVAS DE UI ══════════════════════ */

export const C = {
  accent: "#FF6F52",   // coral de marca
  accent2: "#FFA189",  // coral claro (series secundarias)
  accent3: "#8C7A70",  // café cálido neutro
  yellow: "#EFD95B",   // amarillo de marca — solo sobre fondos oscuros
  bg: "#ffffff",       // fondo de página
  soft: "#F6F3F1",     // superficies internas (tiles, contenedor del dashboard)
  ink: "#1a1a1a",
  mute: "#999",
};

const fmt = (n) => n?.toLocaleString("es-MX") ?? "—";
const fmtK = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : fmt(n));

const Bar = ({ value, max, color = C.accent, h = 10 }) => (
  <div style={{ background: "#f0ebe8", borderRadius: 6, height: h, width: "100%", overflow: "hidden" }}>
    <div style={{ width: `${Math.min((value / max) * 100, 100)}%`, background: color, height: "100%", borderRadius: 6, transition: "width .5s" }} />
  </div>
);
const StackedBar = ({ segments, total }) => (
  <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", height: 16, width: "100%" }}>
    {segments.map((s, i) => <div key={i} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} title={`${s.label}: ${s.value.toFixed(1)}%`} />)}
  </div>
);
const HourChart = ({ data }) => {
  const max = Math.max(...data.map((d) => d.n));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 80 }}>
      {data.map((d) => (
        <div key={d.h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <div style={{ width: "100%", borderRadius: "3px 3px 0 0", minHeight: 2, background: d.h >= 6 && d.h <= 10 ? C.accent : d.h >= 18 && d.h <= 21 ? C.accent2 : "#ede7e3", height: `${(d.n / max) * 72}px` }} />
          {d.h % 4 === 0 && <span style={{ fontSize: 8, color: C.mute }}>{d.h}h</span>}
        </div>
      ))}
    </div>
  );
};
const Card = ({ children, span = 1, style = {} }) => (
  <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 1px 3px rgba(0,0,0,.04),0 6px 18px rgba(0,0,0,.04)", border: "1px solid rgba(0,0,0,.07)", gridColumn: `span ${span}`, ...style }}>{children}</div>
);
const Title = ({ children, sub }) => (
  <div style={{ marginBottom: 14 }}>
    <h3 style={{ fontSize: 15, fontWeight: 700, color: C.ink, margin: 0 }}>{children}</h3>
    {sub && <p style={{ fontSize: 11, color: C.mute, margin: "3px 0 0" }}>{sub}</p>}
  </div>
);
export const Badge = ({ children, color = C.accent }) => (
  <span style={{ background: `${color}15`, color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{children}</span>
);
const KPI = ({ label, value, sub, icon }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <div>
        <p style={{ fontSize: 10, color: C.mute, margin: 0, textTransform: "uppercase", letterSpacing: ".5px", fontWeight: 600 }}>{label}</p>
        <p style={{ fontSize: 26, fontWeight: 700, margin: "4px 0 0", letterSpacing: "-1px" }}>{value}</p>
        <p style={{ fontSize: 10, color: "#aaa", margin: "2px 0 0" }}>{sub}</p>
      </div>
      <span style={{ fontSize: 22 }}>{icon}</span>
    </div>
  </Card>
);
const Insight = ({ icon, title, body, metric, color = C.accent }) => (
  <Card style={{ borderLeft: `4px solid ${color}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
        <h4 style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{title}</h4>
      </div>
      <Badge color={color}>{metric}</Badge>
    </div>
    <p style={{ fontSize: 12, color: "#555", lineHeight: 1.6, margin: 0 }}>{body}</p>
  </Card>
);

/* ══════════════════════ DASHBOARD (demo interactiva) ══════════════════════ */

const tabs = ["Overview", "Coaches", "Contenido", "Engagement", "Comentarios", "Insights"];
const yearKeys = ["all", 2021, 2022, 2023, 2024, 2025, 2026];

function Dashboard() {
  const [tab, setTab] = useState("Overview");
  const [yf, setYf] = useState("all");
  // Invitación a explorar las pestañas: se apaga en cuanto se usa una
  const [hint, setHint] = useState(true);
  const yd = YEARLY[yf];

  const pickTab = (t) => { setTab(t); setHint(false); };

  return (
    <div style={{ background: C.soft, borderRadius: 22, overflow: "hidden", border: "1px solid rgba(0,0,0,.07)" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,.06)", padding: "14px 0" }}>
        <div style={{ padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: `linear-gradient(135deg,${C.accent},${C.accent2})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 12 }}>FY</span>
            </div>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Content Intelligence — demo</h1>
              <p style={{ fontSize: 10, color: C.mute, margin: 0 }}>{fmt(S.general.clases)} clases · {fmt(S.general.comentarios)} interacciones · {fmtK(S.general.vistas)} vistas</p>
            </div>
          </div>
          <Badge color="#666">Datos ilustrativos</Badge>
        </div>
        <div style={{ position: "relative", margin: "8px 0 0" }}>
          <style>{`
            @keyframes fbyBob  { 0%,100% { transform: translateY(0) } 50% { transform: translateY(5px) } }
            @keyframes fbyGlow { 0%,100% { box-shadow: 0 0 0 0 ${C.accent}00; background: transparent } 50% { box-shadow: 0 0 0 5px ${C.accent}24; background: ${C.accent}12 } }
          `}</style>
          <div style={{ padding: "0 24px", display: "flex", alignItems: "center", gap: 4, overflowX: "auto" }}>
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => pickTab(t)}
                style={{
                  padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                  background: tab === t ? C.ink : "transparent", color: tab === t ? "#fff" : hint ? C.accent : C.mute,
                  whiteSpace: "nowrap",
                  animation: hint && t !== tab ? "fbyGlow 2.1s ease-in-out infinite" : "none",
                  animationDelay: hint ? `${i * 0.16}s` : undefined,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {hint && (
            <div style={{ position: "absolute", top: "calc(100% + 10px)", left: 170, zIndex: 6, pointerEvents: "none", animation: "fbyBob 1.6s ease-in-out infinite" }}>
              {/* punta que apunta a las pestañas */}
              <div style={{ position: "absolute", top: -4, left: 22, width: 11, height: 11, borderRadius: 2, background: C.accent, transform: "rotate(45deg)" }} />
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, background: C.accent, color: "#fff", borderRadius: 20, padding: "8px 15px", boxShadow: `0 10px 26px ${C.accent}5c`, whiteSpace: "nowrap" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff">
                  <path d="M6 2.5 19 11l-6.2 1.1L10.6 19 6 2.5Z" />
                </svg>
                <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".2px" }}>Da click en las pestañas para explorar</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "20px 24px 28px" }}>
        {tab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            <KPI label="Clases" value={fmt(S.general.clases)} sub={`${S.general.coaches} coaches`} icon="🏋️" />
            <KPI label="Vistas" value={fmtK(S.general.vistas)} sub={`${fmt(S.general.promVistas)} promedio`} icon="👀" />
            <KPI label="Interacciones" value={fmt(S.general.comentarios)} sub={`${S.general.clasesConComments} clases`} icon="💬" />
            <KPI label="Engagement" value="23.1" sub="int/clase promedio" icon="🔥" />
            <Card span={2}>
              <Title sub="Clases publicadas y vistas promedio por cohorte">Evolución anual</Title>
              {S.porAnio.map((y) => (
                <div key={y.year} style={{ display: "grid", gridTemplateColumns: "42px 1fr 74px 75px", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{y.year}</span>
                  <Bar value={y.clases} max={290} />
                  <span style={{ fontSize: 11, color: "#666", textAlign: "right" }}>{y.clases} clases</span>
                  <span style={{ fontSize: 10, color: C.mute, textAlign: "right" }}>{fmt(y.prom)} vis</span>
                </div>
              ))}
              <p style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginTop: 10 }}>Se produce más y cada clase alcanza menos. El cuello de botella es discovery.</p>
            </Card>
            <Card span={2}>
              <Title sub="Distribución horaria de las interacciones">¿Cuándo entrenan?</Title>
              <HourChart data={S.horaPico} />
              <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 10, color: C.mute }}>
                <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: C.accent, marginRight: 3 }} />AM 6-10h</span>
                <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: C.accent2, marginRight: 3 }} />PM 18-21h</span>
                <span style={{ marginLeft: "auto", fontWeight: 600, color: C.accent }}>Peak 8-9 AM</span>
              </div>
            </Card>
          </div>
        )}

        {tab === "Coaches" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card span={2}>
              <Title sub="Métricas por coach">Performance</Title>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #f0ebe8" }}>
                      {["Coach", "Clases", "Vistas", "Vis/cl", "Int", "I/cl"].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: 10, color: C.mute, fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {S.porCoach.map((c, i) => (
                      <tr key={c.name} style={{ borderBottom: "1px solid #f7f4f1", background: i === 0 ? "#FFF8F6" : "transparent" }}>
                        <td style={{ padding: "7px 8px", fontWeight: 600 }}>{c.name}{c.tipo === "inv" && <span style={{ fontSize: 9, color: C.mute }}> inv.</span>}</td>
                        <td style={{ padding: "7px 8px" }}>{c.clases}</td>
                        <td style={{ padding: "7px 8px" }}>{fmtK(c.vistas)}</td>
                        <td style={{ padding: "7px 8px", fontWeight: 600 }}>{fmt(c.prom)}</td>
                        <td style={{ padding: "7px 8px" }}>{fmt(c.comments)}</td>
                        <td style={{ padding: "7px 8px" }}>{(c.comments / c.clases).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card>
              <Title sub="% del catálogo">Concentración del catálogo</Title>
              {S.porCoach.slice(0, 8).map((c) => (
                <div key={c.name} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span style={{ color: C.mute }}>{((c.clases / S.general.clases) * 100).toFixed(1)}%</span>
                  </div>
                  <Bar value={c.clases} max={462} color={c.name === "Vale Ortiz" ? C.accent : C.accent2} />
                </div>
              ))}
            </Card>
            <Card>
              <Title sub="Clasificación automática del texto de las usuarias">Percepción por coach</Title>
              {S.sentimentCoach.map((c) => (
                <div key={c.name} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 3 }}>{c.name}</div>
                  <StackedBar total={100} segments={[{ value: c.pos, color: "#4CAF50", label: "Positivo" }, { value: c.neutral, color: "#E0E0E0", label: "Neutral" }, { value: c.intenso, color: "#FF9800", label: "Intensidad" }, { value: c.pedido, color: "#9C27B0", label: "Pedido" }]} />
                  <div style={{ fontSize: 9, color: C.mute, marginTop: 2 }}>✅{c.pos}% · 🔶{c.intenso}% · 💜{c.pedido}%</div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === "Contenido" && (
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.mute, marginRight: 4 }}>Año:</span>
              {yearKeys.map((y) => (
                <button key={y} onClick={() => setYf(y)} style={{ padding: "6px 16px", borderRadius: 20, border: yf === y ? `2px solid ${C.accent}` : "1px solid #ddd", cursor: "pointer", fontSize: 12, fontWeight: 600, background: yf === y ? "#FFF3EF" : "#fff", color: yf === y ? C.accent : "#888" }}>{y === "all" ? "Todos" : y}</button>
              ))}
            </div>

            {yd.insight && (
              <div style={{ background: "linear-gradient(135deg,#FFF3EF,#FFF8F5)", border: "1px solid #f0ddd5", borderRadius: 16, padding: "14px 20px", marginBottom: 14, display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 22 }}>💡</span>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 13, color: C.accent }}>{yd.label}</span>
                  <p style={{ fontSize: 12, color: "#555", margin: "4px 0 0", lineHeight: 1.5 }}>{yd.insight}</p>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Card>
                <Title sub={`${yd.clases} clases — ordenado por vistas/clase`}>Tipos de clase por eficiencia</Title>
                {[...yd.tipo].sort((a, b) => b.vis - a.vis).map((t, i) => (
                  <div key={t.tag} style={{ display: "grid", gridTemplateColumns: "80px 1fr 60px 66px", alignItems: "center", gap: 6, marginBottom: 7, background: ["Baile", "Postparto", "Estiramiento"].includes(t.tag) ? "#FFF8F5" : "transparent", padding: "2px 4px", borderRadius: 6, border: t.tag === "Baile" ? "1px solid #f0ddd5" : "1px solid transparent" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: i < 3 ? C.accent : "#333" }}>{t.tag}{t.tag === "Baile" && " ⭐"}</span>
                    <Bar value={t.vis} max={Math.max(...yd.tipo.map((x) => x.vis))} />
                    <span style={{ fontSize: 10, color: "#666", textAlign: "right" }}>{fmtK(t.vis)} vis</span>
                    <span style={{ fontSize: 10, color: C.mute, textAlign: "right" }}>{t.cl} clases</span>
                  </div>
                ))}
              </Card>

              <Card>
                <Title sub="Vistas promedio por target muscular">Músculos</Title>
                {[...yd.musculo].sort((a, b) => b.vis - a.vis).map((m) => (
                  <div key={m.t} style={{ display: "grid", gridTemplateColumns: "70px 1fr 60px", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{m.t}</span>
                    <Bar value={m.vis} max={Math.max(...yd.musculo.map((x) => x.vis))} color={C.accent3} />
                    <span style={{ fontSize: 10, color: "#666", textAlign: "right" }}>{fmtK(m.vis)}</span>
                  </div>
                ))}
              </Card>

              <Card>
                <Title sub="Ordenado por vistas promedio">Equipo</Title>
                {yd.equipo.map((e) => (
                  <div key={e.t} style={{ display: "grid", gridTemplateColumns: "85px 1fr 55px", alignItems: "center", gap: 6, marginBottom: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 500 }}>{e.t}</span>
                    <Bar value={e.vis} max={Math.max(...yd.equipo.map((x) => x.vis))} color={C.accent2} />
                    <span style={{ fontSize: 10, color: "#666", textAlign: "right" }}>{fmtK(e.vis)}</span>
                  </div>
                ))}
              </Card>

              <Card>
                <Title sub="Performance por duración">Duración</Title>
                {[...yd.duracion].sort((a, b) => b.vis - a.vis).map((d) => (
                  <div key={d.d} style={{ display: "grid", gridTemplateColumns: "55px 1fr 60px 40px", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <Badge>{d.d}</Badge>
                    <Bar value={d.cl} max={Math.max(...yd.duracion.map((x) => x.cl))} />
                    <span style={{ fontSize: 10, color: "#666", textAlign: "right" }}>{fmtK(d.vis)} vis</span>
                    <span style={{ fontSize: 10, color: C.mute, textAlign: "right" }}>{d.comm?.toFixed(0)} 💬</span>
                  </div>
                ))}
              </Card>

              <Card>
                <Title sub={`Top coaches en ${yd.label}`}>Coaches del periodo</Title>
                {yd.coach.map((c, i) => (
                  <div key={c.n} style={{ display: "grid", gridTemplateColumns: "1fr 66px 60px 40px", alignItems: "center", gap: 6, padding: "6px 0", borderBottom: "1px solid #f7f4f1" }}>
                    <span style={{ fontSize: 12, fontWeight: i === 0 ? 700 : 500 }}>{c.n}</span>
                    <span style={{ fontSize: 11, color: "#666", textAlign: "right" }}>{c.cl} clases</span>
                    <span style={{ fontSize: 11, fontWeight: 600, textAlign: "right" }}>{fmtK(c.vis)} vis</span>
                    <span style={{ fontSize: 10, color: C.mute, textAlign: "right" }}>{c.comm?.toFixed(0)} 💬</span>
                  </div>
                ))}
              </Card>

              <Card>
                <Title sub={`Top clases publicadas en ${yd.label}`}>Top clases</Title>
                {yd.top.map((t, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr 55px 35px", alignItems: "center", gap: 6, padding: "6px 0", borderBottom: "1px solid #f7f4f1" }}>
                    <span style={{ fontWeight: 700, color: i < 3 ? C.accent : "#ccc", fontSize: 12 }}>#{i + 1}</span>
                    <div><span style={{ fontWeight: 600, fontSize: 12 }}>{t.t}</span><span style={{ color: C.mute, fontSize: 10, marginLeft: 6 }}>{t.c}</span></div>
                    <span style={{ fontWeight: 700, fontSize: 12, textAlign: "right" }}>{fmtK(t.v)}</span>
                    <span style={{ fontSize: 10, color: C.mute, textAlign: "right" }}>{t.cm} 💬</span>
                  </div>
                ))}
              </Card>

              {yd.gems && (
                <Card span={2} style={{ borderLeft: `4px solid ${C.accent}`, background: "#FFFBF9" }}>
                  <Title sub="Categorías con alta eficiencia por clase pero poco volumen producido">🔍 Categorías subproducidas</Title>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                    {yd.gems.map((g) => (
                      <div key={g.tag} style={{ padding: 16, background: "#fff", borderRadius: 16, border: "1px solid #f0ebe8" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 700 }}>{g.tag}</span>
                          <Badge>Gap +{g.gap}</Badge>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                          <div style={{ textAlign: "center", padding: 8, background: C.soft, borderRadius: 16 }}>
                            <p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: C.accent }}>{fmtK(g.vis)}</p>
                            <p style={{ fontSize: 9, color: C.mute, margin: "2px 0 0" }}>vis/clase</p>
                          </div>
                          <div style={{ textAlign: "center", padding: 8, background: C.soft, borderRadius: 16 }}>
                            <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{g.cl}</p>
                            <p style={{ fontSize: 9, color: C.mute, margin: "2px 0 0" }}>clases</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                          <span style={{ fontSize: 10, color: C.mute }}>Eficiencia #{g.rank_eff}</span>
                          <span style={{ fontSize: 10, color: "#ccc" }}>·</span>
                          <span style={{ fontSize: 10, color: C.mute }}>Volumen #{g.rank_vol}</span>
                        </div>
                        <p style={{ fontSize: 11, color: "#555", lineHeight: 1.5, margin: 0 }}>{g.star}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {tab === "Engagement" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card>
              <Title sub="Top 10 usuarias por interacciones">Usuarias más activas</Title>
              {S.topUsers.map((u, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "20px 1fr 45px", alignItems: "center", gap: 6, padding: "6px 0", borderBottom: "1px solid #f7f4f1" }}>
                  <span style={{ fontWeight: 700, color: i < 3 ? C.accent : "#ccc", fontSize: 11 }}>#{i + 1}</span>
                  <span style={{ fontWeight: 500, fontSize: 12 }}>{u.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, textAlign: "right" }}>{u.n}</span>
                </div>
              ))}
              <p style={{ fontSize: 10, color: C.mute, marginTop: 8 }}>Top 10 = 14% de todas las interacciones</p>
            </Card>
            <Card>
              <Title sub="Interacciones por día de la semana">Actividad semanal</Title>
              {S.porDia.map((d) => (
                <div key={d.d} style={{ display: "grid", gridTemplateColumns: "70px 1fr 45px", alignItems: "center", gap: 6, marginBottom: 7 }}>
                  <span style={{ fontSize: 11, fontWeight: 500 }}>{d.d}</span>
                  <Bar value={d.n} max={3470} color={d.d === "Sábado" || d.d === "Domingo" ? "#ede7e3" : C.accent2} />
                  <span style={{ fontSize: 10, color: "#666", textAlign: "right" }}>{fmt(d.n)}</span>
                </div>
              ))}
              <p style={{ fontSize: 10, color: C.accent2, marginTop: 8, fontWeight: 600 }}>Mar-Mié = peak · Domingo -63%</p>
            </Card>
          </div>
        )}

        {tab === "Comentarios" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Card span={2}>
              <Title sub="Clasificación automática de 19,400 interacciones de texto">Sentimiento</Title>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
                {[
                  { l: "Positivo", v: S.sentiment.positivo, c: "#4CAF50", i: "😍", p: "46.2%" },
                  { l: "Neutral", v: S.sentiment.neutral, c: "#9E9E9E", i: "💬", p: "45.7%" },
                  { l: "Intensidad", v: S.sentiment.intenso, c: "#FF9800", i: "🥵", p: "3.4%" },
                  { l: "Intenso+Pos", v: S.sentiment.intenso_pos, c: "#E65100", i: "🔥", p: "1.6%" },
                  { l: "Pedidos", v: S.sentiment.pedido, c: "#9C27B0", i: "🙏", p: "3.0%" },
                ].map((s) => (
                  <div key={s.l} style={{ textAlign: "center", padding: 12, background: C.soft, borderRadius: 20 }}>
                    <span style={{ fontSize: 20 }}>{s.i}</span>
                    <p style={{ fontSize: 18, fontWeight: 700, margin: "4px 0 0", color: s.c }}>{fmt(s.v)}</p>
                    <p style={{ fontSize: 10, fontWeight: 600, margin: "2px 0 0" }}>{s.l}</p>
                    <p style={{ fontSize: 9, color: C.mute, margin: 0 }}>{s.p}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <Title sub="Términos más frecuentes">Vocabulario de la comunidad</Title>
              {S.topWords.map((w) => (
                <div key={w.w} style={{ display: "grid", gridTemplateColumns: "72px 1fr 35px", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, fontStyle: "italic" }}>{w.w}</span>
                  <Bar value={w.n} max={3650} color={C.accent3} h={7} />
                  <span style={{ fontSize: 9, color: C.mute, textAlign: "right" }}>{fmtK(w.n)}</span>
                </div>
              ))}
            </Card>
            <Card>
              <Title sub="Emojis más usados">Señales no verbales</Title>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 12 }}>
                {S.emojis.map((e) => (
                  <div key={e.e} style={{ textAlign: "center", padding: 6, background: C.soft, borderRadius: 16 }}>
                    <span style={{ fontSize: 18 }}>{e.e}</span>
                    <p style={{ fontSize: 9, color: C.mute, margin: "2px 0 0" }}>{fmtK(e.n)}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: C.accent, fontWeight: 600 }}>🔥 funciona como emoji identitario de la comunidad (3K usos)</p>
            </Card>
            <Card>
              <Title sub="686 menciones de música y playlist">La música importa</Title>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 12 }}>
                {[{ l: "Positivas", v: "56%", bg: "#E8F5E9", c: "#4CAF50" }, { l: "Neutras", v: "40%", bg: C.soft, c: "#666" }, { l: "Negativas", v: "4%", bg: "#FFEBEE", c: "#F44336" }].map((m) => (
                  <div key={m.l} style={{ textAlign: "center", padding: 10, background: m.bg, borderRadius: 8 }}>
                    <p style={{ fontSize: 18, fontWeight: 700, margin: 0, color: m.c }}>{m.v}</p>
                    <p style={{ fontSize: 10, margin: "2px 0 0", color: "#666" }}>{m.l}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#666" }}>Los comentarios con más likes son quejas de audio. Balancear voz vs música es la mejora de mayor retorno por peso invertido.</p>
            </Card>
            <Card>
              <Title sub="Ratio 4:1">Percepción de intensidad</Title>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div style={{ flex: 1, textAlign: "center", padding: 12, background: "#FFF3E0", borderRadius: 10 }}>
                  <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#FF9800" }}>979</p>
                  <p style={{ fontSize: 11, fontWeight: 600, margin: "2px 0 0" }}>🥵 Difícil</p>
                </div>
                <div style={{ flex: 1, textAlign: "center", padding: 12, background: "#E8F5E9", borderRadius: 10 }}>
                  <p style={{ fontSize: 24, fontWeight: 700, margin: 0, color: "#4CAF50" }}>244</p>
                  <p style={{ fontSize: 11, fontWeight: 600, margin: "2px 0 0" }}>😌 Fácil</p>
                </div>
              </div>
              <p style={{ fontSize: 11, color: "#FF9800", fontWeight: 600 }}>💡 Las expresiones de dificultad extrema se usan en sentido positivo: la exigencia genera lealtad</p>
            </Card>
            <Card>
              <Title sub="Interacciones con más likes de otras usuarias">Voz de la comunidad</Title>
              {S.topLiked.map((c, i) => (
                <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #f7f4f1", display: "flex", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, minWidth: 28 }}>♥{c.likes}</span>
                  <div>
                    <p style={{ fontSize: 11, margin: 0, color: "#444", fontStyle: "italic", lineHeight: 1.4 }}>"{c.text}"</p>
                    <p style={{ fontSize: 10, color: C.mute, margin: "2px 0 0" }}>— {c.user}</p>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === "Insights" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Insight icon="👑" title="Concentración en una coach ancla" metric="80% de vistas" body="39% del contenido y 80% de las vistas provienen de una sola coach. En la cohorte más reciente baja a 19% del catálogo pero sigue capturando 6x más vistas por clase que el promedio. Riesgo de dependencia alto y difícil de revertir sin discovery." />
            <Insight icon="💃" title="Baile: la categoría oculta" metric="#3 en eficiencia" color={C.accent2} body="21 clases con 2,870 vistas promedio — tercera categoría más eficiente detrás de HIIT y Funcional, pero la 13ª en volumen producido. Gap de +10 posiciones: la categoría más subproducida del catálogo." />
            <Insight icon="💪" title="Las clases largas ganan" metric="2.6x engagement" color={C.accent3} body="50-60 min: 6,740 vistas y 24.6 interacciones por clase. Las sesiones cortas funcionan como snack pero no generan comunidad ni hábito." />
            <Insight icon="📈" title="El formato serie funciona" metric="2.5K vis/cl" body="Las series con marca propia por coach superan a la clase suelta. El patrón se repite en las tres coaches con mejor eficiencia. Es replicable y no requiere más presupuesto de producción." />
            <Insight icon="🎵" title="La música es diferenciador" metric="686 menciones" color={C.accent2} body="56% de las menciones de playlist son positivas, y las quejas de audio son las interacciones con más likes de la plataforma. Curaduría musical y mezcla de audio son palancas de bajo costo." />
            <Insight icon="🎯" title="Nichos sin oferta" metric="Booty bands 9K" color={C.accent3} body="Booty bands y sliders: 9K vistas promedio con 8x menos clases que mancuernas. Postparto: 5 clases con 1,450 vistas. Estiramiento: 2,180 vistas con 30 clases y costo de producción mínimo." />
            <Insight icon="🥵" title="La dificultad es un feature" metric="4:1 ratio" body="979 menciones de dificultad vs 244 de facilidad. El lenguaje de esfuerzo extremo aparece como sentimiento positivo. HIIT concentra los picos de intensidad y la mejor retención." />
            <Insight icon="🧘" title="Yoga: demanda mayor que discovery" metric="8.3% son pedidos" color={C.accent2} body="Yoga tiene la tasa más alta de pedidos explícitos, y a la vez 165 clases con 720 vistas promedio. No es un problema de catálogo: es un problema de que nadie las encuentra." />
            <Insight icon="📉" title="De catálogo a plataforma" metric="96% → 19%" body="La diversificación de coaches ya ocurrió. Lo que no ocurrió es la redistribución de la atención: las vistas siguen concentradas en el catálogo legacy. Es exactamente el problema que resuelve un motor de recomendación." />
            <Insight icon="💬" title="Comunidad de super-fans" metric="14% = 10 usuarias" body="Las 10 usuarias más activas generan 14% de las interacciones. Existe una base identificable de embajadoras que hoy no se está activando de forma sistemática." />
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════ CHROME DE PRESENTACIÓN ══════════════════════ */

export const Slide = ({ children, wide = false }) => (
  <div style={{ maxWidth: wide ? 1240 : 980, margin: "0 auto", padding: "0 32px", width: "100%" }}>{children}</div>
);
export const Eyebrow = ({ children }) => (
  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.4px", textTransform: "uppercase", color: C.accent, margin: "0 0 10px" }}>{children}</p>
);
export const H1 = ({ children, style = {} }) => (
  <h2 style={{ fontSize: 40, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-1.4px", margin: "0 0 14px", ...style }}>{children}</h2>
);
export const Lead = ({ children }) => (
  <p style={{ fontSize: 17, lineHeight: 1.6, color: "#555", margin: "0 0 26px", maxWidth: 760 }}>{children}</p>
);
export const Stat = ({ big, label, color = C.ink }) => (
  <div>
    <p style={{ fontSize: 38, fontWeight: 700, letterSpacing: "-1.6px", margin: 0, color }}>{big}</p>
    <p style={{ fontSize: 12, color: C.mute, margin: "2px 0 0", lineHeight: 1.4 }}>{label}</p>
  </div>
);
// Paso colapsable: se ve solo el título; la flecha despliega la descripción
const Step = ({ n, title, body }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #f0ebe8", paddingBottom: 13 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", gap: 14, alignItems: "center", width: "100%",
          background: "none", border: "none", padding: 0, cursor: "pointer",
          textAlign: "left", fontFamily: "inherit", color: C.ink,
        }}
      >
        <div style={{ minWidth: 30, height: 30, borderRadius: 10, background: C.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{n}</div>
        <span style={{ fontSize: 14.5, fontWeight: 700, flex: 1, lineHeight: 1.3 }}>{title}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={open ? C.accent : C.mute} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .22s" }}>
          <path d="M6 9.5 12 15.5 18 9.5" />
        </svg>
      </button>
      {open && (
        <p style={{ fontSize: 12.5, color: "#666", margin: "11px 0 0", lineHeight: 1.6, paddingLeft: 44 }}>{body}</p>
      )}
    </div>
  );
};

// Ícono minimalista: una usuaria conectada a las clases que se le sugieren
const IconRecs = () => (
  <div style={{
    width: 54, height: 54, borderRadius: 18, background: `${C.accent}14`,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  }}>
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.6" strokeLinecap="round">
      <path d="M7.4 10.9 16.6 6.6M7.4 13.1 16.6 17.4" />
      <circle cx="5" cy="12" r="2.6" fill={C.accent} stroke="none" />
      <circle cx="19" cy="5.6" r="2.4" />
      <circle cx="19" cy="18.4" r="2.4" />
    </svg>
  </div>
);

// Contenedor de ícono: cuadro redondeado con tinte coral
export const IconBadge = ({ children, size = 50, radius = 17 }) => (
  <div style={{
    width: size, height: size, borderRadius: radius, background: `${C.accent}14`,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  }}>{children}</div>
);

const svgBase = { fill: "none", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" };

const ICO = {
  retencion: (
    <svg width="26" height="26" viewBox="0 0 24 24" stroke={C.accent} {...svgBase}>
      <path d="M12 20.2s-7.2-4.5-7.2-9.4A3.9 3.9 0 0 1 12 8.2a3.9 3.9 0 0 1 7.2 2.6c0 4.9-7.2 9.4-7.2 9.4Z" />
    </svg>
  ),
  catalogo: (
    <svg width="26" height="26" viewBox="0 0 24 24" stroke={C.accent} {...svgBase}>
      <path d="M12 3.4 20.8 7.8 12 12.2 3.2 7.8 12 3.4Z" />
      <path d="M3.2 12.2 12 16.6l8.8-4.4M3.2 16.6 12 21l8.8-4.4" />
    </svg>
  ),
  coaches: (
    <svg width="26" height="26" viewBox="0 0 24 24" stroke={C.accent} {...svgBase}>
      <circle cx="9.4" cy="8.4" r="3.2" />
      <path d="M3.8 19.6c0-3.1 2.5-5.2 5.6-5.2s5.6 2.1 5.6 5.2" />
      <path d="M18.6 6.8v5M16.1 9.3h5" />
    </svg>
  ),
};

// Matriz usuaria × clase para explicar filtrado colaborativo
const MX = [
  [1, 1, 0, 1, 0, 0, 1, 0],
  [1, 1, 0, 1, 0, 1, 1, 0],
  [0, 0, 1, 0, 1, 0, 0, 1],
  [1, 1, 0, 1, 1, 0, 1, 0],
  [0, 1, 1, 0, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0],
];
const SIMILAR = [1, 3];
const REC = { r: 3, c: 5 };

const MiniMatrix = () => (
  <div>
    <div style={{ display: "flex", gap: 7, marginBottom: 7, paddingLeft: 65 }}>
      {Array.from({ length: 8 }).map((_, c) => (
        <span key={c} style={{ width: 26, textAlign: "center", fontSize: 9, color: C.mute, fontWeight: 600 }}>C{c + 1}</span>
      ))}
    </div>
    {MX.map((row, r) => (
      <div key={r} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 7 }}>
        <span style={{ width: 58, fontSize: 10, fontWeight: SIMILAR.includes(r) ? 700 : 500, color: SIMILAR.includes(r) ? C.accent : C.mute, textAlign: "right" }}>
          {r === REC.r ? "Ana ←" : `Usuaria ${r + 1}`}
        </span>
        {row.map((v, c) => {
          const isRec = r === REC.r && c === REC.c;
          return (
            <div key={c} style={{
              width: 26, height: 26, borderRadius: 7,
              background: isRec ? "#fff" : v ? (SIMILAR.includes(r) ? C.accent : "#ded5cf") : "#f0ebe8",
              border: isRec ? `2px dashed ${C.accent}` : "1px solid rgba(0,0,0,.04)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: C.accent, fontWeight: 700,
            }}>{isRec ? "?" : ""}</div>
          );
        })}
      </div>
    ))}
    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12, paddingLeft: 65, fontSize: 10.5, color: C.mute }}>
      <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: C.accent, marginRight: 5 }} />Tomó la clase (vecina cercana)</span>
      <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "#ded5cf", marginRight: 5 }} />Tomó la clase (otra usuaria)</span>
      <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: "#fff", border: `2px dashed ${C.accent}`, marginRight: 5 }} />Recomendación</span>
    </div>
  </div>
);

const PriceCol = ({ name, price, unit, items, highlight, tagline, foot }) => (
  <div style={{
    background: highlight ? C.ink : "#fff", color: highlight ? "#fff" : C.ink,
    borderRadius: 22, padding: "24px 22px", border: highlight ? "none" : "1px solid rgba(0,0,0,.08)",
    boxShadow: highlight ? "0 10px 32px rgba(0,0,0,.16)" : "0 1px 3px rgba(0,0,0,.04)",
    display: "flex", flexDirection: "column", position: "relative",
  }}>
    {highlight && <div style={{ position: "absolute", top: -11, left: 22, background: C.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: ".5px" }}>RECOMENDADO</div>}
    <p style={{ fontSize: 13, fontWeight: 700, margin: 0, letterSpacing: "-.2px" }}>{name}</p>
    <p style={{ fontSize: 11, color: highlight ? "rgba(255,255,255,.6)" : C.mute, margin: "3px 0 14px", lineHeight: 1.4, minHeight: 30 }}>{tagline}</p>
    <p style={{ fontSize: 30, fontWeight: 700, margin: 0, letterSpacing: "-1.4px", color: highlight ? "#fff" : C.ink }}>{price}</p>
    <p style={{ fontSize: 11, color: highlight ? "rgba(255,255,255,.55)" : C.mute, margin: "2px 0 16px" }}>{unit}</p>
    <div style={{ borderTop: `1px solid ${highlight ? "rgba(255,255,255,.14)" : "#f0ebe8"}`, paddingTop: 14, flex: 1 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 9, alignItems: "flex-start" }}>
          <span style={{ color: C.accent, fontSize: 12, fontWeight: 700, lineHeight: 1.5 }}>·</span>
          <span style={{ fontSize: 12, lineHeight: 1.5, color: highlight ? "rgba(255,255,255,.85)" : "#555" }}>{it}</span>
        </div>
      ))}
    </div>
    {foot && <p style={{ fontSize: 10.5, color: highlight ? "rgba(255,255,255,.5)" : "#aaa", margin: "12px 0 0", lineHeight: 1.45 }}>{foot}</p>}
  </div>
);

const TOTAL_W = 15;
const PHASES = [
  { f: "Fase 0", name: "Diagnóstico y auditoría de datos", w: "Semanas 1-2", start: 0, dur: 2, out: "Inventario de eventos disponibles, gaps de tracking, plan de instrumentación" },
  { f: "Fase 1", name: "Base de datos de comportamiento", w: "Semanas 3-5", start: 2, dur: 3, out: "Pipeline de eventos, tabla usuaria-clase, catálogo enriquecido con metadata" },
  { f: "Fase 2", name: "Dashboard de contenido en producción", w: "Semanas 5-7", start: 4, dur: 3, out: "El tablero de esta demo, conectado a datos reales y actualizado solo" },
  { f: "Fase 3", name: "Motor de recomendación v1", w: "Semanas 8-11", start: 7, dur: 4, out: "Modelo entrenado, API de recomendaciones, fila 'Para ti' en la app" },
  { f: "Fase 4", name: "Medición y calibración", w: "Semanas 12-15", start: 11, dur: 4, out: "A/B test contra la home actual, reporte de impacto en retención" },
];

/* ══════════════════════ SLIDES ══════════════════════ */

export const SLIDES = [
  {
    id: "cover",
    render: () => (
      <Slide>
        <div style={{ minHeight: "calc(100vh - 172px)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          {/* halo suave detrás del bloque */}
          <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", pointerEvents: "none", background: `radial-gradient(circle, ${C.accent}16 0%, ${C.accent}00 63%)` }} />

          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 950 }}>
            {/* pill de marca */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid rgba(0,0,0,.07)", borderRadius: 30, padding: "7px 17px 7px 7px", boxShadow: "0 1px 3px rgba(0,0,0,.04),0 6px 18px rgba(0,0,0,.04)", marginBottom: 30 }}>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: `linear-gradient(135deg,${C.accent},${C.accent2})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>FY</span>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#555" }}>Propuesta de consultoría · FIT by You</span>
            </div>

            <H1 style={{ fontSize: 54, maxWidth: 900, margin: "0 0 20px" }}>Su catálogo ya sabe qué quiere cada usuaria. Falta que la app se lo diga.</H1>

            <p style={{ fontSize: 17, lineHeight: 1.62, color: "#555", maxWidth: 720, margin: "0 0 40px" }}>
              La propuesta se basa en dos etapas: la primera, un sistema de inteligencia de contenido;
              la segunda, un sistema de recomendación. Ambos construidos con los datos que la plataforma
              ya genera todos los días.
            </p>

            {/* las dos etapas, en concreto */}
            <div style={{ display: "flex", alignItems: "stretch", justifyContent: "center" }}>
              {[
                { n: "01", t: "Inteligencia de contenido", b: "Entender qué funciona y qué nos falta producir." },
                { n: "02", t: "Sistema de recomendación", b: "Poner la clase correcta frente a cada usuaria." },
              ].map((s, i) => (
                <div key={s.n} style={{ display: "flex", alignItems: "center" }}>
                  {i > 0 && (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 12px", flexShrink: 0 }}>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                  <div style={{ width: 272, textAlign: "left", background: "#fff", borderRadius: 20, padding: "18px 20px", border: "1px solid rgba(0,0,0,.07)", boxShadow: "0 1px 3px rgba(0,0,0,.04),0 6px 18px rgba(0,0,0,.04)" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "1px" }}>{s.n}</span>
                    <p style={{ fontSize: 15.5, fontWeight: 700, margin: "6px 0 6px", lineHeight: 1.3, letterSpacing: "-.3px" }}>{s.t}</p>
                    <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.55 }}>{s.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Slide>
    ),
  },
  {
    id: "problema",
    render: () => (
      <Slide>
        <Eyebrow>El reto</Eyebrow>
        <H1>Publicar más ya no mueve la aguja.</H1>
        <Lead>
          El catálogo crece cada semana. La atención de cada usuaria, no. Cada clase nueva compite
          contra años de archivo — y pierde.
        </Lead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[
            { t: "El catálogo se entierra", b: "Se produce, se publica, y casi nadie la vuelve a ver." },
            { t: "Lo viejo se lleva todo", b: "Las clases de siempre ganan por antigüedad, no por ser mejores." },
            { t: "Se produce a ciegas", b: "El calendario se llena por intuición y por quién está disponible." },
          ].map((x) => (
            <div key={x.t} style={{ background: "#fff", borderRadius: 20, padding: "22px 20px", border: "1px solid rgba(0,0,0,.06)", borderTop: `3px solid ${C.accent}` }}>
              <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.35 }}>{x.t}</p>
              <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.6 }}>{x.b}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 14, color: C.accent, fontWeight: 600, marginTop: 26 }}>
          Ninguno es problema de contenido. Los tres son de datos.
        </p>
      </Slide>
    ),
  },
  {
    id: "hipotesis",
    render: () => (
      <Slide>
        <Eyebrow>La hipótesis</Eyebrow>
        <H1>El dato ya lo tienen. Nadie lo está usando.</H1>
        <Lead>
          No hay que comprar nada ni encuestar a nadie. La app genera estas cuatro señales desde el día uno.
          El trabajo es juntarlas.
        </Lead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16, marginBottom: 26 }}>
          {[
            { i: "▶", t: "Reproducciones", b: "Quién le dio play a qué, y hasta qué minuto llegó. La señal más honesta que existe." },
            { i: "🏷", t: "Metadata del catálogo", b: "Tipo, coach, duración, equipo. Ya existe: son los filtros de la app." },
            { i: "💬", t: "Comunidad", b: "Comentarios, likes, favoritos. Poco volumen, mucha intención." },
            { i: "🔄", t: "Suscripción", b: "Alta, pausa, baja. El resultado que de verdad importa." },
          ].map((x) => (
            <div key={x.t} style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", border: "1px solid rgba(0,0,0,.06)", display: "flex", gap: 14 }}>
              <span style={{ fontSize: 20, lineHeight: 1 }}>{x.i}</span>
              <div>
                <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>{x.t}</p>
                <p style={{ fontSize: 13, color: "#666", margin: 0, lineHeight: 1.6 }}>{x.b}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: C.ink, color: "#fff", borderRadius: 20, padding: "22px 26px" }}>
          <p style={{ fontSize: 15, fontWeight: 600, margin: 0, lineHeight: 1.6 }}>
            Juntar las cuatro convierte el catálogo en un mapa de preferencias. Ese mapa alimenta
            el tablero y el recomendador: el mismo dato, dos entregables.
          </p>
        </div>
      </Slide>
    ),
  },
  {
    id: "demo-intro",
    render: () => (
      <Slide>
        <Eyebrow>Entregable 1 de 2</Eyebrow>
        <H1>Primero ver: inteligencia de contenido.</H1>
        <Lead>
          Antes de personalizar hay que entender el catálogo. Este es el tablero que se entrega en la Fase 2 —
          la siguiente pantalla es la versión funcional, navegable, con datos ilustrativos.
        </Lead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 26, marginBottom: 30 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: C.mute, marginBottom: 14 }}>Responde</p>
            {["¿Qué categorías rinden más por clase producida?", "¿Cuáles están subproducidas frente a su desempeño?", "¿Qué duración y formato genera hábito, no solo un play?", "¿Qué coach convierte mejor y en qué categoría?", "¿Qué pide la comunidad que no existe en el catálogo?"].map((q) => (
              <div key={q} style={{ display: "flex", gap: 9, marginBottom: 10 }}>
                <span style={{ color: C.accent, fontWeight: 700, fontSize: 13 }}>→</span>
                <span style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>{q}</span>
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: C.mute, marginBottom: 14 }}>Para qué sirve</p>
            {["Decidir el calendario de producción con evidencia, no con intuición", "Detectar nichos con demanda y sin oferta antes que la competencia", "Dar a cada coach una lectura objetiva de su desempeño", "Justificar inversión en producción ante socios o inversionistas", "Alimentar el motor de recomendación de la Fase 3"].map((q) => (
              <div key={q} style={{ display: "flex", gap: 9, marginBottom: 10 }}>
                <span style={{ color: C.accent2, fontWeight: 700, fontSize: 13 }}>✓</span>
                <span style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>{q}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#FFF3EF", border: "1px solid #f0ddd5", borderRadius: 16, padding: "16px 20px", display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 20 }}>👉</span>
          <p style={{ fontSize: 13, color: "#5a463f", margin: 0, lineHeight: 1.55 }}>
            En la siguiente slide el tablero es interactivo: se pueden cambiar pestañas y filtrar por año durante la junta.
          </p>
        </div>
      </Slide>
    ),
  },
  {
    id: "demo",
    wide: true,
    render: () => (
      <Slide wide>
        <div style={{ marginBottom: 14 }}>
          <Eyebrow>Dashboard interactivo</Eyebrow>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: "-.8px" }}>Sistema de inteligencia de contenido</h2>
          <p style={{ fontSize: 14, color: "#666", margin: "6px 0 0", maxWidth: 780, lineHeight: 1.55 }}>
            Primero, una propuesta de cómo se vería el dashboard que analiza las clases, las coaches y a las usuarias.
          </p>
        </div>
        <Dashboard />
      </Slide>
    ),
  },
  {
    id: "framework",
    render: () => (
      <Slide>
        <Eyebrow>El hallazgo que se repite</Eyebrow>
        <H1>¿Cuáles son las clases que nos hacen falta?</H1>
        <Lead>
          Si vemos qué tan bien le va a cada clase y lo comparamos con cuántas grabamos de esa categoría,
          podemos identificar clases sub producidas qué nos dice lo que están pidiendo las usuarias.
          
        </Lead>
        <div style={{ background: "#fff", borderRadius: 22, padding: "24px 26px", border: "1px solid rgba(0,0,0,.07)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 90px 90px", gap: 10, paddingBottom: 10, borderBottom: "2px solid #f0ebe8", marginBottom: 14 }}>
            {["Categoría", "Gap eficiencia vs volumen", "Vis/clase", "Clases"].map((h) => (
              <span key={h} style={{ fontSize: 10, fontWeight: 700, color: C.mute, textTransform: "uppercase", letterSpacing: ".5px" }}>{h}</span>
            ))}
          </div>
          {S.effGap.map((g) => {
            const pos = g.gap > 0;
            return (
              <div key={g.tag} style={{ display: "grid", gridTemplateColumns: "110px 1fr 90px 90px", gap: 10, alignItems: "center", marginBottom: 11 }}>
                <span style={{ fontSize: 13, fontWeight: pos ? 700 : 500, color: pos ? C.accent : "#444" }}>{g.tag}</span>
                <div style={{ display: "flex", alignItems: "center", height: 18 }}>
                  <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", paddingRight: 3 }}>
                    {!pos && <div style={{ width: `${(Math.abs(g.gap) / 10) * 100}%`, height: 14, background: "#ded5cf", borderRadius: "5px 0 0 5px" }} />}
                  </div>
                  <div style={{ width: 1, height: 18, background: "#ccc" }} />
                  <div style={{ flex: 1, paddingLeft: 3 }}>
                    {pos && <div style={{ width: `${(g.gap / 10) * 100}%`, height: 14, background: C.accent, borderRadius: "0 5px 5px 0" }} />}
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, textAlign: "right", color: "#444" }}>{fmt(g.vis)}</span>
                <span style={{ fontSize: 12, textAlign: "right", color: C.mute }}>{g.cl}</span>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTop: "1px solid #f0ebe8", fontSize: 11, color: C.mute }}>
            <span>← Sobreproducido: mucho volumen, poco rendimiento</span>
            <span style={{ color: C.accent, fontWeight: 600 }}>Subproducido: alto rendimiento, poco volumen →</span>
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: "#444", marginTop: 22, lineHeight: 1.65, maxWidth: 780 }}>
          Cada renglón del lado derecho es una decisión de producción que se puede tomar la próxima semana.
          Cada renglón del lado izquierdo es presupuesto que hoy rinde por debajo de su costo.
        </p>
      </Slide>
    ),
  },
  {
    id: "reco-intro",
    render: () => (
      <Slide>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
          <IconRecs />
          <H1 style={{ margin: 0 }}>Sistema de recomendación</H1>
        </div>
        <div style={{ background: `${C.accent}0A`, border: `1px solid ${C.accent}26`, borderRadius: 22, padding: "28px 32px", marginBottom: 26 }}>
          <p style={{ fontSize: 21, fontWeight: 700, margin: "0 0 10px", letterSpacing: "-.5px" }}>Una fila "Para ti" que aprende</p>
          <p style={{ fontSize: 14.5, color: "#5a5a5a", lineHeight: 1.7, margin: 0, maxWidth: 790 }}>
            Cada usuaria abre la app y ve entre 5 y 10 clases elegidas por su historial y por el de usuarias
            con patrones parecidos. El catálogo completo se vuelve alcanzable, y descubre coaches y categorías
            que nunca habría filtrado a mano.
          </p>
        </div>
        <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: C.mute, margin: "0 0 14px" }}>Objetivos:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { k: "retencion", t: "Retención", v: "Más clases relevantes por sesión = más semanas activas antes de la baja." },
            { k: "catalogo", t: "Catálogo activo", v: "Clases enterradas vuelven a circular sin costo de producción adicional." },
            { k: "coaches", t: "Coaches nuevas", v: "Dejan de depender de la home: llegan directo a su audiencia natural." },
          ].map((x) => (
            <div key={x.t} style={{ display: "flex", gap: 20, alignItems: "center", background: "#fff", borderRadius: 20, padding: "18px 24px", border: "1px solid rgba(0,0,0,.07)", boxShadow: "0 1px 3px rgba(0,0,0,.03),0 5px 14px rgba(0,0,0,.03)", flexWrap: "wrap" }}>
              <IconBadge>{ICO[x.k]}</IconBadge>
              <p style={{ fontSize: 17, fontWeight: 700, margin: 0, minWidth: 168, letterSpacing: "-.3px" }}>{x.t}</p>
              <p style={{ fontSize: 14.5, color: "#666", margin: 0, lineHeight: 1.55, flex: "1 1 300px" }}>{x.v}</p>
            </div>
          ))}
        </div>
      </Slide>
    ),
  },
  {
    id: "reco-como",
    render: () => (
      <Slide>
        <Eyebrow>¿Cómo funciona el sistema de recomendación?</Eyebrow>
        <H1>Usuarias parecidas consumen clases parecidas.</H1>
        <Lead>
          El principio es simple y está probado en toda la industria del streaming. No se le pregunta nada a la
          usuaria: se aprende de lo que hace, y se completa lo que le falta a partir de quienes se comportan como ella.
        </Lead>
        <div style={{ display: "flex", flexWrap: "nowrap", gap: 28, alignItems: "flex-start" }}>
          <div style={{ background: "#fff", borderRadius: 22, padding: "22px 20px", border: "1px solid rgba(0,0,0,.07)", flex: "0 0 auto" }}>
            <MiniMatrix />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13, flex: "1 1 0", minWidth: 250 }}>
            <Step n="1" title="Se construye el mapa de consumo" body="Una fila por usuaria, una columna por clase. Cada celda registra si la vio y con qué intensidad — minutos completados, si volvió, si comentó." />
            <Step n="2" title="Se buscan las vecinas" body="Para Ana, el sistema identifica a las usuarias cuyo patrón de consumo más se parece al suyo. No por edad ni por lo que declararon al registrarse: por lo que efectivamente entrenan." />
            <Step n="3" title="Se recomienda el hueco" body="Si sus vecinas más cercanas disfrutaron una clase que Ana no ha visto, esa clase sube a su fila 'Para ti'. Ese es el hueco marcado con ? en la matriz." />
            <Step n="4" title="Se corrige con el contenido" body="La metadata del catálogo — tipo, duración, coach, equipo — evita recomendaciones absurdas y resuelve el arranque de usuarias y clases nuevas, que todavía no tienen historial." />
          </div>
        </div>
      </Slide>
    ),
  },
  {
    id: "reco-consideraciones",
    render: () => (
      <Slide>
        <Eyebrow>Lo que hay que resolver bien</Eyebrow>
        <H1>Un recomendador mal calibrado empeora el producto.</H1>
        <Lead>
          Estos son los cuatro problemas que hacen fracasar la mayoría de las implementaciones. Están contemplados
          en el alcance desde la Fase 3, no como parches posteriores.
        </Lead>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {[
            { t: "El arranque en frío", p: "Una usuaria nueva no tiene historial y una clase nueva no tiene audiencia.", s: "Recomendaciones basadas en metadata y popularidad durante las primeras sesiones, con transición gradual al modelo de comportamiento conforme se acumula señal." },
            { t: "La burbuja de siempre lo mismo", p: "El modelo optimiza lo seguro y encierra a la usuaria en una sola categoría hasta que se aburre.", s: "Una cuota fija de exploración en cada fila: posiciones reservadas para contenido adyacente pero distinto, que además es cómo se descubren coaches nuevas." },
            { t: "El sesgo hacia el legacy", p: "Las clases antiguas acumulan más señal y ganan siempre, lo que perpetúa exactamente el problema actual.", s: "Normalización por antigüedad y por volumen de exposición: se compara el desempeño de cada clase contra lo esperado para su edad, no en términos absolutos." },
            { t: "Medir de verdad", p: "Sin medición no hay forma de saber si el sistema aporta o solo mueve clics de un lado a otro.", s: "Prueba A/B contra la home actual desde el primer día, con retención y clases completadas por semana como métricas primarias — no el clic." },
          ].map((x) => (
            <div key={x.t} style={{ background: "#fff", borderRadius: 20, padding: "22px 22px", border: "1px solid rgba(0,0,0,.06)" }}>
              <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px" }}>{x.t}</p>
              <p style={{ fontSize: 12, color: "#a08678", margin: "0 0 10px", lineHeight: 1.55, fontStyle: "italic" }}>{x.p}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ color: C.accent, fontWeight: 700, fontSize: 13, lineHeight: 1.4 }}>→</span>
                <p style={{ fontSize: 12.5, color: "#555", margin: 0, lineHeight: 1.6 }}>{x.s}</p>
              </div>
            </div>
          ))}
        </div>
      </Slide>
    ),
  },
  {
    id: "requisitos",
    render: () => (
      <Slide>
        <Eyebrow>Lo que necesito de ustedes</Eyebrow>
        <H1>Tres accesos y una persona de contacto.</H1>
        <Lead>
          El proyecto no requiere contratar a nadie, cambiar de proveedor de video ni rehacer la app.
          Se monta sobre lo que ya existe.
        </Lead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 30 }}>
          {[
            { n: "01", t: "Acceso de lectura a los datos", b: "Base de la app o del proveedor de video: reproducciones, usuarias, catálogo, suscripciones. Solo lectura, en ambiente separado si lo prefieren." },
            { n: "02", t: "Catálogo con su metadata", b: "El export de clases con tipo, coach, duración, músculo y equipo. Si está incompleto, la Fase 1 incluye completarlo." },
            { n: "03", t: "Un contacto técnico y uno de contenido", b: "Dos personas, aproximadamente dos horas de su tiempo por semana. El técnico para los accesos, el de contenido para validar que los hallazgos tengan sentido." },
          ].map((x) => (
            <div key={x.n} style={{ background: "#fff", borderRadius: 20, padding: "22px 20px", border: "1px solid rgba(0,0,0,.06)" }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: "#e6ddd7", margin: "0 0 10px", letterSpacing: "-1px" }}>{x.n}</p>
              <p style={{ fontSize: 13.5, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.35 }}>{x.t}</p>
              <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.6 }}>{x.b}</p>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", border: "1px solid rgba(0,0,0,.06)", borderLeft: `4px solid ${C.accent2}` }}>
          <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 8px" }}>Sobre privacidad</p>
          <p style={{ fontSize: 12.5, color: "#555", margin: 0, lineHeight: 1.65 }}>
            El sistema funciona con identificadores anonimizados: no necesita nombres, correos ni datos de pago.
            Todo se procesa en la infraestructura que ustedes designen y los datos no salen de su control en ningún momento.
          </p>
        </div>
      </Slide>
    ),
  },
  {
    id: "roadmap",
    render: () => (
      <Slide wide>
        <Eyebrow>Plan de trabajo</Eyebrow>
        <H1>15 semanas del acceso a los datos al recomendador medido.</H1>
        <Lead>
          El desarrollo se acelera con asistencia de IA en la parte repetitiva — pipelines, transformaciones,
          interfaz — lo que permite comprimir a menos de cuatro meses un proyecto que tradicionalmente toma ocho o nueve.
        </Lead>
        <div style={{ background: "#fff", borderRadius: 22, padding: "24px 26px", border: "1px solid rgba(0,0,0,.07)" }}>
          {PHASES.map((p, i) => (
            <div key={p.f} style={{ display: "grid", gridTemplateColumns: "80px 250px 1fr", gap: 16, alignItems: "center", padding: "13px 0", borderBottom: i < PHASES.length - 1 ? "1px solid #f7f4f1" : "none" }}>
              <Badge color={i === 3 ? C.accent : "#999"}>{p.f}</Badge>
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{p.name}</p>
                <p style={{ fontSize: 11, color: C.mute, margin: "3px 0 0" }}>{p.w}</p>
              </div>
              <div>
                <div style={{ display: "flex", height: 16, marginBottom: 6 }}>
                  <div style={{ width: `${(p.start / TOTAL_W) * 100}%` }} />
                  <div style={{ width: `${(p.dur / TOTAL_W) * 100}%`, background: i === 3 ? C.accent : C.accent2, borderRadius: 5, opacity: i === 3 ? 1 : 0.55 }} />
                </div>
                <p style={{ fontSize: 11.5, color: "#666", margin: 0, lineHeight: 1.5 }}>{p.out}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 40, marginTop: 26 }}>
          <Stat big="Semana 7" label="El tablero de contenido ya está en producción" color={C.accent2} />
          <Stat big="Semana 11" label="La fila 'Para ti' está viva en la app" color={C.accent} />
          <Stat big="Semana 15" label="Reporte de impacto medido contra la home actual" />
        </div>
      </Slide>
    ),
  },
  {
    id: "inversion",
    render: () => (
      <Slide wide>
        <Eyebrow>Inversión</Eyebrow>
        <H1>Menos que contratar a una persona, y funcionando en 15 semanas.</H1>
        <Lead>
          Un perfil de datos senior en México cuesta entre 78 y 117 mil pesos mensuales con carga social,
          toma tres meses encontrarlo y difícilmente trae experiencia en sistemas de recomendación.
          Esta es la alternativa.
        </Lead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginBottom: 24, marginTop: 30 }}>
          <PriceCol
            name="Diagnóstico"
            tagline="Punto de entrada de bajo riesgo, sin compromiso posterior"
            price="$45,000"
            unit="MXN · pago único · 2-3 semanas"
            items={[
              "Auditoría completa de los datos disponibles y de los gaps de tracking",
              "Análisis de eficiencia por categoría, coach, duración y formato",
              "Tablero estático con los hallazgos, para presentar internamente",
              "Plan técnico detallado del recomendador",
              "Se acredita completo si continúan al retainer",
            ]}
            foot="Ideal si quieren validar el valor antes de comprometer presupuesto."
          />
          <PriceCol
            name="Retainer Core"
            tagline="El proyecto completo: tablero en producción y recomendador v1 medido"
            price="$65,000"
            unit="MXN / mes · compromiso de 4 meses"
            highlight
            items={[
              "Todo lo del diagnóstico, incluido",
              "Pipeline de datos y tablero en producción, actualizado automáticamente",
              "Motor de recomendación v1 entregado con su API",
              "Prueba A/B contra la home actual, con reporte de impacto",
              "Sesión semanal de trabajo con el equipo",
              "Documentación y transferencia de conocimiento al cierre",
            ]}
            foot="Total del proyecto: $260,000 MXN por los 4 meses."
          />
          <PriceCol
            name="Evolución"
            tagline="Después del cierre, para que el sistema no se quede quieto"
            price="$28,000"
            unit="MXN / mes · mes a mes, cancelable"
            items={[
              "Reentrenamiento y calibración del modelo",
              "Nuevos experimentos y ciclos de medición",
              "Reporte mensual de contenido para el equipo de producción",
              "Soporte y ajustes sobre lo entregado",
            ]}
            foot="Opcional. Se contrata solo si quieren seguir iterando."
          />
        </div>
        <div style={{ background: "#fff", border: "1px solid rgba(0,0,0,.06)", borderRadius: 16, padding: "16px 22px", display: "flex", gap: 30, flexWrap: "wrap", alignItems: "center" }}>
          <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.6, flex: 1, minWidth: 280 }}>
            <strong>Alternativa con riesgo compartido:</strong> retainer reducido a $45,000 MXN mensuales más un bono
            por resultado atado a la mejora de retención medida en la prueba A/B. Si el sistema no mueve la aguja,
            pagan menos.
          </p>
          <div style={{ display: "flex", gap: 26 }}>
            <Stat big="4" label="meses de compromiso" />
            <Stat big="$260K" label="inversión total del proyecto" color={C.accent} />
          </div>
        </div>
      </Slide>
    ),
  },
  {
    id: "cierre",
    render: () => (
      <Slide>
        <Eyebrow>Próximo paso</Eyebrow>
        <H1 style={{ fontSize: 46, maxWidth: 840 }}>Empecemos por el diagnóstico. En tres semanas sabemos exactamente qué se puede construir.</H1>
        <Lead>
          Es la forma de arrancar con el menor riesgo para ustedes: una inversión acotada, un entregable
          concreto que sirve solo, y la decisión sobre el resto del proyecto tomada con información real
          en lugar de con una propuesta.
        </Lead>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 34 }}>
          {[
            { n: "Esta semana", t: "Accesos de lectura", b: "Definimos alcance y firmamos el acuerdo de confidencialidad" },
            { n: "Semana 2", t: "Primeros hallazgos", b: "Sesión de trabajo con lo que ya salió del análisis inicial" },
            { n: "Semana 3", t: "Diagnóstico y plan", b: "Entrega del tablero de hallazgos y del plan técnico completo" },
          ].map((x) => (
            <div key={x.n} style={{ borderTop: `3px solid ${C.accent}`, paddingTop: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 8px" }}>{x.n}</p>
              <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px" }}>{x.t}</p>
              <p style={{ fontSize: 12, color: "#666", margin: 0, lineHeight: 1.55 }}>{x.b}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 26, marginTop: 40, paddingTop: 28, borderTop: "1px solid rgba(0,0,0,.08)" }}>
          <Stat big="15" label="semanas al motor de recomendación funcionando" />
          <Stat big="2" label="entregables en producción: tablero + recomendador" color={C.accent} />
          <Stat big="0" label="datos nuevos que tienen que empezar a recolectar" color={C.accent2} />
        </div>
      </Slide>
    ),
  },
];

/* ══════════════════════ APP ══════════════════════ */

export function Deck({ slides }) {
  const [i, setI] = useState(0);
  const last = slides.length - 1;
  const go = (n) => setI(Math.max(0, Math.min(last, n)));

  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); go(i + 1); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(i - 1); }
      if (e.key === "Home") go(0);
      if (e.key === "End") go(last);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, last]);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [i]);

  const cur = slides[i];

  return (
    <div style={{ fontFamily: "'Poppins','Helvetica Neue',sans-serif", background: C.bg, minHeight: "100vh", color: C.ink }}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* puntos de progreso — esquina superior derecha, sin barra */}
      <div style={{ position: "fixed", top: 18, right: 28, zIndex: 20, display: "flex", alignItems: "center", gap: 5 }}>
        {slides.map((s, n) => (
          <button key={s.id} onClick={() => go(n)} title={s.id} style={{
            width: n === i ? 22 : 7, height: 7, borderRadius: 4, border: "none", padding: 0, cursor: "pointer",
            background: n === i ? C.accent : "#ded5cf", transition: "all .25s",
          }} />
        ))}
      </div>

      {/* slide */}
      <div style={{ padding: "52px 0 120px", minHeight: "100vh" }}>
        {cur.render()}
      </div>

      {/* navegación inferior */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 20, background: "rgba(247,244,241,.92)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "10px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <span style={{ fontSize: 11, color: C.mute, fontVariantNumeric: "tabular-nums" }}>
            {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            <span style={{ marginLeft: 12, color: "#c4b8b0" }}>usa ← → para navegar</span>
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => go(i - 1)} disabled={i === 0} style={{
              padding: "8px 18px", borderRadius: 20, border: "1px solid rgba(0,0,0,.12)", background: "#fff",
              fontSize: 12, fontWeight: 600, cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.35 : 1,
              fontFamily: "inherit", color: C.ink,
            }}>← Anterior</button>
            <button onClick={() => go(i + 1)} disabled={i === last} style={{
              padding: "8px 20px", borderRadius: 20, border: "none", background: C.ink, color: "#fff",
              fontSize: 12, fontWeight: 600, cursor: i === last ? "default" : "pointer", opacity: i === last ? 0.35 : 1,
              fontFamily: "inherit",
            }}>Siguiente →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FBYPitch() {
  return <Deck slides={SLIDES} />;
}
