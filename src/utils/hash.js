export function stringToNumber(str) {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = (hash * 31 + str.charCodeAt(i)) % 1000000;
    }

    return hash;
}