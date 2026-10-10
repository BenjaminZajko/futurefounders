const detailDialog = document.querySelector('#detail-dialog');
const leaveDialog = document.querySelector('#leave-dialog');
const photoDialog = document.querySelector('#photo-dialog');
const content = document.querySelector('#dialog-content');
let photos = [];
let photoIndex = 0;
let returnToGallery = false;
let returnFocus = null;

const projects = {
  olive: `<article class="modal-body"><p class="eyebrow">Môj hlavný projekt · Vo vývoji</p><h2 id="dialog-title">OliveCode</h2><p class="modal-lead">Začalo sa to tým, že som nechcel hneď platiť za AI.</p><p>Začalo sa to mojím vlastným problémom. Chcel som s AI stavať projekty, ale nechcel som hneď platiť niekoľko predplatných. Tak som začal hľadať, ako lepšie využiť dostupné modely.</p><img class="cover" src="projekty/olivecode/assets/app-welcome.webp" alt="Skutočné rozhranie OliveCode v termináli"><h3>Čo to vlastne je?</h3><p>Nástroj, v ktorom AI dokáže okrem odpovedania aj pracovať na projekte: prečítať súbory, upraviť kód a skontrolovať výsledok. Ja prepájam modely a nástroje do jedného prostredia.</p><h3>Čo je na tom zaujímavé</h3><h3>Keď sa jeden model minie, pokračuje ďalší</h3><p>Používateľ si pripojí účty poskytovateľov modelov. Keď jeden bezplatný model dosiahne limit, OliveCode môže pokračovať s ďalším dostupným. S viacerými pripojenými poskytovateľmi a lokálnymi modelmi sa chcem dostať k používaniu, ktoré bude v praxi takmer neobmedzené. Dostupnosť cloudových modelov a ich limity však stále závisia od poskytovateľov.</p><p>Zatiaľ nepoznám nástroj, ktorý by v jednom prostredí spájal takúto kombináciu funkcií a zároveň ju ponúkal zadarmo. Práve v tom vidím priestor pre OliveCode: prepojiť dostupné modely, ich spoluprácu a ovládanie počítača tak, aby človek mohol pokračovať v práci bez ďalšieho predplatného.</p><h3>Modely si navzájom kontrolujú prácu</h3><p>Skúšam zapájať viaceré modely do plánovania, riešenia a kontroly tej istej úlohy. Cieľom je, aby sa výsledok preveril aj druhým pohľadom.</p><h3>Kto chce, môže používať lokálne modely</h3><p>Cez OliveCode chcem zjednodušiť stiahnutie a používanie lokálnych modelov. Nevytváram vlastné základné modely; prepájam tie existujúce. Ich rýchlosť závisí od počítača používateľa.</p><h3>Vie aj klikať, písať a otvárať aplikácie</h3><p>Rozvíjam aj ovládanie webov a aplikácií: otváranie okien, pohyb kurzora a písanie. Používateľ vidí, čo sa deje, môže schvaľovať kroky a prácu zastaviť.</p><h3>A úlohu mu môžem poslať z mobilu</h3><p>Ďalšou časťou je zadávanie úloh cez Telegram. Zapnutý a pripojený počítač ich vykoná a výsledok pošle späť. WhatsApp je tiež smer, ktorý ma zaujíma.</p><h3>Kam s tým chcem ísť</h3><p>Chcem OliveCode sprístupniť celosvetovo. Teraz je mojou prioritou dotiahnuť prvé vydanie a získať spätnú väzbu od používateľov.</p><h3>Zadarmo pre používateľa. Ako by to zarábalo?</h3><p>Chcem, aby táto kombinácia dostupných modelov, ich spolupráce a ovládania počítača zostala pre používateľa zadarmo. Príjem by som chcel získavať z reklám v aplikácii, nie z predplatného či predaja AI kreditov. Tento obchodný model ešte potrebujem overiť.</p><button class="primary" data-preview="olivecode">Pozrieť prototyp ↗</button><p class="note">Dočasná prezentačná stránka projektu.</p></article>`,
  stelko: `<article class="modal-body"><p class="eyebrow">Druhý projekt · Prvý prototyp</p><h2 id="dialog-title">STeLko</h2><p class="modal-lead">Taký Vinted pre 3D tlač. A k tomu výroba na zákazku.</p><p>Veľa ľudí má doma 3D tlačiareň a chuť začať niečo vlastné. Na druhej strane sú ľudia, ktorí potrebujú konkrétny výrobok, ale nemajú tlačiareň ani skúsenosti s modelovaním.</p><img class="cover" src="assets/stelko.jpg" alt="Ukážka katalógu prvého prototypu STLko"><h3>Dve rovnocenné cesty</h3><h3>Výrobky: vyberiem si hotový nápad</h3><p>Tvorcovia ponúknu svoje 3D výtlačky. Zákazník si pozrie výrobok, materiál, kvalitu spracovania a tvorcu, od ktorého chce nakúpiť. Predstavte si princíp podobný Vintedu, zameraný na 3D tlač.</p><h3>Zákazky: potrebujem niečo vlastné</h3><p>Zákazník pridá opis, obrázok alebo model. Tvorcovia ponúknu riešenie, prípadne aj modelovanie a tlač. Zákazník si vyberie podľa kvality, ceny a dodania.</p><h3>Najprv Slovensko a Česko</h3><p>Názov je pracovný a vychádza z prípony 3D súborov <strong>.stl</strong>. Zatiaľ sa projektu venujem popri OliveCode. Viac priestoru mu chcem dať po jeho vydaní.</p><h3>Viem, že to nebude úplne jednoduché</h3><p>Tá predstava vyzerá pekne, ale bude treba vyriešiť aj nekvalitné výtlačky, reklamácie či dôveru medzi ľuďmi. A hlavne zistiť, či by takúto službu naozaj používali. Prototyp ukazuje predstavu; reálne objednávky, platby ani doprava zatiaľ nefungujú.</p><button class="primary" data-preview="stelko">Pozrieť prototyp ↗</button><p class="note">Prvá ukážka rozhrania, ktorú chcem ďalej výrazne meniť.</p></article>`
};

function syncModalState() { document.body.classList.toggle('modal-open', !!document.querySelector('dialog[open]')); }
function showDialog(dialog) { dialog.showModal(); syncModalState(); }
function closeDialog(dialog) { dialog.close(); syncModalState(); }

document.querySelectorAll('[data-modal]').forEach(button => button.addEventListener('click', () => {
  returnFocus = button;
  content.innerHTML = projects[button.dataset.modal];
  showDialog(detailDialog);
  detailDialog.scrollTop = 0;
}));

document.addEventListener('click', event => {
  const preview = event.target.closest('[data-preview]');
  if (preview) {
    document.querySelector('#leave-link').href = `projekty/${preview.dataset.preview}/`;
    closeDialog(detailDialog);
    showDialog(leaveDialog);
  }
});

document.querySelector('.cancel-leave').addEventListener('click', () => {
  closeDialog(leaveDialog);
  showDialog(detailDialog);
});
document.querySelector('#leave-link').addEventListener('click', () => closeDialog(leaveDialog));

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => closeDialog(dialog));
  dialog.addEventListener('click', event => {
    const box = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) closeDialog(dialog);
  });
  dialog.addEventListener('close', () => {
    syncModalState();
    if (!document.querySelector('dialog[open]')) returnFocus?.focus({preventScroll:true});
  });
});

const photoCaptions = ['Stretnutia a nové pohľady','Technológie aj mimo obrazovky','Zvedavosť ma dostane na nové miesta','Bratislava z inej perspektívy','Deň mimo školy','Najlepší reset je vonku','Hory, kam sa rád vraciam','O trochu vyššie, o trochu ďalej','Ahojte, som Benji','Nápady začínajú aj rozhovorom','Aj s trochou nadhľadu','Dve kolesá a voľná hlava','Večer mimo kódu','Nápady necestujú bez notebooku','Keď príde nápad v električke','Ešte jeden nápad pred spaním','Pracovné miesto môže byť kdekoľvek','Aj cesta je čas na tvorenie','Rozpracované veci','Na chvíľu spomaliť','Hackathon v The Spote'];
photos = photoCaptions.map((alt, i) => ({id:i, src:`assets/photos/${i}.webp`, alt})).filter(photo => photo.id !== 10);

function renderPhoto() {
  const item = photos[photoIndex];
  const img = document.querySelector('#lightbox-image');
  img.src = item.src; img.alt = item.alt;
  document.querySelector('#photo-caption').textContent = `${photoIndex + 1} / ${photos.length}`;
}
function showPhoto(index) {
  photoIndex = index;
  returnToGallery = detailDialog.open;
  if (detailDialog.open) closeDialog(detailDialog);
  renderPhoto(); showDialog(photoDialog);
}
function showGallery() {
  content.innerHTML = `<div class="gallery-modal"><h2 id="dialog-title">Ďalšie momenty.</h2><p>Fotky z hôr, z ciest aj spoza notebooku.</p><div class="gallery-thumbs">${photos.map((photo,index) => `<button data-gallery-photo="${index}" aria-label="Zväčšiť: ${photo.alt}"><img src="${photo.src}" alt="${photo.alt}" loading="lazy" width="220" height="175"></button>`).join('')}</div></div>`;
  showDialog(detailDialog); detailDialog.scrollTop=0;
}
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {returnFocus=button;showPhoto(photos.findIndex(photo => photo.id === Number(button.dataset.photo)));}));
document.querySelector('[data-gallery]').addEventListener('click', event => {returnFocus=event.currentTarget;showGallery();});
content.addEventListener('click', event => {const button=event.target.closest('[data-gallery-photo]');if(button)showPhoto(Number(button.dataset.galleryPhoto));});
document.querySelector('#previous-photo').addEventListener('click', () => {photoIndex=(photoIndex+photos.length-1)%photos.length;renderPhoto();});
document.querySelector('#next-photo').addEventListener('click', () => {photoIndex=(photoIndex+1)%photos.length;renderPhoto();});
photoDialog.addEventListener('keydown', event => {if(event.key==='ArrowLeft')document.querySelector('#previous-photo').click();if(event.key==='ArrowRight')document.querySelector('#next-photo').click();});
photoDialog.addEventListener('close', () => {if(returnToGallery){returnToGallery=false;showGallery();}});

addEventListener('pageshow', () => {document.querySelectorAll('dialog[open]').forEach(closeDialog);syncModalState();});
