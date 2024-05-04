'use server';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    Mailings,
    OnlyEssential,
} from './definitions';

const ITEMS_PER_PAGE = 6;

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


 



