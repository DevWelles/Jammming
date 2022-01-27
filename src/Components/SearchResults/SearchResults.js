import React from 'react';
import './SearchResults.css';
import TrackList from '../TrackList/TrackList';

const SearchResults = (props) => {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
        <TrackList tracks={props.searchResults}
                   onAdd={props.onAdd}
                   isRemoval={false} />
    </div>
  )
}

// export class SearchResults extends Component {
//   render() {
//     return (
//       <div className="SearchResults">
//         <h2>Results</h2>
//           <TrackList tracks={this.props.searchResults}
//                      onAdd={this.props.onAdd}
//                      isRemoval={false} />
//       </div>
//     )
//   }
// }

export default SearchResults;
