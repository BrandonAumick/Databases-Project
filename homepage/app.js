susButton = document.getElementById('susButton');
theftButton = document.getElementById('theftButton');
vehicleButton = document.getElementById('vehicleButton');
headThing = document.querySelector('h1');

susButton.addEventListener('click', () => {
    headThing.textContent += 'sus'
})

theftButton.addEventListener('click', () => {
    headThing.textContent += 'theft'
})

vehicleButton.addEventListener('click', () => {
    headThing.textContent += 'veh'
})