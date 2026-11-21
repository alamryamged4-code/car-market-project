const sampleAds=[
{id:1,title:"تويوتا كامري 2020 فل كامل",category:"سيارات",price:55000,city:"صنعاء",phone:"",description:"حالة ممتازة، استخدام شخصي، جاهزة للفحص.",image:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80",emoji:"🚗"},
{id:2,title:"آيفون 14 برو ماكس 256GB",category:"جوالات",price:1800,city:"عدن",phone:"",description:"نظيف جداً، مع كامل الملحقات.",image:"https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=900&q=80",emoji:"📱"},
{id:3,title:"شقة 3 غرف للبيع",category:"عقارات",price:350000,city:"تعز",phone:"",description:"موقع هادئ وتشطيب جيد، التفاصيل عند التواصل.",image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",emoji:"🏠"},
{id:4,title:"طقم كنب صالة بحالة ممتازة",category:"أثاث",price:1500,city:"إب",phone:"",description:"طقم أنيق ونظيف، البيع لعدم الحاجة.",image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",emoji:"🛋️"},
{id:5,title:"ساعة ذكية رياضية",category:"أزياء",price:250,city:"المكلا",phone:"",description:"ساعة متعددة المزايا وبطارية ممتازة.",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",emoji:"⌚"},
{id:6,title:"لابتوب للعمل والدراسة",category:"جوالات",price:1800,city:"الحديدة",phone:"",description:"مناسب للدراسة والاستخدام اليومي.",image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",emoji:"💻"},
{id:7,title:"أرض سكنية بموقع مميز",category:"عقارات",price:100000,city:"ذمار",phone:"",description:"أرض مناسبة لبناء منزل، أوراقها جاهزة للمعاينة.",image:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80",emoji:"🌳"},
{id:8,title:"إكسسوارات متنوعة جديدة",category:"أخرى",price:100,city:"مأرب",phone:"",description:"مجموعة إكسسوارات جديدة بأسعار مناسبة.",image:"",emoji:"📦"}
];
let userAds=[];try{userAds=JSON.parse(localStorage.getItem("souq-yemen-ads")||"[]")}catch(e){userAds=[]}
let activeCategory="الكل";
const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat("ar-SA").format(Number(n)||0)+" ر.س";
let currencySettings={currency:"SAR",oldRate:"",newRate:""};
try{currencySettings={...currencySettings,...JSON.parse(localStorage.getItem("souq-yemen-currency")||"{}")}}catch(e){}
const currencyLabels={SAR:" ر.س",YER_OLD:" ر.ي (قديم)",YER_NEW:" ر.ي (جديد)"};
function displayMoney(sarAmount){
  const amount=Number(sarAmount)||0;
  if(currencySettings.currency==="YER_OLD"||currencySettings.currency==="YER_NEW"){
    const rate=Number(currencySettings.currency==="YER_OLD"?currencySettings.oldRate:currencySettings.newRate);
    if(!rate||rate<=0)return money(amount)+" (أدخل سعر الصرف من إعدادات العملة)";
    return new Intl.NumberFormat("ar-SA",{maximumFractionDigits:0}).format(Math.round(amount*rate))+currencyLabels[currencySettings.currency];
  }
  return money(amount);
}
function openCurrencySettings(){
  $("#display-currency").value=currencySettings.currency;
  $("#old-rate").value=currencySettings.oldRate;
  $("#new-rate").value=currencySettings.newRate;
  $("#currency-note").textContent="";
  $("#currency-modal").classList.remove("hidden");
  document.body.style.overflow="hidden";
}
function closeCurrencySettings(){
  $("#currency-modal").classList.add("hidden");
  document.body.style.overflow="";
}
$("#currency-settings").addEventListener("click",openCurrencySettings);
$("#close-currency").addEventListener("click",closeCurrencySettings);
$("#currency-modal").addEventListener("click",e=>{if(e.target.id==="currency-modal")closeCurrencySettings()});
$("#currency-form").addEventListener("submit",e=>{
  e.preventDefault();
  currencySettings={currency:$("#display-currency").value,oldRate:$("#old-rate").value.trim(),newRate:$("#new-rate").value.trim()};
  try{localStorage.setItem("souq-yemen-currency",JSON.stringify(currencySettings));render();$("#currency-note").textContent="تم حفظ إعدادات العملة على هذا الجهاز.";setTimeout(closeCurrencySettings,700)}
  catch(err){$("#currency-note").textContent="تعذر حفظ الإعدادات في المتصفح."}
});
function allAds(){return [...userAds,...sampleAds]}
function render(){const q=$("#search").value.trim().toLowerCase(),city=$("#city").value;const list=allAds().filter(a=>(activeCategory==="الكل"||a.category===activeCategory)&&(!city||a.city===city)&&(!q||(a.title+" "+a.description+" "+a.category+" "+a.city).toLowerCase().includes(q)));$("#listing-grid").innerHTML=list.map(a=>'<article class="listing"><div class="listing-image">'+(a.image?'<img loading="lazy" src="'+escapeAttr(a.image)+'" alt="'+escapeAttr(a.title)+'" onerror="this.remove();this.parentElement.insertAdjacentHTML(\'beforeend\',\'<span class=emoji>'+a.emoji+'</span>\')">':'<span class="emoji">'+a.emoji+'</span>')+'<span class="tag">'+a.category+'</span></div><div class="listing-body"><h3>'+escapeHtml(a.title)+'</h3><div class="listing-meta"><span>📍 '+escapeHtml(a.city)+'</span><span>إعلان مبوب</span></div><div class="listing-price">'+displayMoney(a.price)+'</div><p class="listing-desc">'+escapeHtml(a.description||"تواصل مع المعلن لمعرفة التفاصيل.")+'</p>'+(a.phone?'<a class="contact" target="_blank" rel="noopener" href="https://wa.me/'+encodeURIComponent(a.phone.replace(/[^0-9]/g,""))+'">تواصل عبر واتساب</a>':'<span class="contact">نموذج عرض تجريبي</span>')+'</div></article>').join("");$("#count").textContent=list.length+" إعلان";$("#empty").classList.toggle("hidden",list.length>0)}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function escapeAttr(s=""){return escapeHtml(s)}
function openModal(){$("#modal").classList.remove("hidden");document.body.style.overflow="hidden"}
function closeModal(){$("#modal").classList.add("hidden");document.body.style.overflow=""}
document.querySelectorAll("#top-add,#hero-add,#cta-add").forEach(b=>b.addEventListener("click",openModal));
$("#close-modal").addEventListener("click",closeModal);$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeCurrencySettings()}});
$("#browse-btn").addEventListener("click",()=>$("#listings").scrollIntoView({behavior:"smooth"}));
$("#search-btn").addEventListener("click",()=>{render();$("#listings").scrollIntoView({behavior:"smooth"})});
$("#search").addEventListener("input",render);$("#city").addEventListener("change",render);
document.querySelectorAll(".category").forEach(b=>b.addEventListener("click",()=>{activeCategory=b.dataset.category;document.querySelectorAll(".category").forEach(x=>x.classList.toggle("active",x===b));render();}));
$("#ad-form").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);const ad={id:Date.now(),title:f.get("title").trim(),category:f.get("category"),price:Number(f.get("price")),city:f.get("city"),phone:f.get("phone").trim(),description:f.get("description").trim(),image:f.get("image").trim(),emoji:({سيارات:"🚗",جوالات:"📱",عقارات:"🏠",أثاث:"🛋️",أزياء:"⌚",أخرى:"📦"})[f.get("category")]||"📦"};userAds.unshift(ad);try{localStorage.setItem("souq-yemen-ads",JSON.stringify(userAds));$("#form-note").textContent="تمت إضافة إعلانك على هذا الجهاز بنجاح.";e.currentTarget.reset();render();setTimeout(closeModal,900)}catch(err){$("#form-note").textContent="تعذر الحفظ في المتصفح. حاول تقليل حجم البيانات."}});
$("#year").textContent=new Date().getFullYear();render();