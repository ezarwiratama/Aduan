import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Simpan token di localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Ambil token dari localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set header otorisasi
API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.error("Token tidak ditemukan, silakan login.");
    // Mungkin arahkan pengguna ke halaman login di sini
  }
  return config;
}, (error) => Promise.reject(error));


// GET
export const fetchMessages = () => API.get("/messages");
export const fetchContacts = () => API.get("/contacts");
export const fetchUsers = () => API.get("/users");


// POST
export const loginUser = async (credentials) => {
  try {
    const response = await API.post('/api/login', credentials);
    const token = response.data.token;
    if (token) {
      console.log("TOKEN", token);
      setToken(token);
      await fetchUserData();
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const fetchUserData = async () => {
  try {
    const response = await API.get('/api/user');
    const users = response.data;
    console.log('User data:', users);

    // Ambil username dari token yang disimpan (dengan asumsi Anda menyimpannya di payload token)
    const token = getToken();
    const { username } = parseJwt(token);
    console.log("USERNAME", username)

    // Temukan pengguna yang sesuai dengan username
    const currentUser = users.find(user => user.username === username);
    console.log("CURENT USER", currentUser)

    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      console.log("USER MASUK", JSON.stringify(currentUser))
    }

    return users;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// Fungsi untuk mengekstrak payload dari JWT (token)
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
};


export const signupUser = (credentials) => {
  return API.post('/api/signup', credentials);
};

export const newContact = (name, no_handphone, bidang) =>
  API.post("/contacts", { name, no_handphone, bidang });

export const sendMessages = (phoneNumber , message, data) =>
  API.post("/send-message", { phoneNumber , message, data});

// PUT
export const updateMessageStatus = (id, status, pic, no_pic) =>
  API.put(`/messages/${id}`, { status, pic, no_pic });

export const updateReplyMessage = (id, status, reply_message, reply_time) =>
  API.put(`/message/${id}`, { status,  reply_message, reply_time});

export const updateContact = (id, name, no_handphone, bidang) =>
  API.put(`/contacts/${id}`, { name, no_handphone, bidang });

export const updateUser = (id) =>
  API.put(`/users/${id}`, {});
  
// DELETE
export const deleteMessage = (id) => API.delete(`/messages/${id}`);
export const deleteContact = (id) => API.delete(`/contacts/${id}`);
export const deleteUser = (id) => API.delete(`/users/${id}`);