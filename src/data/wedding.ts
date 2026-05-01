export const wedding = {
  couple: {
    bride: 'Екатерина',
    groom: 'Никита',
    displayName: 'Екатерина & Никита',
  },

  date: {
    iso: '2026-07-04T15:30:00+03:00',
    weekday: 'суббота',
    day: '04',
    month: 'Июль',
    monthShort: 'июл',
    year: '2026',
    pretty: '04 Июля 2026',
  },

  venue: {
    name: 'Ресторан «Фьюжн»',
    addressShort: 'Волгоград, ул. Автомагистральная, 2/1',
    website: 'https://fusion34.ru',
    yandexMapsUrl:
      'https://yandex.ru/maps/?text=Волгоград%2C+ул.+Автомагистральная%2C+2%2F1',
    yandexMapEmbed:
      'https://yandex.ru/map-widget/v1/?ll=44.516%2C48.690&z=15&pt=44.516%2C48.690%2Cpm2rdm&l=map',
  },

  program: [
    {
      time: '11:30',
      title: 'Выкуп невесты',
      place: 'ул. Анны Купалы, 67, Волгоград',
    },
    {
      time: '15:30',
      title: 'Торжественная регистрация',
      place: 'ЗАГС Советского района, г. Волгоград',
    },
    {
      time: '16:30',
      title: 'Свадебный фуршет',
      place: 'Ресторан «Фьюжн»',
    },
  ],

  dressCode: {
    intro:
      'Мы будем признательны, если вы поддержите цветовую гамму торжества в своих нарядах',
    palette: [
      { name: 'Нежно-голубой', hex: '#B8D4E8', pantone: '13-4308' },
      { name: 'Коралловый', hex: '#F2A48E', pantone: '15-1247' },
      { name: 'Пыльная роза', hex: '#F0C4C4', pantone: '13-1407' },
      { name: 'Лавандовый', hex: '#C9BCD8', pantone: '14-3812' },
      { name: 'Мятно-зелёный', hex: '#B8D8C0', pantone: '13-6008' },
    ],
    note: 'Просьба избегать неоновых тонов и полностью чёрных нарядов',
  },

  quote: 'All you need is love',

  music: {
    src: '',
    title: 'Фоновая музыка',
    autoPromptDelayMs: 4000,
    placeholderToast: 'Музыка появится позже',
  },

  rsvp: {
    formActionUrl: 'https://docs.google.com/forms/d/e/REPLACE_FORM_ID/formResponse',
    fields: {
      name: 'entry.0000000000',
      attendance: 'entry.0000000001',
    },
    attendanceValues: {
      yes: 'Я с удовольствием приду',
      no: 'К сожалению, не смогу присутствовать',
    },
    successMessage: 'Спасибо! Мы вас ждём ❤',
    declineMessage: 'Жаль, что не сможете быть. Спасибо, что дали знать!',
    errorMessage: 'Что-то пошло не так. Попробуйте ещё раз или обновите страницу.',
  },
} as const

export type Wedding = typeof wedding
