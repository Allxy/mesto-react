import { memo, useEffect } from "react";
import useForm from "../../hooks/useForm";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ onClose, isOpen, onSubmit }) {
  const { values, errors, isValid, onChange, resetForm } = useForm({
    name: "",
    link: "",
  });

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  function handleSubmit() {
    return onSubmit(values)
  }

  const inputErrorClass = (error) =>
    "popup__input-error" + (error ? " popup__input-error_active" : "");

  return (
    <PopupWithForm
      onClose={onClose}
      isOpen={isOpen}
      name="addcard"
      title="Новое место"
      onSubmit={handleSubmit}
      isValid={isValid}
    >
      <input
        className="popup__input popup__input_type_name"
        placeholder="Название"
        type="text"
        name="name"
        required
        minLength="2"
        maxLength="30"
        autoComplete="off"
        id="add-name-input"
        value={values.name}
        onChange={onChange}
      />
      <span className={inputErrorClass(errors.name)} id="add-name-input-error">
        {errors.name}
      </span>
      <input
        className="popup__input popup__input_type_link"
        placeholder="Ссылка на картинку"
        type="url"
        name="link"
        required
        autoComplete="off"
        id="add-link-input"
        value={values.link}
        onChange={onChange}
      />
      <span className={inputErrorClass(errors.link)} id="add-link-input-error">
        {errors.link}
      </span>
    </PopupWithForm>
  );
}

export default memo(AddPlacePopup);
