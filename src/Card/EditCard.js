import React, { useEffect, useState } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import { updateCard, readCard, readDeck } from "../utils/api";
import ErrorMessage from "../Layout/ErrorMessage";
import CardForm from "./CardForm";

function EditCard() {
  // initialize
  const { deckId, cardId } = useParams();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(undefined);
  const [deck, setDeck] = useState({});
  const history = useHistory();

  // read card + deck and set state for both
  useEffect(() => {
    readCard(cardId).then(setFormData);
    readDeck(deckId).then(setDeck);
  }, [cardId, deckId]);

  // change handler
  const handleChange = ({ target }) => {
    const value = target.value;
    // set form data
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  // reset deck
  const handleReset = (event) => {
    readCard(cardId).then(setFormData);
  };

  //submit handler
  const handleSubmit = (event) => {
    event.preventDefault(); // prevent default behavior
    const abortController = new AbortController(); // see notes in other js on controller
    updateCard(formData, abortController.signal) // updating card and grab a reference to the controller signal
      .then(history.push(`/decks/${deckId}`)) // navigate to the corresponding deck
      .catch(setError); // error handler

    if (error) {
      // if error exists, then execute ErrorMessage.js
      return <ErrorMessage error={error} />;
    }
  };

  // if form data and deck exist, then display breadcrumb (home/edit card), and edit card form
  if (formData && deck) {
    return (
      <>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/">
                <span className="oi oi-home" /> Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/decks/${deckId}`}>{deck.name}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Edit Card {`${cardId}`}
            </li>
          </ol>
        </nav>
        <h1>Edit Card</h1>
        <CardForm
          formData={formData}
          handleChange={handleChange}
          handleReset={handleReset}
          handleSubmit={handleSubmit}
        />
      </>
    );
  }
}

export default EditCard;
