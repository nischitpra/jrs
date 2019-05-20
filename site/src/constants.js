export const get_header = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:57.0) Gecko/20100101 Firefox/57.0",
  "Accept": 'application/json',
}
export const post_header = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12; rv:57.0) Gecko/20100101 Firefox/57.0",
  "Accept": 'application/json',
  "Content-Type": "application/json"
}
export const base_api = 'http://localhost:3001' 

export const values = {
  applyForLeave: {
    maxLeave: 3
  },
}

export default {
  base_api: base_api,
  get_header: get_header,
  post_header: post_header,
  values,
}