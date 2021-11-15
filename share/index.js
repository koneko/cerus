const params = new URLSearchParams(window.location.search)

let code = params.get('code')
let value = atob(code)
let p = document.createElement('p')
p.textContent = value
console.log(value)


