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
export async function fetchGifts(gift: string) {
     try {
      const data = await sql<Gift>`
      SELECT name, price, expiry_date from ${gift}
      `
      const gifts = data.rows.map(row => ({
        item: row.name,
        price: row.price,
        expiryDate: row.expiry_date,
      }));
      return gifts;
     }
     catch (error) {
      console.error('Ошибка при извлечении gifts:', error);
      throw error;
    }
}

export async function fetchFilteredMailings(query: string, page: number) {
  try {
    const offset = (page - 1) * ITEMS_PER_PAGE;
    const data = await sql<Mailings>`
      SELECT name, date, number FROM mailings
      WHERE name ILIKE ${`%${query}%`}
      OR date::text ILIKE ${`%${query}%`}
      OR number::text ILIKE ${`%${query}%`}
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset};
    `;

    const mailings = data.rows.map(row => ({
      id: row.id,
      item: row.name,
      date: row.date,
      number: row.number
    }));

    return mailings;
  } catch (error) {
    console.error('Ошибка при получении данных из базы данных:', error);
    throw error;
  }
}


export async function fetchMailingsPages(query: string) {
  try {
    const count = await sql`
      SELECT COUNT(*)
      FROM mailings
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
      await sql<Mailings>`
          
          INSERT INTO mailings (name, date, number)
          VALUES (${mail.name}, ${mail.date}, ${mail.number})
          ON CONFLICT (name) DO UPDATE
          SET date = EXCLUDED.date, number = EXCLUDED.number;
      `;
      console.log('Данные успешно вставлены в таблицу mailings');
  } catch (error) {
      console.error('Ошибка при вставке данных в таблицу mailings:', error);
      throw error; 
  }
}

export async function MailingsPush(formData : FormData) {
  
  
  const name = formData.get('item') as string;
  const date = formData.get('date') as string;
  const number = formData.get('number') as string;
  const obj = {
    name: name,
    date: date,
    number: number,
  }
  
          
        
  sendMail(obj);
  console.log("name: " + name + " date: " + date);
  revalidatePath('/');
  redirect('/');
        
}



    export async function deleteMailing(formData: FormData) {
      const value = formData.get('name') as string;
      console.log("Call from the server");
      try {
        await sql<Mailings>`
        DELETE FROM mailings WHERE name = ${value};
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


 



