export const createNewButton = (text) => {
    const button = document.createElement("button");
    button.className = "item";
    const createText = document.createTextNode(text);
    button.appendChild(createText);
    parameters.appendChild(button);
    colorMenu.insertAdjacentElement("beforebegin", button);
    return button;
  };
  