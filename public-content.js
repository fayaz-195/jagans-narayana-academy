const CMS_URL="https://stpripgumzxwwblocecs.supabase.co";
const CMS_KEY="sb_publishable_T9S1AjS5mk5GhqnPeuet7w_HJ5LYJUh";
(async()=>{
  try{
    const {createClient}=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
    const supabase=createClient(CMS_URL,CMS_KEY);
    const {data,error}=await supabase.from("jna_site_public").select("content_key,content_value");
    if(error) throw error;
    const values={},pageData={},visualData={};
    (data||[]).forEach(row=>{const v=row.content_value;if(!v||v.deleted)return;if(row.content_key.startsWith("page:")){pageData[row.content_key.slice(5)]=v.value||{};return}if(row.content_key.startsWith("visual:")){const parts=row.content_key.split(":");if(parts[1]===((location.pathname.split("/").pop()||"index").replace(/\\.html$/,"")||"index"))visualData[parts.slice(2).join(":")]=v;return}if(typeof v.value==="string"&&v.value.trim())values[row.content_key]=v.value.trim()});
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
    const visualNodes=[...document.querySelectorAll("main h1,main h2,main h3,main h4,main p,main li,main a,main button,main strong,main span,main em,main small,main figcaption,main label,header .brand-copy strong,header .brand-copy small,footer p,footer a,footer strong,footer span")].filter(el=>!el.closest("#jna-visual-toolbar"));
    const visualImages=[...document.querySelectorAll("main img")];
    Object.entries(visualData).forEach(([id,v])=>{if(v.kind==="text"&&visualNodes[Number(id)])visualNodes[Number(id)].textContent=v.value;if(v.kind==="image"&&visualImages[Number(id)])visualImages[Number(id)].src=v.value});
    if(!document.getElementById("cms-page-style")){const style=document.createElement("style");style.id="cms-page-style";style.textContent=".cms-page-sections,.cms-gallery{max-width:1180px;margin:60px auto;padding:0 20px}.cms-page-section{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:center;margin:28px 0 54px}.cms-page-section.reverse img{order:2}.cms-page-section img{width:100%;height:330px;object-fit:cover;border-radius:14px}.cms-page-section-copy h2,.cms-gallery h2{font:800 clamp(25px,3vw,38px) Manrope;color:#063f37}.cms-page-section-copy p{font:15px/1.8 'DM Sans',sans-serif;color:#64756f}.cms-page-section-copy a{color:#008b7b;font-weight:800}.cms-gallery-track{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(260px,32%);gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:18px 0}.cms-gallery-track figure{margin:0;scroll-snap-align:start}.cms-gallery-track img{width:100%;height:230px;object-fit:cover;border-radius:12px}.cms-gallery-track figcaption{padding:10px 2px;color:#063f37;font-weight:700}@media(max-width:680px){.cms-page-section{grid-template-columns:1fr;gap:15px}.cms-page-section.reverse img{order:0}.cms-page-section img{height:230px}.cms-gallery-track{grid-auto-columns:82%}}";document.head.append(style)}

  }catch(e){console.warn("Academy content could not be refreshed",e)}
})();

/* Front-end visual editor: only authenticated JNA admins see this toolbar. */
(async()=>{
 try{
  const {createClient}=await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
  const sb=createClient(CMS_URL,CMS_KEY);
  const {data:{session}}=await sb.auth.getSession();
  if(!session)return;
  const {data:admins,error:adminErr}=await sb.from("jna_admin_users").select("user_id").eq("user_id",session.user.id).limit(1);
  if(adminErr||!admins?.length)return;
  const slug=(location.pathname.split("/").pop()||"index").replace(/\.html$/,"")||"index";
  const bar=document.createElement("div");bar.id="jna-visual-toolbar";
  bar.innerHTML='<strong>JNA VISUAL EDITOR</strong><span class="jna-editor-page"></span><button type="button" data-action="edit">Edit Page</button><button type="button" data-action="save">Save Draft</button><button type="button" data-action="publish">Publish</button><button type="button" data-action="exit">Exit</button><span class="jna-editor-status" role="status"></span>';
  document.body.append(bar);
  const style=document.createElement("style");style.textContent='#jna-visual-toolbar{position:fixed;z-index:99999;left:12px;right:12px;bottom:12px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:#063f37;color:#fff;padding:10px 12px;border-radius:13px;box-shadow:0 8px 32px #0004;font:600 12px "DM Sans",sans-serif}#jna-visual-toolbar strong{color:#ffb477;letter-spacing:.08em}#jna-visual-toolbar button{border:0;border-radius:7px;padding:9px 12px;background:#fff;color:#063f37;font-weight:800}#jna-visual-toolbar button[data-action=publish]{background:#f36b12;color:#fff}.jna-editor-page{opacity:.8}#jna-visual-toolbar .jna-editor-status{flex-basis:100%;font-size:11px}body.jna-editing [data-jna-editable=true]{outline:2px dashed #f36b12;outline-offset:4px;cursor:text}body.jna-editing img[data-jna-image=true]{outline:3px solid #f36b12;cursor:pointer}body.jna-editing [data-jna-editable=true]:focus{outline:2px solid #008b7b}body{padding-bottom:78px}';
  document.head.append(style);
  bar.querySelector(".jna-editor-page").textContent="· "+slug;
  const status=bar.querySelector(".jna-editor-status");
  let editing=false,dirty=false;
  const selectorPath=el=>{const parts=[];while(el&&el!==document.body){let n=1,s=el;while((s=s.previousElementSibling))if(s.tagName===el.tagName)n++;parts.unshift(el.tagName.toLowerCase()+":nth-of-type("+n+")");el=el.parentElement}return "body > "+parts.join(" > ")};
  const nodes=[...document.querySelectorAll("main h1,main h2,main h3,main p,main li,main a,main button,header .brand-copy strong,header .brand-copy small,footer p,footer a")].filter(el=>!el.closest("#jna-visual-toolbar"));
  nodes.forEach((el,i)=>{el.dataset.jnaEditId=String(i);el.dataset.jnaEditSelector=selectorPath(el);el.dataset.jnaEditable="true"});
  const imgs=[...document.querySelectorAll("main img")];
  imgs.forEach((el,i)=>{el.dataset.jnaImageId=String(i);el.dataset.jnaImageSelector=selectorPath(el);el.dataset.jnaImage="true"});
  const rows=await sb.from("jna_site_drafts").select("content_key,content_value").like("content_key","visual:"+slug+":%");
  if(rows.data)rows.data.forEach(row=>{
    const v=row.content_value||{},id=row.content_key.split(":").slice(2).join(":");
    if(v.deleted)return;
    if(v.kind==="text"){const el=nodes.find(n=>n.dataset.jnaEditId===id);if(el)el.textContent=v.value}
    if(v.kind==="image"){const el=imgs.find(n=>n.dataset.jnaImageId===id);if(el)el.src=v.value}
  });
  const sections=[...document.querySelectorAll("main > section, main section.section, main .visual-pathways, main .quick-strip")].filter(el=>!el.closest("#jna-visual-toolbar"));
  sections.forEach((section,i)=>{
    section.dataset.jnaSectionId=String(i);
    const controls=document.createElement("div");controls.className="jna-section-controls";
    controls.innerHTML='<button type="button" data-section-edit="'+i+'">Edit section</button>';
    section.prepend(controls);
    const editButton=controls.querySelector("button");
    editButton.addEventListener("click",ev=>{
      ev.preventDefault();ev.stopPropagation();
      const active=!section.classList.contains("jna-section-active");
      section.classList.toggle("jna-section-active",active);
      section.querySelectorAll("[data-jna-editable=true]").forEach(el=>{
        el.dataset.jnaSectionEnabled=active?"1":"0";
        el.contentEditable=active?"true":"false";
        el.spellcheck=active;
      });
      editButton.textContent=active?"Done editing":"Edit section";
      status.textContent=active?"Section selected. Tap a text item to edit it, or tap an image to replace it.":"Section editing closed.";
    });
  });
  const sectionStyle=document.createElement("style");
  sectionStyle.textContent='.jna-section-controls{display:none;position:absolute;z-index:30;top:12px;right:12px}.jna-editing .jna-section-controls{display:block}.jna-section-controls button{border:0;border-radius:7px;padding:9px 12px;background:#f36b12;color:#fff;font:700 12px "DM Sans",sans-serif;box-shadow:0 3px 12px #0002}.jna-editing main>section,.jna-editing main section.section,.jna-editing main .visual-pathways,.jna-editing main .quick-strip{position:relative}.jna-section-active{outline:2px dashed #008b7b;outline-offset:-5px}';
  document.head.append(sectionStyle);
  const setEdit=on=>{
    editing=on;document.body.classList.toggle("jna-editing",on);
    nodes.forEach(el=>{el.contentEditable=on?"true":"false";el.spellcheck=on});
    status.textContent=on?"Choose Edit section, then click text or an image to change it.":"View mode";
    bar.querySelector('[data-action="edit"]').textContent=on?"Editing…":"Edit Page";
  };
  document.addEventListener("click",e=>{
    const btn=e.target.closest("[data-section-edit]");
    if(!btn)return;
    e.preventDefault();e.stopPropagation();
    const id=btn.dataset.sectionEdit,section=sections.find(s=>s.dataset.jnaSectionId===id);if(!section)return;
    section.classList.toggle("jna-section-active");
    const active=section.classList.contains("jna-section-active");
    section.querySelectorAll("[data-jna-editable=true]").forEach(el=>{el.dataset.jnaSectionEnabled=active?"1":"0"});
    btn.textContent=active?"Done editing":"Edit section";
    status.textContent=active?"Section selected. Tap any orange-outlined text to edit it; tap an image to replace it.":"Section editing closed.";
  },true);
  document.addEventListener("click",e=>{
    if(!editing)return;
    const el=e.target.closest("[data-jna-editable=true]");
    if(!el||el.closest("#jna-visual-toolbar")||el.dataset.jnaSectionEnabled!=="1")return;
    e.preventDefault();e.stopPropagation();
    const next=prompt("Edit this text. Keep it concise:",el.innerText||el.textContent||"");
    if(next!==null){el.textContent=next;status.textContent="Text updated on page. Tap Save Draft or Publish."}
  },true);
  bar.addEventListener("click",async e=>{
    const action=e.target.dataset.action;if(!action)return;
    if(action==="edit"){setEdit(!editing);return}
    if(action==="exit"){setEdit(false);bar.remove();style.remove();sectionStyle.remove();document.body.style.paddingBottom="";return}
    if(action==="save"||action==="publish"){
      const payload=[];
      nodes.forEach(el=>{if(el.dataset.jnaOriginalText!==el.textContent){payload.push({content_key:"visual:"+slug+":"+el.dataset.jnaEditId,content_value:{kind:"text",value:el.textContent,deleted:false},updated_by:session.user.id})}});
      imgs.forEach(el=>{if(el.dataset.jnaOriginalSrc!==el.src){payload.push({content_key:"visual:"+slug+":"+el.dataset.jnaImageId,content_value:{kind:"image",value:el.getAttribute("src"),deleted:false},updated_by:session.user.id})}});
      if(!payload.length){status.textContent="No changes to save.";return}
      const {error}=await sb.from("jna_site_drafts").upsert(payload);
      if(error){status.textContent="Save failed: "+error.message;return}
      nodes.forEach(el=>el.dataset.jnaOriginalText=el.textContent);
      imgs.forEach(el=>el.dataset.jnaOriginalSrc=el.getAttribute("src"));
      if(action==="publish"){
        const {error:publishError}=await sb.rpc("jna_publish_drafts");
        status.textContent=publishError?"Draft saved, publish failed: "+publishError.message:"Changes published successfully. Refresh the page to verify.";
      }else status.textContent="Draft saved. Visitors will not see it until Publish.";
    }
  });
  nodes.forEach(el=>el.dataset.jnaOriginalText=el.textContent);
  imgs.forEach(el=>el.dataset.jnaOriginalSrc=el.getAttribute("src"));
  document.addEventListener("click",e=>{
    if(!editing)return;const img=e.target.closest("img[data-jna-image=true]");if(!img)return;
    e.preventDefault();e.stopPropagation();const url=prompt("Paste the new image URL",img.getAttribute("src")||"");
    if(url){img.src=url;dirty=true;status.textContent="Image changed. Click Save Draft or Publish."}
  },true);
  nodes.forEach(el=>el.addEventListener("input",()=>{status.textContent="Text changed. Click Save Draft or Publish."}));
  setEdit(false);
 }catch(err){console.warn("JNA visual editor unavailable",err)}
})();
