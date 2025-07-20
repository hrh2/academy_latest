import {jwtDecode} from "jwt-decode";
import axios from "axios";


export async function fetchData(url, token) {
    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { data: response.data, message: response.data.message };
    } catch (error) {
        let errorMessage = "Server is down";

        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return { error: errorMessage, data: -1 };
    }
}

export async function sendData(url,data,token) {
    try {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        const response = await axios.post(url,data);
        return {data:response.data,message:response.data.message};
    } catch (error) {
        let errorMessage = "Server is down";

        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return { error: errorMessage, data: -1 };
    }
}

export async function updateData(url,data,token) {
    try {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        const response = await axios.put(url,data);
        return {data:response.data,message:response.data.message};
    } catch (error) {
        let errorMessage = "Server is down";

        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return { error: errorMessage, data: -1 };
    }
}

export async function deleteData(url,data,token) {
    try {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        const response = await axios.delete(url);

        return {data:response.data,message:response.data.message};
    } catch (error) {
        let errorMessage = "Server is down";

        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return { error: errorMessage, data: -1 };
    }
}


export async function patchData(url,data,token) {
    try {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
        const response = await axios.patch(url);

        return {data:response.data,message:response.data.message};
    } catch (error) {
        let errorMessage = "Server is down";

        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return { error: errorMessage, data: -1 };
    }
}

export function handleLogout(tokenName=null,pathName){
    localStorage.removeItem(tokenName||'buu_client_token');
    window.location = pathName||"/";
}
export function returnToken(tokenName){
    return  localStorage.getItem(tokenName||'buu_client_token');
}

export function setToken(token){
    localStorage.setItem('buu_client_token',token);
}

export const decodeToken =() => {
    const token = returnToken();
    if (!token) {
        return null;
    }
    try {
        const decoded = jwtDecode(token);
        const { firstName, lastName, ...otherProperties } = decoded;
        return { firstName, lastName, ...otherProperties };
    } catch (error) {
        return null;
    }
};

export  function combineFirstChars(sentence) {
    // Split the sentence into words
    const words = sentence.split(' ');

    // Map each word to its first character and join them
    const initials = words.map(word => word[0]).join('');

    // Capitalize the result and return
    return initials.toUpperCase();
}

const awesomeSentences = [
    "You did a fantastic job!",
    "Well done on completing this topic!",
    "Amazing effort!",
    "Great job, keep it up!",
    "Outstanding work!",
    "Superb performance!",
    "Excellent progress!",
    "Impressive achievement!",
    "Bravo, you nailed it!",
    "Terrific, you did it!",
    "You're incredible, well done!",
    "Stellar work, keep shining!",
    "Keep it up, you're doing great!",
    "You're a star, fantastic effort!",
    "Marvelous job!",
    "Way to go, you rock!",
    "Spectacular finish!",
    "Exceptional work, keep going!",
    "You nailed it, awesome job!",
    "Phenomenal achievement!"
];

export const getRandomAwesomeSentence = () => {
    const randomIndex = Math.floor(Math.random() * awesomeSentences.length);
    return awesomeSentences[randomIndex];
};


export  function containsKeyWord(text, keyword) {
    if (typeof text !== "string"||typeof keyword !== "string") {
        throw new Error("The input must be a string");
    }
    return text.toLowerCase().includes(keyword);
}

export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}