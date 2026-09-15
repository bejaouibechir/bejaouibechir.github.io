// Stub DOM minimal : suffisant pour executer les scripts des pages /dsl et lire leur sortie.
function El(id){
  return {id:id,_h:{},value:"",checked:false,hidden:false,textContent:"",innerHTML:"",style:{},dataset:{},
    classList:{_s:new Set(),add(c){this._s.add(c)},remove(c){this._s.delete(c)},
      contains(c){return this._s.has(c)},toggle(c,f){f===undefined?(this._s.has(c)?this._s.delete(c):this._s.add(c)):(f?this._s.add(c):this._s.delete(c));return this._s.has(c)}},
    get className(){return [...this.classList._s].join(" ")}, set className(v){this.classList._s=new Set(v.split(/\s+/).filter(Boolean))},
    setAttribute(){},getAttribute(){return null},focus(){},disabled:false,
    getBoundingClientRect(){return {top:0,bottom:0,left:0,right:0,height:0,width:0}},scrollTop:0,offsetHeight:0,
    addEventListener(t,f){(this._h[t]=this._h[t]||[]).push(f)},
    fire(t){(this._h[t]||[]).forEach(f=>f.call(this,{type:t,preventDefault(){},target:this}))},
    dispatchEvent(e){this.fire(e && e.type ? e.type : String(e))},
    removeAttribute(){},
    querySelector(){return El(id+":child")},querySelectorAll(){return []},
    parentElement:null};
}
const store={};
global.document={
  getElementById(id){return store[id]||(store[id]=El(id))},
  querySelector(){return El("q")},
  querySelectorAll(){return []},
  addEventListener(){},
  documentElement:{getAttribute(){return null},setAttribute(){}}
};
global.window=global; global.store=store;
module.exports={store,El};
