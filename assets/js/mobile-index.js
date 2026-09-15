(()=>{
  const style=document.createElement('style');
  style.id='canvas-mobile-index-tweaks';
  style.textContent=`
    .newsQuick{display:inline-flex;align-items:center;font-size:.82rem;font-weight:600;text-decoration:none;white-space:nowrap;color:#56534e}
    .cardThumb{display:none}
    @media(max-width:620px){
      .siteHeader{height:auto;padding:9px 0 0;background:#fffefb}
      .headerInner{width:100%;display:grid;grid-template-columns:1fr 1fr;grid-template-areas:"brand brand" "news visit";gap:0;align-items:center}
      .brand{grid-area:brand;justify-self:center;gap:7px;min-width:0;white-space:nowrap;margin:0 0 9px}
      .brand img{width:24px;height:24px;flex:0 0 24px}
      .brand span{font-size:1.45rem;letter-spacing:.12em}
      .newsQuick{grid-area:news;display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 10px;border-top:1px solid #e7e2d9;border-right:1px solid #e7e2d9;font-size:.72rem;font-weight:700;text-decoration:none;white-space:nowrap;color:#171717}
      .visit{grid-area:visit;display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 10px;border:0;border-top:1px solid #e7e2d9;font-size:0;line-height:1;text-decoration:none}
      .visit::after{content:"Conoce Canvas";font-size:.72rem;font-weight:700;letter-spacing:0}
      .spaces{padding:40px 0 34px;border-bottom:0}
      .spacesIntro{margin-bottom:18px}
      .cards{gap:8px}
      .card{border-top:0;min-height:118px;padding:14px;display:grid;grid-template-columns:minmax(0,1fr) 54px 92px;align-items:center;gap:10px}
      .card small{font-size:.68rem}
      .card strong{font-size:1.5rem;margin:6px 0 0}
      .card>img:not(.cardThumb){width:50px;height:42px;object-fit:contain;object-position:center;margin:0}
      .cardThumb{display:block!important;width:92px!important;height:76px!important;object-fit:cover!important;object-position:center!important;border:4px solid rgba(255,255,255,.82);box-shadow:0 5px 14px #00000014}
      .spot{display:none!important}
    }
    @media(max-width:380px){
      .brand img{width:22px;height:22px;flex-basis:22px}
      .brand span{font-size:1.3rem;letter-spacing:.1em}
      .newsQuick,.visit::after{font-size:.68rem}
      .card{grid-template-columns:minmax(0,1fr) 46px 78px;padding:12px;gap:8px}
      .card>img:not(.cardThumb){width:44px;height:38px}
      .cardThumb{width:78px!important;height:66px!important}
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
