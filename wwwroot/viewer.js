/// import * as Autodesk from "@types/forge-viewer";
// import * as THREE from 'three';
const colorMenu = document.getElementById("colorMenu");
const parameters = document.querySelector(".parameters");

async function getAccessToken(callback) {
  try {
    const resp = await fetch("/api/auth/token");
    if (!resp.ok) {
      throw new Error(await resp.text());
    }
    const { access_token, expires_in } = await resp.json();
    callback(access_token, expires_in);
  } catch (err) {
    alert("Could not obtain access token. See the console for more details.");
    console.error(err);
  }
}

//creates new instance of the viewer in specified DOM container
export function initViewer(container) {
  //a promise is async and non blocking
  return new Promise(function (resolve, reject) {
    Autodesk.Viewing.Initializer({ getAccessToken }, function () {
      const config = {
        extensions: ["Autodesk.DocumentBrowser"],
      };
      const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
      viewer.start();
      viewer.setTheme("light-theme");
      resolve(viewer);

      //create button function
      const createNewButton = (text) => {
        const button = document.createElement("button");
        button.className = "item";
        const createText = document.createTextNode(text);
        button.appendChild(createText);
        parameters.appendChild(button);
        colorMenu.insertAdjacentElement("beforebegin", button);
        return button;
      };

      //create function that creates the new button in the DOM and adds the text as a parameter
      //includes a boolean as a parameter for the toggle feature
      //add a parameter to add the event listener
      const setBackgroundRed = () => {
        viewer.setBackgroundColor(0xff0000);
      };

      const setBackgroundGrey = () => {
        viewer.setBackgroundColor(0, 0, 0, 210, 210, 210);
      };

      const viewerSelect = () => {
        viewer.select([1]);
      };
      const viewerClearSelection = () => {
        viewer.clearSelection([1]);
      };

      const setGroundShadow = () => {
        viewer.setGroundShadow(true);
      };
      const turnGroundShadowOff = () => {
        viewer.setGroundShadow(false);
      };

      const setGroundReflectionOn = () => {
        viewer.setGroundReflection(true);
      };
      const setGroundReflectionOff = () => {
        viewer.setGroundReflection(false);
      };

      let booleanValue = false;
      const createUIButtons = (
        buttonText,
        viewerFunction,
        viewerFunction2,
        newButtonText
      ) => {
        const button = createNewButton(buttonText);
        button.addEventListener("click", () => {
          if (!booleanValue) {
            viewerFunction();
            button.textContent = newButtonText;
            booleanValue = true;
          } else {
            viewerFunction2();
            button.textContent = buttonText;
            booleanValue = false;
          }
        });
      };
      createUIButtons(
        "Change Background Color To Red",
        setBackgroundRed,
        setBackgroundGrey,
        "Change Background Color to Grey"
      );

      createUIButtons(
        "Select Body",
        viewerSelect,
        viewerClearSelection,
        "Clear Selection"
      );
      createUIButtons(
        "Turn Ground Shadow On",
        setGroundShadow,
        turnGroundShadowOff,
        "Turn Ground Shadow Off"
      );
      createUIButtons(
        "Turn Ground Reflection On",
        setGroundReflectionOn,
        setGroundReflectionOff,
        "Turn Ground Reflection Off"
      );

      const buttons = [
        {
          buttonName: "Set Ground Shadow Color to Red",
          buttonFunction: () => {
            viewer.setGroundShadowColor(new THREE.Color(0xff0000));
          },
        },

        {
          buttonName: "Reset Window",
          buttonFunction: () => {
            location.reload();
          },
        },
      ];

      //claw wrench buttons

      const createButtons = buttons.map((button, idx) => {
        const createButton = document.createElement("button");
        createButton.className = "item";
        const text = document.createTextNode(button.buttonName);
        createButton.appendChild(text);
        parameters.appendChild(createButton);
        colorMenu.insertAdjacentElement("beforebegin", createButton);
        createButton.addEventListener("click", button.buttonFunction);
        return createButton;
      });

      //dropdown menu Code
      const selectOptions = [
        {
          text: " ",
          color: null,
        },
        {
          text: "Grey",
          color: new THREE.Vector4(0.5, 0.5, 0.5, 1),
        },
        {
          text: "Dark Red",
          color: new THREE.Vector4(1, 0, 0, 0.3),
        },
        {
          text: "Silver",
          color: new THREE.Vector4(1, 1, 1, 1),
        },
        {
          text: "Yellow",
          color: new THREE.Vector4(128, 128, 0, 1),
        },
      ];

      //function to create dropdown
      const createDropdownMenu = (text) => {
        const newDropdown = document.createElement("select");
        newDropdown.className = "dropdown";
        const label = document.createElement("label");
        label.className = "label";
        label.textContent = text;
        parameters.appendChild(label);
        parameters.appendChild(newDropdown);
        return newDropdown;
      };

      //function to create options in dropdown menu
      const createOptions = (optionObject, dropdownMenu) => {
        optionObject.map((option, idx) => {
          const newOption = document.createElement("option");
          newOption.innerHTML = option.text;
          dropdownMenu.appendChild(newOption);
        });
      };

      //addEventListener function
      const addEventListenerFunction = (dropDownMenu, optionMenu, dbId) => {
        dropDownMenu.addEventListener("change", () => {
          const selectedColor = dropDownMenu.value;
          const colorObject = optionMenu.find((color) => {
            return selectedColor === color.text;
          });
          if (colorObject) {
            viewer.setThemingColor(dbId, colorObject.color);
          }
        });
      };

      //create menu for Moleteado
      const changeColorOfMoleteado = createDropdownMenu(
        "Change Color of Moleteado"
      );

      //create options for Moleteado
      createOptions(selectOptions, changeColorOfMoleteado);

      //add eventlistener to moleteado
      addEventListenerFunction(changeColorOfMoleteado, selectOptions, 10);

      //change color of middle part
      const changeColorOfMiddlePart = createDropdownMenu(
        "Change Color Of Middle Part"
      );
      //create options for Middle Part
      createOptions(selectOptions, changeColorOfMiddlePart);

      //add event listener to middle part
      addEventListenerFunction(changeColorOfMiddlePart, selectOptions, 4);
    });
  });
}

//loads a specific model into the viewer
export function loadModel(viewer, urn) {
  return new Promise(function (resolve, reject) {
    function onDocumentLoadSuccess(doc) {
      //to return data from a promise, you pass it into resolve
      resolve(viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()));
    }
    function onDocumentLoadFailure(code, message, errors) {
      reject({ code, message, errors });
    }
    viewer.setLightPreset(0);
    Autodesk.Viewing.Document.load(
      "urn:" + urn,
      onDocumentLoadSuccess,
      onDocumentLoadFailure
    );
  });
}
