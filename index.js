require('dotenv').config();  // Загружает переменные из .env
const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

// База проектов
const projects = [
  {
    name: "Закрывающий тег",
    url: "https://github.com/MariaOstanina/zakrivayuschiy-teg-f",
    tech: ["HTML", "CSS", "Адаптивность", "Кроссбраузерность"]
  },
  {
    name: "Blog customizer",
    url: "https://github.com/MariaOstanina/blog-customizer",
    tech: ["TypeScript", "React", "Webpack"]
  },
  {
    name: "Stellar burgers",
    url: "https://github.com/MariaOstanina/stellar-burgers",
    tech: ["TypeScript", "React", "React Router", "Webpack"]
  },
  {
    name: "Emogy",
    url: "https://github.com/MariaOstanina/emogi",
    tech: ["TypeScript", "React", "Styled Components", "Vite"]
  },
  {
    name: "Проект Место",
    url: "https://github.com/MariaOstanina/mesto-project-ff",
    tech: ["JavaScript", "Webpack"]
  }
];

// Все уникальные технологии из проектов
const allTech = [...new Set(projects.flatMap(proj => proj.tech))];

// Клавиатура с кнопками технологий
function getTechKeyboard() {
  return Markup.inlineKeyboard(
    allTech.map(tech => Markup.button.callback(tech, `tech_${tech}`)),
    { columns: 2 } // 2 колонки для красоты
  );
}

// Команда /start
bot.start((ctx) => {
  ctx.reply(
    '👋 Привет! Я помогу найти проекты по технологиям.\n' +
    'Выбери технологии из списка:',
    getTechKeyboard()
  );
});

// Обработка нажатий на кнопки
bot.action(/^tech_/, async (ctx) => {
  const selectedTech = ctx.callbackQuery.data.replace('tech_', '');
  const matchedProjects = projects.filter(proj => 
    proj.tech.includes(selectedTech)
  );

  if (matchedProjects.length === 0) {
    await ctx.reply('Проектов не найдено 😢');
    return;
  }

  let response = `🔍 Проекты с технологией *${selectedTech}*:\n\n`;
  matchedProjects.forEach(proj => {
    response += `➡️ [${proj.name}](${proj.url})\n`;
  });

  await ctx.replyWithMarkdown(response, {
    disable_web_page_preview: true // Чтобы ссылки не разворачивались
  });
});

// Запуск бота
bot.launch();
console.log('Бот запущен!');