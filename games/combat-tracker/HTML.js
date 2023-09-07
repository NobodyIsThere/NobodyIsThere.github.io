class HTML{static IDFromDisplayName(t){return t=(t=t.trim().toLowerCase()).replaceAll(/\s+(\w)/g,((t,e)=>e.toUpperCase()))}static e(t){return document.getElementById(t)}static addClass(t,e){-1===t.className.indexOf(e)&&(t.className=`${t.className} ${e}`)}static removeClass(t,e){const s=t.className.indexOf(e);-1!==s&&(t.className,t.className=`${t.className.substring(0,s)}${t.className.substring(s+e.length)}`)}static button(t,e,s,n){const i=document.createElement("button");return i.type="button",i.id=e,i.innerHTML=s,i.onclick=n,t.appendChild(i),i}static div(t,e){const s=document.createElement("div");return s.className=e,t.appendChild(s),s}static element(t,e){const s=document.createElement(e);return t.appendChild(s),s}static header(t,e,s){const n=document.createElement("h"+e);return n.innerHTML=s,t.appendChild(n),n}static label(t,e,s){const n=document.createElement("label");return n.htmlFor=e,n.innerHTML=s,t.appendChild(n),n}static input(t,e){const s=this.element(t,"input");return s.name=e,s.id=e,s.setAttribute("placeholder",""),s}static checkBox(t,e,s){const n=this.input(t,e);return n.type="checkbox",this.label(t,e,s),n}static textField(t,e,s){this.label(t,e,s);const n=this.input(t,e);return n.type="text",t.appendChild(n),n}static colour(t,e,s){const n=this.input(t,e);return n.type="color",t.appendChild(n),this.label(t,e,s),n}static textArea(t,e,s){this.label(t,e,s);const n=this.element(t,"textarea");return n.id=e,n}static file(t,e,s,n=!1){const i=this.div(t,"buttons");this.label(i,e,s);const a=this.input(t,e);return a.type="file",n&&a.setAttribute("multiple",""),i.appendChild(a),a}static table(t,e){const s=this.element(t,"table"),n=this.element(s,"thead"),i=this.element(n,"tr");return e.forEach((t=>{this.element(i,"th").innerText=t})),s}static modalWindow(t,e){let s=this.e(t);if(null===s){s=this.element(document.body,"dialog"),s.id=t,s.addEventListener("click",(t=>{t.target===s&&s.close()}));const e=this.div(s,"windowInner"),n=this.element(s,"form");n.setAttribute("method","dialog");const i=this.button(n,"closeButton","Close",(()=>{}));return i.value="default",i.type="",s.showModal(),e}return s.showModal(),document.querySelector(`#${t} .windowInner`)}static closeWindow(t){let e=this.e(t);null!==e&&e.close()}static toast(t){let e=this.e("toasts");null===e&&(e=this.div(document.body,"toastContainer"),e.id="toasts");const s=this.div(e,"toast");s.innerHTML=t,s.addEventListener("animationend",this.removeToast,!1)}static removeToast(){HTML.e("toasts").removeChild(this)}}export default HTML;