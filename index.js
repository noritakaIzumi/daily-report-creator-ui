(() => {
    const createDateStr = (date) => {
        if (!date) {
            return '';
        }
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}/${month}/${day}`;
    };

    const calendarConfig = {
        on: 'click',
        type: 'date',
        formatter: {
            date: (date, _) => {
                return createDateStr(date);
            }
        },
    };


    // Email to/cc/bcc
    const initEmailHeader = () => {
        const $tr = $('<tr>');
        $tr.append(
            $('<th>').addClass('one wide'),
            $('<th>').addClass('three wide').text('First name'),
            $('<th>').addClass('three wide').text('Last name'),
            $('<th>').text('Email'),
        );

        $('.form-table-email thead').append($tr);
    };
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
                    $('<input>').attr('type', 'text').css('width', '0')
                )
            ),
            $('<td>').attr({
                'data-label': 'Last name',
                'data-column': 'last_name',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text').css('width', '0')
                )
            ),
            $('<td>').attr({
                'data-label': 'Email',
                'data-column': 'email',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text').css('width', '0')
                )
            ),
        );
        selector.append($tr);
    };

    const $btnAddEmailTo = $('#btn-add-email-to');
    $btnAddEmailTo.on('click', () => {
        addEmailRow($('#form-table-email-to'));
    });

    const $btnAddEmailCc = $('#btn-add-email-cc');
    $btnAddEmailCc.on('click', () => {
        addEmailRow($('#form-table-email-cc'));
    });

    const $btnAddEmailBcc = $('#btn-add-email-bcc');
    $btnAddEmailBcc.on('click', () => {
        addEmailRow($('#form-table-email-bcc'));
    });


    // Task list
    const initTaskHeader = () => {
        const $tr = $('<tr>');
        $tr.append(
            $('<th>').addClass('one wide'),
            $('<th>').addClass('two wide').text('Expected hours'),
            $('<th>').addClass('two wide').text('Actual hours'),
            $('<th>').addClass('two wide').text('Remained hours'),
            $('<th>').text('Task name'),
        );

        $('#form-table-task thead').append($tr);
    };
    const addTaskRow = () => {
        const $tr = $('<tr>');
        $tr.append(
            $('<td>').addClass('center aligned').append(
                $('<button>').addClass('negative ui button').on('click', () => {
                    $tr.remove();
                }).text('-')
            ),
            $('<td>').attr({
                'data-label': 'Expected hours',
                'data-column': 'expected_hours',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text').css('width', '0')
                )
            ),
            $('<td>').attr({
                'data-label': 'Actual hours',
                'data-column': 'actual_hours',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text').css('width', '0')
                )
            ),
            $('<td>').attr({
                'data-label': 'Remained hours',
                'data-column': 'remained_hours',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text').css('width', '0')
                )
            ),
            $('<td>').attr({
                'data-label': 'Task name',
                'data-column': 'task_name',
            }).append(
                $('<div>').addClass('ui input').append(
                    $('<input>').attr('type', 'text').css('width', '0')
                )
            ),
        );
        $('#form-table-task tbody').append($tr);
    };

    const $btnAddTask = $('#btn-add-task');
    $btnAddTask.on('click', () => {
        addTaskRow();
    });

    // Create data json
    const getFmtJson = () => {
        const params = {};

        params.date = $('#form-date input').val();
        params.name = $('#form-name input').val();

        const createEmailItem = (e) => {
            const item = {};
            $(e).find('td[data-column]').each((_, row) => {
                item[row.dataset.column] = $(row).find('input').val();
            });
            return item;
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
            const task = {};
            $(e).find('td[data-column]').each((_, row) => {
                task[row.dataset.column] = $(row).find('input').val();
            });
            tasks.push(task);
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
                fmt: '予定 実績 残 タスク',
            },
            {
                ctrl: 'each',
                stmt: {
                    iterable: 'tasks',
                    as: 'task',
                    expr: {
                        fmt: '${task.expected_hours} ${task.actual_hours} ${task.remained_hours} ${task.task_name}',
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

        return {
            params: params,
            template: template,
        };
    };
    $('#btn-send-email').on('click', () => {
        const data = getFmtJson();
        console.log(JSON.stringify(data));
    });

    // main
    (() => {
        $('#form-date').calendar(calendarConfig);

        $('#form-table-email-to').sortable({items: 'tbody tr', placeholder: "ui-state-highlight"});
        $('#form-table-email-cc').sortable({items: 'tbody tr', placeholder: "ui-state-highlight"});
        $('#form-table-email-bcc').sortable({items: 'tbody tr', placeholder: "ui-state-highlight"});
        $('#form-table-task').sortable({items: 'tbody tr', placeholder: "ui-state-highlight"});

        $('.ui.accordion').accordion();

        initEmailHeader();
        initTaskHeader();

        $btnAddEmailTo.trigger('click');
        $btnAddEmailCc.trigger('click');
        $btnAddEmailBcc.trigger('click');
        $btnAddTask.trigger('click');
    })();
})();
