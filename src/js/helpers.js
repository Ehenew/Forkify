import { TIMEOUT_SEC } from './config.js';

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${ sec } second`));
    }, sec * 1000);
  });
};

// Refactoring the two functions - getJSON and sendJSON which are almost the same and that violates the DRY principle of coding

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData ? fetch(url, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    }) : fetch(url);

    const response = await Promise.race([ fetchPromise, timeout(TIMEOUT_SEC) ]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${ data.message } (${ data.status })`);
    return data;
  } catch (err) {
    throw err;
  }
};


/*
export const getJSON = async function (url) {
  try {
    // const response = await fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');
    const fetchPromise = fetch(url);
    const response = await Promise.race([ fetchPromise, timeout(TIMEOUT_SEC) ]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${ data.message } (${ data.status })`);
    return data;
  } catch (err) {
    throw err; // rethrowing the error so that it can propagate to the model.js 
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    });

    const response = await Promise.race([ fetchPromise, timeout(TIMEOUT_SEC) ]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${ data.message } (${ data.status })`);
    return data;
  } catch (err) {
    throw err; // rethrowing the error so that it can propagate to the model.js 
  }
};
*/