const fs = require('fs');
const file = 'index.html';
let content = fs.readFileSync(file, 'utf8');

const patches = [
// Fix A: My Account order cards clickable
[
`$("accOrdersWrap").innerHTML = orders.map(o => \`
<div style="border:1px solid var(--line);border-radius:10px;padding:14px;margin-bottom:10px">`,
`$("accOrdersWrap").innerHTML = orders.map(o => \`
<div style="border:1px solid var(--line);border-radius:10px;padding:14px;margin-bottom:10px;cursor:pointer" onclick="closePanels();openTrackOrder()">`
],
// Fix B1: Admin Panel drawer link
[
`<a href="#" onclick="closeDrawer();openTrackOrder();return false">Track Order</a>`,
`<a href="#" onclick="closeDrawer();openTrackOrder();return false">Track Order</a>
<a href="#" onclick="closeDrawer();openAdminEntry();return false">Admin Panel</a>`
],
// Fix B2: openAdminEntry function
[
`function openAccount(){
openPanel("accountPanel")
refreshAccountView()
}

function openDrawer(){`,
`function openAccount(){
openPanel("accountPanel")
refreshAccountView()
}

async function openAdminEntry(){
const { data:{ session } } = await supabaseClient.auth.getSession()
if(session && session.user.email && session.user.email.toLowerCase() === ADMIN_EMAIL){
showAdmin()
}else{
openAccount()
}
}

function openDrawer(){`
],
// Fix C1: viewOrderedProduct robust matching
[
`function viewOrderedProduct(productId){
const product = allProducts.find(p => p.id === productId)
if(!product){
toast("This product is no longer available.")
return
}
openProductDetail(productId)
}`,
`function viewOrderedProduct(productId){
const product = allProducts.find(p => Number(p.id) === Number(productId))
if(!product){
toast("This product is no longer available.")
return
}
closePanels()
openProductDetail(Number(productId))
}`
],
// Fix C2: always-clickable order item row
[
`const clickable = !!r.product_id
return \`
<div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)\${clickable ? ';cursor:pointer' : ''}"\${clickable ? \` onclick="viewOrderedProduct(\${r.product_id})"\` : ''}>`,
`return \`
<div style="display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line);cursor:pointer" onclick="viewOrderedProduct(\${r.product_id || 'null'})">`
]
];

let ok = true;
patches.forEach(([o,n], i) => {
if(!content.includes(o)){ console.error('❌ Block ' + (i+1) + ' not found.'); ok = false; return; }
content = content.replace(o, n);
});

if(!ok){ process.exit(1); }
fs.writeFileSync(file, content, 'utf8');
console.log('✅ All fixes applied successfully.');
