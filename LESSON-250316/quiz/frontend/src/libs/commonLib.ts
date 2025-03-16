export default {
    log(obj: object) {
        console.log(JSON.parse(JSON.stringify(obj)));
    }
};