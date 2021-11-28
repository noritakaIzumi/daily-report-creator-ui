/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.handler = async (event, context) => {
    const parseTemplate = (template, params) => {
        const lines = [];
        const endl = '\n';
        // https://stackoverflow.com/questions/29182244/convert-a-string-to-a-template-string
        template.map((element) => {
            const printf = (element, params) => {
                const names = Object.keys(params);
                const values = Object.values(params);

                values.forEach((value) => {
                    if (['string', 'object'].indexOf(typeof value) < 0) {
                        return '';
                    }
                });
                const varNames = element.fmt.match(/(?<=\${).*?(?=})/g);
                if (varNames && varNames.filter(a => a.match(/[^a-zA-Z0-9._]/) !== null).length > 0) {
                    return '';
                }
                let literal = '';
                literal += new Function(...names, `return \`${element.fmt}\``)(...values);
                if (element.end && element.end.blank) {
                    literal += endl.repeat(Number(element.end.blank));
                }
                return literal;
            };

            let literal = '';
            if (element.fmt) {
                lines.push(printf(element, params));
            } else if (element.ctrl) {
                const ctrl = element.ctrl;
                if (ctrl === 'each') {
                    const eachParam = params[element.stmt.iterable];
                    eachParam.map((p) => {
                        params[element.stmt.as] = p;
                        lines.push(printf(element.stmt.expr, params));
                    });
                }

                if (element.end && element.end.blank) {
                    literal += endl.repeat(Number(element.end.blank));
                }
            }
            return literal;
        });
        return lines.join(endl);
    };

    let url;
    try {
        const inputParams = JSON.parse(event.body);
        const baseUrl = 'https://mail.google.com/';
        const queryParams = new URLSearchParams({
            view: 'cm',
            to: inputParams.params.emailTo.map((e) => {
                return `${e.firstName} ${e.lastName}<${e.email}>`;
            }).join(','),
            cc: inputParams.params.emailCc.map((e) => {
                return `${e.firstName} ${e.lastName}<${e.email}>`;
            }).join(','),
            bcc: inputParams.params.emailBcc.map((e) => {
                return `${e.firstName} ${e.lastName}<${e.email}>`;
            }).join(','),
            su: `運用日報（${inputParams.params.date}）`,
            body: parseTemplate(inputParams.template, inputParams.params),
        });

        url = `${baseUrl}?${queryParams.toString()}`;
    } catch (err) {
        console.log(err);
        url = '';
    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(url),
    };
};
