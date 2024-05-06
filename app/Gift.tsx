'use client';
import styles from './page.module.scss';
import { useState } from 'react';
export default function Gift({item, price, date } : {item: string, price: number, date: string}) {
    const [isVisible, setIsVisible] = useState(false);
    const [switcher, setSwitcher] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const showPopup = (event: any, kind: boolean) => {
    
    setPosition({ x: event.clientX, y: event.clientY });
    
    
        setIsVisible(kind);
    }
    
  ;

  
    return (
        <div>
      <div onMouseOver={(e) => showPopup(e, true)} onMouseOut={(e) => showPopup(e, false)} className={styles.item}>
        {item}
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