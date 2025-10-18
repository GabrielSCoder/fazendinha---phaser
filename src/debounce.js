/**
 * Cria uma função debounced
 * @param {Function} func - Função que será chamada
 * @param {number} wait - Tempo em ms para aguardar após o último clique
 * @returns {Function}
 */
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;

        clearTimeout(timeout); // cancela qualquer execução anterior
        timeout = setTimeout(() => {
            func.apply(context, args); // executa somente após o tempo definido
        }, wait);
    };
}
