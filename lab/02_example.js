const
    inspector = require('./02_inspector.js'),
    validator = require('./02_validator.js'),
    log       = ({pass, message}) => console.log('PASS:', pass, pass ? ' -' : '-', 'MESSAGE:', message());

// const inspectString = inspector.string({pattern: /^\S+$/, maxLength: 10});

// log(inspectString(123));
// log(inspectString('test'));
// log(inspectString('test 012'));
// log(inspectString('test123456789'));

const inspectObject = inspector.object({
    optional:   false,
    properties: {
        id:   inspector.string({pattern: /^\S+$/}),
        type: inspector.object({
            optional:   false,
            properties: {
                id: inspector.string({pattern: /^\S+$/})
            }
        })
    }
});

log(inspectObject());
log(inspectObject(null));
log(inspectObject({id: 'bla', type: {id: 'ttest'}}));
