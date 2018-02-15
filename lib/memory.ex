defmodule Card do
  defstruct letter: 'A', flipped: false
end


defmodule Memory.Game do
  def new_game() do
    %{
      cards: gen_cards(),
      foundPairs: [],
      guesses: [],
      clicks: 0,
    }      
  end

  def client_view(game) do
    %{
      cards: game.cards,
      foundPairs: game.foundPairs,
      guesses: game.guesses,
      clicks: game.clicks,
    }
  end 

  def click(game, index) do
    guess_len = Enum.count(game.guesses)
    if guess_len == 2 do
      #do nothing, already clicked 2 cards
    else
      card_flipped = Enum.at(game.cards, index)
                     |> flip_card()
      %{
        cards: game.cards,
        foundPairs: game.foundPairs,
        guesses: List.insert_at(game.guesses, 0, index),
        clicks: game.clicks + 1,
      }
    end
  end

  def check_for_pairs(game) do
    guess1 = Enum.at(game.guesses, 0).letter
    guess2 = Enum.at(game.guesses, 1).letter
    if guess1 == guess2 do
      %{
        cards: game.cards,
        foundPairs: List.insert_at(game.foundPairs, 0, guess1)
      }
    end
  end

  def flip_card(card) do
    %{
      letter: card.letter,
      flipped: true,
    }
  end

  defp gen_cards() do
    [ %Card {letter: "A", flipped: false},
      %Card {letter: "A", flipped: false},
      %Card {letter: "B", flipped: false},
      %Card {letter: "B", flipped: false},
      %Card {letter: "C", flipped: false},
      %Card {letter: "C", flipped: false},
      %Card {letter: "D", flipped: false},
      %Card {letter: "D", flipped: false},
      %Card {letter: "E", flipped: false},
      %Card {letter: "E", flipped: false},
      %Card {letter: "F", flipped: false},
      %Card {letter: "F", flipped: false},
      %Card {letter: "G", flipped: false},
      %Card {letter: "G", flipped: false},
      %Card {letter: "H", flipped: false},
      %Card {letter: "H", flipped: false}
    ]
  end
end
