// @vitest-environment node
import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, test } from 'vitest';
import { initializeTestEnvironment, assertFails, assertSucceeds, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { collection, addDoc, doc, setDoc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
describe.skipIf(!process.env.FIRESTORE_EMULATOR_HOST)('Firestore access rules',()=>{
let env:RulesTestEnvironment;
beforeAll(async()=>{env=await initializeTestEnvironment({projectId:'demo-kelly-lee',firestore:{host:'127.0.0.1',port:8080,rules:readFileSync('firestore.rules','utf8')}});});
afterAll(async()=>{await env?.cleanup();});
beforeEach(async()=>{await env.clearFirestore();});
const visit=(uid:string)=>({name:'Fictional Visitor',host:'Front desk',purpose:'Badge pickup',createdBy:'visitor',checkIn:serverTimestamp(),checkOut:null});
async function seed(){await env.withSecurityRulesDisabled(async context=>{const db=context.firestore();await setDoc(doc(db,'leeStaff','approved'),{name:'Fictional Staff',email:'fictional@example.test',approved:true});await setDoc(doc(db,'leeVisits','existing'),{...visit('visitor'),checkIn:Timestamp.fromMillis(Date.now()-1000)});});}
test('public visitors can submit without creating accounts but cannot read arrivals',async()=>{const db=env.unauthenticatedContext().firestore();const result=await assertSucceeds(addDoc(collection(db,'leeVisits'),visit('visitor')));await assertFails(getDoc(result));});
test('forged times and creator identifiers are rejected',async()=>{const db=env.unauthenticatedContext().firestore();await assertFails(addDoc(collection(db,'leeVisits'),{...visit('visitor'),checkIn:Timestamp.fromMillis(0)}));await assertFails(addDoc(collection(db,'leeVisits'),{...visit('visitor'),createdBy:'someone-else'}));});
test('staff clients cannot create profiles or self approve',async()=>{const db=env.authenticatedContext('new-staff',{email:'staff@example.test',email_verified:true}).firestore();const ref=doc(db,'leeStaff','new-staff');for(const approved of [false,true])await assertFails(setDoc(ref,{name:'Fictional Staff',email:'staff@example.test',approved}));await seed();await assertFails(getDoc(doc(db,'leeVisits','existing')));const approvedDb=env.authenticatedContext('approved',{email:'fictional@example.test',email_verified:true}).firestore();await assertFails(updateDoc(doc(approvedDb,'leeStaff','approved'),{approved:false}));await assertFails(setDoc(doc(approvedDb,'leeStaff','other'),{name:'Other',email:'other@example.test',approved:true}));});
test('verified approved staff can read and checkout but cannot edit visitor details',async()=>{await seed();const db=env.authenticatedContext('approved',{email:'fictional@example.test',email_verified:true}).firestore();const ref=doc(db,'leeVisits','existing');await assertSucceeds(getDoc(ref));await assertFails(updateDoc(ref,{name:'Changed'}));await assertSucceeds(updateDoc(ref,{checkOut:serverTimestamp()}));await assertFails(updateDoc(ref,{checkOut:serverTimestamp()}));});
test('unverified approved staff have no access',async()=>{await seed();const db=env.authenticatedContext('approved',{email:'fictional@example.test',email_verified:false}).firestore();await assertFails(getDoc(doc(db,'leeVisits','existing')));});
test('invalid visitor fields and extra fields are rejected',async()=>{const db=env.authenticatedContext('visitor').firestore();for(const changes of [{name:''},{purpose:'invalid'},{approved:true},{host:''}])await assertFails(addDoc(collection(db,'leeVisits'),{...visit('visitor'),...changes}));});

});
