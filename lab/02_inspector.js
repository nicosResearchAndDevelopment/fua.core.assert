const inspector = function (validate) {
    return function inspect(value) {
        try {
            validate(value);
        } catch (err) {
            return err;
        }
    };
};

inspector.string = function (param = {}) {
    return function inspect(value) {
        let pass    = typeof value === 'string';
        let message = () => pass
            ? 'invalid string type'
            : 'expected string type, received ' + typeof value;
        if (!pass) return {pass, message};

        if ('length' in param) {
            pass    = value.length === param.length;
            message = () => pass
                ? 'invalid length of ' + param.length
                : 'expected length of ' + param.length + ', received ' + value.length;
            if (!pass) return {pass, message};
        }

        if ('minLength' in param) {
            pass    = value.length >= param.minLength;
            message = () => pass
                ? 'invalid min length of ' + param.minLength + ', received ' + value.length
                : 'expected min length of ' + param.minLength + ', received ' + value.length;
            if (!pass) return {pass, message};
        }

        if ('maxLength' in param) {
            pass    = value.length <= param.maxLength;
            message = () => pass
                ? 'invalid max length of ' + param.maxLength + ', received ' + value.length
                : 'expected max length of ' + param.maxLength + ', received ' + value.length;
            if (!pass) return {pass, message};
        }

        if ('pattern' in param) {
            pass    = param.pattern.test(value);
            message = () => pass
                ? 'invalid pattern ' + param.pattern + ', received ' + value
                : 'expected pattern ' + param.pattern + ', received ' + value;
            if (!pass) return {pass, message};
        }

        return {pass, message};
    };
};

inspector.object = function (param = {}) {
    return function inspect(value) {
        let pass    = typeof value === 'object';
        let message = () => pass
            ? 'invalid object type'
            : 'expected object type, received ' + typeof value;
        if (!pass) return {pass, message};

        if (param.optional !== true) {
            pass    = !!value;
            message = () => pass
                ? 'expected null'
                : 'expected not null';
            if (!pass) return {pass, message};
        }

        if (value && param.properties) {
            for (let [propKey, propInspect] of Object.entries(param.properties)) {
                const propRes = propInspect(value[propKey]);
                pass          = propRes.pass;
                message       = () => 'for property ' + propKey + ', ' + propRes.message();
                if (!pass) return {pass, message};
            }
        }

        return {pass, message};
    };
};

module.exports = inspector;

const log = ({pass, message}) => console.log('PASS:', pass, 'MESSAGE:', message());

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