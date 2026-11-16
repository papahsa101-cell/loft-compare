'use strict';
const c=window.EVENT_CONFIG;
const rub=n=>Math.round(n).toLocaleString('ru-RU')+' ₽';
document.querySelectorAll('[data-field]').forEach(el=>el.textContent=c[el.dataset.field]??'Уточняется');
document.querySelectorAll('.estimate').forEach(el=>el.textContent='≈ '+rub(c.estimatePerPerson));
document.title=c.venue+' — '+c.title.toLowerCase();
document.querySelectorAll('.map').forEach(a=>a.href=c.mapUrl);
const artists=document.getElementById('artists');
if(c.artists.length){
 document.getElementById('poster-artists').textContent=c.artists.map(a=>typeof a==='string'?a:a.name).join(' / ');
 c.artists.forEach(a=>{const row=document.createElement('div');row.className='artist';const b=document.createElement('b');b.textContent=typeof a==='string'?a:a.name;row.append(b);if(a.description){const p=document.createElement('p');p.textContent=a.description;row.append(p);}artists.append(row);});
}else{const p=document.createElement('p');p.textContent='Имена и состав музыкантов уточняются. Добавим их здесь после подтверждения.';artists.append(p);}
let validRSVP=false;
try{const u=new URL(c.rsvpUrl);validRSVP=['https:','http:'].includes(u.protocol);}catch{}
document.querySelectorAll('.rsvp').forEach(a=>{if(validRSVP){a.href=c.rsvpUrl;a.target='_blank';a.rel='noopener';}else{a.href='#confirmation';a.classList.add('pending');a.textContent='Я приду · ссылка скоро';a.title='Ссылка подтверждения пока не указана';}});
if(validRSVP)document.getElementById('rsvp-note').textContent='Подтвердите участие по ссылке организатора. На этом сайте данные участников не собираются.';
const fields=['day','hours','guests','food','drinks','extras'];
const $=id=>document.getElementById(id);
$('hours').value=c.durationHours;
function number(id,min,max){const el=$(id);const n=Number(el.value);return Math.max(min,Math.min(max,Number.isFinite(n)?n:min));}
function calculate(){
 const day=$('day').value;const rate={mon_thu:2000,fri:3900,sat:5400,sun:2900}[day];
 const h=number('hours',1,24),g=number('guests',1,40),food=number('food',0,100000),drinks=number('drinks',0,100000),extra=number('extras',0,1000000);
 const rent=rate*h,total=rent+2500+(food+drinks)*g+extra;
 $('rent').textContent=rub(rent);$('food-total').textContent=rub((food+drinks)*g);$('extras-total').textContent=rub(extra);$('per-person').textContent=rub(total/g);$('total').textContent='Всего '+rub(total)+' на '+g+' гостей.';
 const minimum=day==='fri'?5:day==='sat'?6:1;
 const warning=$('scenario-warning');
 if(h<minimum){warning.textContent='Этот сценарий не соответствует минимуму площадки: '+minimum+' ч. Итог не является доступным предложением.';warning.classList.add('invalid');$('per-person').textContent='—';$('total').textContent='Увеличьте длительность до '+minimum+' часов.';}
 else{warning.classList.remove('invalid');warning.textContent=(food===0&&drinks===0?'Еда и напитки не учтены. ':'')+'Не включает неуказанные доплаты и возвратный депозит, если он потребуется. Цены, особенно на декабрь, нужно подтвердить у площадки.';}
}
fields.forEach(id=>$(id).addEventListener('input',calculate));calculate();
