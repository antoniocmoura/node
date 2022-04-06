const div_table = document.getElementById('div_table')
const contact_input = document.getElementById('contact')
const base_url = 'http://localhost:3001/contact'

// armazena item selecionado
let selected_index = -1

// carrega contado para edição
const editContact = (index, name) => {
    selected_index = index
    contact_input.value = name
}

// faz requisições na API
const Api = (url, method, headers, body) => {
    fetch(url, {
        method,
        headers,
        body,
    }).then(response => response.json())
        .then(data => printContacts(data))
}

// busca contatos na API
Api(base_url, 'get')

// exclui contato
const deleteContact = (index) => {
    if (confirm("Confirma a exclusão do contato?")) {
        Api(base_url + '/' + index, 'delete')
    }
}

// lista contatos
const printContacts = (data) => {
    div_table.innerHTML = ''
    let table = document.createElement("table")
    let table_body = document.createElement("tbody")
    table.appendChild(table_body);
    table.setAttribute("width", "300");
    div_table.appendChild(table);
    return (
        data.map((contact, index) => {
            let table_row = document.createElement("tr")
            for (let col = 0; col < 3; col++) {
                let table_col = document.createElement("td")
                if (col === 0) {
                    let cell_text = document.createTextNode(contact.name)
                    table_col.appendChild(cell_text);
                } else if (col === 1) {
                    let btn_update = document.createElement("button")
                    btn_update.innerHTML = 'alterar'
                    btn_update.onclick = () => { editContact(index, contact.name) }
                    table_col.appendChild(btn_update);
                } else {
                    let btn_delete = document.createElement("button")
                    btn_delete.innerHTML = 'excluir'
                    btn_delete.onclick = () => { deleteContact(index) }
                    table_col.appendChild(btn_delete);
                }
                table_row.appendChild(table_col);
            }
            table_body.appendChild(table_row);
        })
    )
}

// validação do submit do formulário
document.addEventListener('submit', function (event) {
    event.preventDefault();
    const contact_name = document.getElementById('contact').value
    if (contact_name === '') {
        alert('Digite o nome')
    } else {
        document.getElementById('contact').value = ''
        if (selected_index === -1) {
            Api(base_url, 'post', { 'Content-Type': 'application/json' }, JSON.stringify({ name: contact_name }))
        } else {
            Api(base_url + '/' + selected_index, 'put', { 'Content-Type': 'application/json' }, JSON.stringify({ name: contact_name }))
            selected_index = -1
        }
    }
})

