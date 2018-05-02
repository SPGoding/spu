"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Formats {
}
Formats.pairs = new Map([
    [
        'advancement grant %entity only %string',
        'advancement grant %0 only %1'
    ], [
        'advancement grant %entity only %string %string',
        'advancement grant %0 only %1 %2'
    ]
]);
exports.default = Formats;
