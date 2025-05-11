export const generateCodeForEmail = () => {
    let code = '';
    const string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i=0; i<6; i++){
        const randomIndex = Math.floor(Math.random() * string.length)
        code = code + string[randomIndex]
    }
    return code.toString()
}