import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';


export default function TrackList({tracks,onAdd,onRemove,isRemoval}) { //ovo sam samo vjezbao destructuring, najbolje mi je primiti cijeli props pa dolje pisem props.onAdd itd..
  return (
    <div className="TrackList">
      {tracks.map(pisma => {
        return <Track track={pisma}
                      key={pisma.id}
                      onAdd={onAdd}
                      onRemove={onRemove}
                      isRemoval={isRemoval} />
      })
      }
    </div>
  )
}


// export class TrackList extends Component {
//   render() {
//     return (
//       <div className="TrackList">
//         {
//           this.props.tracks.map(pisma => {
//             return <Track track={pisma}
//                           key={pisma.id}
//                           onAdd={this.props.onAdd}
//                           onRemove={this.props.onRemove}
//                           isRemoval={this.props.isRemoval} />
            
//           })
//         }
      
//       </div>
//     );
//   }
// }


