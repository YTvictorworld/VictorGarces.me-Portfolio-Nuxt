const o=(e,t="en-US")=>(typeof e=="string"?new Date(e):e).toLocaleDateString(t,{year:"numeric",month:"long",day:"numeric",timeZone:"UTC"});export{o as f};
