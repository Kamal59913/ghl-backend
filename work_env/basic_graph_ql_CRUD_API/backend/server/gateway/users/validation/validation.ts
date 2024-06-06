// validation.js
export const validateUsername = (username) => {
    const noSpacesOrSpecialChars = /^[a-zA-Z0-9]*$/;
    if (!noSpacesOrSpecialChars.test(username)) {
        return "Username cannot contain spaces or special characters";
    }
    if (username.length < 3 || username.length > 15) {
        return "Username must be between 3 and 15 characters";
    }
    return null;
};

export const validatePassword = (password) => {

    if (password.length < 6) {
        return "Password should be at least 6 characters long";
    }

    return null;
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return "Invalid email format";
    }
    return null;
};

