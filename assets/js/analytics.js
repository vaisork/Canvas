(()=>{
  const GA_ID='G-0G8VJ13QFG';
  if(window.__canvasAnalyticsLoaded)return;
  window.__canvasAnalyticsLoaded=true;

  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};

  const tag=document.createElement('script');
  tag.async=true;
  tag.src=`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(tag);

  gtag('js',new Date());
  gtag('config',GA_ID,{
    send_page_view:true,
    linker:{domains:['glampingojodeagua.mx','vaisork.github.io']}
  });

  const cleanText=value=>(value||'').replace(/\s+/g,' ').trim().slice(0,120);

  const classifyLink=(anchor,url,raw)=>{
    const href=(raw||'').toLowerCase();
    const host=(url?.hostname||'').toLowerCase();
    if(href.startsWith('#'))return 'anchor';
    if(href.startsWith('mailto:'))return 'email';
    if(href.startsWith('tel:'))return 'phone';
    if(host==='wa.me'||host.endsWith('.wa.me')||host.includes('whatsapp.com'))return 'whatsapp';
    if(host.includes('google.com')||host.includes('goo.gl')||host.includes('maps.app.goo.gl'))return 'google_maps';
    if(host.includes('instagram.com'))return 'instagram';
    if(host.includes('facebook.com'))return 'facebook';
    if(url&&url.origin===location.origin)return 'internal';
    return 'external';
  };

  document.addEventListener('click',event=>{
    const anchor=event.target.closest?.('a[href]');
    if(!anchor)return;

    const raw=anchor.getAttribute('href')||'';
    if(!raw||raw.toLowerCase().startsWith('javascript:'))return;

    let url=null;
    try{url=new URL(raw,location.href);}catch(_){/* conservar href crudo */}

    gtag('event','link_click',{
      link_text:cleanText(anchor.innerText||anchor.getAttribute('aria-label')||anchor.title),
      link_url:url?.href||raw,
      link_type:classifyLink(anchor,url,raw),
      link_domain:url?.hostname||'',
      link_path:url?.pathname||raw,
      link_target:anchor.target||'_self',
      link_id:anchor.id||'',
      link_classes:cleanText(anchor.className||''),
      page_path:location.pathname+location.search,
      page_title:document.title
    });
  },true);
})();
