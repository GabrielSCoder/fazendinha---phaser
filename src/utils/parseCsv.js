
export function parseCSV(csv) {

    const lines = csv.trim().split("\n");
    const headers = lines.shift().split(",");

    return lines.map(line => {

        const values = line.split(",");

        const obj = {};

        headers.forEach((h, i) => {
            obj[h.trim()] = Number(values[i]);
        });

        return obj;

    });

}