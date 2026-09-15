(()=>{
  const MAP_URL='https://maps.app.goo.gl/8iztCUD8DyXN1Yzk9';

  const style=document.createElement('style');
  style.id='canvas-mobile-index-tweaks';
  style.textContent=`
    .newsQuick{display:inline-flex;align-items:center;font-size:.82rem;font-weight:600;text-decoration:none;white-space:nowrap;color:#56534e}
    .cardThumb,.mobileMenuButton,.mobileDrawer{display:none}
    .locationMapCard{cursor:pointer}
    .locationMapCard>a{display:block;width:100%;height:100%}

    @media(max-width:980px){
      .siteHeader{position:sticky;top:0;z-index:1000;height:68px;padding:0;background:#fffefb;overflow:visible}
      .headerInner{width:calc(100% - 24px);height:68px;display:flex;align-items:center;justify-content:space-between;gap:12px}
      .brand{gap:8px;min-width:0;white-space:nowrap;margin:0}
      .brand img{width:25px;height:25px;flex:0 0 25px}
      .brand span{font-size:1.5rem;letter-spacing:.12em}
      .nav,.newsQuick,.visit{display:none!important}
      .mobileMenuButton{display:flex;width:44px;height:44px;padding:0;border:0;background:transparent;align-items:center;justify-content:center;flex-direction:column;gap:5px;cursor:pointer}
      .mobileMenuButton span{display:block;width:25px;height:2px;background:#171717;transition:transform .2s ease,opacity .2s ease}
      .mobileMenuButton.isOpen span:nth-child(1){transform:translateY(7px) rotate(45deg)}
      .mobileMenuButton.isOpen span:nth-child(2){opacity:0}
      .mobileMenuButton.isOpen span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
      .mobileDrawer{display:block;position:absolute;left:0;right:0;top:100%;background:#fffefb;border-top:1px solid #e7e2d9;border-bottom:1px solid #d8d2c7;box-shadow:0 16px 35px #00000016;max-height:0;opacity:0;overflow:hidden;pointer-events:none;transition:max-height .28s ease,opacity .2s ease}
      .mobileDrawer.isOpen{max-height:520px;opacity:1;pointer-events:auto}
      .mobileDrawerInner{padding:10px 18px 18px;display:grid}
      .mobileDrawer a{display:flex;align-items:center;justify-content:space-between;min-height:49px;padding:0 4px;border-bottom:1px solid #ebe6dd;text-decoration:none;font:600 1.2rem/1 'Cormorant Garamond',serif}
      .mobileDrawer a::after{content:'→';font-family:Inter,system-ui,sans-serif;font-size:.8rem;color:#77736b}
      .mobileDrawer a.mobileDrawerCta{margin-top:12px;min-height:46px;padding:0 14px;background:#171717;color:#fff;border:0;font-family:Inter,system-ui,sans-serif;font-size:.8rem;font-weight:700}
      .mobileDrawer a.mobileDrawerCta::after{color:#fff}
    }

    @media(max-width:620px){
      .headerInner{width:calc(100% - 20px)}
      .brand img{width:23px;height:23px;flex-basis:23px}
      .brand span{font-size:1.4rem;letter-spacing:.1em}
      .spaces{padding:40px 0 34px;border-bottom:0}
      .spacesIntro{margin-bottom:18px}
      .cards{gap:8px}
      .card{border-top:0;min-height:118px;padding:14px;display:grid;grid-template-columns:minmax(0,1fr) 54px 92px;align-items:center;gap:10px}
      .card small{font-size:.68rem}
      .card strong{font-size:1.5rem;margin:6px 0 0}
      .card>img:not(.cardThumb){width:50px;height:42px;object-fit:contain;object-position:center;margin:0}
      .cardThumb{display:block!important;width:92px!important;height:76px!important;object-fit:cover!important;object-position:center!important;border:4px solid rgba(255,255,255,.82);box-shadow:0 5px 14px #00000014}
      .spot{display:none!important}

      .possibilities{padding:38px 0 30px}
      .possibilitiesInner{width:calc(100% - 20px)}
      .possibilities h2{font-size:2.45rem;line-height:.94;margin:0 0 20px}
      .possibilityGrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .posCard{padding:6px 6px 9px;box-shadow:0 8px 18px #0000000d}
      .posCard img{aspect-ratio:4/3;object-fit:cover}
      .posCard strong{margin:8px 3px 1px;font-size:.64rem;line-height:1.18;letter-spacing:.09em}
      .posCard:last-child{grid-column:1/-1}
      .posCard:last-child img{aspect-ratio:16/6;object-position:center 42%}
      .possibilityNote{margin-top:17px;font-size:1.4rem;line-height:1.12}
      .activityStrip{padding:25px 0 28px}
      .activityStripInner{width:calc(100% - 20px)}
      .activityList{justify-content:flex-start;gap:8px 18px;font-size:1.5rem;line-height:1}
    }

    @media(max-width:380px){
      .brand img{width:21px;height:21px;flex-basis:21px}
      .brand span{font-size:1.28rem;letter-spacing:.08em}
      .card{grid-template-columns:minmax(0,1fr) 46px 78px;padding:12px;gap:8px}
      .card>img:not(.cardThumb){width:44px;height:38px}
      .cardThumb{width:78px!important;height:66px!important}
      .possibilities h2{font-size:2.2rem}
      .posCard strong{font-size:.6rem}
      .activityList{font-size:1.38rem;gap:7px 15px}
    }
  `;
  document.head.appendChild(style);

  const header=document.querySelector('.headerInner');
  const visit=header?.querySelector('.visit');

  if(header&&visit&&!header.querySelector('.newsQuick')){
    const link=document.createElement('a');
    link.className='newsQuick';
    link.href='novedades/';
    link.textContent='Novedades';
    link.setAttribute('aria-label','Novedades de Canvas');
    header.insertBefore(link,visit);
  }

  const desktopLocation=header?.querySelector('.nav a[href="ubicacion/"]');
  if(desktopLocation){
    desktopLocation.href='#ubicacion-landing';
    desktopLocation.removeAttribute('target');
    desktopLocation.removeAttribute('rel');
  }

  const siteHeader=document.querySelector('.siteHeader');
  if(siteHeader&&header&&!siteHeader.querySelector('.mobileMenuButton')){
    const button=document.createElement('button');
    button.className='mobileMenuButton';
    button.type='button';
    button.setAttribute('aria-label','Abrir menú de navegación');
    button.setAttribute('aria-expanded','false');
    button.innerHTML='<span></span><span></span><span></span>';
    header.appendChild(button);

    const drawer=document.createElement('nav');
    drawer.className='mobileDrawer';
    drawer.setAttribute('aria-label','Navegación móvil');
    drawer.innerHTML=`<div class="mobileDrawerInner">
      <a href="#espacios">Espacios</a>
      <a href="#ubicacion-landing">Ubicación</a>
      <a href="disponibilidad/">Disponibilidad</a>
      <a href="contacto/">Contacto</a>
      <a href="novedades/">Novedades</a>
      <a class="mobileDrawerCta" href="contacto/">Conoce Canvas</a>
    </div>`;
    siteHeader.appendChild(drawer);

    const closeMenu=()=>{
      button.classList.remove('isOpen');
      drawer.classList.remove('isOpen');
      button.setAttribute('aria-expanded','false');
      button.setAttribute('aria-label','Abrir menú de navegación');
    };
    const toggleMenu=()=>{
      const open=!button.classList.contains('isOpen');
      button.classList.toggle('isOpen',open);
      drawer.classList.toggle('isOpen',open);
      button.setAttribute('aria-expanded',String(open));
      button.setAttribute('aria-label',open?'Cerrar menú de navegación':'Abrir menú de navegación');
    };
    button.addEventListener('click',toggleMenu);
    drawer.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
    document.addEventListener('click',e=>{
      if(!siteHeader.contains(e.target))closeMenu();
    });
  }

  const locationButton=document.querySelector('.locationBtn.primary');
  if(locationButton){
    locationButton.href=MAP_URL;
    locationButton.target='_blank';
    locationButton.rel='noopener';
  }

  const mapCard=document.querySelector('.locationMapCard');
  if(mapCard&&!mapCard.querySelector('a')){
    const link=document.createElement('a');
    link.href=MAP_URL;
    link.target='_blank';
    link.rel='noopener';
    link.setAttribute('aria-label','Abrir ubicación de Canvas en Google Maps');
    while(mapCard.firstChild)link.appendChild(mapCard.firstChild);
    mapCard.appendChild(link);
  }

  const pairs=[
    ['.card.c90','detailCanvas90','Canvas 90'],
    ['.card.pulse','detailPulso','Canvas Pulso'],
    ['.card.origin','detailOrigen','Canvas Origen'],
    ['.card.gardenCard','detailGarden','El Jardín de Canvas'],
    ['.card.deckCard','detailDeck','Canvas Deck']
  ];

  pairs.forEach(([selector,sourceId,label])=>{
    const card=document.querySelector(selector);
    const source=document.getElementById(sourceId);
    if(!card||!source||card.querySelector('.cardThumb'))return;
    const thumb=document.createElement('img');
    thumb.className='cardThumb';
    thumb.alt=`Miniatura de ${label}`;
    thumb.loading='lazy';
    card.appendChild(thumb);
    const sync=()=>{if(source.src)thumb.src=source.src};
    sync();
    new MutationObserver(sync).observe(source,{attributes:true,attributeFilter:['src']});
  });
})();
