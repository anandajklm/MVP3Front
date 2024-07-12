import { insertList, updateItemCount } from "../ui/uiFunctions.js";
import { coinTypeElement } from "../ui/uiVariables.js";
import apiBaseURL from "./apiBaseURL.js";

/*
  --------------------------------------------------------------------------------------
  GET REQUEST: Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = `${apiBaseURL}/item`; 
  fetch(url, {
    method: "get",
    
  })
    .then((response) => response.json())
    .then((data) => {
      data.items.forEach((item) => {
        insertList(
          item.name,
          item.value,
          item.quantity,
          item.date,
          item.is_done,
          item.id
        );
      });
      updateItemCount();
    })

    .catch((error) => {
      console.error("Error:", error);
    });
};


/*
  --------------------------------------------------------------------------------------
  GET REQUEST: Função busca valores das moedas em API Externa
  --------------------------------------------------------------------------------------
*/

const fetchExchangeRates = async () => {
  const apiURL = "https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL";
  try {
    const response = await fetch(apiURL, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    const usdHigh = data.USDBRL.high;
    const usdLow = data.USDBRL.low;

    const eurHigh = data.EURBRL.high;
    const eurLow = data.EURBRL.low;

    const btcHigh = data.BTCBRL.high;
    const btcLow = data.BTCBRL.low;

    console.log("USD High:", usdHigh, "USD Low:", usdLow);
    console.log("EUR High:", eurHigh, "EUR Low:", eurLow);
    console.log("BTC High:", btcHigh, "BTC Low:", btcLow);

    // Use essas variáveis conforme necessário em seu código
  } catch (error) {
    console.error("Error:", error);
  }
};

// Chame a função para buscar e armazenar os valores
fetchExchangeRates();


/*
  --------------------------------------------------------------------------------------
  POST REQUEST: Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/

const postItem = async (inputName, inputValue, inputQuantity, inputDate) => {
  let typeOfCoinId = coinTypeElement.value;
  const itemData = {
    name: inputName,
    value: inputValue,
    quantity:inputQuantity,
    date:inputDate,
    is_done: false,
    coin_id: typeOfCoinId, 
  };

  const jsonData = JSON.stringify(itemData);

  let url = `${apiBaseURL}/item`;
  fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};  




/*
  --------------------------------------------------------------------------------------
  PUT REQUEST: Função para modificar um item na lista do servidor via requisição PUT
  --------------------------------------------------------------------------------------
*/
const updateItem = async (is_done, item_id) => {
  const itemData = { is_done: is_done };
  // Convert the object to a JSON string
  const jsonData = JSON.stringify(itemData);

  let url = `${apiBaseURL}/item/${item_id}`;
  fetch(url, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};
/*
  --------------------------------------------------------------------------------------
  DELETE REQUEST: Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (itemId) => {
  let url = `${apiBaseURL}/item/${itemId}`;
  fetch(url, {
    method: "delete",
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error:", error);
    });
};

export { getList, postItem, updateItem, deleteItem, coinTypeElement };
