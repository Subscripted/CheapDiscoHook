document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);

        if (currentTheme === 'dark') {
            themeToggle.checked = true;
        }
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
});

document.getElementById('addField').addEventListener('click', function() {
    var fieldsContainer = document.getElementById('fields');
    var field = document.createElement('div');
    field.classList.add('field');
    field.innerHTML = `
        <input type="text" class="fieldTitle" placeholder="Field Title">
        <input type="text" class="fieldValue" placeholder="Field Value">
    `;
    fieldsContainer.appendChild(field);
});

document.getElementById('messageForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var webhookURL = document.getElementById('webhookURL').value;
    var username = document.getElementById('username').value;
    var content = document.getElementById('content').value;
    var embedTitle = document.getElementById('embedTitle').value;
    var embedDescription = document.getElementById('embedDescription').value;
    var embedColor = document.getElementById('embedColor').value;
    var footer = document.getElementById('footer').value;

    var fields = [];
    var fieldElements = document.querySelectorAll('.field');
    fieldElements.forEach(function(fieldElement) {
        var fieldTitle = fieldElement.querySelector('.fieldTitle').value;
        var fieldValue = fieldElement.querySelector('.fieldValue').value;
        if (fieldTitle && fieldValue) {
            fields.push({
                name: fieldTitle,
                value: fieldValue,
                inline: true
            });
        }
    });

    var payload = {
        username: username,
        content: content,
        embeds: [
            {
                title: embedTitle,
                description: embedDescription,
                color: parseInt(embedColor.replace('#', ''), 16),
                fields: fields,
                footer: {
                    text: footer
                }
            }
        ]
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Message sent successfully!');
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
            alert('Failed to send message. Check console for details.');
        });
});
