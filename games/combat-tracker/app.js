import HTML from"./HTML.js";import InputDropDown from"./InputDropDown.js";class Strings{static ToID(t){return t.replaceAll(/\s/g,"")}}class Editable{static Text(t,e,i){const a=HTML.element(t,"input");return a.type="text",a.value=e,a.setAttribute("size",Editable.LengthOf(e)),a.onchange=()=>{i(a.value),a.blur()},a.oninput=()=>{a.setAttribute("size",Editable.LengthOf(a.value))},a.addEventListener("focus",(()=>a.select())),a}static Textarea(t,e,i){const a=HTML.element(t,"textarea");return a.value=e,a.onchange=()=>{i(a.value)},a}static RollRegex(){return/^((\d+)?d(\d+)?)?(\s*[+-]\s*\d+)?$/i}static GlobalRollRegex(){return/\b((\d+)?d(\d+)?)(\s*[+-]\s*\d+)?\b/gi}static Roll(t,e,i){let a=0,s="";for(let i=0;i<e;++i){let e=Math.floor(Math.random()*t)+1;a+=e,s+=`<div class="die d${t}">${e}</div>`}return a+=Number(i.replaceAll(" ","")),HTML.toast(`${s}${i} = <span class="total">${a}</span>`),a}static PreferNumbers(t,e){const i=Editable.RollRegex(),a=t.match(i);if(null!==a){let t=void 0!==a[3]?Number(a[3]):e,i=void 0!==a[2]?Number(a[2]):1,s=void 0!==a[4]?a[4]:"";return Editable.Roll(t,i,s)}return isNaN(Number(t))?t:Number(t)}static AdjustValue(t,e,i){if(e.startsWith("+")||e.startsWith("-")){let a=e.startsWith("+")?1:-1,s=Editable.PreferNumbers(e.substring(1),i);return isNaN(Number(s))?t+s:t+a*s}return Editable.PreferNumbers(e,i)}static ImportValue(t,e){return t.toString().startsWith("{")&&t.toString().endsWith("}")?Editable.PreferNumbers(t.substring(1,t.length-1),e):t}static LengthOf(t){return"null"!==String(t)&&""!==String(t)?String(t).length:1}}class DataProvider{static getLocalData(t,e){let i=localStorage.getItem(t);return null!==i?JSON.parse(i):e}static NewEncounter(){return{name:"Encounter",participants:[],fields:[],round:0}}static NewField(t){return{name:t,color:"#eeffee",icon:"#circle",label:!0,boolean:!1}}constructor(){this.encounters=DataProvider.getLocalData("encounters",[DataProvider.NewEncounter()]),this.activeEncounterId=DataProvider.getLocalData("activeEncounterId",0),this.fields=DataProvider.getLocalData("fields",{HP:{name:"HP",color:"#ff8080",icon:"#heart",label:!1,boolean:!1},AC:{name:"AC",color:"#c0c0c0",icon:"#shield",label:!1,boolean:!1}}),this.statusEffects=DataProvider.getLocalData("statusEffects",["Blinded","Charmed","Concentrating","Deafened","Dodging","Frightened","Incapacitated","Grappled","Prone","Shielding","Slowed","Stunned"]),this.fieldIcons=["#circle","#square","#heart","#shield","#square_checkbox","#circle_checkbox"],this.encounter=this.encounters[this.activeEncounterId],this.settings=DataProvider.getLocalData("settings",{showNotes:!1,favouriteDie:20,immediateInitiativeUpdates:!0,sortAscending:!1,darkMode:!1})}async save(){localStorage.setItem("encounters",JSON.stringify(this.encounters)),localStorage.setItem("activeEncounterId",this.activeEncounterId),localStorage.setItem("fields",JSON.stringify(this.fields)),localStorage.setItem("statusEffects",JSON.stringify(this.statusEffects)),localStorage.setItem("settings",JSON.stringify(this.settings))}setDarkMode(t){this.settings.darkMode=t,this.save(),t?(this.setColour("--background-color","#000"),this.setColour("--font-color","#ddd"),this.setColour("--accent-color","#445"),this.setColour("--accent-color-dark","#ddd"),this.setColour("--button-dark","#223"),this.setColour("--negative-color","#844"),this.setColour("--negative-color-dark","#533"),this.setColour("--positive-color","#353"),this.setColour("--positive-color-dark","#232"),this.setColour("--taken-turn-color","#888"),this.setColour("--link-color","#99d")):(this.setColour("--background-color","#fff"),this.setColour("--font-color","#222"),this.setColour("--accent-color","#dde"),this.setColour("--accent-color-dark","#000"),this.setColour("--button-dark","#88a"),this.setColour("--negative-color","#fdd"),this.setColour("--negative-color-dark","#d88"),this.setColour("--positive-color","#ded"),this.setColour("--positive-color-dark","#8a8"),this.setColour("--taken-turn-color","#aaa"),this.setColour("--link-color","#55a"))}setColour(t,e){document.documentElement.style.setProperty(t,e)}export(){let t=JSON.stringify({encounters:this.encounters,fields:this.fields,statusEffects:this.statusEffects});const e=document.createElement("a");e.setAttribute("href","data:text/plain;charset:utf-8,"+encodeURIComponent(t)),e.setAttribute("download","NCombatTrackerData.txt"),e.style="display: none",document.body.appendChild(e),e.click(),document.body.removeChild(e)}import(t){const e=new FileReader;e.onload=()=>{const t=JSON.parse(e.result);t&&t.hasOwnProperty("encounters")&&t.hasOwnProperty("statusEffects")&&t.hasOwnProperty("fields")||alert("Reading file failed."),this.encounters=this.encounters.concat(t.encounters),this.statusEffects=this.statusEffects.concat(t.statusEffects),Object.keys(t).forEach((e=>{this.fields[e]=t.fields[e]}))},e.readAsText(t.files[0])}clearAll(){localStorage.removeItem("encounters"),localStorage.removeItem("activeEncounterId"),localStorage.removeItem("fields"),localStorage.removeItem("statusEffects"),localStorage.removeItem("settings"),location.reload()}importParticipant(t){let e=Editable.ImportValue(t.initiative,this.settings.favouriteDie);return t.name=this.nextAvailableName(t.name),t.initiative=e,t.newInitiative=e,Object.keys(t.fields).forEach((e=>{let i=t.fields[e];if(i.value.toString().startsWith("{")&&i.value.toString().endsWith("}")){let t=Editable.ImportValue(i.value,this.settings.favouriteDie);i.value=t,i.max=t}})),this.encounter.participants.push(t),t}nextAvailableName(t){if(this.encounter.participants.some((e=>e.name===t))){const e=new RegExp(`${t} (\\d+)`),i=this.encounter.participants.filter((t=>null!==t.name.match(e)));let a=2;return i.forEach((t=>{const i=t.name.match(e);Number(i[1])>=a&&(a=Number(i[1])+1)})),`${t} ${a}`}return t}}class TextAreaWidget{constructor(t,e,i,a){this.parent=t,this.value=e,this.callback=a,this.textarea=HTML.element(t,"textarea"),this.textarea.placeholder=i,this.div=HTML.div(t,"hidden"),this.div.onclick=()=>{this.switchToEdit()},this.textarea.value=e,this.update(),this.textarea.onchange=()=>{this.update(),a(this.textarea.value)},this.textarea.onblur=()=>{this.update()}}update(){if(this.textarea.value){this.value=this.textarea.value,this.textarea.className="hidden",this.div.className="";let t=this.value.replaceAll(Editable.GlobalRollRegex(),((t,e,i,a,s)=>this.rollHTML(i,a,s,t)));this.div.innerHTML=t.replaceAll("\n","<br/>"),document.querySelectorAll("span.roll").forEach((t=>{t.onclick=e=>{e.stopImmediatePropagation();let i=Number(t.getAttribute("_numberofdice"));isNaN(i)&&(i=1);let a=Number(t.getAttribute("_type"));if(isNaN(a))return;let s=t.getAttribute("_modifier").replaceAll(" ","");isNaN(s)&&(s=""),Editable.Roll(a,i,s)}}))}else this.textarea.className="",this.div.className="hidden"}rollHTML(t,e,i,a){return void 0===t&&void 0===e?a:`<span class="roll" _numberOfDice="${t}" _type="${e}" _modifier="${i}">${a}</span>`}switchToEdit(){this.div.className="hidden",this.textarea.className="",this.textarea.focus()}}class FieldIconPickerWidget{constructor(t,e,i,a){this.element=HTML.div(t,"fieldIconPickerWidget"),this.fieldId=e,this.dataProvider=i,this.field=this.dataProvider.fields[this.fieldId],this.callback=a,this.expanded=!1,this.render()}render(){if(this.element.replaceChildren(),this.expanded)for(let t=0;t<this.dataProvider.fieldIcons.length;++t){let e=HTML.div(this.element,"image");e.innerHTML=`<svg class="svg" version="2.0"><use href="${this.dataProvider.fieldIcons[t]}"/></svg>`,e.setAttribute("_iconIndex",t),e.onclick=t=>this.choose(t),e.style=`background-color: ${this.field.color}`}else{let t=HTML.div(this.element,"image");t.innerHTML=`<svg class="svg" version="2.0"><use href="${this.field.icon}"/></svg>`,t.onclick=()=>{this.expanded=!0,this.render()},t.style=`background-color: ${this.field.color}`}}choose(t){let e=Number(t.currentTarget.getAttribute("_iconIndex"));this.dataProvider.fields[this.fieldId].icon=this.dataProvider.fieldIcons[e],this.dataProvider.save(),this.expanded=!1,this.render(),this.callback()}}class FieldEditorWidget{constructor(t,e,i,a){this.parent=HTML.div(t,"fieldEditorWidget"),this.fieldId=e,this.field=i.fields[e],this.dataProvider=i,this.callback=a,this.render()}render(){const t=HTML.element(this.parent,"input");t.type="checkbox",t.checked=-1!==this.dataProvider.encounter.fields.indexOf(this.fieldId),t.id=`inEncounter${this.fieldId}`,t.className="inEncounter",t.onchange=()=>{t.checked?this.dataProvider.encounter.fields=this.dataProvider.encounter.fields.concat(this.fieldId):this.dataProvider.encounter.fields.splice(this.dataProvider.encounter.fields.indexOf(this.fieldId),1),this.dataProvider.save(),this.callback()};const e=HTML.div(this.parent,"group");Editable.Text(e,this.field.name,(t=>{this.field.name=t,this.dataProvider.save(),this.callback()}));const i=HTML.checkBox(e,`showLabel${this.fieldId}`,"Label");i.checked=this.field.label,i.onchange=()=>{this.dataProvider.fields[this.fieldId].label=!!i.checked,this.dataProvider.save(),this.callback()},i.className="button";const a=HTML.checkBox(e,`boolean${this.fieldId}`,"Check box");a.checked=this.field.boolean,a.onchange=()=>{this.dataProvider.fields[this.fieldId].boolean=!!a.checked,this.dataProvider.save(),this.callback()},a.className="button";const s=HTML.div(this.parent,"group");new FieldIconPickerWidget(s,this.fieldId,this.dataProvider,this.callback);const r=HTML.colour(s,`colour${this.fieldId}`,"Colour");r.value=this.field.color,r.onchange=()=>{this.dataProvider.fields[this.fieldId].color=r.value,this.dataProvider.save(),this.callback()},HTML.button(this.parent,null,"✖",(()=>this.delete())).className="negative"}delete(){-1!==this.dataProvider.encounter.fields.indexOf(this.fieldId)&&this.dataProvider.encounter.fields.splice(this.dataProvider.encounter.fields.indexOf(this.fieldId),1),delete this.dataProvider.fields[this.fieldId],this.dataProvider.save(),this.callback()}}class FieldsEditor{constructor(t,e){this.dataProvider=t,this.callback=e,this.element=HTML.modalWindow("fieldEditor","Edit values"),this.render()}render(){this.element.replaceChildren();let t=Object.keys(this.dataProvider.fields);for(let e=0;e<t.length;++e)new FieldEditorWidget(this.element,t[e],this.dataProvider,(()=>{this.render(),this.callback()}));Editable.Text(this.element,"",(t=>{this.dataProvider.fields[t]=DataProvider.NewField(t),this.dataProvider.save(),this.callback(),this.render()})).setAttribute("placeholder","New value")}}class SettingsWindow{constructor(t,e){this.dataProvider=t,this.callback=e,this.element=HTML.modalWindow("settingsWindow","Settings"),this.render()}render(){this.element.replaceChildren(),HTML.div(this.element,"description").innerHTML='Visit my blog for <a href="https://nobodyisthere.github.io/blog/ns-combat-tracker-help.html" target="_blank">help</a>. If you like this tool, consider donating on <a href="https://nobodyisthere.itch.io/combat-tracker">itch.io</a>.',HTML.div(this.element,"help").innerHTML="This die will be used when you specify only a modifier in the die roller and other places. For example, if this is set to 20 and you type +3 in the die roller, it will roll 1d20+3.";const t=HTML.textField(this.element,"favouriteDie","Favourite die: d");t.value=this.dataProvider.settings.favouriteDie,t.onchange=()=>{isNaN(Number(t.value.trim()))||(this.dataProvider.settings.favouriteDie=Number(t.value.trim()),this.dataProvider.save())},t.setAttribute("size",3),HTML.div(this.element,"help").innerHTML="Enable/disable to reverse the participant list.";const e=HTML.checkBox(this.element,"sortAscending","Sort participants ascending (lower scores first)");e.checked=this.dataProvider.settings.sortAscending,e.onchange=()=>{this.dataProvider.settings.sortAscending=!!e.checked,this.dataProvider.save(),this.callback()},HTML.div(this.element,"help").innerHTML="If disabled, participants' initiative scores will change the round <em>after</em> they are set.";const i=HTML.checkBox(this.element,"immediateUpdate","Initiative updates immediately");i.checked=this.dataProvider.settings.immediateInitiativeUpdates,i.onchange=()=>{this.dataProvider.settings.immediateInitiativeUpdates=!!i.checked,this.dataProvider.save()},HTML.div(this.element,"help").innerHTML="Switch to a darker colour scheme.";const a=HTML.checkBox(this.element,"darkMode","Dark mode");a.checked=this.dataProvider.settings.darkMode,a.onchange=()=>{this.dataProvider.setDarkMode(!!a.checked)},HTML.div(this.element,"help").innerHTML="If you're moving between devices, you can import or export your encounters, fields and status effects here. Importing a file will <em>add</em> that file's encounters, fields and status effects to your local data, preserving what you already have on this device. If you don't want to do that, clear your local data first using the button below.",HTML.button(this.element,"export","Export",(()=>this.dataProvider.export()));const s=HTML.element(this.element,"input");s.setAttribute("type","file"),s.id="import",s.className="button",HTML.label(this.element,"import").innerText="Import",s.onchange=()=>this.dataProvider.import(s),HTML.div(this.element,"help").innerText="This button will immediately clear your data from this device. Use with caution.",HTML.button(this.element,"deleteAll","Clear all data",(()=>this.dataProvider.clearAll())).className="negative"}}class EncounterManagerWidget{constructor(t,e,i,a,s){this.parent=t,this.dataProvider=i,this.encounterIndex=e,this.callback=a,this.closeWindow=s,this.div=HTML.div(this.parent,"encounterWidget"),this.dataProvider.activeEncounterId===this.encounterIndex&&(this.div.className="encounterWidget active");let r=this.dataProvider.encounters[this.encounterIndex];r.name.startsWith("+")&&(this.div.className+=" preset"),HTML.div(this.div,"encounterName").innerText=r.name.startsWith("+")?r.name.substring(1):r.name,HTML.button(this.div,null,"Add to encounter",(t=>this.importParticipants(t))),HTML.button(this.div,null,"✖",(t=>this.delete(t))).className="negative",this.div.onclick=()=>this.load()}load(){this.dataProvider.activeEncounterId=this.encounterIndex,this.dataProvider.encounter=this.dataProvider.encounters[this.dataProvider.activeEncounterId],this.dataProvider.save(),this.callback(),this.closeWindow()}importParticipants(t){t.stopImmediatePropagation();JSON.parse(JSON.stringify(this.dataProvider.encounters[this.encounterIndex].participants)).forEach((t=>{this.dataProvider.importParticipant(t)})),this.dataProvider.save(),this.callback()}delete(t){t.stopImmediatePropagation(),this.dataProvider.encounters.splice(this.encounterIndex,1),0===this.dataProvider.encounters.length&&(this.dataProvider.encounters=[DataProvider.NewEncounter()]),this.dataProvider.activeEncounterId>=this.dataProvider.encounters.length&&(this.dataProvider.activeEncounterId=this.dataProvider.encounters.length-1),this.dataProvider.encounter=this.dataProvider.encounters[this.dataProvider.activeEncounterId],this.dataProvider.save(),this.callback()}}class EncounterManager{constructor(t,e){this.dataProvider=t,this.callback=e,this.element=HTML.modalWindow("encounterEditor","Manage encounters"),this.widgetList=[],this.render()}render(){this.element.replaceChildren(),this.searchField=HTML.textField(this.element,"encounterSearch","Search"),this.searchField.placeholder="Search",this.searchField.oninput=()=>this.update(),this.dataProvider.encounters.sort(((t,e)=>this.encounterSortFunction(t,e))),this.dataProvider.activeEncounterId=this.dataProvider.encounters.indexOf(this.dataProvider.encounter);for(let t=0;t<this.dataProvider.encounters.length;++t)this.widgetList.push({searchName:this.dataProvider.encounters[t].name.toLowerCase(),widget:new EncounterManagerWidget(this.element,t,this.dataProvider,(()=>{this.render(),this.callback()}),(()=>HTML.closeWindow(this.element.parentElement.id)))})}async update(){const t=this.searchField.value.trim().toLowerCase();this.widgetList.forEach((e=>{-1===e.searchName.indexOf(t)?HTML.addClass(e.widget.div,"hidden"):HTML.removeClass(e.widget.div,"hidden")}))}encounterSortFunction(t,e){return t.name.startsWith("+")&&!e.name.startsWith("+")?1:e.name.startsWith("+")&&!t.name.startsWith("+")?-1:t.name.localeCompare(e.name)}}class InitiativeWidget{constructor(t,e,i,a){this.parent=t,this.participant=e,this.dataProvider=i,this.refreshCallback=a,this.render()}async render(){this.parent.replaceChildren(),this.participant.initiative===this.participant.newInitiative||-1===this.participant.newInitiative?Editable.Text(this.parent,this.participant.initiative,(t=>{-1===this.participant.newInitiative||this.dataProvider.settings.immediateInitiativeUpdates?(this.participant.initiative=Editable.PreferNumbers(t,this.dataProvider.settings.favouriteDie),this.participant.newInitiative=this.participant.initiative):this.participant.newInitiative=Editable.PreferNumbers(t,this.dataProvider.settings.favouriteDie),this.dataProvider.save(),this.refreshCallback()})):(Editable.Text(this.parent,this.participant.initiative,(t=>{this.participant.initiative=Editable.PreferNumbers(t,this.dataProvider.settings.favouriteDie),this.dataProvider.save(),this.refreshCallback()})),HTML.div(this.parent,"rightArrow").innerHTML='<svg version="2.0"><use href="#triangle"/></svg>',Editable.Text(this.parent,this.participant.newInitiative,(t=>{this.participant.newInitiative=Editable.PreferNumbers(t,this.dataProvider.settings.favouriteDie),this.dataProvider.save(),this.render()})))}}class FieldWidget{constructor(t,e,i,a){this.parent=t,this.fieldId=e,this.participant=i,this.dataProvider=a,this.field=this.dataProvider.fields[this.fieldId],this.element=HTML.div(this.parent),this.render(),this.update()}async render(){this.fill=HTML.div(this.element,"fill"),this.image=HTML.div(this.element,"image"),this.image.innerHTML=`<svg class="svg" version="2.0"><use href="${this.field.icon}"/></svg>`,this.fieldName=HTML.label(this.element,`${Strings.ToID(this.field.name)}${this.participant.id}`,this.field.name),this.fieldName.className="fieldName",this.editable=Editable.Text(this.element,this.participant.fields.hasOwnProperty(this.fieldId)?this.participant.fields[this.fieldId].value:"",(t=>{if(this.participant.fields.hasOwnProperty(this.fieldId)||(this.participant.fields[this.fieldId]={value:0,max:null}),""===t)delete this.participant.fields[this.fieldId];else{const e=/^\s*([\d|d|+|-]+)\s*\/\s*([\d|d|+|-]*)\s*$/,i=t.match(e);i?(this.participant.fields[this.fieldId].value=Editable.PreferNumbers(i[1],this.dataProvider.settings.favouriteDie),""===i[2]?this.participant.fields[this.fieldId].max=this.participant.fields[this.fieldId].value:this.participant.fields[this.fieldId].max=Editable.PreferNumbers(i[2],this.dataProvider.settings.favouriteDie)):this.participant.fields[this.fieldId].value=Editable.AdjustValue(this.participant.fields[this.fieldId].value,t,this.dataProvider.settings.favouriteDie)}this.dataProvider.save(),this.update()})),this.editable.id=`${Strings.ToID(this.field.name)}${this.participant.id}`,this.field.boolean&&(this.editable.style="display: none",this.image.onclick=()=>this.toggle(),this.fieldName.onclick=()=>this.toggle())}toggle(){this.participant.fields.hasOwnProperty(this.fieldId)?delete this.participant.fields[this.fieldId]:this.participant.fields[this.fieldId]={value:1,max:1},this.dataProvider.save(),this.update()}update(){if(this.participant.fields.hasOwnProperty(this.fieldId))if(this.editable.value=this.participant.fields[this.fieldId].value,this.element.className="field",null!==this.participant.fields[this.fieldId].max){let t=100*(1-this.participant.fields[this.fieldId].value/this.participant.fields[this.fieldId].max);t=Math.max(t,0),t=Math.min(t,100),this.fill.style=`height: calc(100% - ${t}% - 2px); background-color: ${this.field.color}`}else this.fill.style=`height: calc(100% - 2px); background-color: ${this.field.color}`;else this.fill.style=`top: 100%; background-color: ${this.field.color}`,this.element.className="empty field";this.fieldName.innerText=this.field.name,this.field.label?this.fieldName.className="fieldName":this.fieldName.className="fieldName hidden"}}class ValuesWidget{constructor(t,e,i){this.parent=t,this.participant=e,this.dataProvider=i,this.render()}async render(){this.parent.replaceChildren(),this.dataProvider.encounter.fields.forEach((t=>{new FieldWidget(this.parent,t,this.participant,this.dataProvider)}))}}class TagWindow{constructor(t,e,i,a){this.tag=t,this.participant=e,this.dataProvider=i,this.callback=a,this.w=HTML.modalWindow("editTag","Edit tag"),this.render()}render(){this.w.replaceChildren(),this.header=HTML.header(this.w,2,""),this.update();const t=HTML.div(this.w,"flexRow");HTML.button(t,null,"−",(()=>{this.tag.counter--,this.dataProvider.save(),this.update(),this.callback(!1)})),HTML.button(t,null,"Remove",(()=>{this.participant.tags.splice(this.participant.tags.indexOf(this.tag),1),this.dataProvider.save(),HTML.closeWindow("editTag"),this.callback(!0)})).className="negative",HTML.button(t,null,"+",(()=>{this.tag.counter++,this.dataProvider.save(),this.update(),this.callback(!1)}))}update(){this.header.innerText=`${this.tag.name} (${this.tag.counter})`}}class TagWidget{constructor(t,e,i,a){this.parent=t,this.tag=e,this.participant=i,this.dataProvider=a,this.render()}render(){this.div=HTML.div(this.parent,"tag"),this.div.innerText=this.tagText(),this.div.onclick=()=>{new TagWindow(this.tag,this.participant,this.dataProvider,(t=>this.update(t)))}}tagText(){return`${this.tag.name} (${this.tag.counter})`}update(t){t?this.parent.removeChild(this.div):this.div.innerText=this.tagText()}delete(){this.participant.tags.splice(this.participant.tags.indexOf(this.tag),1),this.dataProvider.save(),this.parent.removeChild(this.div)}}class ManageStatusEffectWidget{constructor(t,e,i,a){this.parent=t,this.statusEffect=e,this.dataProvider=i,this.callback=a,this.d=HTML.div(this.parent,"manageStatusEffect");HTML.div(this.d,"statusEffect").innerText=this.statusEffect,this.d.onclick=()=>{this.callback(this.statusEffect)},HTML.button(this.d,null,"✖",(t=>{t.stopImmediatePropagation(),this.dataProvider.statusEffects.splice(this.dataProvider.statusEffects.indexOf(this.statusEffect),1),this.dataProvider.save(),this.parent.removeChild(this.d)})).className="negative"}}class StatusWidget{constructor(t,e,i){this.parent=t,this.participant=e,this.dataProvider=i,this.render()}render(){this.parent.replaceChildren(),this.participant.tags.forEach((t=>{new TagWidget(this.parent,t,this.participant,this.dataProvider)}));const t=HTML.div(this.parent,"addStatusContainer"),e=Editable.Text(t,"",(t=>this.addTag(t)));e.setAttribute("placeholder","+"),e.setAttribute("size",8),e.className="addTag",this.dropdown=HTML.div(t,"dropdown"),this.dataProvider.statusEffects.forEach((t=>{new ManageStatusEffectWidget(this.dropdown,t,this.dataProvider,(t=>this.addTag(t)))}))}addTag(t){this.participant.tags=this.participant.tags.concat({name:t,counter:0}),-1===this.dataProvider.statusEffects.indexOf(t)&&(this.dataProvider.statusEffects=this.dataProvider.statusEffects.concat(t),this.dataProvider.statusEffects.sort(((t,e)=>t.localeCompare(e)))),this.dataProvider.save(),this.render()}}class Participant{constructor(t,e,i,a){this.parent=t,this.row=HTML.element(t,"tr"),this.data=e,this.dataProvider=i,this.refreshCallback=a,this.render()}async render(){this.row.replaceChildren();const t=HTML.element(this.row,"td");t.className="buttons";const e=HTML.button(t,null,"",(()=>this.moveUp()));e.className="up",e.innerHTML='<svg version="2.0"><use href="#triangle"/></svg>',HTML.button(t,null,"Remove",(()=>this.delete())).className="negative";const i=HTML.element(this.row,"td");new InitiativeWidget(i,this.data,this.dataProvider,this.refreshCallback);const a=HTML.element(this.row,"td");Editable.Text(a,this.data.name,(t=>{this.data.name=t,this.dataProvider.save()}));const s=HTML.element(this.row,"td");new ValuesWidget(s,this.data,this.dataProvider);const r=HTML.element(this.row,"td");r.className="tags",new StatusWidget(r,this.data,this.dataProvider);const n=HTML.element(this.row,"td");n.className="takenTurnCell";const d=HTML.element(n,"input");d.type="checkbox",d.checked=this.data.takenTurn,this.row.className=this.data.takenTurn?"takenTurn":"",d.onchange=()=>{d.checked?(this.data.takenTurn=!0,this.row.className+=" takenTurn"):(this.data.takenTurn=!1,this.row.className=this.row.className.replaceAll(/\s*takenTurn/g,"")),this.dataProvider.save(),this.row.blur()};const o=HTML.element(this.row,"td");o.className="notes",new TextAreaWidget(o,this.data.notes,"Notes",(t=>{this.data.notes=t,this.dataProvider.save()}))}delete(){this.dataProvider.encounter.participants.splice(this.dataProvider.encounter.participants.indexOf(this.data),1),this.dataProvider.save(),this.refreshCallback()}moveUp(){let t=this.dataProvider.encounter.participants.indexOf(this.data);if(t>0){const e=this.dataProvider.encounter.participants[t-1],i=this.data.initiative;this.data.initiative===e.initiative&&(this.dataProvider.encounter.participants[t-1]=this.data,this.dataProvider.encounter.participants[t]=e),this.data.initiative=e.initiative,this.data.newInitiative=e.initiative,e.initiative=i,e.newInitiative=i,this.dataProvider.save(),this.refreshCallback()}}}class ParticipantEntry{constructor(t,e,i){this.parent=t,this.dataProvider=e,this.callback=i,this.row=HTML.element(t,"tr"),this.row.className="entry",this.render()}async render(){this.row.replaceChildren(),HTML.element(this.row,"td");const t=HTML.element(this.row,"td");this.initiativeText=Editable.Text(t,"",(()=>{})),this.initiativeText.className="hiddenUnlessValueOrFocus";const e=HTML.element(this.row,"td");e.setAttribute("colspan",4),e.className="entry";const i=HTML.element(e,"input");i.type="text",i.addEventListener("keydown",(t=>{if("Enter"===t.key){let t=i.value.trim();const e=t.match(/(.*),\s?([\d|d|+|-]+)/);null!==e&&(t=e[1],this.initiativeText.value=e[2]);let a=1;const s=t.match(/\s*(.*?)\s+x([\d|d|+|-]+)$/i);if(null!==s)if(t=s[1],a=s[2],isNaN(Number(a))){const t=a.match(Editable.RollRegex());a=null!==t?Editable.PreferNumbers(a,this.dataProvider.settings.favouriteDie):1}else a=Number(a);for(let e=0;e<a;++e){let e=""===this.initiativeText.value?0:Editable.PreferNumbers(this.initiativeText.value,this.dataProvider.settings.favouriteDie);const i=this.dataProvider.encounters.find((e=>e.name===`+${t}`));if(i&&i!==this.dataProvider.encounter&&i.participants.length>0){const t=this.dataProvider.importParticipant(JSON.parse(JSON.stringify(i.participants[Math.floor(Math.random()*i.participants.length)])));""!==this.initiativeText.value&&(t.initiative=e,t.newInitiative=e)}else this.dataProvider.encounter.participants.push({name:this.dataProvider.nextAvailableName(t),initiative:e,newInitiative:e,fields:{},tags:[],notes:"",takenTurn:!1});this.callback()}document.querySelector("#newParticipant").select()}})),i.id="newParticipant",i.setAttribute("placeholder","New participant"),i.onkeyup=t=>{if(" "===t.key||","===t.key){const t=i.value.match(/^\s*([\d|d|+|-]+),?\s?(.*)/i);if(null!==t){let e=t[1];this.initiativeText.value=e,i.value=t[2]}}" "!==t.key||""!==i.value&&" "!==i.value||(i.value="")},i.onkeydown=t=>{""!==i.value||"Backspace"!==t.key||t.repeat||this.initiativeText.focus()},this.dropdown=new InputDropDown(e,i,this.dataProvider.encounters.filter((t=>t.name.startsWith("+")&&t!==this.dataProvider.encounter)).map((t=>t.name.substring(1))),(t=>{let e=document.createElement("div");return e.className="item",e.innerText=t,e}))}}class App{constructor(t){this.parent=t,this.dataProvider=new DataProvider,this.dataProvider.setDarkMode(this.dataProvider.settings.darkMode);const e=HTML.div(this.parent,"menu"),i=HTML.button(e,"settings","",(()=>new SettingsWindow(this.dataProvider,(()=>this.update()))));i.className="small",i.innerHTML='<svg version="2.0"><use href="#cog"/></svg><div class="screenReader">Settings</div>';const a=HTML.button(e,"manageEncounters","",(()=>new EncounterManager(this.dataProvider,(()=>this.update()))));a.className="small",a.innerHTML='<svg version="2.0"><use href="#menu"/></svg><div class="screenReader">Encounters</div>';const s=HTML.button(e,"newEncounter","",(()=>this.newEncounter()));s.className="small",s.innerHTML='<svg version="2.0"><use href="#plus"/></svg><div class="screenReader">New</div>';const r=HTML.button(e,"discardEncounter","",(()=>this.discardEncounter()));r.className="small negative",r.innerHTML='<svg version="2.0"><use href="#cross"/></svg><div class="screenReader">Discard encounter</div>';const n=HTML.div(this.parent,"title");this.title=Editable.Text(n,this.dataProvider.encounter.name,(t=>{this.dataProvider.encounter.name=t,this.dataProvider.save()})),this.title.setAttribute("id","title"),this.title.oninput=()=>{this.checkEncounterType()};HTML.button(this.parent,"fieldsButton","Fields",(()=>new FieldsEditor(this.dataProvider,(()=>this.update()))));this.participantsButton=HTML.checkBox(this.parent,"participants","Manage participants"),this.participantsButton.className="button",this.notesButton=HTML.checkBox(this.parent,"notes","Notes"),this.notesButton.className="button",this.notesButton.checked=this.dataProvider.settings.showNotes,this.notesButton.onchange=()=>{this.dataProvider.settings.showNotes=this.notesButton.checked,this.dataProvider.save()},HTML.div(this.parent,"first spacer"),HTML.div(this.parent,"spacer");HTML.button(this.parent,"resetButton","Reset",(()=>this.reset()));HTML.label(this.parent,"round","Round"),this.roundText=Editable.Text(this.parent,this.dataProvider.encounter.round,(t=>{isNaN(Number(t))||(this.dataProvider.encounter.round=Number(t),this.dataProvider.save(),this.update())})),this.roundText.setAttribute("type","number"),this.roundText.id="round",this.renderNextRoundButton();const d=HTML.table(this.parent,["Sort","Name","Values","Status","Notes","",""]);this.tbody=HTML.element(d,"tbody"),this.tbody.addEventListener("focusin",(t=>this.focusChanged(t))),this.tbody.addEventListener("focusout",(t=>this.focusLeft(t))),this.update(),HTML.div(this.parent,"spacer"),this.renderNextRoundButton();const o=HTML.div(t,"diceTray"),l=HTML.textField(o,"roller","Roll");l.onkeydown=t=>{"Enter"===t.key&&(Editable.PreferNumbers(l.value.trim(),this.dataProvider.settings.favouriteDie),l.value="")},l.setAttribute("placeholder","Roll dice")}renderNextRoundButton(){HTML.button(this.parent,"nextRoundButton","Next",(()=>this.nextRound())).innerHTML='Next<svg version="2.0"><use href="#triangle"/></svg>'}checkEncounterType(){this.title.value.startsWith("+")?HTML.addClass(this.parent,"creatureList"):HTML.removeClass(this.parent,"creatureList")}async update(){this.tbody.replaceChildren(),this.participants=[],this.dataProvider.settings.sortAscending?this.dataProvider.encounter.participants.sort(((t,e)=>t.initiative-e.initiative)):this.dataProvider.encounter.participants.sort(((t,e)=>e.initiative-t.initiative));for(var t=0;t<this.dataProvider.encounter.participants.length;++t)this.dataProvider.encounter.participants[t].id=t;this.dataProvider.encounter.participants.forEach((t=>{let e=new Participant(this.tbody,t,this.dataProvider,(()=>this.update()));this.participants=this.participants.concat(e)})),new ParticipantEntry(this.tbody,this.dataProvider,(()=>{this.dataProvider.save(),this.update()})),this.roundText.value=this.dataProvider.encounter.round,this.title.value=this.dataProvider.encounter.name,this.title.setAttribute("size",Editable.LengthOf(this.title.value)),this.dataProvider.encounter.participants.length>0?(this.participantsButton.className="button",this.notesButton.className="button"):(this.participantsButton.className="hidden button",this.participantsButton.checked=!1,this.notesButton.className="hidden button"),this.checkEncounterType()}reset(){let t=!1;0===this.dataProvider.encounter.round&&(t=!0),this.dataProvider.encounter.round=0,this.dataProvider.encounter.participants.forEach((e=>{e.takenTurn=!1,e.tags=[],this.dataProvider.encounter.fields.forEach((t=>{e.fields.hasOwnProperty(t)&&null!==e.fields[t].max&&(e.fields[t].value=e.fields[t].max)})),t&&(e.initiative=0,e.newInitiative=0)})),this.dataProvider.save(),this.participantsButton.checked=!1,this.update()}newEncounter(){const t=JSON.parse(JSON.stringify(this.dataProvider.encounter.fields));this.dataProvider.encounters=this.dataProvider.encounters.concat(DataProvider.NewEncounter()),this.dataProvider.activeEncounterId=this.dataProvider.encounters.length-1,this.dataProvider.encounter=this.dataProvider.encounters[this.dataProvider.activeEncounterId],this.dataProvider.encounter.fields=t,this.dataProvider.save(),this.participantsButton.checked=!1,this.update()}discardEncounter(){const t=JSON.parse(JSON.stringify(this.dataProvider.encounter.fields));this.dataProvider.encounters[this.dataProvider.activeEncounterId]=DataProvider.NewEncounter(),this.dataProvider.encounter=this.dataProvider.encounters[this.dataProvider.activeEncounterId],this.dataProvider.encounter.fields=t,this.dataProvider.save(),this.participantsButton.checked=!1,this.update()}nextRound(){this.dataProvider.encounter.round++,this.dataProvider.encounter.participants.forEach((t=>{t.takenTurn=!1,t.tags.forEach((t=>{t.counter++})),-1===t.newInitiative&&(t.newInitiative=0),t.newInitiative!==t.initiative&&(t.initiative=t.newInitiative)})),this.dataProvider.save(),this.participantsButton.checked=!1,this.update()}focusChanged(t){const e=document.querySelector(".selected");null!==e&&(e.className=e.className.replaceAll(/\s*selected/g,""));for(var i=t.target;"TR"!==i.tagName;){if(null===i.parentElement)return;i=i.parentElement}i.className+=" selected"}focusLeft(t){const e=document.querySelector(".selected");null!==e&&(e.className=e.className.replaceAll(/\s*selected/g,""))}}async function onPageLoaded(){new App(HTML.e("app"))}window.onload=onPageLoaded;