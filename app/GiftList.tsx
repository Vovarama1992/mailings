'use server';
import styles from './page.module.scss';
import Link from 'next/link';
import Gift from './Gift';
import { fetchJson } from './lib/fetchers';
export default async function GiftList({item, num, date}: {item: string, num: string, date: string}) {
    const gifts = await fetchJson(item);
    return (
        <><div className={styles.giftWrapper}>
            {gifts.map((gift: [string, string, number], index: number) => (
                <Gift key={index} commonItem={item} item={gift[0]} date={gift[1]}  price={gift[2]}/>
            ))}
            

        </div>
        <Link href={`/mailredactor?item=${item}&number=${num}&date=${date}`}><button>Back</button></Link></>
    )
}



function getRelatedWords(word: string, num: number) {
    const relatedWords = [];
    for (let i = 0; i < num; i++) {
        relatedWords.push(word + "_" + (i + 1)); 
    }
    return relatedWords;
  }

  function randomDate(date: string) {
    const dateObject = new Date(new Date(date).getTime() - Math.floor(Math.random() * (1000 * 3600 * 24 * 30)));
            

           const year = dateObject.getFullYear();
          const month = ('0' + (dateObject.getMonth() + 1)).slice(-2); 
          const day = ('0' + dateObject.getDate()).slice(-2); 

           const randomExpiryDate = `${year}-${month}-${day}`;
           return randomExpiryDate;
          
  }
  function randomPrice(): number {
    return Math.floor(Math.random() * 1000) + 1;
  }
  function priceDater(arr: string[], date: string): [string, string, number][] {
    const newArr: [string, string, number][] = arr.map(ar => {
        const newDate = randomDate(date);
        const newPrice = randomPrice();
        return [ar, newDate, newPrice];
    });
    return newArr;
}
  