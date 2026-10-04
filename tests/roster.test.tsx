// @vitest-environment jsdom
import React from 'react';
import {afterEach,beforeEach,test,expect,vi} from 'vitest';
import {render,screen,cleanup,within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {BrowserRouter} from 'react-router-dom';
import {currentWeek} from '../src/utils/dateUtils';
vi.mock('../src/data',async()=>{const original=await vi.importActual<typeof import('../src/data')>('../src/data');return {...original,watchVisits:vi.fn(),searchHistory:vi.fn()};});
import * as data from '../src/data';
import Roster from '../src/Roster';
const fixed=Date.parse('2026-10-03T16:00:00Z');const week=currentWeek(fixed);
const recent={id:'recent',name:'Current Visitor',host:'Front desk',purpose:'Badge pickup',checkIn:fixed,checkOut:null};
const old={...recent,id:'old',name:'Historic Visitor',checkIn:week.start-86400000};
beforeEach(()=>{vi.spyOn(Date,'now').mockReturnValue(fixed);HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};vi.mocked(data.watchVisits).mockImplementation(next=>{next([recent,old]);return()=>{};});});
afterEach(()=>{cleanup();vi.restoreAllMocks();vi.clearAllMocks();});
function open(){render(<BrowserRouter><Roster profile={{name:'Fictional Staff',email:'staff@example.test',approved:true}}/></BrowserRouter>);}
test('default roster shows this week only and passes exact boundaries to backend',()=>{open();expect(screen.getByText('Current Visitor')).toBeTruthy();expect(screen.queryByText('Historic Visitor')).toBeNull();expect(screen.getByText('Arrivals this week').previousElementSibling?.textContent).toBe('1');expect(vi.mocked(data.watchVisits).mock.calls[0][2]).toEqual(week);});
test('historical search is read only and closing preserves weekly roster and counts',async()=>{vi.mocked(data.searchHistory).mockResolvedValue({items:[old],cursor:null,hasMore:false,scanned:1});open();const user=userEvent.setup();await user.click(screen.getByRole('button',{name:'Search history'}));const dialog=screen.getByRole('dialog');await user.type(within(dialog).getByLabelText('Visitor name'),'Historic');await user.click(within(dialog).getByRole('button',{name:'Search history'}));await within(dialog).findByText('Historic Visitor');expect(within(dialog).queryByRole('button',{name:'Check out'})).toBeNull();expect(screen.getByText('Arrivals this week').previousElementSibling?.textContent).toBe('1');await user.click(within(dialog).getByRole('button',{name:'Close history'}));expect(screen.queryByText('Historic Visitor')).toBeNull();expect(screen.getByText('Current Visitor')).toBeTruthy();expect(vi.mocked(data.watchVisits)).toHaveBeenCalledTimes(1);});
test('history pagination continues beyond empty scanned batches',async()=>{vi.mocked(data.searchHistory).mockResolvedValueOnce({items:[],cursor:1000,hasMore:true,scanned:1000}).mockResolvedValueOnce({items:[old],cursor:1001,hasMore:false,scanned:1});open();const user=userEvent.setup();await user.click(screen.getByRole('button',{name:'Search history'}));const dialog=screen.getByRole('dialog');await user.type(within(dialog).getByLabelText('Visitor name'),'Historic');await user.click(within(dialog).getByRole('button',{name:'Search history'}));await within(dialog).findByText(/No matches in the records searched so far/);await user.click(within(dialog).getByRole('button',{name:'Continue searching / load more'}));await within(dialog).findByText('Historic Visitor');expect(data.searchHistory).toHaveBeenLastCalledWith({name:'Historic',from:'',to:''},1000);});
test('authenticated staff sees roster without approval screen',()=>{open();expect(screen.getByText('Visitor roster')).toBeTruthy();expect(screen.queryByText('Access pending.')).toBeNull();});
