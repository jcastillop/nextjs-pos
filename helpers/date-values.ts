export const getDatetimeFormat = (dateStringValue: Date) => {

    try {

        const dateValue = new Date(dateStringValue)
        const year = helperFormat(dateValue.getFullYear());
        const month = helperFormat(dateValue.getMonth()+1);
        const dt = helperFormat(dateValue.getDate());        

        const hour = helperFormat(dateValue.getHours()+5);     
        const minute = helperFormat(dateValue.getMinutes());     
        const second = helperFormat(dateValue.getSeconds());     
        return year + "-" + month + "-" + dt + " " + hour + ":" + minute + ":" + second;   
    } catch (error) {
        return "Formato inválido"
    }  
}

const helperFormat = (value: number) => {
    if (value < 10) {
        return'0' + value.toString();
    }
    return value
}

export const getTodayDatetime = () => {

    try {
        const dateValue = new Date()
        const year = helperFormat(dateValue.getFullYear());
        const month = helperFormat(dateValue.getMonth()+1);
        const dt = helperFormat(dateValue.getDate());        

        const hour = helperFormat(dateValue.getHours());     
        const minute = helperFormat(dateValue.getMinutes());     
        const second = helperFormat(dateValue.getSeconds());     
        return year + "-" + month + "-" + dt + " " + hour + ":" + minute + ":" + second;   
    } catch (error) {
        return "Formato inválido"
    }  
}