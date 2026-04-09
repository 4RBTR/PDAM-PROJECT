import Cookies from "js-cookie";

// --- 1. KONFIGURASI KEY ---
const TOKEN_KEY = "token";
const ROLE_KEY = "role";
const ID_KEY = "userId";  // ✅ Tambahan baru
const NAME_KEY = "name";  // ✅ Tambahan baru

const cookieOptions = {
    expires: 1, // Expire 1 hari
};

// --- 2. SETTERS (Dipakai saat LOGIN) ---
// Kita pisah atau gabung fungsinya agar fleksibel
export const setAuthData = (token: string, role: string, id: string, name: string) => {
    Cookies.set(TOKEN_KEY, token, cookieOptions);
    Cookies.set(ROLE_KEY, role, cookieOptions);
    Cookies.set(ID_KEY, id, cookieOptions);     // ✅ Simpan ID
    Cookies.set(NAME_KEY, name, cookieOptions); // ✅ Simpan Nama
};

// --- 3. GETTERS (Dipakai di DASHBOARD / PROTEKSI) ---
export const getAuthToken = () => {
    return Cookies.get(TOKEN_KEY);
};

export const getUserRole = () => {
    return Cookies.get(ROLE_KEY);
};

// 👇 Fungsi ini yang dicari oleh Dashboard tapi belum ada di file lama
export const getUserId = () => {
    return Cookies.get(ID_KEY);
};

export const getUserName = () => {
    return Cookies.get(NAME_KEY);
};

// --- 4. REMOVERS (Dipakai saat LOGOUT) ---
// Kita namakan 'removeAuthToken' agar cocok dengan import di Dashboard
export const removeAuthToken = () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(ROLE_KEY);
    Cookies.remove(ID_KEY);
    Cookies.remove(NAME_KEY);
};