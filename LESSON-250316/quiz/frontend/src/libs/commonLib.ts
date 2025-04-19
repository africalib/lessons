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
    }
};