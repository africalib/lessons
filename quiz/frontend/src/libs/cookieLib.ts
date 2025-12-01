export default {
    // 쿠키 가져오기
    get(name: string): string | null {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) {
                return decodeURIComponent(value);
            }
        }
        return null;
    },

    // 쿠키 설정하기
    set(name: string, value: string, days: number = 7, secure: boolean = true): void {
        const expires = new Date();
        expires.setDate(expires.getDate() + days);
        let cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
        if (secure) {
            cookie += '; Secure';
        }
        document.cookie = cookie;
    },

    // 쿠키 삭제하기
    del(name: string): void {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
};
