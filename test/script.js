const link = document.getElementById('link')
const btn = document.getElementById('btn')

btn.addEventListener('click', async () => {
    const response = await fetch('http://54.227.224.224/api') // IP do servidor + rota
    const data = await response.json()
    console.log(data.people)
    link.innerHTML = data.people
})