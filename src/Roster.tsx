import {useEffect,useRef,useState,FormEvent} from 'react';
import {Link,Navigate} from 'react-router-dom';
import {Users,ClipboardList,Clock,LogOut,Search,UserPlus,X} from 'lucide-react';
import * as data from './data';
import {currentWeek,formatMiamiDate,formatMiamiTime} from './utils/dateUtils';
import {HistoryCursor,HistoryFilters,historyBounds} from './visitStore';

function VisitTable({visits,onExit,busy=''}:{visits:data.Visit[];onExit?:(id:string)=>void;busy?:string}){
 return <div className="table-scroll"><table><thead><tr><th>Visitor</th><th>Reason for visit</th><th>Visiting</th><th>Arrival · ET</th><th>Status</th>{onExit&&<th>Action</th>}</tr></thead><tbody>{visits.map(v=><tr key={v.id}><td><span className="avatar">{v.name.slice(0,1)}</span><strong>{v.name}</strong></td><td>{v.purpose}</td><td>{v.host}</td><td>{formatMiamiTime(v.checkIn)}</td><td><span className={`status ${v.checkOut?'departed':''}`}>{v.checkOut?`Left ${data.clock(v.checkOut)}`:'Checked in'}</span></td>{onExit&&<td>{!v.checkOut&&<button className="small outline" disabled={!!busy} onClick={()=>onExit(v.id)}>{busy===v.id?'Saving…':'Check out'}</button>}</td>}</tr>)}</tbody></table></div>;
}
function History({onClose}:{onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null);const request=useRef(0);
 const [filters,setFilters]=useState<HistoryFilters>({name:'',from:'',to:''});
 const [submitted,setSubmitted]=useState<HistoryFilters|null>(null);
 const [items,setItems]=useState<data.Visit[]>([]);const [cursor,setCursor]=useState<HistoryCursor>(null);
 const [more,setMore]=useState(false);const [busy,setBusy]=useState(false);const [error,setError]=useState('');const [searched,setSearched]=useState(false);
 useEffect(()=>{dialog.current?.showModal();return()=>{request.current++;};},[]);
 async function run(criteria:HistoryFilters,next:HistoryCursor=null,append=false){
  const id=++request.current;setBusy(true);setError('');
  try{historyBounds(criteria);if(!append){setItems([]);setCursor(null);setMore(false);setSubmitted(criteria);setSearched(false);}
   const page=await data.searchHistory(criteria,next);
   if(id!==request.current)return;
   setItems(previous=>append?[...previous,...page.items]:page.items);setCursor(page.cursor);setMore(page.hasMore);setSearched(true);
  }catch(e){if(id===request.current)setError(data.message(e));}finally{if(id===request.current)setBusy(false);}
 }
 function submit(e:FormEvent){e.preventDefault();void run({...filters});}
 return <dialog className="history-dialog" ref={dialog} aria-labelledby="history-title" onCancel={onClose}><div className="roster-title"><div><h2 id="history-title">Visitor history</h2><p className="muted">Find past visits by name or date. All records remain saved.</p></div><button className="outline" aria-label="Close history" onClick={onClose}><X size={20}/></button></div><form className="history-form" onSubmit={submit}><label>Visitor name<input value={filters.name} maxLength={100} placeholder="Full or partial name" onChange={e=>setFilters({...filters,name:e.target.value})}/></label><label>From date<input type="date" value={filters.from} onChange={e=>setFilters({...filters,from:e.target.value})}/></label><label>To date<input type="date" value={filters.to} onChange={e=>setFilters({...filters,to:e.target.value})}/></label><button disabled={busy}><Search size={17}/>{busy?'Searching…':'Search history'}</button></form><p className="privacy">Dates use Eastern time. History is read-only; your weekly roster stays unchanged.</p>{error&&<p className="error" role="alert">{error}</p>}<div role="status" aria-live="polite">{busy?<p className="muted">Searching saved visits…</p>:searched&&<p className="muted">{items.length} {items.length===1?'matching visit':'matching visits'}{more?' · More saved records remain to be searched.':''}</p>}</div>{items.length>0&&<VisitTable visits={items}/>} {!busy&&searched&&!items.length&&<p className="empty">{more?'No matches in the records searched so far. Continue searching older records.':'No matching visits found.'}</p>}{more&&submitted&&<button className="outline" disabled={busy} onClick={()=>void run(submitted,cursor,true)}>Continue searching / load more</button>}{!searched&&!busy&&!error&&<p className="empty">Enter a name or choose a date to search saved visits.</p>}</dialog>;
}
export default function Roster({profile}:{profile:data.Profile|null}){
 const [visits,setVisits]=useState<data.Visit[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
 const [search,setSearch]=useState('');const [filter,setFilter]=useState('week');const [busy,setBusy]=useState('');
 const [now,setNow]=useState(Date.now());const [history,setHistory]=useState(false);const week=currentWeek(now);
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),60000);return()=>clearInterval(timer);},[]);
 useEffect(()=>{setVisits([]);setLoading(true);if(!profile)return;return data.watchVisits(v=>{setVisits(v);setLoading(false);setError('');},e=>{setError(data.message(e));setLoading(false);},week);},[profile?.email,week.start]);
 async function exit(id:string){setBusy(id);setError('');try{await data.checkOut(id);}catch(e){setError(data.message(e));}finally{setBusy('');}}
 if(!profile)return <Navigate to="/staff"/>;

 const weekly=visits.filter(v=>v.checkIn>=week.start&&v.checkIn<week.end);
 const today=weekly.filter(v=>data.day(v.checkIn)===data.day(now));const inside=weekly.filter(v=>!v.checkOut);
 const visible=(filter==='inside'?inside:filter==='today'?today:weekly).filter(v=>`${v.name} ${v.host} ${v.purpose}`.toLowerCase().includes(search.toLowerCase()));
 return <main className="roster"><div className="roster-heading"><div><span className="eyebrow">LEE COUNTY · STAFF PORTAL</span><h1>A warm welcome starts here.</h1><p className="muted">Hello, {profile.name}. Here’s who’s visiting this week.</p></div><button className="outline" onClick={()=>void data.logout().catch(e=>setError(data.message(e)))}><LogOut size={17}/>Sign out</button></div><div className="stats"><div><Users/><strong>{weekly.length}</strong><span>Arrivals this week</span></div><div><ClipboardList/><strong>{today.length}</strong><span>Arrivals today</span></div><div><Clock/><strong>{data.clock(now)}</strong><span>Lee County · Eastern time</span></div></div><section className="roster-card"><div className="roster-title"><div><h2>Visitor roster</h2><span className="muted">{formatMiamiDate(week.start)} – {formatMiamiDate(week.end-1)} · <span className="dot"/> Live updates</span></div><div className="roster-actions"><button className="outline" onClick={()=>setHistory(true)}><Search size={17}/>Search history</button><Link to="/visit" className="button">New check-in <UserPlus size={17}/></Link></div></div><div className="filters"><div className="tabs"><button className={filter==='week'?'selected':''} onClick={()=>setFilter('week')}>This week</button><button className={filter==='today'?'selected':''} onClick={()=>setFilter('today')}>Today</button><button className={filter==='inside'?'selected':''} onClick={()=>setFilter('inside')}>Checked in</button></div><label className="search"><Search size={18}/><input aria-label="Search this week's visitors" placeholder="Search this week’s visitors" value={search} onChange={e=>setSearch(e.target.value)}/></label></div>{error&&<p role="alert" className="error">{error}</p>}<VisitTable visits={visible} onExit={id=>void exit(id)} busy={busy}/>{loading?<p className="empty" role="status">Loading this week’s visitors…</p>:!visible.length&&<p className="empty">{search?'No visitors match your search this week.':'No visits to display this week.'}</p>}<p className="privacy retention-note">Previous visits remain saved in the database. Use Search history to find them.</p></section>{history&&<History onClose={()=>setHistory(false)}/>}</main>;
}
