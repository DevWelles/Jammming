const clientId = '-------------';

//ovaj koristim u developer fazi:
const redirectUri = "http://localhost:3000/";

//a ovaj u build odnosno nakon sto sam postavioa preko netlifya ili neceg slicnog:
// const redirectUri = 'https://zvone_jamming_react_app.surge.sh';

let accessToken;

const Spotify = {
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
            accessToken = accessTokenMatch[1];
            console.log('accessToken je' + accessToken)
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

    // async search(searchTerm) {
    //     const accessToken = Spotify.getAccessToken();
    //     console.log(accessToken)
    //     let response = await fetch (`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
    //     headers: {
    //         Authorization: `Bearer ${accessToken}`
    //     }
    //    });
    //    console.log('ovo je prvi oblik responsea: ' + response )
    //    let jsonResponse = await response.json();
    //    console.log('drugi oblik responsea nakon response.json: ' + response)
    //    if(!jsonResponse.tracks) { //ako jsonResponse nema property .tracks vrati praznu array
    //        return [];
    //    }
    //    return jsonResponse.tracks.items.map(track => ({
    //        id: track.id,
    //        name: track.name,
    //        artist: track.artist[0].name,
    //        album: track.album.name,
    //        uri: track.uri
    //    }))
       
    // },

    search(term) {
        const accessToken = Spotify.getAccessToken(); //postavili smo accessToken iz poziva metode iznad
        console.log(accessToken)
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            console.log(response)
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                console.log(jsonResponse)
                return [];
            }
            console.log(jsonResponse)
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
    },
    
    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) { //provjeravamo ako nema imena i ako je trackUris array prazna
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: ` Bearer ${accessToken}`};
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name:name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris })
                })
            })
        })
    }


}

export default Spotify