import wretch from "wretch";

export const http = (url: string) => wretch(url).resolve(async r => r.json())