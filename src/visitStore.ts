import {collection,query,where,orderBy,startAfter,limit,getDocs,onSnapshot,Timestamp,Firestore,QueryConstraint,QueryDocumentSnapshot,DocumentData} from 'firebase/firestore';
import type {Visit} from './data';
import {localDayStart,shiftDay} from './utils/dateUtils';
export type HistoryFilters={name:string;from:string;to:string};
export type HistoryCursor=QueryDocumentSnapshot<DocumentData>|number|null;
export type HistoryPage={items:Visit[];cursor:HistoryCursor;hasMore:boolean;scanned:number};
export const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function historyBounds(filters:HistoryFilters) {
 if(!filters.name.trim()&&!filters.from&&!filters.to)throw new Error('Enter a visitor name or select a date.');
 const start=filters.from?localDayStart(filters.from):undefined;
 const end=filters.to?localDayStart(shiftDay(filters.to,1)):undefined;
 if(filters.to)localDayStart(filters.to);
 if(start!==undefined&&end!==undefined&&start>=end)throw new Error('The end date must be on or after the start date.');
 return {start,end};
}
function decode(d:QueryDocumentSnapshot<DocumentData>):Visit {const v=d.data();return {id:d.id,name:v.name,host:v.host,purpose:v.purpose,email:v.email,phone:v.phone,postalCode:v.postalCode,checkIn:(v.checkIn as Timestamp|null)?.toMillis()||0,checkOut:(v.checkOut as Timestamp|null)?.toMillis()||null};}
export function createVisitStore(db:Firestore) {
 const ref=collection(db,'leeVisits');
 return {
  watchWeek(start:number,end:number,next:(visits:Visit[])=>void,error:(e:unknown)=>void){
   return onSnapshot(query(ref,where('checkIn','>=',Timestamp.fromMillis(start)),where('checkIn','<',Timestamp.fromMillis(end)),orderBy('checkIn','desc')),snapshot=>next(snapshot.docs.map(decode)),error);
  },
  async searchHistory(filters:HistoryFilters,cursor:HistoryCursor=null):Promise<HistoryPage>{
   const {start,end}=historyBounds(filters);const name=normalize(filters.name);
   const base:QueryConstraint[]=[];
   if(start!==undefined)base.push(where('checkIn','>=',Timestamp.fromMillis(start)));
   if(end!==undefined)base.push(where('checkIn','<',Timestamp.fromMillis(end)));
   base.push(orderBy('checkIn','desc'));
   const items:Visit[]=[];let scanned=0;let last=cursor as QueryDocumentSnapshot<DocumentData>|null;let hasMore=true;
   // Scan bounded batches, retaining a document cursor even when no names match.
   // Older documents do not need additional fields or a migration.
   while(scanned<1000&&items.length<50&&hasMore){
    const snapshot=await getDocs(query(ref,...base,...(last?[startAfter(last)]:[]),limit(100)));
    scanned+=snapshot.size;hasMore=snapshot.size===100;
    if(snapshot.size)last=snapshot.docs[snapshot.size-1];
    for(const d of snapshot.docs){const v=decode(d);if(!name||normalize(v.name).includes(name))items.push(v);}
   }
   return {items,cursor:last,hasMore,scanned};
  }
 };
}
