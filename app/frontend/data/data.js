// Демо-данные для списка уроков (используются, пока /api/v1/lesson/all_lessons не реализован на бэке).
// Форма объектов повторяет то, что уже отдаёт all_lessons_by_teacher: vocabulary_cards / fill_blank_exercises.
window.SEED_LESSONS = [
  {
    id: "seed-1",
    title: "Météo & Lieux",
    vocabulary_cards: [
      { id: 1, word_fr: "Le soleil",     word_ru: "Солнце",  icon: "Sun" },
      { id: 2, word_fr: "La pluie",      word_ru: "Дождь",   icon: "CloudRain" },
      { id: 3, word_fr: "Les nuages",    word_ru: "Облака",  icon: "Cloud" },
      { id: 4, word_fr: "La neige",      word_ru: "Снег",    icon: "Snowflake" },
      { id: 5, word_fr: "Le vent",       word_ru: "Ветер",   icon: "Wind" },
      { id: 6, word_fr: "L'orage",       word_ru: "Гроза",   icon: "CloudLightning" },
      { id: 7, word_fr: "Le brouillard", word_ru: "Туман",   icon: "CloudFog" },
      { id: 8, word_fr: "La chaleur",    word_ru: "Жара",    icon: "Thermometer" },
    ],
    fill_blank_exercises: [
      {
        id: 1,
        sentence: "Aujourd'hui à Paris, ___ brille dans le ciel.",
        translation: "Сегодня в Париже в небе светит солнце.",
        options: ["le soleil", "la pluie", "le vent", "la neige"],
        correct_answer: "le soleil",
      },
      {
        id: 2,
        sentence: "À Lyon, il ___ depuis ce matin. Prends ton parapluie!",
        translation: "В Лионе с утра идёт дождь. Возьми зонт!",
        options: ["pleut", "neige", "fait chaud", "fait beau"],
        correct_answer: "pleut",
      },
      {
        id: 3,
        sentence: "En hiver à Moscou, il ___ beaucoup.",
        translation: "Зимой в Москве много снега.",
        options: ["pleut", "neige", "fait chaud", "y a du soleil"],
        correct_answer: "neige",
      },
    ],
  },
  {
    id: "seed-2",
    title: "Au Restaurant",
    vocabulary_cards: [
      { id: 1, word_fr: "L'addition",    word_ru: "Счёт",     icon: "Receipt" },
      { id: 2, word_fr: "Le menu",       word_ru: "Меню",     icon: "BookOpen" },
      { id: 3, word_fr: "Le serveur",    word_ru: "Официант", icon: "UserRound" },
      { id: 4, word_fr: "La réservation",word_ru: "Бронь",    icon: "CalendarCheck" },
    ],
    fill_blank_exercises: [
      {
        id: 1,
        sentence: "Monsieur, ___ s'il vous plaît.",
        translation: "Официант, счёт, пожалуйста.",
        options: ["l'addition", "le menu", "la réservation", "le serveur"],
        correct_answer: "l'addition",
      },
    ],
  },
];
