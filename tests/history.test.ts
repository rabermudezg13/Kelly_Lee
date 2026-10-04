import {expect,test} from 'vitest';
import {historyBounds,normalize} from '../src/visitStore';
test('inclusive date ranges respect the DST transition day',()=>{const range=historyBounds({name:'',from:'2026-03-08',to:'2026-03-08'});expect(new Date(range.start!).toISOString()).toBe('2026-03-08T05:00:00.000Z');expect(new Date(range.end!).toISOString()).toBe('2026-03-09T04:00:00.000Z');});
test('history requires criteria and rejects reversed or invalid dates',()=>{expect(()=>historyBounds({name:' ',from:'',to:''})).toThrow();expect(()=>historyBounds({name:'',from:'2026-10-05',to:'2026-10-03'})).toThrow();expect(()=>historyBounds({name:'',from:'2026-02-31',to:''})).toThrow();});
test('partial name search ignores accents and case',()=>{expect(normalize('  JOSÉ García  ')).toBe('jose garcia');});
