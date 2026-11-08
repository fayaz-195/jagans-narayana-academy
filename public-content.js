const CMS_URL="https://stpripgumzxwwblocecs.supabase.co";
const CMS_KEY="sb_publishable_T9S1AjS5mk5GhqnPeuet7w_HJ5LYJUh";
(async()=>{
  try{
    const {createClient}=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    const supabase=createClient(CMS_URL,CMS_KEY);
    const {data,error}=await supabase.from("jna_site_public").select("content_key,content_value");
    if(error) throw error;
    const values={};
    (data||[]).forEach(row=>{const v=row.content_value;if(v&&!v.deleted&&typeof v.value==="string"&&v.value.trim())values[row.content_key]=v.value.trim()});
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
  }catch(e){console.warn("Academy content could not be refreshed",e)}
})();