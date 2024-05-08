'use server';
import styles  from "./page.module.scss";
import Mailing from './ui/mailing';
import { fetchFilteredMailings} from './lib/fetchers';


export default async function MailingList({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const mailings = await fetchFilteredMailings(query, currentPage);
  
 
 
  return (
    <div >
      
      {mailings.map((mail, index) => (
        <Mailing key={index}  query={query} id={mail.id} item={mail.item} date={mail.date} number={mail.number} />
      ))}
    </div>

  )
}