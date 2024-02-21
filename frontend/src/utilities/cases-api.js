import sendRequest from "./send-request";
const BASE_URL = process.env.REACT_APP_BASE_URL;

export async function index() {
  return sendRequest(`${BASE_URL}/cases`, "GET")
}

export async function create(data) {
  return sendRequest(`${BASE_URL}/cases`, "POST", data)
}


export async function getMostRecentCase() {
  return sendRequest(`${BASE_URL}/cases/most-recent`, "GET")
}

export async function detail(id) {
  return sendRequest(`${BASE_URL}/cases/${id}`, "GET")
}

export async function destroy(id) {
  return sendRequest(`${BASE_URL}/cases/${id}`, "DELETE")
}

export async function update(id, data) {
  return sendRequest(`${BASE_URL}/cases/${id}`, "PUT", data)
}

export async function sendResponse(id, data) {
  return sendRequest(`${BASE_URL}/cases/${id}/response`, "POST", data)
}

export async function chatOpenAI(id, data) {
  // console.log(id, data)
  // console.log("utilities")
  return sendRequest(`${BASE_URL}/cases/${id}/chat-open-ai`, "POST", data)
}