module.exports = [
    {
        title: 'Nome completo',
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
            },
            {
                title: 'Amigos',
                reaction: '2️⃣',
            },
            {
                title: 'Facebook',
                reaction: '3️⃣',
            },
            {
                title: 'Discord',
                reaction: '4️⃣',
            },
            {
                title: 'Comunidades de NFT',
                reaction: '5️⃣',
            },
            {
                title: 'Twitter',
                reaction: '6️⃣',
            },
            {
                title: 'Outros',
                reaction: '7️⃣',
            },
        ],
        timer: 1
    },

]