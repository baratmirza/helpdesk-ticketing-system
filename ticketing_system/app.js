let tickets = JSON.parse(localStorage.getItem('jira_tickets')) || [];

function toggleModal(show) {
    document.getElementById('ticketModal').style.display = show ? 'flex' : 'none';
}

function saveTicket() {
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const priority = document.getElementById('priority').value;

    if (!title) return;

    const ticket = {
        id: "JIRA-" + Math.floor(Math.random() * 1000),
        title,
        desc,
        priority,
        status: 'open'
    };

    tickets.push(ticket);
    saveAndRender();
    toggleModal(false);
    document.getElementById('title').value = '';
}

function renderTickets() {
    const columns = ['open', 'pending', 'closed'];
    columns.forEach(status => {
        const list = document.querySelector(`#${status} .ticket-list`);
        list.innerHTML = '';
        const filtered = tickets.filter(t => t.status === status);
        document.querySelector(`#${status} .count`).innerText = filtered.length;

        filtered.forEach(t => {
            list.innerHTML += `
                <div class="ticket-card" draggable="true" ondragstart="drag(event)" id="${t.id}">
                    <div style="margin-bottom: 10px;">${t.title}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 11px; font-weight: bold; color: var(--text-light);"><i class="fas fa-check-square" style="color: #4C9AFF"></i> ${t.id}</span>
                        <i class="fas fa-arrow-up" style="color: ${t.priority === 'high' ? 'red' : 'orange'}"></i>
                    </div>
                </div>
            `;
        });
    });
}

function drag(ev) { ev.dataTransfer.setData("text", ev.target.id); }
function allowDrop(ev) { ev.preventDefault(); }
function drop(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text");
    let col = ev.target;
    while (!col.classList.contains('kanban-col')) col = col.parentElement;
    
    const ticket = tickets.find(t => t.id === id);
    ticket.status = col.id;
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('jira_tickets', JSON.stringify(tickets));
    renderTickets();
}

renderTickets();

