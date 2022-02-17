module.exports = [
    {
        title: 'Nome completo (vida real):',
        limit: 40,
        timer: 1
    },
    {
        title: 'Idade ',
        type: 'number',
        limit: 2,
        minimum: 17,
        timer: 1
    },
    {
        title: 'Possui microfone ?',
        answers: [
            {
                title: 'Sim',
                reaction: '👍',
                correct: true
            },
            {
                title: 'Não',
                reaction: '👎',
            }
        ],
        timer: 1
    },
    {
        title: 'Como conheceu o servidor:',
        answers: [
            {
                title: 'Google',
                reaction: '1️⃣',
                correct: true
            },
            {
                title: 'Amigos',
                reaction: '2️⃣',
                correct: true
            },
            {
                title: 'Facebook',
                reaction: '3️⃣',
                correct: true
            },
            {
                title: 'Discord',
                reaction: '4️⃣',
                correct: true
            },
            {
                title: 'Comunidades de NFT',
                reaction: '5️⃣',
                correct: true
            },
            {
                title: 'Twitter',
                reaction: '6️⃣',
                correct: true
            },
            {
                title: 'Outros',
                reaction: '7️⃣',
                correct: true
            },
        ],
        timer: 1
    },

]