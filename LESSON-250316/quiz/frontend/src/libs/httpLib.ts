import axios from "axios";

export default {
    get() {

    },
    post(url: string, args: Record<string, any>) {
        return axios.post(url, args);
    },
    put() {

    },
    delete() {

    }
};