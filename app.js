
const charUrl = "https://xivapi.com/character/search?";
const profileUrl = "https://xivapi.com/character/";


//Watches for search button to be clicked on
//Initializes get search results
function formWatch() {
    $('#js-form').submit(event => {
        event.preventDefault();
        $('nav').removeClass('nav');
        $('nav').addClass('navTop');
        $('#js-characterData').hide();
        const playerName = $('#userSearch').val();
        const serverName = document.getElementById('serverList').value;

        getSearchResults(playerName, serverName);

    })
}

//Converts params into a string
function generateQueryString(params) {

    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
    return queryItems.join('&');

}

//Fetches the XIVAPI to gather search results
//Based on Character + Server Name
function getSearchResults(playerName, serverName) {
    const params = {
        name: playerName,
        server: serverName
    }
    const queryString = generateQueryString(params);
    const searchUrl = charUrl + queryString;
    console.log(searchUrl);

    fetch(searchUrl)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(data => (displaySearchResults(data)))
        .catch(error => {
            alert(`Something went wrong: ${error.message}`);
        })
}

//Displays the initial search results
//Found from the fetch
//Displays them their own div box
function displaySearchResults(data) {

    $('.results').empty();

    for (let idx = 0; idx < data.Results.length; idx++) {
        $('.results').append(`
        <li>
        <a class="characterUrl" href="https://xivapi.com/character/${data.Results[idx].ID}">
        <img class="avatar" src="${data.Results[idx].Avatar}" alt="Players Avatar Picture">
        
        <span>${data.Results[idx].Name}</span>
        <span>${data.Results[idx].Server}</span>
       
        </a>
        </li>
        
       ` )
    };
    profileWatch();
}

//Watches for the click on the mini Profile
function profileWatch() {

    $('.characterUrl').on('click', function (event) {
        event.preventDefault();



        let playerData = $(this).attr('href');
        let playerDataUrl = playerData + "?extended=1";
        console.log(playerDataUrl);

        fetch(playerDataUrl)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(response.statusText);
                }
            })
            .then(results => displayCharacterData(results))
            .catch(error => {
                alert(`Something Went Wrong: ${error.message}`);
            });
        console.log("click");
    })

}



function displayCharacterData(results) {
    
    $('#js-characterData').show();
    $('.results').empty();
    let toon = results.Character;

    console.log(toon.Name);

    $('.nameAndServer').html(`
        <p>${toon.Name}</p>
        <p>${toon.Server} (${toon.DC}) </p>
    `)
    $('.characterPortrait').html(`
        <img class="charPortrait" src=${toon.Portrait}>
    `)


    
    displayStats(toon);
    displayJobLevels(toon);
    displayGear(toon);
}


function displayStats(toon) {

    let stats = Object.keys(toon.GearSet.Attributes).map(
        function (attr) {
            let value = toon.GearSet.Attributes[attr];
            return value;
        }
    )


    $('.str').html(`${stats[0].Value}`);
    $('.dex').html(`${stats[1].Value}`);
    $('.vit').html(`${stats[2].Value}`);
    $('.int').html(`${stats[3].Value}`);
    $('.mnd').html(`${stats[4].Value}`);

    $('.ch').html(`${stats[5].Value}`);
    $('.det').html(`${stats[6].Value}`);
    $('.dh').html(`${stats[7].Value}`);

    $('.def').html(`${stats[8].Value}`);   
    $('.mdef').html(`${stats[9].Value}`);
    
    $('.atk').html(`${stats[10].Value}`);
    $('.sks').html(`${stats[11].Value}`);

    $('.atkMagic').html(`${stats[12].Value}`);
    $('.healMagic').html(`${stats[13].Value}`);
    $('.sps').html(`${stats[14].Value}`);
    
    $('.ten').html(`${stats[15].Value}`);
    $('.pie').html(`${stats[16].Value}`);    

}


function displayJobLevels(toon) {

    let level = toon.ClassJobs.map(el => el.Level);

    $('.pld').html(`${level[0]}`);
    $('.war').html(`${level[1]}`);
    $('.drk').html(`${level[2]}`);
    $('.gnb').html(`${level[3]}`);

    $('.whm').html(`${level[8]}`);
    $('.sch').html(`${level[9]}`);
    $('.ast').html(`${level[10]}`);

    $('.mnk').html(`${level[4]}`);    
    $('.drg').html(`${level[5]}`);    
    $('.nin').html(`${level[6]}`);    
    $('.sam').html(`${level[7]}`);    
    
    $('.brd').html(`${level[11]}`);
    $('.mch').html(`${level[12]}`);
    $('.dnc').html(`${level[13]}`);

    $('.blm').html(`${level[14]}`);
    $('.smn').html(`${level[15]}`);
    $('.rdm').html(`${level[16]}`);
    $('.blu').html(`${level[17]}`);

    $('.crp').html(`${level[18]}`);
    $('.bsm').html(`${level[19]}`);
    $('.arm').html(`${level[20]}`);
    $('.gsm').html(`${level[21]}`);
    $('.ltw').html(`${level[22]}`);
    $('.wvr').html(`${level[23]}`);
    $('.alc').html(`${level[24]}`);
    $('.cul').html(`${level[25]}`);

    $('.min').html(`${level[26]}`);
    $('.btn').html(`${level[27]}`);
    $('.fsh').html(`${level[28]}`);


}

//rename functions
//gear collection of names
//if statements
//if(gear.head)

//leftside arr
//rightside arr

//Displays Gear currently equipped

function displayGear (toon) {

  let leftParts = ['MainHand', 'Head', 'Body', 'Hands', 'Waist', 'Legs', 'Feet'];
  let rightParts = ['Earrings', 'Necklace', 'Bracelets', 'Ring1', 'Ring2'];

  let gear = toon.GearSet.Gear;
  console.log(gear);

  $('.gear').html(getGearColumns(gear, leftParts, rightParts));

}

//Checks and returns if materia is present on any of the gear pieces
function getMateria (part){

    if(part && part.Materia) {
        return part.Materia.map(
            materia => `<div class="Materia">
            <img src="https://xivapi.com${materia.Icon}">
            ${materia.Name}
            </div>
            `
        );
    }

    return ``;

}

//Gets and returns all currently equipped gear
function getGearItem (gear, partName){

    let part = gear[partName];
    let materia = part.Materia ? getMateria(part) : '' ;
    
    
        return `
        <li class="bodyPart ${partName}">
        <h4>${partName}</h4>
        <img src="https://xivapi.com${part.Item.Icon}">
        ${part.Item.Name}
        ${materia}
    `;
     
   

}

//breaks up the gear into 2 columns
function getGearColumns(gear, column1, column2) {


    let leftColumn = column1.map(
        partName => getGearItem(gear, partName)
    ).join('');
    

    let rightColumn = column2.map(
        partName => getGearItem(gear, partName)
    ).join('');
    


    return `<div class="gearColumns">
        <ul class="bodyParts left">${leftColumn}</ul>
        <ul class="bodyParts right">${rightColumn}</ul>
    `



}


$(formWatch);
