import React from "react";
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";

import Spotify from '../../util/Spotify';


class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      searchResults: [
        {name:'firstSong', artist: 'Amoprhis', album:'Under the red cloud', id:1},
        {name:'secondtSong', artist: 'Amarthi', album:'Asator', id:2},
        {name:'thirdSong', artist: 'Blekija', album:'Ludilo', id:3},
      ],
      playlistName:"Epic Metal",
      playlistTracks:[
        {name:'firstSong', artist: 'Ensikerum', album:'From Afar', id:4},
        {name:'secondtSong', artist: 'Metallica', album:'Master of Puppets', id:5},
        {name:'thirdSong', artist: 'Powerija', album:'Zmajevi', id:6},
      ]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  // async search(searchTerm) {
  //   let searchResults = await Spotify.search(searchTerm);
  //   this.setState({searchResults: searchResults})
  // }

  search(term) {
    Spotify.search(term).then(searchResults => { //updateamo this.state.searchresult sa valeuom iz Spotify file i njegove metode
      console.log(searchResults)
      this.setState({searchResults: searchResults}) //Spotify.search koja resolva sa promisom. Term dobivamo iz endpoita od urla kojeg smo fetchali( pogledaj u spotify fileu)
    })
  }

  // search(term) {
  //   console.log(term)
  // }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(() => {
      this.setState( {
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name})
  }
  
  addTrack(track) {
    if (this.state.playlistTracks.find(pisma => pisma.id === track.id)){
      return
    } else {
      this.state.playlistTracks.push(track) //neznam da li smijem ovako ili moram napraviti novu varijablu kao u primjeru sa codecademya
      this.setState({
        playlistTracks: this.state.playlistTracks
      })
    }
  }

  removeTrack(track) {
    let newplaylistTracks = this.state.playlistTracks;
    newplaylistTracks = newplaylistTracks.filter(pismu => pismu.id !== track.id);
    this.setState({
      playlistTracks: newplaylistTracks
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
        <div className="App-playlist">
         <SearchResults 
                        searchResults={this.state.searchResults}
                        onAdd={this.addTrack} />
         <Playlist playlistName={this.state.playlistName}
                   playlistTracks={this.state.playlistTracks}
                   onRemove={this.removeTrack}
                   onNameChange={this.updatePlaylistName}
                   onSave={this.savePlaylist} />
        </div>
        </div>
      </div>
    )
  }
}








export default App;