import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { readDeck } from "../utils/api";
import ErrorMessage from "../Layout/ErrorMessage";

export const Study = () => {
  // initialize state
  const { deckId } = useParams();
  const [deck, setDeck] = useState({ cards: [] });
  const [error, setError] = useState(undefined);
  const [flipped, setFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  // adds the ability to perform side effects from a function component. a side effect is anything in a React component that affects something outside the scope of the function.
  useEffect(() => {
    //The AbortController interface represents a controller object that allows you to abort one or more Web requests as and when desired.
    // see https://developer.mozilla.org/en-US/docs/Web/API/AbortController
    const abortController = new AbortController(); // create a controller
    //retriev deck
    async function getDeck() {
      try {
        let data = await readDeck(deckId, abortController.signal); // grab a reference to its associated AbortSignal object using abortController.signal. associates the signal and controller with the fetch request
        setDeck(data); //set deck to retrieved data
      } catch (err) {
        // handle error
        setError(err);
      }
    }
    getDeck(); // call to function that retrieves deck
    return () => abortController.abort(); // abort the fetch request
  }, [deckId]); // get deck once

  if (error) {
    // handle error
    return <ErrorMessage error={error} />;
  }

  function nextCard() {
    // check number of cards in deck
    if (cardIndex === deck.cards.length - 1) {
      const result = window.confirm("Do you want to restart the deck?"); // confirm user wants to reshuffle deck
      if (result) {
        // reset deck
        setCardIndex(0);
      }
    } else {
      // add 1 to deck
      setCardIndex(cardIndex + 1);
    }
    setFlipped((prevState) => !prevState); // flip card over
  }

  function flipCard() {
    // flip card over
    setFlipped((prevState) => !prevState);
  }

  if (deck) {
    return (
      <>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">
                <span className="oi oi-home" /> Home
              </a>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              <a href={`/decks/${deck.id}`}>{deck.name}</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Study
            </li>
          </ol>
        </nav>
        <h2>Now Studying: {deck.name}</h2>
        {deck.cards.length > 2 ? (
          <div className="card shadow my-4 col-10">
            <div className="card-body">
              <h2
                className="jumbotron bg-info text-center"
                style={{ height: "20rem" }}
              >
                {!flipped
                  ? `${deck.cards[cardIndex].front}`
                  : `${deck.cards[cardIndex].back}`}
              </h2>
              <small>
                Card {cardIndex + 1} of {deck.cards.length}
              </small>
            </div>
            <div className="card-footer bg-transparent d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={flipCard}>
                <span className="oi oi-action-redo" /> Flip
              </button>
              {flipped && (
                <button className="btn btn-primary" onClick={nextCard}>
                  <span className="oi oi-arrow-thick-right" /> Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="card shadow mt-4">
              <h3 className="card-header">Not enough cards.</h3>
              <div className="card-body">
                <p className="card-text">
                  You need at least 3 cards to study. There are{" "}
                  {deck.cards.length} cards in this deck.
                </p>
              </div>

              <div className="card-footer bg-transparent">
                <Link
                  to={`/decks/${deck.id}/cards/new`}
                  className="btn btn-primary"
                >
                  <span className="oi oi-plus" /> Add Cards
                </Link>
              </div>
            </div>
          </>
        )}
      </>
    );
  }
};
export default Study;
