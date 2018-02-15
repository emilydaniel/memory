import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import socket from './socket';

export default function run_memory(root, gameName) {
  ReactDOM.render(<MemoryGame gameName={gameName}/>, root);
}

class MemoryGame extends React.Component {
    constructor(props) {
        super(props);
        this.channel = socket.channel("games:" + props.gameName, {});
        this.state = { 
            //cards: _.shuffle(["A", "B", "C", "D", "E", "F", "G", "H", 
                              //"A", "B", "C", "D", "E", "F", "G", "H"]),
            cards: [],
            foundPairs: [],
            guess: [],
            score: 0,
        };

        this.channel.join()
            .receive("ok", this.showView.bind(this))
            .receive("error", (resp) => { 
                console.log("GAME: Unable to join", resp) 
            });
    }

    showView(view) {
        console.log("New View", view);
        this.setState(view.game);
    }
    
    clickEvent(me, cardIndex) {
        this.channel.push("click", {index: cardIndex})
            .receive("ok", this.showView.bind(this));
    }

    resetBtnClick(me) {
        this.channel.push("new")
            .receive("ok", this.showView.bind(this));
    }

    render() {
        return (
            <div>
                <DrawRow cardLets={ this.state.cards.slice(0, 4) } 
                         foundPairs={ this.state.foundPairs }
                         guess={ this.state.guess }
                         click={ this.clickEvent.bind(this) }
                         row={ 0 } />
                <DrawRow cardLets={ this.state.cards.slice(4, 8) } 
                         foundPairs={ this.state.foundPairs }
                         guess={ this.state.guess }
                         click={ this.clickEvent.bind(this) }
                         row={ 1 } />
                <DrawRow cardLets={ this.state.cards.slice(8, 12) } 
                         foundPairs={ this.state.foundPairs }
                         guess={ this.state.guess }
                         click={ this.clickEvent.bind(this) }
                         row={ 2 } />
                <DrawRow cardLets={ this.state.cards.slice(12) } 
                         foundPairs={ this.state.foundPairs }
                         guess={ this.state.guess }
                         click={ this.clickEvent.bind(this) }
                         row={ 3 } />
                <div className="row">
                    <DrawResetBtn btnClick={ 
                        this.resetBtnClick.bind(this) } />
                    <DrawScore score={ this.state.score } />
                </div>
            </div>
        );
    }
}

function Card({letter, cardIndex, flipped, clickEvent}) {
    return (
        <div className="card" onClick={ (me) => 
                clickEvent(me, cardIndex) }>
            <h1>{ (flipped ? letter : letter) }</h1>
        </div>
    );
}

function DrawRow({cardLets, foundPairs, guess, click, row}) {
    return (
        <div className="row"> {
            cardLets.map((card, col) => 
                (<Card letter={card.letter} 
                      cardIndex={(row * 4) + col}
                      flipped={card.flipped}
                      clickEvent={click}/>)
           )          
        }
        </div>
    );
}

function DrawResetBtn({btnClick}) {
    return (
        <div className="col">
            <button type="button" onClick={btnClick}>Reset</button>
        </div>
    );
}

function DrawScore({score}) {
    return (
        <div className="col">
            <h5>Your score is:  { score }</h5>
        </div>
    );
}
