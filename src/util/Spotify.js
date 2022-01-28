const clientId = '090fb7da1ca848ad8d0146e375fecca3';

//ovaj koristim u developer fazi:
const redirectUri = "http://localhost:3000/";

//a ovaj u build odnosno nakon sto sam postavioa preko netlifya ili neceg slicnog:
// const redirectUri = 'https://zvone_jamming_react_app.surge.sh';

let accessToken;

const Spotify = { //na spotify API piše kako se dolazi do accesTokena pa smo napisali ovu funkciju
    getAccessToken() { 
        if (accessToken) {
            return accessToken;
        }

        // chek for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/); // window.location.href je metoda kad upišemo u consolu vraća URL te stranice
                                                // koristimo match metodu koja traži da li je u URL-u access_token= koji ima ovaj regex
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
   
        if (accessTokenMatch && expiresInMatch) { //ako su pronađeni u URL-u onda radimo logiku ispod
            console.log('Cijeli access_token iz URLa je' + accessTokenMatch)
            console.log('Cijeli expires_in iz URLa je' + expiresInMatch)
            accessToken = accessTokenMatch[1]; //u consoli se kuži da su poslana 2 ako pozorno pogledam
            console.log('accessToken je: ' + accessToken)
            const expiresIN = Number(expiresInMatch[1]); //koristimo Number built in type 
            // ovo ispod clears the parameters, allowing us to grab a new access token when it expires:
            window.setTimeout(() => accessToken = '', expiresIN * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else { //ako je varijabla access_token prazna i nema je u URLu:
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl; //redirectamo usera jer setamo window.location na ovaj link iznad 
        }
    },

    async search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
        console.log(accessToken)
        let response = await fetch (`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
        headers: {
            Authorization: `Bearer ${accessToken}` //ovo traži API spotify
        }
       });
       console.log('Cijeli response je:')
       console.log(response )
       const jsonResponse = await response.json();
       console.log('response nakon response.json: ')
       console.log(jsonResponse)
       if(!jsonResponse.tracks) { //ako jsonResponse nema property .tracks odnosno ako je falsy onda vrati praznu array
           return [];
       }
       const results = jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
    }));
        console.log(results)
       return results
       
    },

    // ista stvar samo pomoću promisa a ne async awaita
    // search(term) {
    //     const accessToken = Spotify.getAccessToken(); //postavili smo accessToken iz poziva metode iznad
    //     console.log(accessToken)
    //     return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
    //         headers: {
    //             Authorization: `Bearer ${accessToken}`
    //         }
    //     }).then(response => {
    //         console.log('Cijeli response je:')
    //         console.log(response)
    //         return response.json();
    //     }).then(jsonResponse => {
    //         if(!jsonResponse.tracks) {
    //             console.log(jsonResponse)
    //             return [];
    //         }
    //         console.log('Response nakon response.json: ')
    //         console.log(jsonResponse) //lipo vidim response u consoli i izvlačim stvari koje su mi potrebne
    //         return jsonResponse.tracks.items.map(track => ({
    //             id: track.id,
    //             name: track.name,
    //             artist: track.artists[0].name,
    //             album: track.album.name,
    //             uri: track.uri
    //         }));
    //     });
    // },
    
    async savePlaylist(playlistName, trackUris) {
        if (!playlistName || !trackUris.length) { //provjeravamo ako nema imena i ako je trackUris array prazna
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: ` Bearer ${accessToken}`}; //sa API spotify
        let userId;

        const response1 = await fetch('https://api.spotify.com/v1/me', {headers: headers}); //ovaj fetch radimo da dobijemo userId
        // console.log('Cijeli response je:')
        // console.log(response)
        const jsonResponse = await response1.json()
        // console.log('Response nakon response.json: ')
        // console.log(jsonResponse)
        userId = jsonResponse.id;

        const response2 = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, { //POST metodom (za koju je potreban prethodni userId) šaljemo request da nam vrati playlistID
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name:playlistName}) //ovim POST requestom smo stvorili novu playlistu na userovom accountu, a u ovoj liniji smo joj dali ime playlistName koje ce biti ubaceno kao paramaetar u funkciju kasnije iz Reactovom stanja
        })
        const jsonResponse2 = await response2.json();
        //console.log(jsonResponse2);
        const playlistId = jsonResponse2.id;
        //console.log(playlistID)

        const response3 = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, { //ovim POSTOM addamo pisme u tu stvorenu playlistu
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ uris: trackUris }) //sa ovim dodajemo trackUris u prethodno dohvaćenu playlistu
        });
        // console.log(response3);
        // const jsonResponse3 = await (response3.json())
        // console.log(jsonResponse3)
        return response3

    }


}

export default Spotify