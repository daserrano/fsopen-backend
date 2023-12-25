const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())

// Se añade nuevo parametro (content) para mostrar en consola el objeto enviado en metodos post.
morgan.token('content', (request) => {
    return request.method === 'POST' ?
        JSON.stringify(request.body) :
        '-'
})

// Muestra logs en consola de las peticiones que se realizan.
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

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

app.post('/api/persons', (request, response) => {
    console.log("BOOODY: ", request)
    const {name, number} = request.body

    if (!name || !number) {
        return response.status(400).json({error:"missing property"})
    }
    if(contacts.find(contact => contact.name.toLowerCase() === name.toLowerCase())) return response.status(400).json({error: "name must be unique!"})
    const contact = {
        id: Math.random(),
        name: name,
        number: number
    }
    
    contacts.push(contact)
    response.json(contact)

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})