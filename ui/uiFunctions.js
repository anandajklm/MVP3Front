import categoryObject from "../data/categoryObject.js";

import {
  postItem,
  deleteItem,
  updateItem,
  getList,
  coinTypeElement,
  coinValueHigh,
  coinValueLow,

} from "../api/apiRequests.js";

import {
  removeClassFromTableHeader,
  getTextContent,
  getIntegerTextContent,
  getIfCheckboxChecked,
  getEmojiTextContent,
} from "../utils/functionUtils.js";

import { table, tableHeaders, itemCountsElement } from "./uiVariables.js";

let ascendingSortedObject = {};

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (itemName, value, quantity,  date,  is_done = false, id) => {
  let coinValueHigh, coinValueLow;

  switch (coin_id) {
    case 1:
      coinValueHigh = 1;
      coinValueLow = 1;
      break;
    case 2:
      coinValueHigh = usdHigh;
      coinValueLow = usdLow;
      break;
    case 3:
      coinValueHigh = eurHigh;
      coinValueLow = eurLow;
      break;
    case 4:
      coinValueHigh = btcHigh;
      coinValueLow = btcLow;
      break;
    default:
      coinValueHigh = "N/A";
      coinValueLow = "N/A";
  }

  let item = [
    itemName,
    value,
    quantity,
    date,
    `${coinValueHigh} / ${coinValueLow}`, // Nova coluna com valores de moedas
    is_done,
  ];
  let row = table.insertRow();

  row.setAttribute("data-row-id", id);

  for (let i = 0; i < item.length; i++) {
    let cell = row.insertCell(i);
    if (i === item.length - 1 && typeof item[i] === "boolean") {
      let checkbox = document.createElement("Name");
      checkbox.type = "checkbox";
      checkbox.checked = item[i];

      //Esse title será usado para ordenar os checkbox
      checkbox.title = item[i] ? "Checked" : "Unchecked";

      cell.appendChild(checkbox);
    } else {
      cell.textContent = item[i];
    }
  }
  insertButton(row.insertCell(-1));

  document.getElementById("newName").value = "";
  document.getElementById("newValue").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newDate").value = "";

};

/*
    --------------------------------------------------------------------------------------
    Função para remover um item da lista de acordo com o click no botão close
    --------------------------------------------------------------------------------------
  */

const deleteRow = (event) => {
  if (event.target.classList.contains("close")) {
    let tableRow = event.target.parentElement.parentElement;
    const id = tableRow.getAttribute("data-row-id");
    tableRow.remove();
    deleteItem(id);
  }
};

/*
  --------------------------------------------------------------------------------------
  Função para alterar um item da lista de acordo com o click no checkbox
  --------------------------------------------------------------------------------------
*/

function updateElement(event) {
  {
    if (event.target.type === "checkbox") {
      let checkbox = event.target;
      let tr = checkbox.closest("tr");
      let rowId = tr.getAttribute("data-row-id");

      updateItem(checkbox.checked, rowId);
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let button = document.createElement("button");
  let txt = document.createTextNode("\u00D7");
  button.className = "close";
  button.appendChild(txt);
  parent.appendChild(button);
};

/*
  --------------------------------------------------------------------------------------
  Função para remover todos os items da lista
  --------------------------------------------------------------------------------------
*/
const removeAllElements = () => {
  const elementsToRemove = table.querySelectorAll("tr[data-row-id]");
  elementsToRemove.forEach((element) => {
    element.remove();
  });
};

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputItem = document.getElementById("newName").value;
  let inputValue = document.getElementById("newValue").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputDate = document.getElementById("newDate").value;

  if (inputItem === "") {
    alert("Escreva o nome da ação!");
  } else if (isNaN(inputValue)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputItem, inputValue, inputQuantity, inputDate);
    postItem(inputItem, inputValue,inputQuantity, inputDate);
  }
};

/*
--------------------------------------------------------------------------------------
  Função para atualizar a contagem dos itens.
  --------------------------------------------------------------------------------------
*/

function updateItemCount() {
  const percentageCoinDictionary = getPercentageDone();
  const percentage = Math.round(
    (percentageCoinDictionary.checkedItems /
      percentageCoinDictionary.totalItems) *
      100
  );

  const itemCountText =
    percentage === 100
      ? `Você já realizou todas as operações?`
      : percentageDoneDictionary.totalItems
      ? `Você tem ${percentageDoneDictionary.totalItems} ações na sua lista, e você já realizou ${percentageDoneDictionary.checkedItems} (${percentage}%)`
      : `Realize as Operações!`;

  itemCountsElement.textContent = itemCountText;
}

/*
  --------------------------------------------------------------------------------------
  Função que atualiza o value do droplist de tipo de coin e armazena seu valor no localStorage.
  --------------------------------------------------------------------------------------
*/

function setCoinType() {
  const storedCoinType = localStorage.getItem("typeOfCoinId");

  coinTypeElement.value = storedCoinType ? storedCoinType : "1";

  if (!storedCoinType) {
    localStorage.setItem("typeOfCoinId", coinTypeElement.value);
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para atualizar a tabela ao mudar o tipo da moeda.
  --------------------------------------------------------------------------------------
*/

function onChangeCoinType() {
  // Update the typeOfCoin variable when the selection changes
  removeAllElements();
  getList();
  removeClassFromTableHeader(tableHeaders);
  localStorage.setItem("typeOfCoinlId", coinTypeElement.value);
}



/*
    --------------------------------------------------------------------------------------
    Função para adicionar Event Handlers para ordenar a tabela quando clicado
    --------------------------------------------------------------------------------------
*/

function initializeTableHeaderSorting() {
  for (let columnIndex = 0; columnIndex < tableHeaders.length; columnIndex++) {
    let tableColumn = tableHeaders[columnIndex];
    let tableColumnType = tableColumn.getAttribute("column-type");
    if (!tableColumnType) {
      continue;
    }
    tableColumn.addEventListener(
      "click",
      createSortHandler(columnIndex, tableColumnType)
    );
  }
}

/*
    --------------------------------------------------------------------------------------
    Função para adicionar a classe nos headers que serão ordenados e chamar a função que ordena
    --------------------------------------------------------------------------------------
*/

function createSortHandler(columnIndex, tableColumnType) {
  return function () {
    sortTable(columnIndex, tableColumnType);
    ascendingSortedObject[columnIndex] = !ascendingSortedObject[columnIndex];

    const headersArray = Array.from(tableHeaders);

    headersArray.forEach((th) => {
      th.classList.remove("th-sort-asc", "th-sort-desc");
    });

    tableHeaders[columnIndex].classList.toggle(
      "th-sort-asc",
      !ascendingSortedObject[columnIndex]
    );
    tableHeaders[columnIndex].classList.toggle(
      "th-sort-desc",
      ascendingSortedObject[columnIndex]
    );
  };
}

/*
    --------------------------------------------------------------------------------------
    Função para ordenar a tabela de acordo com o tipo da coluna
    --------------------------------------------------------------------------------------
*/
function sortTable(columnIndex, tableColumnType) {
  let rows, switching, i, x, y, shouldSwitch;
  switching = true;

  let dataTransformFunction;

  if (tableColumnType === "string") {
    dataTransformFunction = getTextContent;
  }

  if (tableColumnType === "emoji-string") {
    dataTransformFunction = getEmojiTextContent;
  }

  if (tableColumnType === "integer") {
    dataTransformFunction = getIntegerTextContent;
  }

  if (tableColumnType === "checkbox") {
    dataTransformFunction = getIfCheckboxChecked;
  }

  while (switching) {
    switching = false;
    rows = table.rows;

    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      const xValue = dataTransformFunction(
        rows[i].getElementsByTagName("td")[columnIndex]
      );
      const yValue = dataTransformFunction(
        rows[i + 1].getElementsByTagName("td")[columnIndex]
      );

      if (ascendingSortedObject[columnIndex]) {
        if (xValue > yValue) {
          shouldSwitch = true;
          break;
        }
      } else if (!ascendingSortedObject[columnIndex]) {
        if (xValue < yValue) {
          shouldSwitch = true;
          break;
        }
      }
    }

    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

export {
  insertList,
  updateElement,
  insertButton,
  removeAllElements,
  sortTable,
  deleteRow,
  newItem,
  onChangeCoinType,
  updateItemCount,
  initializeTableHeaderSorting,
  setCoinType,
};
