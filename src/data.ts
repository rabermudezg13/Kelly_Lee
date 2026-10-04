import { getMiamiDateKey, formatMiamiTimeOnly } from './utils/dateUtils';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, collection, addDoc, updateDoc, onSnapshot, query, orderBy, limit, serverTimestamp, Timestamp } from 'firebase/firestore';
export type Profile={name:string;email:string;approved:boolean};
export type Visit={id:string;name:string;host:string;purpose:string;checkIn:number;checkOut:number|null};
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
 let stop=()=>{};
 const unsubscribe=onAuthStateChanged(auth,user=>{stop();next(null);if(user&&!user.isAnonymous){stop=onSnapshot(doc(db!,'leeStaff',user.uid),snap=>next(snap.exists()?{...snap.data() as Profile,approved:snap.data().approved===true && user.emailVerified}:{name:user.email||'Staff',email:user.email||'',approved:false}),error);}},error);
 return()=>{stop();unsubscribe();};
}
export async function login(email:string,password:string){if(demo){demoProfile={name:'Demo staff',email,approved:true};profileListeners.forEach(f=>f(demoProfile));return;}await signInWithEmailAndPassword(requireBackend().auth,email,password);}
export async function logout(){if(demo){demoProfile=null;profileListeners.forEach(f=>f(null));return;}await signOut(requireBackend().auth);}
export async function checkIn(input:{name:string;host:string;purpose:string}){
 if(demo){visits=[{...input,id:crypto.randomUUID(),checkIn:Date.now(),checkOut:null},...visits];visitListeners.forEach(f=>f([...visits]));return;}
 const {db}=requireBackend();
 await addDoc(collection(db,'leeVisits'),{...input,checkIn:serverTimestamp(),checkOut:null,createdBy:'visitor'});
}
export function watchVisits(next:(v:Visit[])=>void,error:(e:unknown)=>void){
 if(demo){visitListeners.add(next);next([...visits]);return()=>{visitListeners.delete(next);};}
 const {db}=requireBackend();return onSnapshot(query(collection(db,'leeVisits'),orderBy('checkIn','desc'),limit(500)),snap=>next(snap.docs.map(d=>{const v=d.data();return {id:d.id,name:v.name,host:v.host,purpose:v.purpose,checkIn:(v.checkIn as Timestamp|null)?.toMillis()||0,checkOut:(v.checkOut as Timestamp|null)?.toMillis()||null};})),error);
}
export async function checkOut(id:string){if(demo){visits=visits.map(v=>v.id===id?{...v,checkOut:Date.now()}:v);visitListeners.forEach(f=>f([...visits]));return;}await updateDoc(doc(requireBackend().db,'leeVisits',id),{checkOut:serverTimestamp()});}
export const day=getMiamiDateKey;
export const clock=(time:number)=>time?formatMiamiTimeOnly(time):'Saving…';
export function message(error:unknown){const code=(error as {code?:string})?.code;const known:Record<string,string>={'auth/invalid-credential':'The email or password is incorrect.','auth/email-already-in-use':'This email already has an account. Please sign in.','auth/weak-password':'Please use a password with at least 8 characters.','auth/too-many-requests':'Too many attempts. Please try again later.','permission-denied':'You do not have permission. Ask an administrator to approve your staff account.','auth/network-request-failed':'Connection failed. Please try again.'};return code?known[code]||'Unable to complete this action. Please try again or contact your administrator.':error instanceof Error?error.message:'Something went wrong. Please try again.';}

export async function refreshAccess(){const {auth}=requireBackend();await auth.currentUser?.reload();await auth.currentUser?.getIdToken(true);window.location.reload();}

export async function sendVerification(){const {auth}=requireBackend();if(!auth.currentUser || auth.currentUser.isAnonymous)throw new Error('Please sign in first.');if(auth.currentUser.emailVerified)throw new Error('Your email is already verified. Ask your administrator to approve access.');await sendEmailVerification(auth.currentUser);}
