(()=>{
  const siteHeader=document.querySelector('.siteHeader');
  const button=siteHeader?.querySelector('.mobileMenuButton');
  const drawer=siteHeader?.querySelector('.mobileDrawer');
  if(!button||!drawer)return;

  const setOpen=open=>{
    button.classList.toggle('isOpen',open);
    drawer.classList.toggle('isOpen',open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'Cerrar menú de navegación':'Abrir menú de navegación');
  };
  button.addEventListener('click',()=>setOpen(!button.classList.contains('isOpen')));
  drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
  document.addEventListener('click',e=>{if(!siteHeader.contains(e.target))setOpen(false)});
})();
