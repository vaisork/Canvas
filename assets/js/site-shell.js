(()=>{
  const self=document.currentScript;
  const src=self?.src||'';
  const root=src.replace(/assets\/js\/site-shell\.js(?:\?.*)?$/,'');
  if(!root)return;

  const $=(sel,ctx=document)=>ctx.querySelector(sel);
  const all=(sel,ctx=document)=>[...ctx.querySelectorAll(sel)];

  if(!document.getElementById('canvas-shared-shell-style')){
    const link=document.createElement('link');
    link.rel='stylesheet';link.id='canvas-shared-shell-style';link.href=root+'assets/css/shell.css?v=1';
    document.head.appendChild(link);
  }

  const oldHeader=$('body > header')||$('header');
  if(oldHeader)oldHeader.remove();
  all('footer').forEach(f=>f.remove());

  const header=document.createElement('header');
  header.className='canvasSiteHeader';
  header.innerHTML=`
    <div class="canvasHeaderInner">
      <a class="canvasBrand" href="${root}index.html" aria-label="Canvas, inicio"><img src="${root}assets/img/canvas-icon-mark-optimized.webp" alt=""><span>CANVAS</span></a>
      <nav class="canvasDesktopNav" aria-label="Navegación principal">
        <a href="${root}index.html#espacios">Espacios</a>
        <a href="${root}estudio-fotografico/">Estudio fotográfico</a>
        <a href="${root}index.html#ubicacion-landing">Ubicación</a>
        <a href="${root}disponibilidad/">Disponibilidad</a>
      </nav>
      <a class="canvasNews" href="${root}novedades/">Qué pasa en Canvas</a>
      <a class="canvasVisit" href="${root}contacto/">Ven a conocer Canvas</a>
      <button class="canvasMenuButton" type="button" aria-label="Abrir menú de navegación" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
    <nav class="canvasMobileDrawer" aria-label="Navegación móvil">
      <div class="canvasMobileDrawerInner">
        <a href="${root}index.html#espacios">Espacios</a>
        <a href="${root}estudio-fotografico/">Estudio fotográfico</a>
        <a href="${root}index.html#ubicacion-landing">Ubicación</a>
        <a href="${root}disponibilidad/">Disponibilidad</a>
        <a href="${root}novedades/">Qué pasa en Canvas</a>
        <a class="canvasDrawerCta" href="${root}contacto/">Conoce Canvas</a>
      </div>
    </nav>`;
  document.body.insertBefore(header,document.body.firstChild);

  const footer=document.createElement('footer');
  footer.className='canvasSiteFooter';
  footer.innerHTML=`<div class="canvasFooterInner"><div class="canvasFooterBrand"><strong>CANVAS</strong><span>Espacios para proyectos independientes</span></div><div class="canvasSocial">
    <a href="https://www.instagram.com/canvas_90/" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg></a>
    <a href="https://www.facebook.com/share/18fSa5VbmX/" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V10H8v3h2.6v8h3.1Z"/></svg></a>
    <a href="${root}index.html#ubicacion-landing" aria-label="Ubicación" title="Ubicación"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"/><circle cx="12" cy="10" r="2.2"/></svg></a>
    <a href="https://wa.me/527821402617?text=Hola%2C%20vi%20la%20p%C3%A1gina%20de%20Canvas%20y%20quiero%20conocer%20los%20espacios%20para%20mi%20proyecto." target="_blank" rel="noopener" aria-label="WhatsApp" title="WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M20.4 11.8a8.4 8.4 0 0 1-12.4 7.4L4 20.3l1.1-3.9A8.4 8.4 0 1 1 20.4 11.8Z"/><path d="M9 7.8c.2-.4.5-.4.8-.4h.5c.2 0 .4 0 .5.4l.8 1.8c.1.3.1.5-.1.7l-.6.8c-.2.2-.2.4-.1.7.5 1.1 1.4 2 2.5 2.6.3.2.5.1.7-.1l.8-1c.2-.3.5-.3.8-.2l1.8.9c.3.1.4.3.4.5 0 .7-.3 1.4-.8 1.8-.6.5-1.4.8-2.3.6-1.1-.2-2.7-.9-4.5-2.5-1.5-1.3-2.5-2.9-2.8-4-.3-1 .1-2 .6-2.6Z"/></svg></a>
  </div></div>`;
  document.body.appendChild(footer);

  const button=$('.canvasMenuButton',header);
  const drawer=$('.canvasMobileDrawer',header);
  const closeMenu=()=>{
    button.classList.remove('isOpen');
    drawer.classList.remove('isOpen');
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-label','Abrir menú de navegación');
  };
  button.addEventListener('click',()=>{
    const open=!button.classList.contains('isOpen');
    button.classList.toggle('isOpen',open);
    drawer.classList.toggle('isOpen',open);
    button.setAttribute('aria-expanded',String(open));
    button.setAttribute('aria-label',open?'Cerrar menú de navegación':'Abrir menú de navegación');
  });
  all('a',drawer).forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  document.addEventListener('click',e=>{if(!header.contains(e.target))closeMenu()});
})();
