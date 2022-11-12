import { useEffect, useState } from "react";
import { useUser } from "../contexts/CurrentUserContext";
import Api from "../utils/Api";
import Card from "./Card";

function Main(props) {
  const [cards, setCards] = useState([]);
  const [currentUser] = useUser();

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    Api.setLikeStatus(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => console.error(err.message));
  }

  function handleCardDelete(card) {
    Api.removeCard(card._id)
      .then(() => {
        const newCards = cards.filter((c) => c._id !== card._id);
        setCards(newCards);
      })
      .catch((err) => console.error(err.message));
  }

  useEffect(() => {
    Api.getCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch((err) => console.error(err.message));
  }, []);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar" onClick={props.onEditAvatar}>
          <img
            className="profile__avatar-image"
            src={currentUser?.avatar}
            alt="Аватар"
          />
        </div>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser?.name}</h1>
          <button
            type="button"
            className="profile__edit-btn"
            onClick={props.onEditProfile}
          ></button>
          <p className="profile__about">{currentUser?.about}</p>
        </div>
        <button
          type="button"
          className="profile__add-btn"
          onClick={props.onAddPlace}
        ></button>
      </section>
      <section aria-label="Места" className="places">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={props.onCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
