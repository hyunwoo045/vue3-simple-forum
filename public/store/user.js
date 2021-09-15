import axios from"axios";import config from"~/key/config";const endpoint=config.endpoint;export default{namespaced:!0,state:()=>({isLoggedIn:!1,id:-1,provider:"forum",nickname:"",identifier:""}),mutations:{setState(i,e){const{id:o,provider:n,identifier:d,displayName:t}=e;i.isLoggedIn=!0,i.provider=n,i.id=o,i.nickname=t,i.identifier=d},resetState(i){i.id=-1,i.nickname="",i.provider="",i.identifier="",i.isLoggedIn=!1},sessionCheck(i){console.log("SESSION CHECKING"),axios.get(`${endpoint}/auth/session`).then((e=>(console.log(e.data),"SESSION_EXPIRED"===e.data?(console.log("SESSION EXPIRED"),"SESSION_EXPIRED"):(i.isLoggedIn=!0,i.provider=e.data.provider,i.id=e.data.id,i.nickname=e.data.displayName,i.identifier=e.data.identifier,"OK"))))}}};