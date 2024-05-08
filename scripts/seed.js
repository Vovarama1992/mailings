const { db } = require('@vercel/postgres');
require('dotenv').config();
async function createJsonedMailingsTable(client) {
  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS jsoned_mailings (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        number INTEGER NOT NULL,
        gifts JSON NOT NULL
      );
    `;
    console.log("Table 'jsoned_mailings' created successfully");
  } catch (error) {
    console.error("Error creating 'jsoned_mailings' table:", error);
    throw error;
  }
}

function formater(date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

const names = [
  "Daily Digest", "Weekly Wrap-Up", "Tech Trends", "Health Hub", "Travel Buzz",
  "Fashion Fix", "Home & Garden Gazette", "Foodie Finds", "Culture Chronicle", "Entertainment Express",
  "Career Corner", "Financial Flash", "Lifestyle Lift", "Mindfulness Matters", "Parenting Pointers",
  "Student Scoop", "Bookworm's Bulletin", "Gaming Gazette", "Art Alert", "Music Minute",
  "Film Fanfare", "Sports Spotlight", "Pet Post", "Nature News", "Outdoor Outlook",
  "DIY Dispatch", "Gadget Gazette", "Fitness Focus", "Motivation Mail", "Recipe Roundup",
  "Language Lessons", "Job Junction", "Startup Stories", "Investor Insights", "Leadership Letter",
  "Mindset Memo", "Yoga Yarns", "Self-Care Dispatch", "Productivity Picks", "Fashion Forward",
  "Budget Brief", "Travel Tales", "Tech Talk", "Wellness Weekly", "Relationship Report"
];
function randomDate(star, en) {
  const start = new Date(star);
  const end = new Date(en);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}
function randomNum() {
  return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
}
function extender(names) {
  const extended = [];
  for (const name of names) {
        const arr = [name, randomDate("2024-05-12", "2024-12-31"), randomNum()];
        extended.push(arr);
  }
  return extended;
}
const extended_mailings = extender(names);
async function seedExtendedMailings(client) {
  try {
      const promises = extended_mailings.map(async (ext) => {
          await client.sql`
              INSERT INTO extended_mailings (name, date, number) 
              VALUES (${ext[0]}, ${ext[1]}, ${ext[2]})
          `;
      });

      await Promise.all(promises);
      console.log("Extended mailings seeded successfully.");
  } catch (error) {
      console.error("Error seeding extended mailings:", error);
  }
}

function randomPrice() {
  return Math.floor(Math.random() * 1000) + 1;
}

function jsonIzer(ar) {
  const date = ar[1];
  const number = ar[2];
  const start = "2024-05-14";
  const gifts = getRelatedWords(ar[0], number);
  const extended_gifts = gifts.map(gift => [gift, randomDate(start, date), randomPrice() ]);
  return JSON.stringify(extended_gifts);

}

const giftsContent = extended_mailings.map(ext => jsonIzer(ext));


function getRelatedWords(word, num) {
  const relatedWords = [];
  for (let i = 0; i < num; i++) {
      relatedWords.push(word + "_" + (i + 1)); 
  }
  return relatedWords;
}
const finalArr = extended_mailings.map((ext, i) => [...ext, giftsContent[i]]);



async function insertGiftsContent(client) {
  try {
    const insertPromises = finalArr.map(async (far) => {
      await client.sql`
        INSERT INTO jsoned_mailings (name, date, number, gifts)
        VALUES (${far[0]}, ${far[1]}, ${far[2]}, ${far[3]})
      `;
    });
    await Promise.all(insertPromises);
    console.log("Gifts content inserted successfully");
  } catch (error) {
    console.error("Error inserting gifts content:", error);
    throw error;
  }
}


async function createGiftTables(client) {
  
  try {
    const data = await client.sql`
    SELECT name, date, number FROM mailings`
    
    const names = data.rows.map(row => {
      return {
        item: row.name,
        date: row.date,
        number: row.number,
      };
    });
    
    
    const promises = names.map(async row => {
      const name = row.item;
      const expiryDate = row.expiry_date;
      const price = row.price;
    
      try {
        
        const result = await client.sql`
          CREATE TABLE IF NOT EXISTS "${name}" (
            id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        expiry_date DATE
          );
        `;
        console.log(`Таблица "${name}" успешно создана.`);
        return result; 
      } catch (error) {
        console.error(`Ошибка при создании таблицы "${name}":`, error);
        throw error;
      }
    });
    
    try {
      
      const results = await Promise.all(promises);
      console.log("Все таблицы созданы успешно:", results);
    } catch (error) {
      console.error("Ошибка при создании таблиц:", error);
    }
  } catch(err) {
    console.log("creating gifr table ", err)
  }
}

async function fetchJson(client, item) {
  const data = await client.sql`
      SELECT gifts FROM jsoned_mailings
      WHERE NAME = ${item}
  `;
  return data.rows[0];
  
}

 async function remove(client, item, index) {
  
  try {
    const obj = await client.sql`
      SELECT gifts FROM jsoned_mailings WHERE name = ${item}
    `;
    const giftArray = obj.rows[0].gifts;
    console.log("GiftArray: " + giftArray);
    const newGiftsArray = giftArray.filter((ar, i) => i !== Number(index));
    console.log("IsTrue: " + giftArray !== newGiftsArray);
    const json = JSON.stringify(newGiftsArray);
    await client.sql`
      UPDATE jsoned_mailings
      SET gifts = ${json}
      WHERE name = ${item}
    `;
    console.log(`Element at index ${index} removed from ${item}.`);
  } catch (error) {
    console.error('Error removing element:', error);
  }
    
}
async function limiter(client) {
  try {
    await client.sql`
    DELETE FROM jsoned_mailings WHERE name = 'Home & Garden Gazette';
    `;
    console.log("Successful remove");
  }
  catch (error) {
    console.error('Ошибка при удалении', error);
    throw error; 
}
}
async function fetchGiftsLength(client, item) {
  try {
    const data = await client.sql`
      SELECT gifts FROM jsoned_mailings WHERE name = ${item}
    `;
    const gifts = data.rows[0].gifts;
    const giftsLength = gifts ? gifts.length : 0;
    console.log("gifts length: " + giftsLength);
    return giftsLength;
  } catch (error) {
    console.error('Ошибка при запросе значения gifts:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await fetchGiftsLength(client, "Weekly Wrap-Up");
  

  await client.end();
}


main().catch((err) => {
  console.error('An error occurred while creating gift tables:', err);
});




