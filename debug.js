let data = () => {
    $.ajax({
        url: 'https://jsonplaceholder.typicode.com/users',
        method: 'GET',
        success(users) {
            for (let user of users) {
                $('ul').append(`<li>${user.username}</li>`)
            }
        },

        error(err) {
            console.log(err);
        }

    });
};

$('button').click(data);