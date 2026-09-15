'use strict';
const siteBase = new URL('../', document.currentScript.src);
document.querySelectorAll('[data-home]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-home]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));document.getElementById('one-price').textContent=button.dataset.home==='house'?'5,478':'4,378';}));

const firstCta=document.getElementById('first-cta');
const mobileCta=document.querySelector('.mobile-cta');
if(firstCta&&mobileCta&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{const entry=entries[0];mobileCta.classList.toggle('is-visible',!entry.isIntersecting&&entry.boundingClientRect.bottom<0);});
 observer.observe(firstCta);
}
const fixedHeader=document.querySelector('.site-header');
if(fixedHeader){const measureHeader=()=>document.documentElement.style.setProperty('--header-height',`${Math.ceil(fixedHeader.getBoundingClientRect().height)}px`);measureHeader();if('ResizeObserver' in window)new ResizeObserver(measureHeader).observe(fixedHeader);window.addEventListener('resize',measureHeader);}
const menu=document.querySelector('.menu');
if(menu){menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>menu.open=false));document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.open){menu.open=false;menu.querySelector('summary').focus()}});}
const application=document.getElementById('application-form');
if(application){
 const digits=value=>value.normalize('NFKC').replace(/[\s\-ー−―]/g,'');
 const phone=application.elements.tel,zip=application.elements.zip,name=application.elements.name,addr=application.elements.addr;
 const validate=()=>{phone.setCustomValidity(/^0\d{9,10}$/.test(digits(phone.value))?'':'電話番号を10〜11桁の数字で入力してください。');zip.setCustomValidity(/^\d{7}$/.test(digits(zip.value))?'':'郵便番号を7桁の数字で入力してください。');name.setCustomValidity(name.value.trim()?'':'名前を入力してください。');addr.setCustomValidity(addr.value.trim()?'':'住所を入力してください。');};
 [phone,zip,name,addr].forEach(input=>input.addEventListener('input',()=>input.setCustomValidity('')));
 let sending=false;
 application.addEventListener('submit',async event=>{
  event.preventDefault();if(sending)return;validate();if(!application.reportValidity())return;
  const button=application.querySelector('[type=submit]'),status=document.getElementById('form-status');
  const payload={name:name.value.trim(),tel:digits(phone.value),zip:digits(zip.value),addr:addr.value.trim(),addr_type:application.elements.addr_type.value,current_line:application.elements.current_line.value,agree:application.elements.agree.checked,privacy_policy_url:new URL('privacy',siteBase).href,submitted_at:new Date().toISOString(),source_url:location.href,lp_path:location.pathname,referrer:document.referrer};
  const params=new URLSearchParams(location.search);['utm_source','utm_medium','utm_campaign','utm_term','utm_content','placement','keyword','matchtype','gclid','fbclid','lpv'].forEach(key=>payload[key]=params.get(key)||'');
  sending=true;button.disabled=true;button.textContent='送信しています…';status.textContent='';
  try{
   const response=await fetch('https://hooks.zapier.com/hooks/catch/12525485/44eksus/',{method:'POST',mode:'cors',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(payload)});
   if(!response.ok)throw new Error('Submission rejected');
   window.dataLayer = window.dataLayer || [];
   window.dataLayer.push({event: 'form_submit_cv'});
   window.location.assign(new URL('thanks',siteBase).href);
  }catch(error){status.textContent='送信完了を確認できませんでした。通信状況をご確認ください。時間をおいて再送信する場合、重複して受け付けられる可能性があります。';sending=false;button.disabled=false;button.textContent='この内容で申し込む →';}
 });
 if(mobileCta&&'IntersectionObserver' in window){new IntersectionObserver(entries=>{mobileCta.classList.toggle('form-in-view',entries[0].isIntersecting);}).observe(application);}
}
