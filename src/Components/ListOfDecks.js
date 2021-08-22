import React from "react";
import { Link } from "react-router-dom";

// create, study, view, or delete a deck

function Home({ decks, deleteDeck }) {
  return (
    <div>
      <div>
        <Link>Create New</Link>
        <Link>View</Link>
        <Link>Study</Link>
        <button onClick={() => deleteDeck(deck.id)}>Delete</button>
      </div>
    </div>
  );
}

export default Home;
