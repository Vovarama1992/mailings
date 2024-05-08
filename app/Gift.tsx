'use client';
import styles from './page.module.scss';
import Link from 'next/link';
import { useState } from 'react';
export default function Gift({item, price, date, commonItem } : {item: string, price: number, date: string, commonItem: string}) {
    const [isVisible, setIsVisible] = useState(false);
    
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const indexToDelete = findIndexToDelete(item);

 
 

  const showPopup = (event: any, kind: boolean) => {
    
    setPosition({ x: event.clientX, y: event.clientY });
    
    
        setIsVisible(kind);
    }
    
  ;

  
    return (
        <div>
      <div onMouseOver={(e) => showPopup(e, true)} onMouseOut={(e) => showPopup(e, false)} className={styles.item}>
        {item}<Link href={`/GiftDeleteConfirmer?item=${commonItem}&number=${indexToDelete}&date=${date}`}>x</Link>
      </div>
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            width: 'auto',
            height: 'auto',
            top: position.y,
            left: position.x,
            border: '1px solid black',
            padding: '5px',
            background: 'white',
            zIndex: 9999, 
          }}
        >
          Цена {price}
    <br></br>
    <br></br>
    {date}
        </div>
      )}
    </div>
    )
}

function findIndexToDelete(str: string) {
  for (let i = 0; i < str.length; i++) {
    if (/\d/.test(str[i])) {
      return Number(str.substring(i)) - 1;
    }
  }
  return 0;
}