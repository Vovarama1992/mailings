const { db } = require('@vercel/postgres');
require('dotenv').config();
async function changeMailingsDates(client3) {
  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


const startDate = new Date('2024-04-22'); 
const endDate = new Date('2024-12-31'); 


const randomDates = [];

// Генерируем 100 случайных дат
for (let i = 0; i < 100; i++) {
    randomDates.push(randomDate(startDate, endDate));
}
const mailings = await client.sql`SELECT * FROM mailings`;

// Создаем массив промисов для выполнения запросов UPDATE
const updatePromises = mailings.map(async (mailing) => {
  const randomDateIndex = Math.floor(Math.random() * randomDates.length);
  const randomDate = randomDates[randomDateIndex];
  
  // Обновляем дату для текущей строки
  await client.sql`
    UPDATE mailings
    SET date = ${randomDate}
    WHERE id = ${mailing.id}; // Предполагается, что есть поле id для каждой строки
  `;
});

// Ждем выполнения всех промисов
await Promise.all(updatePromises);

}








async function main() {
  const client = await db.connect();

  
  await changeMailingsDates(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
