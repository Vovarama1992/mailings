const { db } = require('@vercel/postgres');
require('dotenv').config();
async function changeMailingsDates(client) {
  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


const startDate = new Date('2024-04-22'); 
const endDate = new Date('2024-12-31'); 


const randomDates = [];


for (let i = 0; i < 100; i++) {
    const res = (randomDate(startDate, endDate));
    const date = new Date(res);

const year = date.getFullYear();
const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
const day = date.getDate().toString().padStart(2, '0'); 

const formattedDate = `${year}-${month}-${day}`;
    randomDates.push(formattedDate);
}
const data = await client.sql`SELECT * FROM mailings`;
const mailings = data.rows.map(row => ({
  id: row.id,
  item: row.name,
  date: row.date,
  number: row.number
}));
console.log("Mailings [0] is " + mailings[0].item);



const updatePromises = mailings.map(async (mailing) => {
  const randomDateIndex = Math.floor(Math.random() * randomDates.length);
  const randomDate = randomDates[randomDateIndex];
  
  
  await client.sql`
    UPDATE mailings
    SET date = ${randomDate}
    WHERE id = ${mailing.id}; 
  `;
});


await Promise.all(updatePromises);

}








async function main() {
  const client = await db.connect();

  
  await changeMailingsDates(client);

  await client.end();
  console.log("date formating");
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
