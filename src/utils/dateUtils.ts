/** Adapted from kelly-app-v2@1589e02 frontend/src/utils/dateUtils.ts. */
export const TIME_ZONE='America/New_York';
type DateInput=string|number|null|undefined;
function parse(input:DateInput):Date|null {
 if(input===null||input===undefined||input==='')return null;
 if(typeof input==='number'){const d=new Date(input);return Number.isNaN(d.getTime())?null:d;}
 let value=input.trim();
 if(/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
 if(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(value))value=value.replace(' ','T');
 if(value.includes('T')&&!/(Z|[+-]\d{2}:?\d{2})$/i.test(value))value+='Z';
 const d=new Date(value);return Number.isNaN(d.getTime())?null:d;
}
function format(input:DateInput,options:Intl.DateTimeFormatOptions):string {
 if(input===null||input===undefined||input==='')return 'N/A';
 const d=parse(input);return d?new Intl.DateTimeFormat('en-US',{timeZone:TIME_ZONE,...options}).format(d):'Invalid Date';
}
const dateOptions:Intl.DateTimeFormatOptions={year:'numeric',month:'2-digit',day:'2-digit'};
const timeOptions:Intl.DateTimeFormatOptions={hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true};
export const formatMiamiTime=(input:DateInput)=>format(input,{...dateOptions,...timeOptions});
export const formatMiamiDate=(input:DateInput)=>format(input,dateOptions);
export const formatMiamiTimeOnly=(input:DateInput)=>format(input,timeOptions);
export function getMiamiDateKey(input:DateInput):string {
 const d=parse(input);if(!d)return '';
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:TIME_ZONE,...dateOptions}).formatToParts(d);
 const part=(name:string)=>parts.find(p=>p.type===name)?.value||'';
 return `${part('year')}-${part('month')}-${part('day')}`;
}
export function formatMiamiDateDisplay(input:DateInput):string {
 const d=parse(input);return d?new Intl.DateTimeFormat('en-US',{timeZone:TIME_ZONE,weekday:'long',year:'numeric',month:'long',day:'numeric'}).format(d):'';
}
