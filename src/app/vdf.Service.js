// a simple parser for Valve's KeyValue format
// https://developer.valvesoftware.com/wiki/KeyValues
//
// author: Rossen Popov, 2014
//Adapted as an angular service by Drop
(function () {

    var VDFService = ['$mdToast', function ($mdToast) {
        var error = function (text) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .position('top right')
                    .hideDelay(5000)
            );
        };
        var _dump = function (obj, pretty, level) {
            if (typeof obj != 'object') {
                ui.notification('vdf', 'VDF.stringify: a key has value of type other than string or object');
                return false;
            }

            var indent = '\t';
            var buf = '';
            var line_indent = '';


            if (pretty) {
                for (var i = 0; i < level; i++) {
                    line_indent += indent;
                }
            }

            for (var key in obj) {
                if (typeof obj[key] == 'object') {
                    buf += [line_indent, '"', key, '"\n', line_indent, '{\n', _dump(obj[key], pretty, level + 1), line_indent, '}\n'].join('');
                } else {
                    buf += [line_indent, '"', key, '" "', String(obj[key]), '"\n'].join('');
                }
            }

            return buf;
        },
            parse = function (text) {
                if (typeof text != 'string') {
                    error('VDF.parse: Expecting parameter to be a string');
                    return false;
                }

                var lines = text.split('\n'), line, m;

                var obj = {};
                var stack = [obj];
                var expect_bracket = false;
                var name = '';

                var re_kv = new RegExp(
                    '^("((?:\\\\.|[^\\\\"])+)"|([a-z0-9\\-\\_]+))' +
                    '([ \t]*(' +
                    '"((?:\\\\.|[^\\\\"])*)(")?' +
                    '|([a-z0-9\\-\\_]+)' +
                    '))?'
                );

                var i = 0,
                    j = lines.length;
                for (; i < j; i++) {
                    line = lines[i].trim();

                    // skip empty and comment lines
                    if (line == '' || line[0] == '/') {
                        continue;
                    }

                    // one level deeper
                    if (line[0] == '{') {
                        expect_bracket = false;
                        continue;
                    }

                    if (expect_bracket) {
                        error('VDF.parse: invalid syntax on line ' + (i + 1));
                        return false;
                    }

                    // one level back
                    if (line[0] == '}') {
                        stack.pop();
                        continue;
                    }

                    // parse keyvalue pairs
                    while (true) {
                        m = re_kv.exec(line);

                        if (m === null) {
                            error('VDF.parse: invalid syntax on line ' + (i + 1));
                            return false;
                        }

                        // qkey = 2
                        // key = 3
                        // qval = 6
                        // vq_end = 7
                        // val = 8
                        var key = (m[2] !== undefined) ? m[2] : m[3];
                        var val = (m[6] !== undefined) ? m[6] : m[8];

                        if (val === undefined) {
                            stack[stack.length - 1][key] = {};
                            stack.push(stack[stack.length - 1][key]);
                            expect_bracket = true;
                        } else {
                            if (m[7] === undefined && m[8] === undefined) {
                                line += '\n' + lines[++i];
                                continue;
                            }

                            stack[stack.length - 1][key] = val;
                        }

                        break;
                    }
                }

                if (stack.length != 1) {
                    error('VDF.parse: open parentheses somewhere');
                    return false;
                }

                return obj;
            },

            stringify = function (obj, pretty) {
                if (typeof obj != 'object') {
                    error('VDF.stringify: First input parameter is not an object');
                }

                pretty = (typeof pretty == 'boolean' && pretty) ? true : false;

                return _dump(obj, pretty, 0);
            };
        return { parse: parse, stringify: stringify };
    }],
        module = angular.module('csgo-radio');
    module.factory('VDFService', VDFService);
} ());