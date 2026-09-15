(()=>{
  const self=document.currentScript;
  const src=self?.src||'';
  const root=src.replace(/assets\/js\/site-shell\.js(?:\?.*)?$/,'');
  if(!root)return;

  const $=(sel,ctx=document)=>ctx.querySelector(sel);
  const all=(sel,ctx=document)=>[...ctx.querySelectorAll(sel)];

  const style=document.createElement('style');
  style.id='canvas-shared-shell-style';
  style.textContent=`
    .canvasSiteHeader,.canvasSiteHeader *,.canvasSiteFooter,.canvasSiteFooter *{box-sizing:border-box}
    header.canvasSiteHeader{height:80px;padding:0;margin:0;border-bottom:1px solid #e7e2d9;background:#fffefb;color:#171717;display:flex;align-items:center;font-family:Inter,system-ui,sans-serif;position:relative;z-index:1000;text-transform:none;letter-spacing:normal}
    .canvasHeaderInner{width:min(1400px,calc(100% - 72px));height:100%;margin:auto;display:flex;align-items:center;gap:24px}
    .canvasBrand{display:flex;align-items:center;gap:12px;text-decoration:none;color:#171717;white-space:nowrap}
    .canvasBrand img{width:30px;height:30px;object-fit:contain;display:block}
    .canvasBrand span{font:500 2.15rem/1 "Cormorant Garamond",Georgia,serif;letter-spacing:.18em}
    .canvasDesktopNav{display:flex;align-items:center;gap:28px;margin-left:auto;font-size:.88rem;color:#56534e}
    .canvasDesktopNav a,.canvasNews{text-decoration:none;color:inherit}
    .canvasNews{display:inline-flex;align-items:center;font-size:.82rem;font-weight:600;white-space:nowrap;color:#56534e}
    .canvasVisit{border:1px solid #171717;padding:10px 14px;font-size:.88rem;line-height:1;font-weight:600;text-decoration:none;color:#171717;white-space:nowrap}
    .canvasMenuButton,.canvasMobileDrawer{display:none}

    footer.canvasSiteFooter{margin:0;padding:30px 0;background:#111;color:#d8d8d4;font-family:Inter,system-ui,sans-serif;font-size:initial;letter-spacing:normal;text-transform:none;border:0}
    .canvasFooterInner{width:min(1180px,calc(100% - 34px));margin:auto;display:flex;justify-content:space-between;gap:30px;align-items:center}
    .canvasFooterBrand strong{display:block;font-family:"Cormorant Garamond",Georgia,serif;font-size:1.5rem;line-height:1;letter-spacing:.2em;color:#fff}
    .canvasFooterBrand span{display:block;font-size:.72rem;line-height:1.35;color:#aaa;margin-top:4px;letter-spacing:normal;text-transform:none}
    .canvasSocial{display:flex;align-items:center;gap:24px;flex-wrap:wrap}
    .canvasSocial a{display:inline-flex;align-items:center;color:#ddd;text-decoration:none}
    .canvasSocial svg{display:block;width:28px;height:28px}

    @media(max-width:980px){
      header.canvasSiteHeader{position:sticky;top:0;height:68px;padding:0;overflow:visible}
      .canvasHeaderInner{width:calc(100% - 24px);height:68px;justify-content:space-between;gap:12px}
      .canvasBrand{gap:8px;min-width:0;margin:0}
      .canvasBrand img{width:25px;height:25px;flex:0 0 25px}
      .canvasBrand span{font-size:1.5rem;letter-spacing:.12em}
      .canvasDesktopNav,.canvasNews,.canvasVisit{display:none!important}
      .canvasMenuButton{display:flex;width:44px;height:44px;padding:0;border:0;background:transparent;align-items:center;justify-content:center;flex-direction:column;gap:5px;cursor:pointer}
      .canvasMenuButton span{display:block;width:25px;height:2px;background:#171717;transition:transform .2s ease,opacity .2s ease}
      .canvasMenuButton.isOpen span:nth-child(1){transform:translateY(7px) rotate(45deg)}
      .canvasMenuButton.isOpen span:nth-child(2){opacity:0}
      .canvasMenuButton.isOpen span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
      .canvasMobileDrawer{display:block;position:absolute;left:0;right:0;top:100%;background:#fffefb;border-top:1px solid #e7e2d9;border-bottom:1px solid #d8d2c7;box-shadow:0 16px 35px #00000016;max-height:0;opacity:0;overflow:hidden;pointer-events:none;transition:max-height .28s ease,opacity .2s ease}
      .canvasMobileDrawer.isOpen{max-height:520px;opacity:1;pointer-events:auto}
      .canvasMobileDrawerInner{padding:10px 18px 18px;display:grid}
      .canvasMobileDrawer a{display:flex;align-items:center;justify-content:space-between;min-height:49px;padding:0 4px;border-bottom:1px solid #ebe6dd;text-decoration:none;color:#171717;font:600 1.2rem/1 "Cormorant Garamond",Georgia,serif;letter-spacing:normal;text-transform:none}
      .canvasMobileDrawer a::after{content:'→';font-family:Inter,system-ui,sans-serif;font-size:.8rem;color:#77736b}
      .canvasMobileDrawer a.canvasDrawerCta{margin-top:12px;min-height:46px;padding:0 14px;background:#171717;color:#fff;border:0;font-family:Inter,system-ui,sans-serif;font-size:.8rem;font-weight:700}
      .canvasMobileDrawer a.canvasDrawerCta::after{color:#fff}
      .canvasFooterInner{align-items:flex-start;flex-direction:column}
    }
    @media(max-width:620px){
      .canvasHeaderInner{width:calc(100% - 20px)}
      .canvasBrand img{width:23px;height:23px;flex-basis:23px}
      .canvasBrand span{font-size:1.4rem;letter-spacing:.1em}
    }
  `;
  document.head.appendChild(style);

  const oldHeader=$('body > header')||$('header');
  if(oldHeader)oldHeader.remove();
  all('footer').forEach(f=>f.remove());

  const header=document.createElement('header');
  header.className='canvasSiteHeader';
  header.innerHTML=`
    <div class="canvasHeaderInner">
      <a class="canvasBrand" href="${root}index.html" aria-label="Canvas, inicio"><img src="${root}assets/img/canvas-icon-mark.png" alt=""><span>CANVAS</span></a>
      <nav class="canvasDesktopNav" aria-label="Navegación principal">
        <a href="${root}index.html#espacios">Espacios</a>
        <a href="${root}index.html#ubicacion-landing">Ubicación</a>
        <a href="${root}disponibilidad/">Disponibilidad</a>
      </nav>
      <a class="canvasNews" href="${root}novedades/">Novedades</a>
      <a class="canvasVisit" href="${root}contacto/">Ven a conocer Canvas</a>
      <button class="canvasMenuButton" type="button" aria-label="Abrir menú de navegación" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
    <nav class="canvasMobileDrawer" aria-label="Navegación móvil">
      <div class="canvasMobileDrawerInner">
        <a href="${root}index.html#espacios">Espacios</a>
        <a href="${root}index.html#ubicacion-landing">Ubicación</a>
        <a href="${root}disponibilidad/">Disponibilidad</a>
        <a href="${root}novedades/">Novedades</a>
        <a class="canvasDrawerCta" href="${root}contacto/">Conoce Canvas</a>
      </div>
    </nav>`;
  document.body.insertBefore(header,document.body.firstChild);

  const footer=document.createElement('footer');
  footer.className='canvasSiteFooter';
  footer.innerHTML=`<div class="canvasFooterInner"><div class="canvasFooterBrand"><strong>CANVAS</strong><span>Espacios para proyectos independientes</span></div><div class="canvasSocial">
    <a href="https://www.instagram.com/canvas_90/" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg></a>
    <a href="#" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V10H8v3h2.6v8h3.1Z"/></svg></a>
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
