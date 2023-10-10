
const getParksByActivity = async (event) => {
    event.stopPropagation();
    const element = event.target;
    const actId = element.getAttribute('id');
    const actName = element.textContent;

    const response = await fetch('/', {
        method: 'POST',
        body: JSON.stringify({ actId, actName }),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    if (response.ok) {
        location.reload(true);
    } else {
        alert(response.statusText);
    };
};

const closeParksForAct = async () => {
    document.querySelector('.modal').style.display = 'none';

    const clearActParks = true;

    const response = await fetch('/', {
        method: 'POST',
        body: JSON.stringify({ clearActParks }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        location.reload(true);
    } else {
        alert(response.statusText);
    };
};
