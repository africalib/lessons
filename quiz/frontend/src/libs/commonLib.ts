export default {
    log(obj: object) {
        console.log(JSON.parse(JSON.stringify(obj)));
    },
    wait(seconds: number) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(undefined);
            }, seconds * 1000);
        });
    },
    getDateFormatted(value: string, format: string) {
        const d = new Date(value);
        const year = d.getFullYear().toString().substring(2);
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const date = d.getDate().toString().padStart(2, "0");
        const hours = d.getHours().toString().padStart(2, "0");
        const minutes = d.getMinutes().toString().padStart(2, "0");

        switch (format) {
            case "yy-MM-dd HH:mm":
                return [year, month, date].join("-") + " " + [hours, minutes].join(":");
        }

        return value;
    },
    renew(value: object) {
        return JSON.parse(JSON.stringify(value));
    },
};