searchStuff = document.querySelector('div');
console.log(searchStuff.innerHTML)
const re = /.*/g
oldStuff = searchStuff.innerHTML.match(re);
newString = searchStuff.innerHTML.replaceAll(re, oldStuff[0]);
console.log(newString);
searchStuff.innerHTML = newString;
