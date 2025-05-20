export const generatePassword = (length = 10) => {
    if (length < 3) {
        throw new Error("Password length must be at least 3 to include all required character types.");
    }

    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numberChars = "0123456789";
    const allChars = lowercaseChars + uppercaseChars + numberChars;

    const upper = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    const number = numberChars[Math.floor(Math.random() * numberChars.length)];

    let password = upper + number;

    for (let i = 2; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password.split('').sort(() => Math.random() - 0.5).join('');
}


