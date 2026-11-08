const CMS_URL="https://stpripgumzxwwblocecs.supabase.co";
const CMS_KEY="sb_publishable_T9S1AjS5mk5GhqnPeuet7w_HJ5LYJUh";
(async()=>{
  try{
    const {createClient}=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    const supabase=createClient(CMS_URL,CMS_KEY);
    const {data,error}=await supabase.from("jna_site_public").select("content_key,content_value");
    if(error) throw error;
    const values={},pageData={};
    (data||[]).forEach(row=>{const v=row.content_value;if(!v||v.deleted)return;if(row.content_key.startsWith("page:")){pageData[row.content_key.slice(5)]=v.value||{};return}if(typeof v.value==="string"&&v.value.trim())values[row.content_key]=v.value.trim()});
    const setText=(selector,value)=>{const el=document.querySelector(selector);if(el&&value)el.textContent=value};
    if(location.pathname.endsWith("/")||location.pathname.endsWith("/index.html")||location.pathname==="/"){
      setText(".hero-copy h1",values.hero_title);
      setText(".hero-lead",values.hero_description);
      setText(".school-card p",values.schooling);
      setText(".intermediate-card p",values.intermediate);
      setText(".entrance-card p",values.entrance);
      setText(".professional-card p",values.professional);
    }
    if(values.contact_phone){
      document.querySelectorAll('a[href^="tel:"]').forEach(a=>{a.href="tel:"+values.contact_phone.replace(/[^0-9+]/g,"");if(/call|phone|9133444384/i.test(a.textContent))a.textContent="Call "+values.contact_phone+" →"});
      document.querySelectorAll("body *").forEach(el=>{if(el.children.length===0&&el.textContent.includes("9133444384"))el.textContent=el.textContent.replaceAll("9133444384",values.contact_phone)});
    }
    if(values.contact_address){
      document.querySelectorAll("body *").forEach(el=>{if(el.children.length===0&&/Sama Street|Badangpet/i.test(el.textContent))el.textContent=values.contact_address});
    }
    if(values.notice_title||values.notice_text){
      const bar=document.createElement("aside");bar.setAttribute("aria-label","Academy notice");
      bar.style.cssText="background:#fff3e8;border-bottom:1px solid #f36b12;padding:12px 20px;text-align:center;color:#063f37;font:600 14px/1.5 'DM Sans',sans-serif";
      const strong=document.createElement("strong");strong.textContent=values.notice_title||"Academy Update";
      const span=document.createElement("span");span.textContent=(values.notice_text?" — "+values.notice_text:"");
      bar.append(strong,span);
      if(values.notice_link){const a=document.createElement("a");a.href=values.notice_link;a.textContent=" Read more ↗";a.style.cssText="color:#f36b12;margin-left:8px";bar.append(a)}
      document.body.prepend(bar);
    }
    if(values.hero_image){const hero=document.querySelector(".hero-art");if(hero)hero.style.backgroundImage="url("+JSON.stringify(values.hero_image)+")"}

    const slug=(location.pathname.split("/").pop()||"index").replace(/\\.html$/,"")||"index";
    const page=pageData[slug];
    if(page){
      const h=document.querySelector("main h1");if(h&&page.title)h.textContent=page.title;
      const intro=document.querySelector(".hero-lead,.page-hero p,main>section p");if(intro&&page.intro)intro.textContent=page.intro;
      const main=document.querySelector("main");
      if(main&&Array.isArray(page.sections)&&page.sections.length){
        const wrap=document.createElement("section");wrap.className="cms-page-sections";
        page.sections.forEach((item,i)=>{
          const card=document.createElement("article");card.className="cms-page-section"+(i%2?" reverse":"");
          if(item.image){const img=document.createElement("img");img.src=item.image;img.alt=item.alt||item.heading||"Academy learning";img.loading="lazy";card.append(img)}
          const body=document.createElement("div");body.className="cms-page-section-copy";
          const h2=document.createElement("h2");h2.textContent=item.heading||"";body.append(h2);
          const p=document.createElement("p");p.textContent=item.text||"";body.append(p);
          if(item.link){const a=document.createElement("a");a.href=item.link;a.textContent=item.linkText||"Learn more ↗";body.append(a)}
          card.append(body);wrap.append(card);
        });main.append(wrap);
      }
      if(main&&Array.isArray(page.slides)&&page.slides.length){
        const gallery=document.createElement("section");gallery.className="cms-gallery";
        const title=document.createElement("h2");title.textContent="Academy moments";gallery.append(title);
        const track=document.createElement("div");track.className="cms-gallery-track";
        page.slides.forEach(item=>{if(!item.image)return;const card=document.createElement("figure");const img=document.createElement("img");img.src=item.image;img.alt=item.alt||item.caption||"Academy gallery";img.loading="lazy";card.append(img);if(item.caption){const cap=document.createElement("figcaption");cap.textContent=item.caption;card.append(cap)}track.append(card)});
        gallery.append(track);main.append(gallery);
      }
    }
    if(!document.getElementById("cms-page-style")){const style=document.createElement("style");style.id="cms-page-style";style.textContent=".cms-page-sections,.cms-gallery{max-width:1180px;margin:60px auto;padding:0 20px}.cms-page-section{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:center;margin:28px 0 54px}.cms-page-section.reverse img{order:2}.cms-page-section img{width:100%;height:330px;object-fit:cover;border-radius:14px}.cms-page-section-copy h2,.cms-gallery h2{font:800 clamp(25px,3vw,38px) Manrope;color:#063f37}.cms-page-section-copy p{font:15px/1.8 'DM Sans',sans-serif;color:#64756f}.cms-page-section-copy a{color:#008b7b;font-weight:800}.cms-gallery-track{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(260px,32%);gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:18px 0}.cms-gallery-track figure{margin:0;scroll-snap-align:start}.cms-gallery-track img{width:100%;height:230px;object-fit:cover;border-radius:12px}.cms-gallery-track figcaption{padding:10px 2px;color:#063f37;font-weight:700}@media(max-width:680px){.cms-page-section{grid-template-columns:1fr;gap:15px}.cms-page-section.reverse img{order:0}.cms-page-section img{height:230px}.cms-gallery-track{grid-auto-columns:82%}}";document.head.append(style)}

  }catch(e){console.warn("Academy content could not be refreshed",e)}
})();