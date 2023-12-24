const express = require('express')
const app = express()

let contacts = [
    {
        id: 1,
        name: 'John Doe',
        number: "040-123456"
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: "39-00-532523"
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: "12-43-23445"
    },
    {
        id: 4,
        name: 'Mary Poppendick',
        number: "39-23-6423122"
    },
]

app.get('/', (request, response) => {
    response.send("OK")
})

app.get('/api/persons', (request, response) => {
    response.json(contacts)
})

app.get('/info', (request, response) => {
    let info = `Phonebook has info for ${contacts.length} people`
    response.send(`
        <p>${info}</p>
        <p>${new Date()}</p>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const contact = contacts.find(contact => contact.id === id)
    
    contact ? 
    response.json(contact) :
    response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    contacts = contacts.filter(person => person.id !== id)

    response.status(204).end()

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})