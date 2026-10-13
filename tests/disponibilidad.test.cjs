// No dependencies: execute the actual inline page script with a minimal DOM.
// These are behavior/HTML tests, not browser layout or screenshot tests.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const html = fs.readFileSync(require('node:path').join(__dirname, '../disponibilidad/index.html'), 'utf8');
const source = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
const keys = ['canvas90', 'origen', 'pulso'];
const success = (ocupados = []) => ({ ok: true, json: async () => ({ ok: true, ocupados }) });
const deferred = () => { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; };
const flush = async () => { for (let i=0; i<15; i++) await Promise.resolve(); };
function page(fetch) {
  const elements = new Map(), timers = new Map(); let nextTimer=0;
  const element = () => ({ innerHTML:'', textContent:'', value:'', children:[], classList:{ toggle(){}, add(){}, remove(){} }, appendChild(x){this.children.push(x);} });
  const document = { getElementById(id){if(!elements.has(id)) elements.set(id,element()); return elements.get(id);}, createElement:element, querySelectorAll(){return [];} };
  const context = vm.createContext({ document, fetch, AbortController, URL, console, setTimeout(fn,ms){const id=++nextTimer;timers.set(id,{fn,ms});return id;}, clearTimeout(id){timers.delete(id);} });
  vm.runInContext(source,context);
  return { elements, timers, run: expression => vm.runInContext(expression, context), state: k => vm.runInContext(`states['${k}']`, context) };
}
function unavailable(p,k,state='error') {
  assert.equal(p.state(k), state);
  assert.equal(p.run(`free('${k}', selected).length`),0);
  for (const expression of [`rowForSpace('${k}',selected)`, `space='${k}';rowForDay(selected)`]) {
    const row=p.run(expression);
    assert.doesNotMatch(row,/class="track|>Disponible<|class="free"/);
    assert.match(row,state==='error'?/DISPONIBILIDAD NO DISPONIBLE/:/Cargando…/);
    if(state==='error') {
      assert.match(row,/Esto no significa que los espacios estén libres/);
      assert.match(row,/https:\/\/wa.me\//);
      assert.match(row,new RegExp(`data-retry="${k}"`));
    }
  }
}
test('initial pending requests never render free tracks, labels or summary ranges', () => {
  const p=page(()=>new Promise(()=>{}));
  keys.forEach(k=>unavailable(p,k,'loading'));
  assert.doesNotMatch(p.elements.get('summary').innerHTML,/07:00|22:00/);
});
test('successful empty calendars confirm full operation range',async()=>{
  const p=page(async()=>success());await flush();
  keys.forEach(k=>{assert.equal(p.state(k),'confirmed');assert.equal(JSON.stringify(p.run(`free('${k}',selected)`)),'[[420,1320]]');});
  assert.match(p.elements.get('status').textContent,/Disponibilidad confirmada/);
  assert.match(p.elements.get('summary').innerHTML,/07:00 — 22:00/);
});
test('occupied intervals are rendered and removed from free ranges',async()=>{
  const p=page(async()=>success());await flush();
  p.run("data.canvas90=[{desde:selected+'T10:00:00',hasta:selected+'T12:00:00'}];renderAll()");
  assert.equal(JSON.stringify(p.run("free('canvas90',selected)")),'[[420,600],[720,1320]]');
  assert.match(p.elements.get('rows').innerHTML,/class="busy canvas90"/);
});
test('fully occupied day never has Disponible label in either view or mobile legend',async()=>{
  const p=page(async()=>success());await flush();
  p.run("data.canvas90=[{desde:selected+'T07:00:00',hasta:selected+'T22:00:00'}]");
  for(const x of ["rowForSpace('canvas90',selected)","rowForDay(selected)"]) {const row=p.run(x);assert.doesNotMatch(row,/>Disponible</);assert.match(row,/Sin disponibilidad/);}
});
const errors = {
  'network failure':async()=>{throw new TypeError('Failed to fetch');},
  'HTTP 503 even with valid JSON':async()=>({...success(),ok:false,status:503}),
  'invalid JSON':async()=>({ok:true,json:async()=>{throw new SyntaxError('bad JSON');}}),
  'ok false':async()=>({ok:true,json:async()=>({ok:false,ocupados:[]})}),
  'missing occupancy':async()=>({ok:true,json:async()=>({ok:true})}),
  'invalid occupancy type':async()=>({ok:true,json:async()=>({ok:true,ocupados:{}})}),
  'invalid dates':async()=>success([{desde:'invalid',hasta:'2026-10-14T12:00:00Z'}]),
  'missing interval endpoint':async()=>success([{desde:'2026-10-14T10:00:00Z'}]),
  'null interval':async()=>success([null]),
  'reversed interval':async()=>success([{desde:'2026-10-14T12:00:00Z',hasta:'2026-10-14T10:00:00Z'}]),
  'impossible date':async()=>success([{desde:'2026-02-30T10:00:00Z',hasta:'2026-03-03T10:00:00Z'}]),
  'ok truthy but not true':async()=>({ok:true,json:async()=>({ok:'true',ocupados:[]})}),
};
for(const [name,fetch] of Object.entries(errors))test(`${name} blocks all affected spaces`,async()=>{const p=page(fetch);await flush();keys.forEach(k=>unavailable(p,k));assert.doesNotMatch(p.elements.get('summary').innerHTML,/07:00|22:00/);assert.match(p.elements.get('status').textContent,/DISPONIBILIDAD NO DISPONIBLE/);assert.equal(p.timers.size,0);});
test('timeout fires at 15 seconds, aborts and blocks even if fetch ignores abort',async()=>{
  const signals=[],p=page((_,options)=>{signals.push(options.signal);return new Promise(()=>{});});
  for(const timer of [...p.timers.values()]){assert.equal(timer.ms,15000);timer.fn();}await flush();
  keys.forEach(k=>unavailable(p,k));assert.ok(signals.every(x=>x.aborted));
});
test('timeout also covers a stalled response body',async()=>{
  const p=page(async()=>({ok:true,json:()=>new Promise(()=>{})}));await flush();
  for(const timer of [...p.timers.values()])timer.fn();await flush();keys.forEach(k=>unavailable(p,k));
});
test('failure in one space does not block two successful spaces',async()=>{
  const p=page(async url=>new URL(url).searchParams.get('espacio')==='origen'?errors['network failure']():success());await flush();
  unavailable(p,'origen');assert.equal(p.state('canvas90'),'confirmed');assert.equal(p.state('pulso'),'confirmed');assert.match(p.elements.get('status').textContent,/2 de 3/);
});
test('a successful space renders without waiting for a stalled space',async()=>{
  const p=page(url=>new URL(url).searchParams.get('espacio')==='origen'?new Promise(()=>{}):Promise.resolve(success()));await flush();
  unavailable(p,'origen','loading');assert.equal(p.state('canvas90'),'confirmed');assert.equal(p.state('pulso'),'confirmed');
});
test('retry button blocks during retry and recovers only the affected space',async()=>{
  let retry=false;const pending=deferred(),calls=[];
  const p=page(async url=>{const k=new URL(url).searchParams.get('espacio');calls.push(k);if(k==='origen')return retry?pending.promise:errors['network failure']();return success();});await flush();
  unavailable(p,'origen');retry=true;
  p.elements.get('rows').onclick({target:{closest:()=>({dataset:{retry:'origen'}})}});
  unavailable(p,'origen','loading');assert.equal(p.state('canvas90'),'confirmed');
  pending.resolve(success());await flush();assert.equal(p.state('origen'),'confirmed');assert.deepEqual(calls,['canvas90','origen','pulso','origen']);
});
test('new week immediately clears previous confirmed data',async()=>{
  let stall=false;const p=page(async()=>stall?new Promise(()=>{}):success());await flush();stall=true;
  p.elements.get('next').onclick();keys.forEach(k=>unavailable(p,k,'loading'));
});
test('late responses from old week cannot confirm the new week',async()=>{
  const old=[];let current=false;
  const p=page(()=>{if(current)return errors['network failure']();const d=deferred();old.push(d);return d.promise;});
  current=true;p.elements.get('next').onclick();await flush();keys.forEach(k=>unavailable(p,k));
  old.forEach(d=>d.resolve(success()));await flush();keys.forEach(k=>unavailable(p,k));
});
test('midnight and date-only all-day intervals cannot vanish',async()=>{
  const p=page(async()=>success());await flush();
  p.run("data.canvas90=[{desde:selected+'T18:00:00',hasta:formatKey(addDays(parseKey(selected),1))+'T00:00:00'}]");
  assert.equal(JSON.stringify(p.run("free('canvas90',selected)")),'[[420,1080]]');
  p.run("data.canvas90=validOccupancy({ok:true,ocupados:[{desde:selected,hasta:formatKey(addDays(parseKey(selected),1))}]})");
  assert.equal(p.run("free('canvas90',selected).length"),0);
});
test('fractional occupied minutes are rounded conservatively',async()=>{
  const p=page(async()=>success());await flush();
  p.run("data.canvas90=[{desde:selected+'T10:00:30',hasta:selected+'T12:00:01'}]");
  assert.equal(JSON.stringify(p.run("free('canvas90',selected)")),'[[420,600],[721,1320]]');
});
