// Lógica da lista To-Do

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const weekdaysDiv = document.getElementById('weekdays');
const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// Seleção animada dos dias da semana
let selectedDays = [];
weekdaysDiv.querySelectorAll('.weekday').forEach(dayEl => {
    dayEl.addEventListener('click', function() {
        const day = parseInt(dayEl.dataset.day);
        if (selectedDays.includes(day)) {
            selectedDays = selectedDays.filter(d => d !== day);
            dayEl.classList.remove('selected');
        } else {
            selectedDays.push(day);
            dayEl.classList.add('selected');
        }
    });
});

// Carregar tarefas do localStorage
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => addTodoElement(todo.text, todo.days));
}

// Salvar tarefas no localStorage
function saveTodos() {
    const todos = Array.from(list.children).map(li => {
        return {
            text: li.querySelector('.todo-text').textContent,
            days: li.dataset.days ? JSON.parse(li.dataset.days) : []
        };
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Adicionar elemento na lista
function addTodoElement(text, days = []) {
    const li = document.createElement('li');
    li.style.opacity = 0;
    li.style.transform = 'scale(0.95)';
    setTimeout(() => {
        li.style.opacity = 1;
        li.style.transform = 'scale(1)';
    }, 10);
    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = text;
    li.appendChild(span);
    // Exibir badge dos dias recorrentes
    if (days && days.length > 0) {
        const daysBadge = document.createElement('span');
        daysBadge.className = 'days-badge';
        daysBadge.textContent = days.map(d => weekdayNames[d]).join(', ');
        li.appendChild(daysBadge);
    }
    li.dataset.days = JSON.stringify(days);
    const btn = document.createElement('button');
    btn.className = 'remove-btn';
    btn.textContent = 'Concluir';
    btn.setAttribute('aria-label', 'Concluir tarefa');
    btn.onclick = function() {
        li.style.transform = 'scale(0.92)';
        li.style.opacity = 0;
        li.style.background = 'linear-gradient(90deg, #ffb6b6 60%, #ffe0e0 100%)';
        setTimeout(() => {
            li.remove();
            saveTodos();
        }, 350);
    };
    li.appendChild(btn);
    list.appendChild(li);
    // Scroll para a tarefa adicionada
    li.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Evento de submit do formulário
form.addEventListener('submit', function(e) {
    e.preventDefault();
    const value = input.value.trim();
    if (value) {
        addTodoElement(value, selectedDays.slice());
        saveTodos();
        input.value = '';
        input.focus();
        // Limpar seleção dos dias
        selectedDays = [];
        weekdaysDiv.querySelectorAll('.weekday').forEach(dayEl => dayEl.classList.remove('selected'));
        // Feedback visual no input
        input.style.background = '#e0ffe0';
        setTimeout(() => { input.style.background = ''; }, 350);
    }
});

// Inicializar
loadTodos();
