const DataFactory = {
    /**
     * putLocalStorage 把数据放到本地存储
     * @param {*} key
     * @param {*} value
     */
    putLocalStorage  : (key, value)=>{
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    /**
     * getLocalStorage 获取本地存储数据
     * @param {*} key
     */
    getLocalStorage (key) {
        let obj = window.localStorage.getItem(key);
        if (obj && obj !== 'undefined' && obj !== 'null') {
            return JSON.parse(obj);
        }
        return '';
    },
    /**
     * removeLocalStorage 清除本地数据
     * @param {*} key
     */
    removeLocalStorage: (key)=>{
        if (key) {
            window.localStorage.removeItem(key);
        } else {
            console.log(arguments)
            for (let i in arguments) {
                window.localStorage.removeItem(arguments[i]);
            }
        }
    }
};
export default DataFactory
