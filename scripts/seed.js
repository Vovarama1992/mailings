const { db } = require('@vercel/postgres');
require('dotenv').config();

function getRelatedWords(word, num) {
  const relatedWords = [];
  for (let i = 0; i < num; i++) {
      relatedWords.push(word + "_" + (i + 1)); 
  }
  return relatedWords;
}

async function createGiftTables(client) {
  
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    const giftRow = await client.sql`
      CREATE TABLE IF NOT EXISTS книги (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        expiry_date DATE
      );
    `;
    console.log("giftRow is created as книги ");
  } catch(err) {
    console.log("creating gifr table ", err)
  }
}


async function main() {
  const client = await db.connect();

  await createGiftTables(client);
  console.log("Big changes!");

  await client.end();
}

main().catch((err) => {
  console.error('An error occurred while creating gift tables:', err);
});


