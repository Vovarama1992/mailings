
import MailingList from './MailingList';
import Search from './Search';
import Pagination from './Pagination';
import { fetchMailingsPages } from './lib/fetchers';


 
export default async function Page({
    searchParams,
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    };
  }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchMailingsPages(query);
    return (
        <>
            <Search />
            <MailingList query={query} currentPage={currentPage} />
            <Pagination totalPages={totalPages}/>
        </>
    )
}