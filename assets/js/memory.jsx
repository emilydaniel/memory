import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(root) {
  ReactDOM.render(<MemoryGame />, root);
}

class MemoryGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            cards: _.shuffle(["A", "B", "C", "D", "E", "F", "G", "H", 
                              "A", "B", "C", "D", "E", "F", "G", "H"]),
            foundPairs: [],
            guess: [],
            score: 0,
        }
    }
    
    clickEvent(me, cardIndex) {
        let input = $(me.target);
        if (_.size(this.state.guess) == 2) {
            //do nothing because they've clicked on 2 already
        }
        else {
            //check if they've clicked on the same card twice or it's
            //in foundPairs
            if (_.contains(this.state.guess, cardIndex) ||
                _.contains(this.state.foundPairs, 
                    this.state.cards[cardIndex])) {
                //do nothing because they've either clicked on this or
                //found it
            }
            else {
                //flip the card over
                let state1 = _.extend(this.state, {
                    guess: this.state.guess.concat(cardIndex),
                    score: this.state.score + 1,
                });
                this.setState(state1);

                if (_.size(this.state.guess) == 2) {
                    this.checkForPairs();
                }
            }
        }
    }

    checkForPairs() {
        let guess1 = this.state.cards[this.state.guess[0]];
        let guess2 = this.state.cards[this.state.guess[1]];
        let guessArr = this.state.guess;
        if (guess1 == guess2) {
            guessArr = ClearArray(guessArr);
            let state1 = _.extend(this.state, {
                foundPairs: this.state.foundPairs.concat(guess1),
                guess: guessArr,
            });
            this.setState(state1);
            setTimeout(() => {
                if (this.state.foundPairs.length == 8) {
                    window.alert("You've won!");
                }
            }, 100);
        }
        else {
            setTimeout(() => {
                guessArr = ClearArray(guessArr);
                let state1 = _.extend(this.state, {
                    guess: guessArr,
                });
                this.setState(state1);
            }, 1000);
        }
    }

    resetBtnClick(me) {
        let cardsArr = _.shuffle(this.state.cards);
        let guessArr = this.state.guess;
        let foundPairsArr = this.state.foundPairs;
        let newScore = 0;
        guessArr = ClearArray(guessArr);
        foundPairsArr = ClearArray(foundPairsArr);
        let state1 = _.extend({
            cards: cardsArr,
            guess: guessArr,
            foundPairs: foundPairsArr,
            score: newScore,
        });
        this.setState(state1);
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

class Card extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="card" onClick={ (me) => 
                        this.props.clickEvent(me, 
                                this.props.cardIndex) }>
                <h1>{ (this.props.flipped ? 
                        this.props.letter : "?") }</h1>
            </div>
        );
    }
}

function DrawRow({cardLets, foundPairs, guess, click, row}) {
    return (
        <div className="row"> {
            cardLets.map((cardLet, col) => 
                (<Card letter={cardLet} 
                      cardIndex={(row * 4) + col}
                      flipped={((_.contains(guess, (row * 4) + col))
                              || _.contains(foundPairs, cardLet))} 
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

function ClearArray(array) {
    while (array.length != 0) {
        array.pop();
    }
    return array;
}
