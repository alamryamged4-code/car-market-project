const initialCars = [
  {id:1,name:"Toyota Camry",brand:"Toyota",year:2022,price:18500,image:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80"},
  {id:2,name:"Hyundai Tucson",brand:"Hyundai",year:2021,price:16900,image:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80"},
  {id:3,name:"BMW 5 Series",brand:"BMW",year:2023,price:32000,image:"https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80"},
  {id:4,name:"Kia Sportage",brand:"Kia",year:2020,price:14200,image:"https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80"},
  {id:5,name:"Mercedes C-Class",brand:"Mercedes",year:2022,price:28500,image:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80"},
  {id:6,name:"Honda Accord",brand:"Honda",year:2019,price:12500,image:"https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?auto=format&fit=crop&w=900&q=80"}
];
const KEY = "car-market-demo-v1";
const $ = (id) => document.getElementById(id);
let cars = readCars();

function readCars(){
  try { const value = localStorage.getItem(KEY); return value ? JSON.parse(value) : initialCars; }
  catch { return initialCars; }
}
function saveCars(){ try { localStorage.setItem(KEY, JSON.stringify(cars)); } catch(e) { console.warn("تعذر حفظ البيانات محليًا", e); } }
function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function updateBrands(){
  const current = $("brand-filter").value;
  const brands = [...new Set(cars.map(car => car.brand))].sort();
  $("brand-filter").innerHTML = '<option value="">كل الشركات</option>' +
    brands.map(brand => '<option value="' + escapeHtml(brand) + '">' + escapeHtml(brand) + '</option>').join("");
  $("brand-filter").value = brands.includes(current) ? current : "";
}
function renderCars(){
  const term = $("search").value.trim().toLowerCase();
  const brand = $("brand-filter").value;
  const max = Number($("price-filter").value) || Infinity;
  const shown = cars.filter(car =>
    (car.name.toLowerCase().includes(term) || car.brand.toLowerCase().includes(term)) &&
    (!brand || car.brand === brand) && car.price < max
  );
  const grid = $("car-grid");
  const template = $("car-template");
  grid.innerHTML = "";
  shown.forEach(car => {
    const card = template.content.cloneNode(true);
    const img = card.querySelector("img");
    img.src = car.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80";
    img.alt = car.name;
    img.onerror = () => { img.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80"; };
    card.querySelector(".year-tag").textContent = car.year;
    card.querySelector(".car-brand").textContent = car.brand;
    card.querySelector(".car-name").textContent = car.name;
    card.querySelector(".car-price").textContent = new Intl.NumberFormat("en-US").format(car.price) + " $";
    card.querySelector(".delete-button").addEventListener("click", () => {
      if(confirm("هل تريد حذف إعلان " + car.name + "؟")){
        cars = cars.filter(item => item.id !== car.id);
        saveCars(); updateBrands(); renderCars();
      }
    });
    grid.appendChild(card);
  });
  $("total-count").textContent = cars.length;
  $("results-count").textContent = "عرض " + shown.length + " من " + cars.length + " سيارة";
  $("empty-state").classList.toggle("hidden", shown.length !== 0);
}
$("search").addEventListener("input", renderCars);
$("brand-filter").addEventListener("change", renderCars);
$("price-filter").addEventListener("change", renderCars);
$("car-form").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const car = {
    id: Date.now(),
    name: String(data.get("name")).trim(),
    brand: String(data.get("brand")).trim(),
    year: Number(data.get("year")),
    price: Number(data.get("price")),
    image: String(data.get("image")).trim()
  };
  if(!car.name || !car.brand || !Number.isFinite(car.year) || !Number.isFinite(car.price) || car.price <= 0) return;
  cars.unshift(car);
  saveCars(); updateBrands(); renderCars();
  event.currentTarget.reset();
  $("form-message").textContent = "تمت إضافة السيارة إلى المعرض على هذا الجهاز.";
  $("inventory").scrollIntoView({behavior:"smooth"});
});
$("year").textContent = new Date().getFullYear();
updateBrands();
renderCars();
