(() => {
    const createDateStr = (date) => {
        if (!date) {
            return '';
        }
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return year + '/' + month + '/' + day;
    };

    $('#form-date').calendar({
        on: 'click',
        type: 'date',
        formatter: {
            date: (date, _) => {
                return createDateStr(date);
            }
        },
    });

    $('#form-table-email-to').sortable({items: 'tbody tr', placeholder: "ui-state-highlight"});
    $('#form-table-email-cc').sortable({items: 'tbody tr', placeholder: "ui-state-highlight"});
    $('#form-table-email-bcc').sortable({items: 'tbody tr', placeholder: "ui-state-highlight"});
    $('#form-table-task').sortable({items: 'tbody tr', placeholder: "ui-state-highlight"});

    $('.ui.accordion').accordion();

    // Email to/cc/bcc
    const addEmailRow = (selector) => {
        const $tr = $('<tr>');
        $tr.append(
            $('<td>').addClass('center aligned').append(
                $('<button>').addClass('negative ui button').on('click', () => {
                    $tr.remove();
                }).text('-')
            ),
            $('<td>').attr({
                'data-label': 'First name',
                'data-column': 'first_name',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text')
                )
            ),
            $('<td>').attr({
                'data-label': 'Last name',
                'data-column': 'last_name',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text')
                )
            ),
            $('<td>').attr({
                'data-label': 'Email',
                'data-column': 'email',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text')
                )
            ),
        );
        selector.append($tr);
    };

    $('#btn-add-email-to').on('click', () => {
        addEmailRow($('#form-table-email-to'));
    }).trigger('click');

    $('#btn-add-email-cc').on('click', () => {
        addEmailRow($('#form-table-email-cc'));
    }).trigger('click');

    $('#btn-add-email-bcc').on('click', () => {
        addEmailRow($('#form-table-email-bcc'));
    }).trigger('click');


    // Task list
    const addTaskRow = () => {
        const $tr = $('<tr>');
        $tr.append(
            $('<td>').addClass('center aligned').append(
                $('<button>').addClass('negative ui button').on('click', () => {
                    $tr.remove();
                }).text('-')
            ),
            $('<td>').attr({
                'data-label': 'Task name',
                'data-column': 'task_name',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text')
                )
            ),
            $('<td>').attr({
                'data-label': 'Expected hours',
                'data-column': 'expected_hours',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text')
                )
            ),
            $('<td>').attr({
                'data-label': 'Actual hours',
                'data-column': 'actual_hours',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text')
                )
            ),
            $('<td>').attr({
                'data-label': 'Status',
                'data-column': 'status',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text')
                )
            ),
        );
        $('#form-table-task tbody').append($tr);
    };

    $('#btn-add-task').on('click', () => {
        addTaskRow();
    }).trigger('click');

    // Create data json
    $('#btn-send-email').on('click', () => {
        const params = {};

        params.date = $('#form-date input').val();
        params.name = $('#form-name input').val();

        const createEmailItem = (e) => {
            return {
                firstName: $(e).find('td[data-column="first_name"] input').val(),
                lastName: $(e).find('td[data-column="last_name"] input').val(),
                email: $(e).find('td[data-column="email"] input').val(),
            };
        };
        const emailTo = [];
        $('#form-table-email-to tbody > tr').map((_, e) => {
            emailTo.push(createEmailItem(e));
        });
        params.emailTo = emailTo;
        const emailCc = [];
        $('#form-table-email-cc tbody > tr').map((_, e) => {
            emailCc.push(createEmailItem(e));
        });
        params.emailCc = emailCc;
        const emailBcc = [];
        $('#form-table-email-bcc tbody > tr').map((_, e) => {
            emailBcc.push(createEmailItem(e));
        });
        params.emailBcc = emailBcc;

        const tasks = [];
        $('#form-table-task tbody > tr').map((_, e) => {
            tasks.push({
                taskName: $(e).find('td[data-column="task_name"] input').val(),
                expectedHours: $(e).find('td[data-column="expected_hours"] input').val(),
                actualHours: $(e).find('td[data-column="actual_hours"] input').val(),
                status: $(e).find('td[data-column="status"] input').val(),
            });
        });
        params.tasks = tasks;

        params.overview = document.querySelector('#form-overview').innerText;
        params.futurePlans = document.querySelector('#form-future-plans').innerText;

        const template = [
            {
                fmt: 'お疲れ様です、${name}です。',
                end: {
                    blank: 1,
                },
            },
            {
                fmt: '本日の日報です。',
                end: {
                    blank: 1,
                },
            },
            {
                fmt: '■タスク',
                end: {
                    blank: 1,
                },
            },
            {
                fmt: 'タスク 予定 実績 状況',
            },
            {
                ctrl: 'each',
                stmt: {
                    iterable: 'tasks',
                    as: 'task',
                    expr: {
                        fmt: '${task.taskName} ${task.expectedHours} ${task.actualHours} ${task.status}',
                    },
                },
                end: {
                    blank: 1,
                }
            },
            {
                fmt: '■概況',
                end: {
                    blank: 1,
                },
            },
            {
                fmt: '${overview}',
                end: {
                    blank: 1,
                },
            },
            {
                fmt: '■明日の予定',
                end: {
                    blank: 1,
                },
            },
            {
                fmt: '${futurePlans}',
            },
        ];

        const data = {
            params: params,
            template: template,
        };
        console.log(JSON.stringify(data));
    });
})();
