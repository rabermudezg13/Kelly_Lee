import {createVisitStore,historyBounds,normalize,HistoryFilters,HistoryCursor,HistoryPage} from './visitStore';
import {currentWeek} from './utils/dateUtils';
import { getMiamiDateKey, formatMiamiTimeOnly } from './utils/dateUtils';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, collection, addDoc, updateDoc, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';
export type Profile={name:string;email:string};
export type Visit={id:string;name:string;host:string;purpose:string;email?:string;phone?:string;postalCode?:string;checkIn:number;checkOut:number|null};
export const purposes=['Information session','New hire orientation','Fingerprinting','Badge pickup','Meet with staff','Other'];
export const demo=import.meta.env.VITE_DEMO_MODE==='true';
const config={apiKey:import.meta.env.VITE_FIREBASE_API_KEY,authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,appId:import.meta.env.VITE_FIREBASE_APP_ID};
export const configured=Object.values(config).every(Boolean);
const app=configured&&!demo?initializeApp(config):null;
const auth=app?getAuth(app):null;
const db=app?getFirestore(app):null;
let demoProfile:Profile|null=null;
let visits:Visit[]=[{id:'sample-1',name:'Alex Morgan',host:'Front desk',purpose:'Badge pickup',checkIn:Date.now()-15*60000,checkOut:null},{id:'sample-2',name:'Jordan Taylor',host:'Recruiting team',purpose:'New hire orientation',checkIn:Date.now()-40*60000,checkOut:Date.now()-5*60000}];
const visitListeners=new Set<(v:Visit[])=>void>();
const profileListeners=new Set<(p:Profile|null)=>void>();
function requireBackend(){if(!auth||!db)throw new Error('Firebase is not connected yet. Contact your administrator.');return {auth,db};}
export function watchProfile(next:(p:Profile|null)=>void,error:(e:unknown)=>void){
 if(demo){profileListeners.add(next);next(demoProfile);return()=>{profileListeners.delete(next);};}
 if(!auth){next(null);return()=>{};}
 return onAuthStateChanged(auth,user=>{next(user&&!user.isAnonymous?{name:user.displayName||user.email?.split('@')[0]||'Staff',email:user.email||''}:null);},error);
}
export async function login(email:string,password:string){if(demo){demoProfile={name:'Demo staff',email};profileListeners.forEach(f=>f(demoProfile));return;}await signInWithEmailAndPassword(requireBackend().auth,email,password);}
export async function logout(){if(demo){demoProfile=null;profileListeners.forEach(f=>f(null));return;}await signOut(requireBackend().auth);}
export async function checkIn(input:{name:string;host:string;purpose:string;email:string;phone:string;postalCode:string}){
 if(demo){visits=[{...input,id:crypto.randomUUID(),checkIn:Date.now(),checkOut:null},...visits];visitListeners.forEach(f=>f([...visits]));return;}
 const {db}=requireBackend();
 await addDoc(collection(db,'leeVisits'),{...input,checkIn:serverTimestamp(),checkOut:null,createdBy:'visitor'});
}
export function watchVisits(next:(v:Visit[])=>void,error:(e:unknown)=>void,week=currentWeek()){
 if(demo){const deliver=(v:Visit[])=>next(v.filter(item=>item.checkIn>=week.start&&item.checkIn<week.end));visitListeners.add(deliver);deliver([...visits]);return()=>{visitListeners.delete(deliver);};}
 return createVisitStore(requireBackend().db).watchWeek(week.start,week.end,next,error);
}
export async function searchHistory(filters:HistoryFilters,cursor:HistoryCursor=null):Promise<HistoryPage>{
 if(!demo)return createVisitStore(requireBackend().db).searchHistory(filters,cursor);
 const bounds=historyBounds(filters);const name=normalize(filters.name);
 const all=visits.filter(v=>(bounds.start===undefined||v.checkIn>=bounds.start)&&(bounds.end===undefined||v.checkIn<bounds.end)).sort((a,b)=>b.checkIn-a.checkIn);
 const offset=typeof cursor==='number'?cursor:0;const batch=all.slice(offset,offset+1000);
 return {items:batch.filter(v=>!name||normalize(v.name).includes(name)),cursor:offset+batch.length,hasMore:offset+batch.length<all.length,scanned:batch.length};
}
export async function checkOut(id:string){if(demo){visits=visits.map(v=>v.id===id?{...v,checkOut:Date.now()}:v);visitListeners.forEach(f=>f([...visits]));return;}await updateDoc(doc(requireBackend().db,'leeVisits',id),{checkOut:serverTimestamp()});}
export const day=getMiamiDateKey;
export const clock=(time:number)=>time?formatMiamiTimeOnly(time):'Saving…';
export function message(error:unknown){const code=(error as {code?:string})?.code;const known:Record<string,string>={'auth/invalid-credential':'The email or password is incorrect.','auth/email-already-in-use':'This email already has an account. Please sign in.','auth/weak-password':'Please use a password with at least 8 characters.','auth/too-many-requests':'Too many attempts. Please try again later.','permission-denied':'You do not have permission. Contact your administrator to check your account.','auth/network-request-failed':'Connection failed. Please try again.'};return code?known[code]||'Unable to complete this action. Please try again or contact your administrator.':error instanceof Error?error.message:'Something went wrong. Please try again.';}
