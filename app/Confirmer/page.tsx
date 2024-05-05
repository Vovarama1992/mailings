'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { deleteMailing } from '../lib/fetchers'
import { Suspense } from 'react';
import Skeleton from '../Search';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
export default function ConfirmWrapper() {
    return (
        <Suspense fallback={<Skeleton />}>
            <Confirmer />
        </Suspense>
    )
}

 function Confirmer() {
    const searchparams = useSearchParams();
        const params = new URLSearchParams(searchparams);
        const item = params.get('item') as string;
   
    

    useEffect(() => {
        
        const form = document.querySelector('form');
        const isConfirmed = window.confirm('Are you sure?');
        if (isConfirmed && form) {
            form.requestSubmit()
            
        } else redirect('/');
        
        return () => {
            
        };
    }, [item]);
    return (
        <form action={deleteMailing}>
            <input name='name' value={item} readOnly></input>
            

        </form>
    )
}