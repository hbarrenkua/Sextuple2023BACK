"use strict";(self.webpackChunkAgilityFrontEnd=self.webpackChunkAgilityFrontEnd||[]).push([[592],{1865:(v,s,r)=>{r.d(s,{n:()=>o});var c=r(4650),a=r(8223);let o=(()=>{class i{constructor(e){this.wsService=e}emitirPerifericosActivos(e){this.wsService.emit("obtener-perifericos",{config_pistas:e})}emitirPerifericoActivo(e,t){e&&this.wsService.emit("obtener-periferico",{uid:e},t)}getPerifericosActivos(){return this.wsService.listen("perifericos-activos")}getPerifericoActivo(){return this.wsService.listen("periferico-activo")}esperaActivacion(){return this.wsService.listen("periferico-activado")}activarPeriferico(e,t,_){console.log(e),this.wsService.emit("activar-periferico",{id:e,crono:t,datos:_})}mensajeCrono(e,t){this.wsService.emit("mensaje-crono",{crono:e,telegrama:t})}esperaCrono(){return this.wsService.listen("mensaje-crono")}activaCrono(e,t){this.wsService.emit("activar-crono",{id:e,crono:t})}}return i.\u0275fac=function(e){return new(e||i)(c.LFG(a.i))},i.\u0275prov=c.Yz7({token:i,factory:i.\u0275fac,providedIn:"root"}),i})()},4466:(v,s,r)=>{r.d(s,{m:()=>n});var c=r(6895),a=r(4406),o=r(9299),i=r(4650);let n=(()=>{class e{}return e.\u0275fac=function(_){return new(_||e)},e.\u0275mod=i.oAB({type:e}),e.\u0275inj=i.cJS({imports:[c.ez,a.q,o.Bz]}),e})()},4641:(v,s,r)=>{r.d(s,{O:()=>a});var c=r(4650);let a=(()=>{class o{constructor(){this.emailPattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"}}return o.\u0275fac=function(n){return new(n||o)},o.\u0275prov=c.Yz7({token:o,factory:o.\u0275fac,providedIn:"root"}),o})()}}]);