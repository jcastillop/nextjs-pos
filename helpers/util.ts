

type dateFormat = 'dd-mm-yyyy'; 

export const getActualDate = (format: dateFormat ) =>{

    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();

    switch (format) {
        case 'dd-mm-yyyy':
            return `${date}-${month<10?`0${month}`:`${month}`}-${year}`        
        default:
            return `${date}-${month<10?`0${month}`:`${month}`}-${year}`
    } 
}

export const formatDate = (date: Date) =>{

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return `${day<10?`0${day}`:`${day}`}-${month<10?`0${month}`:`${month}`}-${year}`
}

export const formatDateSQL = (date: Date) =>{

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    return `${month<10?`0${month}`:`${month}`}-${day<10?`0${day}`:`${day}`}-${year}`
}