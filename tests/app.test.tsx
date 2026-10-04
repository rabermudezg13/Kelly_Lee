// @vitest-environment jsdom
import React from 'react';
import {test,expect,vi,afterEach} from 'vitest';
import {render,screen,cleanup,waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
vi.mock('../src/data',async()=>{const original=await vi.importActual<typeof import('../src/data')>('../src/data');return {...original,demo:true,configured:false,watchProfile:(next:Function)=>{next(null);return()=>{};},checkIn:vi.fn().mockResolvedValue(undefined)};});
import App from '../src/App';
import * as data from '../src/data';
afterEach(()=>{cleanup();window.history.replaceState(null,'','/');vi.clearAllMocks();});
test('visitor confirms only after successful registration',async()=>{window.history.replaceState(null,'','/visit');render(<App/>);const user=userEvent.setup();await user.type(screen.getByLabelText('Full name'),'Fictional Visitor');await user.selectOptions(screen.getByLabelText('Reason for your visit'),'Badge pickup');await user.click(screen.getByRole('button',{name:'Complete check-in'}));await screen.findByText('You’re checked in!');expect(data.checkIn).toHaveBeenCalledWith({name:'Fictional Visitor',purpose:'Badge pickup',host:'Front desk'});});
test('failed write leaves visitor form available and displays error',async()=>{vi.mocked(data.checkIn).mockRejectedValueOnce(new Error('Connection failed'));window.history.replaceState(null,'','/visit');render(<App/>);const user=userEvent.setup();await user.type(screen.getByLabelText('Full name'),'Fictional Visitor');await user.selectOptions(screen.getByLabelText('Reason for your visit'),'Other');await user.click(screen.getByRole('button',{name:'Complete check-in'}));expect((await screen.findByRole('alert')).textContent).toContain('Connection failed');expect(screen.queryByText('You’re checked in!')).toBeNull();});
test('unauthenticated roster redirects to staff login',async()=>{window.history.replaceState(null,'','/roster');render(<App/>);await waitFor(()=>expect(screen.getByRole('heading',{name:'Welcome back.'})).toBeTruthy());expect(screen.queryByText('Visitor roster')).toBeNull();});
test('staff portal offers login only and directs account requests to admin',()=>{window.history.replaceState(null,'','/staff');render(<App/>);expect(screen.getByText(/Staff accounts are created by your administrator/)).toBeTruthy();expect(screen.queryByRole('button',{name:'Register staff'})).toBeNull();expect(screen.queryByRole('button',{name:'Create staff account'})).toBeNull();expect(screen.getByRole('button',{name:'Sign in'})).toBeTruthy();});
