const compareProperty = '__created';

function initTable () {
    let options = {
        headers: {
            'Authorization': 'APIKEY ' + getApiKey()
        }
    };

    fetch(baseUrl + '/obs', options)
        .then(response => response.json())
        .then(function (data) {
            getMetadata(0, data['sets'], []);
        });
}

function getMetadata (index, links, metadata) {
    if (index >= links.length) {
        processMetadata(metadata);
        return;
    }

    document.getElementById('tableDiv').innerText = 'Loading data ' + Math.round(index * 100 / links.length) + '%';

    let options = {
        headers: {
            'Authorization': 'APIKEY ' + getApiKey()
        }
    };

    fetch(links[index], options)
        .then(function (response) {
            if (response.status === 200) {
                return response.json();
            }
        })
        .then(function (data) {
            if (data != null) {
                metadata.push(data);
                getMetadata(index + 1, links, metadata);
            }
        });
}

function processMetadata(metadata) {
    let properties = [];
    for (let obsMetadata of metadata) {
        for (let property of Object.getOwnPropertyNames(obsMetadata)) {
            if (properties.indexOf(property) === -1) {
                properties.push(property);
            }
        }
    }
    metadata.sort(compareByProperty(compareProperty));
    drawTable(metadata, properties);
}

function drawTable(metadata, properties) {
    let tableDiv = document.getElementById('tableDiv');
    tableDiv.innerHTML = "<table class='pto-data-table'><thead></thead><tbody></tbody></table>";

    const thead = tableDiv.getElementsByTagName('thead')[0];
    let row = thead.insertRow(-1);
    for (let property of properties) {
        row.insertCell(-1).outerHTML = "<th>" + property + "</th>";
    }

    const tbody = tableDiv.getElementsByTagName('tbody')[0];
    for (let obsMetadata of metadata) {
        const row = tbody.insertRow(-1);
        for (let property of properties) {
            row.insertCell(-1).innerText = obsMetadata[property] == null ? '' : obsMetadata[property];
        }
    }
}