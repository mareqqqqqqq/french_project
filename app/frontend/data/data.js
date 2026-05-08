window.LESSON_DATA = {
  title: "Météo & Lieux",
  subtitle: "Leçon 3 · Niveau A1",
  vocab: [
    { fr: "Le soleil",   ru: "Солнце",  icon: "Sun",       hint: "Il fait beau" },
    { fr: "La pluie",    ru: "Дождь",   icon: "CloudRain", hint: "Il pleut" },
    { fr: "Les nuages",  ru: "Облака",  icon: "Cloud",     hint: "Il y a des nuages" },
    { fr: "La neige",    ru: "Снег",    icon: "Snowflake", hint: "Il neige" },
    { fr: "Le vent",     ru: "Ветер",   icon: "Wind",      hint: "Il y a du vent" },
    { fr: "L'orage",     ru: "Гроза",   icon: "CloudLightning", hint: "Il y a un orage" },
    { fr: "Le brouillard", ru: "Туман", icon: "CloudFog",  hint: "Il y a du brouillard" },
    { fr: "La chaleur",  ru: "Жара",    icon: "Thermometer", hint: "Il fait chaud" },
  ],

  match: [
    { fr: "Le soleil",  ru: "Солнце" },
    { fr: "La pluie",   ru: "Дождь" },
    { fr: "Les nuages", ru: "Облака" },
    { fr: "La neige",   ru: "Снег" },
    { fr: "Le vent",    ru: "Ветер" },
  ],

  sentences: [
    {
      prompt: "Aujourd'hui à Paris, ___ brille dans le ciel.",
      translation: "Сегодня в Париже в небе светит солнце.",
      options: ["le soleil", "la pluie", "le vent", "la neige"],
      answer: "le soleil",
    },
    {
      prompt: "À Lyon, il ___ depuis ce matin. Prends ton parapluie!",
      translation: "В Лионе с утра идёт дождь. Возьми зонт!",
      options: ["pleut", "neige", "fait chaud", "fait beau"],
      answer: "pleut",
    },
    {
      prompt: "En hiver à Moscou, il ___ beaucoup.",
      translation: "Зимой в Москве много снега.",
      options: ["pleut", "neige", "fait chaud", "y a du soleil"],
      answer: "neige",
    },
  ],
};
