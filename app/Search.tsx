'use client';
import { useDebouncedCallback } from 'use-debounce';

import styles from './page.module.scss';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Search() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((ask: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (ask) {
            params.set('query', ask);
          } else {
            params.delete('query');
          }
          replace(`${pathname}?${params.toString()}`);
    })
    return (
        <div className={styles.inputWrapper}>
            <input onChange={(e) => handleSearch(e.target.value)} 
            defaultValue={searchParams.get('query')?.toString()}
            className={styles.inputInput} placeholder='search..'></input>
        </div>
    )
}