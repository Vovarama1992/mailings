import Link from 'next/link';
import { useEffect } from 'react';
import { deleteMailing, fetchGiftsLength } from '../lib/fetchers';
import styles from '../page.module.scss';
import { MailingProps } from '../lib/definitions';
export default async function Mailing({ id, item, date, number, query } : MailingProps) {
const fixedItem = encodeURIComponent(item);

const giftsLenth = await fetchGiftsLength(item, query);

    
    return (
        <div className={styles.mailing} id={id}>
            <div className={styles.Element}>{item}</div>
            <div className={styles.Element}>{date}</div>
            <div className={styles.numberElement}>{giftsLenth}</div>
            <div className={styles.redactor}>
                <Link href={`/mailredactor?item=${fixedItem}&date=${date}&number=${number}`}><button className={styles.button}></button></Link>
            </div>
            <div className={`${styles.redactor} ${styles.delete}`}>
                <form action={deleteMailing} >
                    <input hidden={true} name='name' value={item} readOnly></input>
                    <Link href={`/Confirmer?item=${item}`}><button type='submit' className={styles.button}></button></Link></form>
            </div>
            <div className={`${styles.redactor} ${styles.adder}`}>
            <Link href={`/mailredactor?item=''&date=''&number=''`}><button className={styles.button}></button></Link>
            </div>
            
        </div>
    )

}