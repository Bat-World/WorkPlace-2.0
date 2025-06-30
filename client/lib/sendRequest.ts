import axios from "axios"

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"

console.log('Backend URL:', baseURL);

export const sendRequest = axios.create({ baseURL })