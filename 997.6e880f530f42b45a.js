"use strict";(self.webpackChunkbudgetkey=self.webpackChunkbudgetkey||[]).push([[997],{9997:(Y,p,u)=>{u.r(p),u.d(p,{ProfileModule:()=>Q});var a=u(6814),g=u(3654),f=u(7328),c=u(6774),d=u(438),l=u(6524),h=u(6751),t=u(9468),_=u(6509),x=u(8666),E=u(9862);function C(n,s){1&n&&(t.ynx(0),t._uU(1," \u05db\u05dc \u05d4\u05ea\u05d5\u05e6\u05d0\u05d5\u05ea "),t.BQk())}function A(n,s){if(1&n&&(t.ynx(0),t._uU(1),t.BQk()),2&n){const o=t.oxw();t.xp6(1),t.hij(" ",o.docTypeDisplay()," ")}}function y(n,s){if(1&n&&(t.TgZ(0,"span"),t._uU(1),t.qZA()),2&n){const o=t.oxw(2);t.xp6(1),t.hij(" ",o.total_results," ")}}function b(n,s){1&n&&(t.TgZ(0,"span"),t._uU(1," 500+ "),t.qZA())}function v(n,s){if(1&n&&(t.ynx(0),t.YNc(1,y,2,1,"span",7),t.YNc(2,b,2,0,"span",7),t.BQk()),2&n){const o=t.oxw();t.xp6(1),t.Q6J("ngIf",o.total_results<500),t.xp6(1),t.Q6J("ngIf",o.total_results>=500)}}const P=function(n){return{sharing:n}};let T=(()=>{var n;class s{constructor(e,i,r){this.http=e,this.lists=i,this.globalSettings=r,this.changed=new t.vpe,this.sharing=!1,this.total_results=null}ngOnInit(){if(this.getCurrentResultNum(),this.globalSettings.themeId){let e=this.item.url.split("?")[1];if(e){const i=new URLSearchParams(e);i.get("theme")||(i.set("theme",this.globalSettings.themeId),e=i.toString(),this.item.url=this.item.url.split("?")[0]+"?"+e)}}}docType(){const e=this.item.properties;return e.docType&&e.docType.id||e.displayDocs}docTypeTypes(){const e=this.item.properties;return e.docType&&e.docType.types||e.displayDocsTypes}docTypeDisplay(){const e=this.item.properties;return e.docType&&e.docType.name||e.displayDocsDisplay}filters(){const e=this.item.properties;return e.docType&&e.docType.filters||e.filters||{}}timeRange(){const e=this.item.properties;return e.period&&e.period.value||e.timeRange||"alltime"}timeRangeDisplay(){const e=this.item.properties;return e.period&&e.period.title||e.timeRangeDisplay||""}timeRangeStart(){const e=this.item.properties;return e.period&&e.period.start||e.startRange||"1900-01-01"}timeRangeEnd(){const e=this.item.properties;return e.period&&e.period.end||e.endRange||"2100-12-31"}getCurrentResultNum(){const i=this.item.properties,r=[{id:this.docType(),doc_types:this.docTypeTypes(),filters:this.filters()}],R=encodeURIComponent(JSON.stringify(r));this.http.get(`https://next.obudget.org/search/count?q=${encodeURIComponent(i.term)}&&config=${R}`).subscribe(m=>{if(m.search_counts){const D=m.search_counts[this.docType()];D&&(this.total_results=D.total_overall)}})}delete(){Number.isFinite(this.item.id)&&this.lists.delete(l.$,this.item.id).subscribe(i=>{this.changed.emit(null)})}share(){this.sharing=!this.sharing}navigate(){window.location.href=this.item.url}}return(n=s).\u0275fac=function(e){return new(e||n)(t.Y36(E.eN),t.Y36(c.$Y),t.Y36(x.o))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-single-subscription-item"]],inputs:{item:"item"},outputs:{changed:"changed"},decls:21,vars:10,consts:[[1,"item-row",3,"ngClass"],[1,"main-container"],[1,"main",3,"click"],[1,"text"],[1,"emphasis"],[1,"break"],[1,"regular"],[4,"ngIf"],[1,"goto-container"],[1,"goto"],["src","assets/profile/img/left.svg"],[1,"sharers"],[1,"sharethis-inline-share-buttons"],[1,"icon","share",3,"click"],[3,"src"],[1,"icon","trash",3,"click"],["src","assets/profile/img/trash.svg"]],template:function(e,i){1&e&&(t.TgZ(0,"div",0)(1,"div",1)(2,"div",2),t.NdJ("click",function(){return i.navigate()}),t.TgZ(3,"span",3)(4,"span",4),t._uU(5),t.qZA(),t._UZ(6,"span",5),t.TgZ(7,"span",6),t._uU(8," \u05d7\u05d9\u05e4\u05d5\u05e9 "),t.YNc(9,C,2,0,"ng-container",7),t.YNc(10,A,2,1,"ng-container",7),t.qZA()(),t.TgZ(11,"span",8)(12,"span",9),t.YNc(13,v,3,2,"ng-container",7),t._UZ(14,"img",10),t.qZA()()(),t.TgZ(15,"div",11),t._UZ(16,"div",12),t.qZA()(),t.TgZ(17,"div",13),t.NdJ("click",function(){return i.share()}),t._UZ(18,"img",14),t.qZA(),t.TgZ(19,"div",15),t.NdJ("click",function(){return i.delete()}),t._UZ(20,"img",16),t.qZA()()),2&e&&(t.Q6J("ngClass",t.VKq(8,P,i.sharing)),t.xp6(5),t.hij(" ",i.item.title," "),t.xp6(4),t.Q6J("ngIf","all"===i.docType()),t.xp6(1),t.Q6J("ngIf","all"!==i.docType()),t.xp6(3),t.Q6J("ngIf",null!==i.total_results),t.xp6(3),t.uIk("data-url",i.item.url)("data-title",i.item.title),t.xp6(2),t.Q6J("src",i.sharing?"assets/profile/img/close.svg":"assets/profile/img/share-2.svg",t.LSH))},dependencies:[a.mk,a.O5],styles:["[_nghost-%COMP%]{width:100%}.item-row[_ngcontent-%COMP%]{margin-bottom:25px}.main[_ngcontent-%COMP%], .item-row[_ngcontent-%COMP%]{display:flex;flex-flow:row;align-items:center;width:100%}.main-container[_ngcontent-%COMP%]{width:100%;position:relative;z-index:0;margin-right:10px}.main[_ngcontent-%COMP%]{position:relative;border-radius:35px;background-color:#ff5a5f;box-shadow:0 2px 5px #0000000d;padding:10px 20px;margin-left:2.5px;flex:none;z-index:2;cursor:pointer;overflow-x:hidden;display:flex;flex-flow:row}.main.text[_ngcontent-%COMP%]{display:flex;flex-flow:row wrap}.sharers[_ngcontent-%COMP%]{left:0;top:0;width:210px;position:absolute;height:50px;padding-top:9px;z-index:1}.main[_ngcontent-%COMP%]{transition-property:width,z-index;transition-duration:.6s}.sharing[_ngcontent-%COMP%]   .main[_ngcontent-%COMP%]{width:calc(100% - 210px)}.emphasis[_ngcontent-%COMP%]{color:#fff;font-family:Abraham TRIAL;font-size:20px;font-weight:700;letter-spacing:.43px;max-width:380px;overflow-x:hidden;white-space:nowrap;text-overflow:ellipsis;margin-left:16px;flex:none}.regular[_ngcontent-%COMP%]{color:#00000080;font-family:Abraham TRIAL;font-size:20px;letter-spacing:.43px;overflow-x:hidden;white-space:nowrap}.goto-container[_ngcontent-%COMP%]{margin-right:auto}.goto[_ngcontent-%COMP%]{color:#fff;font-family:Abraham TRIAL;font-size:20px;letter-spacing:.43px;background:linear-gradient(270deg,rgba(255,90,95,0) 0%,rgba(255,90,95,.8) 30px);white-space:nowrap;flex:none}.icon[_ngcontent-%COMP%]{cursor:pointer;text-align:center;flex:none;width:30px}.break[_ngcontent-%COMP%]{display:none;flex-basis:100%;height:0}@media only screen and (max-width: 600px){.break[_ngcontent-%COMP%]{display:block}.emphasis[_ngcontent-%COMP%], .regular[_ngcontent-%COMP%], .goto[_ngcontent-%COMP%]{font-size:14px}}"]}),s})(),w=(()=>{var n;class s{constructor(e){this.lists=e,this.changed=new t.vpe}delete(){this.lists.delete(l.$,null).subscribe(e=>{this.changed.emit(null)})}}return(n=s).\u0275fac=function(e){return new(e||n)(t.Y36(c.$Y))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-delete-all-subscription-items"]],outputs:{changed:"changed"},decls:4,vars:0,consts:[[1,"icon","trash",3,"click"],["src","assets/profile/img/trash.svg"]],template:function(e,i){1&e&&(t.TgZ(0,"div",0),t.NdJ("click",function(){return i.delete()}),t.TgZ(1,"span"),t._uU(2,"\u05de\u05d7\u05e7\u05d5 \u05d4\u05db\u05dc"),t.qZA(),t._UZ(3,"img",1),t.qZA())},styles:["[_nghost-%COMP%]{align-self:flex-end;margin-left:6px}[_nghost-%COMP%]   .icon[_ngcontent-%COMP%]{cursor:pointer;text-align:center;opacity:.5;color:#333;font-family:Miriam Libre;font-size:16px;font-weight:700}[_nghost-%COMP%]   span[_ngcontent-%COMP%]{padding:10px;display:inline-block}[_nghost-%COMP%]   img[_ngcontent-%COMP%]{margin-top:-3px}"]}),s})();function Z(n,s){1&n&&(t.TgZ(0,"div",7)(1,"div",8),t._uU(2,"\u05d4\u05d2\u05e2\u05ea \u05dc\u05db\u05d0\u05df, \u05d0\u05d1\u05dc \u05e2\u05d5\u05d3 \u05dc\u05d0 \u05e0\u05e8\u05e9\u05de\u05ea \u05dc\u05d4\u05ea\u05e8\u05d0\u05d5\u05ea"),t.qZA(),t.TgZ(3,"div",9)(4,"span"),t._uU(5," \u05d0\u05dc \u05d7\u05e9\u05e9, \u05d1\u05d3\u05e3 \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05d4\u05d7\u05d9\u05e4\u05d5\u05e9 \u05dc\u05d7\u05d9\u05e6\u05d4 \u05e7\u05d8\u05e0\u05d4 \u05e2\u05dc \u05d4\u05db\u05d5\u05db\u05d1 \u05d1\u05e9\u05d5\u05e8\u05ea \u05d4\u05d7\u05d9\u05e4\u05d5\u05e9 \u05ea\u05e8\u05e9\u05d5\u05dd \u05d0\u05d5\u05ea\u05da \u05dc\u05e7\u05d1\u05dc\u05ea \u05d4\u05ea\u05e8\u05d0\u05d5\u05ea \u05d1\u05d3\u05d5\u05d0\u05f4\u05dc \u05e9\u05e0\u05d9\u05ea\u05df \u05d9\u05d4\u05d9\u05d4 \u05dc\u05e2\u05e8\u05d5\u05da \u05d1\u05e2\u05de\u05d5\u05d3 \u05d6\u05d4 "),t.qZA()(),t._UZ(6,"img",10),t.qZA())}function M(n,s){if(1&n&&(t.TgZ(0,"div",7)(1,"div",8),t._uU(2,"\u05d4\u05d2\u05e2\u05ea \u05dc\u05db\u05d0\u05df, \u05d0\u05d1\u05dc \u05e2\u05d5\u05d3 \u05dc\u05d0 \u05d4\u05ea\u05d7\u05d1\u05e8\u05ea \u05dc\u05de\u05e2\u05e8\u05db\u05ea"),t.qZA(),t.TgZ(3,"div",9)(4,"a",11),t._UZ(5,"img",12),t.qZA(),t.TgZ(6,"span",13),t._uU(7,"\u05d4\u05ea\u05d7\u05d1\u05e8\u05d5 \u05e2\u05dd \u05d2\u05d5\u05d2\u05dc"),t.qZA(),t.TgZ(8,"span"),t._uU(9,'\u05d7\u05d3\u05e9\u05d9\u05dd \u05db\u05d0\u05df? \u05d0\u05dc \u05d7\u05e9\u05e9, \u05d1\u05d3\u05e3 \u05ea\u05d5\u05e6\u05d0\u05d5\u05ea \u05d4\u05d7\u05d9\u05e4\u05d5\u05e9 \u05dc\u05d7\u05d9\u05e6\u05d4 \u05e7\u05d8\u05e0\u05d4 \u05e2\u05dc \u05d4\u05db\u05d5\u05db\u05d1 \u05d1\u05e9\u05d5\u05e8\u05ea \u05d4\u05d7\u05d9\u05e4\u05d5\u05e9 \u05ea\u05e8\u05e9\u05d5\u05dd \u05d0\u05d5\u05ea\u05da \u05dc\u05e7\u05d1\u05dc\u05ea \u05d4\u05ea\u05e8\u05d0\u05d5\u05ea \u05d1\u05d3\u05d5\u05d0"\u05dc, \u05e9\u05e0\u05d9\u05ea\u05df \u05d9\u05d4\u05d9\u05d4 \u05dc\u05e2\u05e8\u05d5\u05da \u05d1\u05e2\u05de\u05d5\u05d3 \u05d6\u05d4 '),t.qZA()(),t._UZ(10,"img",10),t.qZA()),2&n){const o=t.oxw(2);t.xp6(4),t.Q6J("href",o.loginUrl,t.LSH)}}function I(n,s){if(1&n&&(t.ynx(0),t._UZ(1,"img",3),t.TgZ(2,"span",4),t._uU(3,"(\u05e4\u05d4 \u05d9\u05d5\u05e4\u05d9\u05e2\u05d5)"),t.qZA(),t.TgZ(4,"span",5),t._uU(5,"\u05d4\u05d4\u05ea\u05e8\u05d0\u05d5\u05ea \u05d4\u05e9\u05de\u05d5\u05e8\u05d5\u05ea \u05e9\u05dc\u05d9"),t.qZA(),t.YNc(6,Z,7,0,"div",6),t.YNc(7,M,11,1,"div",6),t.BQk()),2&n){const o=t.oxw();t.xp6(6),t.Q6J("ngIf",o.authenticated),t.xp6(1),t.Q6J("ngIf",!o.authenticated)}}function S(n,s){if(1&n){const o=t.EpF();t.TgZ(0,"app-single-subscription-item",18),t.NdJ("changed",function(){t.CHM(o);const i=t.oxw(3);return t.KtG(i.updateItems())}),t.qZA()}if(2&n){const o=t.oxw().$implicit;t.Q6J("item",o)}}function O(n,s){if(1&n&&(t.ynx(0),t.YNc(1,S,1,1,"app-single-subscription-item",17),t.BQk()),2&n){const o=s.$implicit;t.xp6(1),t.Q6J("ngIf",o.properties&&"search"===o.properties.kind)}}function U(n,s){if(1&n){const o=t.EpF();t.ynx(0),t._UZ(1,"img",14),t.TgZ(2,"span",5),t._uU(3,"\u05d4\u05d4\u05ea\u05e8\u05d0\u05d5\u05ea \u05d4\u05e9\u05de\u05d5\u05e8\u05d5\u05ea \u05e9\u05dc\u05d9"),t.qZA(),t.YNc(4,O,2,1,"ng-container",15),t.ALo(5,"async"),t.TgZ(6,"app-delete-all-subscription-items",16),t.NdJ("changed",function(){t.CHM(o);const i=t.oxw();return t.KtG(i.updateItems())}),t.qZA(),t.BQk()}if(2&n){const o=t.oxw();t.xp6(4),t.Q6J("ngForOf",t.lcZ(5,1,o.items))}}const J=[{path:"",component:(()=>{var n;class s{constructor(e,i,r){this.lists=e,this.auth=i,this.ps=r,this.items=new f.t,this.init=!1,this.authenticated=!1,this.hasItems=!1,this.loginUrl=null,this.updateItems()}updateItems(){this.auth.check().subscribe(e=>{if(e&&(this.authenticated=e.authenticated,!e.authenticated)){this.init=!0,this.hasItems=!1,this.items.next([]);const i=e.providers&&(e.providers.google||e.providers.github);i&&(this.loginUrl=i.url)}}),this.lists.get(l.$).subscribe(e=>{this.init=!0,this.hasItems=!!e.items&&e.items.length>0,this.items.next(e.items||[]),this.refreshShareThis()})}ngAfterViewInit(){this.refreshShareThis()}refreshShareThis(){this.ps.browser(()=>{window.__sharethis__&&window.__sharethis__.initialize?window.setTimeout(()=>{window.__sharethis__.initialize()},1e3):(console.log("Failed to find ShareThis buttons"),window.setTimeout(()=>{this.ngAfterViewInit()},3e3))})}}return(n=s).\u0275fac=function(e){return new(e||n)(t.Y36(c.$Y),t.Y36(d.e),t.Y36(h.m))},n.\u0275cmp=t.Xpm({type:n,selectors:[["app-profile-page"]],decls:4,vars:4,consts:[[3,"showHeader","showSearchBar"],[1,"main"],[4,"ngIf"],["src","assets/profile/img/update_stars_empty.svg",1,"logo"],[1,"subtitle"],[1,"title"],["class","instructions",4,"ngIf"],[1,"instructions"],[1,"instructions-title"],[1,"instructions-subtitle"],["src","assets/profile/img/no_alerts_stars_transition.svg"],[3,"href"],["src","assets/profile/img/google_login.svg"],[1,"connect"],["src","assets/profile/img/update_stars.svg",1,"logo"],[4,"ngFor","ngForOf"],[3,"changed"],[3,"item","changed",4,"ngIf"],[3,"item","changed"]],template:function(e,i){1&e&&(t.TgZ(0,"app-container",0)(1,"div",1),t.YNc(2,I,8,2,"ng-container",2),t.YNc(3,U,7,3,"ng-container",2),t.qZA()()),2&e&&(t.Q6J("showHeader",!0)("showSearchBar",!0),t.xp6(2),t.Q6J("ngIf",i.init&&!i.hasItems),t.xp6(1),t.Q6J("ngIf",i.init&&i.hasItems))},dependencies:[a.sg,a.O5,_.b,T,w,a.Ov],styles:["div.main[_ngcontent-%COMP%]{display:flex;flex-flow:column;align-items:center;padding-bottom:50px;width:100%;max-width:770px}.logo[_ngcontent-%COMP%]{margin-top:50px;width:170px}.title[_ngcontent-%COMP%]{color:#ff5a5f;font-family:Miriam Libre;font-size:28px;font-weight:700;padding-bottom:25px}.subtitle[_ngcontent-%COMP%]{color:#ff5a5f;font-family:Miriam Libre;font-size:18px;font-weight:200;padding:10px 0}.instructions[_ngcontent-%COMP%]{width:100%;display:flex;flex-flow:column;align-items:center;background-color:#fafafa4d;box-shadow:inset 0 1px 10px #0000000d;padding:40px}.instructions-title[_ngcontent-%COMP%]{color:#333;font-family:Miriam Libre;font-size:22px;font-weight:700;text-align:center;margin-bottom:10px}.instructions-subtitle[_ngcontent-%COMP%]{display:flex;flex-flow:column;align-items:center}.instructions-subtitle[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{color:#3c4948;font-family:Abraham TRIAL;font-size:16px;font-weight:300;max-width:460px;text-align:center;margin-bottom:25px}.instructions-subtitle[_ngcontent-%COMP%]   .connect[_ngcontent-%COMP%]{display:block;pointer-events:none;color:#fff;font-family:Miriam Libre;font-size:14px;font-weight:700;letter-spacing:.4px;margin-top:-33px;margin-right:-33px;margin-bottom:33px}"]}),s})()}];let k=(()=>{var n;class s{}return(n=s).\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[g.Bz.forChild(J),g.Bz]}),s})();var B=u(4063),N=u(8691);let Q=(()=>{var n;class s{}return(n=s).\u0275fac=function(e){return new(e||n)},n.\u0275mod=t.oAB({type:n}),n.\u0275inj=t.cJS({imports:[a.ez,k,B.U,N.M]}),s})()}}]);