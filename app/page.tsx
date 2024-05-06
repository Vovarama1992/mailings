import GiftList from './GiftList';
import MailingList from './MailingList';
import Search from './Search';
import Pagination from './Pagination';
import {Suspense} from 'react';
import Skeleton from './Skeleton';
import { fetchMailingsPages } from './lib/fetchers';


 
export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
      showGifts?: boolean;
      item?: string;
      date?: string;
      num?: string;
    };
  }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchMailingsPages(query);
    const item = searchParams?.item || "";
    const date = searchParams?.date || "";
    const num = searchParams?.num || "";
    const showGifts = searchParams?.showGifts || false;
    return (
        <>{!showGifts ? (<>
            <Search />
            <Suspense fallback={<Skeleton />}>
              <MailingList query={query} currentPage={currentPage} />
            </Suspense>
            <Pagination totalPages={totalPages}/></>) : (<GiftList item={item} 
            date={date} num={num}/>)}
            
    </>
    )
}