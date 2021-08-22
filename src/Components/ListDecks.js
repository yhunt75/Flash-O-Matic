import React from "react";
import { Link } from "react-router-dom";

// create, study, view, or delete a deck

function ListDecks({ decks, deleteDeck }) {
  const list = decks.map((deck, index) => {
    return (
      <div>
        <div>
          <h2>{deck.name}</h2>
          <p>{deck.cards.length} Cards</p>
        </div>
        <p>{deck.description}</p>
        <div>
          <Link to={`/decks/${deck.id}`}>View</Link>
          <Link to={`/decks/${deck.id}/study`}>Study</Link>
          <button onClick={() => deleteDeck(deck.id)}>Delete</button>
        </div>
      </div>
    );
  });
  return (
    <div>
      <div>
        <Link to="/decks/new">Create New</Link>
      </div>
      <div>{list}</div>
    </div>
  );
}

export default ListDecks;
