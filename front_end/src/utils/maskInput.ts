

export const maskNumberCard = (value: string) => {
    return value
        .replace(/\D/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .replace(/(\d{19})\d+?$/, "$1")
}