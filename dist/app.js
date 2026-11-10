const categories = {heritage:'Tradition & heritage',romantic:'Romantic & contemporary',reception:'Sangeet & reception',personal:'Pre-wedding & personal'};
const tones = {heritage:['#8b8067','#92715e','#7a7968','#a08a64'],romantic:['#b39c94','#a7a795','#a38a87','#a79782'],reception:['#7c7376','#804d53','#73715e'],personal:['#b1865f','#ae7c58','#9d9478','#827283']};
const grid = document.querySelector('#project-grid');
const dialog = document.querySelector('#project-dialog');
const more = document.querySelector('#load-more');
let projects = [], currentFilter = 'all', expanded = false, lastTrigger;
function closeProject(){dialog.close();document.body.classList.remove('modal-open');lastTrigger?.focus();}
function openProject(project,index,trigger){
  lastTrigger=trigger;
  document.querySelector('#project-title').textContent=project.title;
  document.querySelector('#project-category').textContent=categories[project.category];
  document.querySelector('#project-description').textContent=project.description;
  document.querySelector('.dialog-art').style.setProperty('--tone',tones[project.category][index%tones[project.category].length]);
  dialog.showModal();document.body.classList.add('modal-open');
}
function renderProjects(){
  const filtered=projects.filter(p=>currentFilter==='all'||p.category===currentFilter);
  const visible=expanded?filtered:filtered.slice(0,6);
  grid.replaceChildren();
  visible.forEach((project,index)=>{
    const article=document.createElement('article');article.className='project-card';
    const button=document.createElement('button');button.type='button';button.className='project-button';button.setAttribute('aria-label',`View ${project.title}`);
    const art=document.createElement('div');art.className='project-art placeholder';art.style.setProperty('--tone',tones[project.category][index%tones[project.category].length]);
    const arch=document.createElement('div');arch.className='mini-arch';arch.setAttribute('aria-hidden','true');
    const label=document.createElement('span');label.className='media-label';label.textContent='PHOTOGRAPH TO FOLLOW';
    const number=document.createElement('span');number.className='project-index';number.textContent=String(projects.indexOf(project)+1).padStart(2,'0');
    art.append(arch,label,number);
    const meta=document.createElement('div');meta.className='project-meta';const title=document.createElement('h3');title.textContent=project.title;const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');meta.append(title,arrow);
    const category=document.createElement('small');category.textContent=categories[project.category];button.append(art,meta,category);button.addEventListener('click',()=>openProject(project,index,button));article.append(button);grid.append(article);
  });
  more.hidden=expanded||filtered.length<=6;
  more.firstChild.textContent=`Explore all ${filtered.length} celebrations `;
  document.querySelector('#results').textContent=`Showing ${visible.length} of ${filtered.length} celebrations`;
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  currentFilter=button.dataset.filter;expanded=false;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));renderProjects();
}));
more.addEventListener('click',()=>{expanded=true;renderProjects();grid.children[6]?.querySelector('button')?.focus();});
document.querySelector('.dialog-close').addEventListener('click',closeProject);
dialog.addEventListener('cancel',event=>{event.preventDefault();closeProject();});
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeProject();}});
document.querySelector('#project-enquire').addEventListener('click',closeProject);
const menu=document.querySelector('.menu-toggle');const navigation=document.querySelector('#navigation');
function closeMenu(){navigation.classList.remove('open');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);});
navigation.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
document.querySelector('#enquiry').addEventListener('submit',event=>{
  event.preventDefault();const data=new FormData(event.currentTarget);
  const message=['Hello Two Fold Destiny,',`My name is ${data.get('name').trim()}.`,`Email: ${data.get('email').trim()}`,`Celebration: ${data.get('type')}`,data.get('date')?`Date: ${data.get('date')}`:'',data.get('location').trim()?`Location: ${data.get('location').trim()}`:'',data.get('vision').trim()?`Our vision: ${data.get('vision').trim()}`:''].filter(Boolean).join('\n');
  const url=`https://wa.me/918179578884?text=${encodeURIComponent(message)}`;
  const status=document.querySelector('#form-status');status.replaceChildren();const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Continue to WhatsApp ↗';link.style.textDecoration='underline';status.append(link);window.open(url,'_blank','noopener,noreferrer');
});
document.querySelector('#year').textContent=new Date().getFullYear();
fetch('projects.json').then(response=>{if(!response.ok)throw new Error('Portfolio unavailable');return response.json();}).then(data=>{projects=data;renderProjects();}).catch(()=>{grid.textContent='Our portfolio is temporarily unavailable. Please contact us to explore our celebrations.';more.hidden=true;});
