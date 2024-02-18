type DialogButtonType = "Yes" | "No";
interface FormButton {
  type: "Add" | "Remove" | "Buy";
}
// задача 1:
// создайте тип AnyButtonType, который описывает все вариации кнопок
type AnyButtonType = FormButton["type"] | DialogButtonType; // только без копипасты литералов, пожалуйста

let addButton: AnyButtonType = "Add";
let yesButton: AnyButtonType = "Yes";

// задача 2:
// создайте тип ConfirmationHandlingFormButton
// т.е. подтип формовых кнопок, которые ещё содержат поле onConfirm, в котором
// может лежать функция, которая вызывается с параметром типа DialogButtonType
// (и ничего не возвращает)
// Т.е. предполагается что у кнопки такого типа, если поле onConfirm пустое,
// то при нажатии на эту кнопку сразу происходит действие
// а иначе вызывается диалог Подтверждения, и результат нажатия на кнопку Да или Нет
// в итоге попадет в функцию onConfirm, которая уже дальше решит что делать
type ConfirmationHandlingFormButton = FormButton & {
  onConfirm?: (firstParameter: DialogButtonType) => void;
};

let buttonAdd: ConfirmationHandlingFormButton = {
  type: "Add",
  onConfirm(addButton) {
    console.log("You would like to add this form?");
  },
};

let buttonRemove: ConfirmationHandlingFormButton = {
  type: "Remove",
};
