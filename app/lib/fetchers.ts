'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    Mailings,
    OnlyEssential,
    Gift,
} from './definitions';

const ITEMS_PER_PAGE = 6;

export async function createGiftTable(tableName: string) {
  try {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    
    const giftRow = await sql<Gift>`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        expiry_date DATE
      );
    `;
    console.log("giftRow is created as " + giftRow);
  } catch(err) {
    console.log("creating gifr table ", err)
  }
}

function getRelatedWords(word: string, num: number) {
  const relatedWords = [];
  for (let i = 0; i < num; i++) {
      relatedWords.push(word + "_" + (i + 1)); 
  }
  return relatedWords;
}
export async function seedGifts(word: string, num: string, date: string) {
          const gifts = getRelatedWords(word, Number(num));
          const insertPromises = gifts.map(async (gift) => {
            const randomPrice = Math.floor(Math.random() * 1000) + 1;
            const dateObject = new Date(new Date(date).getTime() - Math.floor(Math.random() * (1000 * 3600 * 24 * 30)));
            

           const year = dateObject.getFullYear();
          const month = ('0' + (dateObject.getMonth() + 1)).slice(-2); 
          const day = ('0' + dateObject.getDate()).slice(-2); 

           const randomExpiryDate = `${year}-${month}-${day}`;
          
            await sql<Gift>`
              INSERT INTO ${word} (name, price, expiry_date)
              VALUES (${gift}, ${randomPrice}, ${randomExpiryDate})
            `;
          });
          
          await Promise.all(insertPromises);

}


export async function fetchFilteredMailings(query: string, page: number) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const data = await sql<Mailings>`
      SELECT name, date, number FROM jsoned_mailings
      WHERE name ILIKE ${`%${query}%`}
      OR date::text ILIKE ${`%${query}%`}
      OR number::text ILIKE ${`%${query}%`}
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset};
    `;

    const mailings = data.rows.map(row => ({
      id: row.id,
      item: row.name,
      date: formater(row.date),
      number: row.number
    }));

    return mailings;
  } catch (error) {
    console.error('Ошибка при получении данных из базы данных:', error);
    throw error;
  }
}
export async function fetchJson(item: string)  {
  
  const data = await sql`
      SELECT gifts FROM jsoned_mailings
      WHERE NAME = ${item}
  `;
  const row = data.rows[0];
  const values = Object.values(row);
  return values[0];
  
}

export async function remove(formData: FormData) {
  const item = formData.get('item') as string;
  const index = formData.get("number") as string;
  const date = formData.get('date') as string;
  const indexNum = Number(index) + 1;
  try {
    const obj = await sql`
      SELECT gifts FROM jsoned_mailings WHERE name = ${item}
    `;
    const giftArray: [string, string, number][] = obj.rows[0].gifts;
    const newGiftsArray = giftArray.filter((ar, i) => i !== Number(index));
    const json = JSON.stringify(newGiftsArray);
    await sql`
      UPDATE jsoned_mailings
      SET gifts = ${json}
      WHERE name = ${item}
    `;
    console.log(`Element at index ${index} removed from ${item}.`);
    
    
  } catch (error) {
    console.error('Error removing element:', error);
  }
  
  revalidatePath('/');
    redirect(`/?item=${item}&number=${indexNum}&date=${date}&showGifts=true`);
    
    
    
    
}


export async function fetchMailingsPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM jsoned_mailings
      WHERE
        name ILIKE ${`%${query}%`} OR
        date::text ILIKE ${`%${query}%`} OR
        number::text ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    console.log("totalPages: " + totalPages);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of mailings.');
  }
}







async function sendMail(mail: OnlyEssential) {
  try {
      await sql`
          
      INSERT INTO jsoned_mailings (name, date, number, gifts)
      VALUES (${mail.name}, ${mail.date}, ${mail.number}, ${mail.gifts})
      ON CONFLICT (name) DO UPDATE
      SET date = EXCLUDED.date, number = EXCLUDED.number, gifts = EXCLUDED.gifts;
          
      `;
      console.log('Данные успешно вставлены в таблицу jsoned_mailings');
  } catch (error) {
      console.error('Ошибка при вставке данных в таблицу jsoned_mailings:', error);
      throw error; 
  }
}
function randomDate(star: any, en: any) {
  const start = new Date(star);
  const end = new Date(en);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}


function randomNum() {
  return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
}

function randomPrice() {
  return Math.floor(Math.random() * 1000) + 1;
}




export async function MailingsPush(formData : FormData) {
  
  
  const name = formData.get('item') as string;
  const date = formData.get('date') as string;
  const number = formData.get('number') as string;
  console.log("Date is " + date);

  const words = getRelatedWords(name, Number(number));
  const extended_words = words.map(word => [word, randomDate("2024-05-12", date), randomPrice()]);
  const json = JSON.stringify(extended_words);


  
  const obj = {
    name: name,
    date: date,
    number: number,
    gifts: json,
  }
  
          
        
  sendMail(obj);
  console.log("name: " + name + " date: " + date);
  revalidatePath('/');
  redirect('/');
        
}

export async function fetchGiftsLength(item: string, query: string) {
  try {
    const data = await sql`
      SELECT gifts FROM jsoned_mailings WHERE name = ${item}
    `;
    const gifts = data.rows[0].gifts;
    const giftsLength = gifts ? gifts.length : 0;
    return giftsLength;
  } catch (error) {
    console.error('Ошибка при запросе значения gifts:', error);
    throw error;
  }
}


    export async function deleteMailing(formData: FormData) {
      let value = formData.get('name') as string;
      if (value == "Home") {
        value = "Home & Garden Gazette";
      }
      console.log("Call from the server");
      try {
        await sql`
        DELETE FROM jsoned_mailings WHERE name = ${value};
        `;
        console.log("Successful remove");
      }
      catch (error) {
        console.error('Ошибка при удалении', error);
        throw error; 
    }
    revalidatePath('/');
    redirect('/');
    
    
  }

  function formater(date: any) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }


 



