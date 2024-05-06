'use client';

import styles from '../page.module.scss';
import Skeleton from '../Skeleton';
import { MailingsPush } from '../lib/fetchers';
import Link from 'next/link';
import { Suspense } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';



export default function MailRedactor() {
          return(
            <Suspense fallback={<Skeleton/>}>
                <MaiilRedactor />
            </Suspense>
          )
}

function MaiilRedactor() {
    const searchparams = useSearchParams();
    const params = new URLSearchParams(searchparams);
    const initialObj = {item: params.get('item') as string,
        date: params.get('date') as string,
        number: params.get('number') as string,
    }
    const [obj, setObj] = useState(initialObj);
    let letter;
    if (initialObj.date) {
        const target = initialObj.date;
        const targetDate: any = new Date(target.split('.').reverse().join('-'));
        const todayDate: any = new Date();
        const remainingDays = Math.ceil((targetDate - todayDate) / (1000 * 3600 * 24));
        letter = remainingDays > 0 ? `Осталось ${remainingDays} дней` : "Акция истекла, пора удалять";
        
    }
   
    
function onInput(value: string, attr: 'item' | 'date' | 'number') {
    const newObj = {...obj, [attr]: value};
    setObj(newObj);
}
function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
   
   

    
    const isConfirmed = window.confirm('Are you sure?');
    
   
    if (isConfirmed) {
      
        const form = event.currentTarget; 
        form.requestSubmit();
        alert(obj.item + " is added");
    } else {
      
      event.preventDefault();
      return;
    }
  }

      return (
              <form action={MailingsPush} onSubmit={handleSubmit}> <div className={styles.inputWrapper}>
                <label htmlFor='item'></label>
                  <input type='text' onChange={(e) => onInput(e.target.value, 'item')} name='item' value={obj.item} placeholder='item' className={styles.inputInput}></input> 
               </div>
               <div className={styles.inputWrapper}>
               <label htmlFor='date'></label>
               <input type='date' onChange={(e) => onInput(e.target.value, 'date')} name='date' value={obj.date} placeholder='date' className={styles.inputInput}></input>    
               </div>
               
               <div className={styles.inputWrapper}>
               <label htmlFor='number'></label>
               <input type='number' onChange={(e) => onInput(e.target.value, 'number')} name='number' value={obj.number} placeholder='number' className={styles.inputInput}></input> 
               </div>
               <div className={styles.sendBack}>
                   <Link href={'/'}><button>Back</button></Link>
                   <button type='submit'  >Send Changes</button>
                   <Link href={`/?item=${obj.item}&date=${obj.date}&num=${obj.number}&showGifts=true`}><button>Show gifts</button></Link>
                   
                   
               </div>
               <div className={styles.letter}>{letter}</div>
               
               </form>
      )
}






