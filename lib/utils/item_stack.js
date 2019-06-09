"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class ItemStack {
    constructor(input) {
        let index = 0;
        index = this.parseName(input, index) + 1;
        this.parseNbt(input, index);
    }
    toString() {
        let result = this.name;
        if (this.nbt !== undefined) {
            result += this.nbt.toString();
        }
        return result;
    }
    /**
     * Parses the item name.
     * @returns The end of the name. (The index of the char before `{` or ``.)
     */
    parseName(input, index) {
        let name = '';
        while (input.charAt(index) !== '' && input.charAt(index) !== '[' && input.charAt(index) !== '{') {
            name += input.charAt(index);
            index += 1;
        }
        name = utils_1.completeNamespace(name);
        this.name = name;
        return index - 1;
    }
    /**
     * Parses the item nbt.
     * @returns The end of the nbt. (Can be `}` or ``.)
     */
    parseNbt(input, index) {
        if (input.charAt(index) === '{') {
            this.nbt = utils_1.getNbtCompound(input.slice(index));
        }
        return index;
    }
}
exports.ItemStack = ItemStack;
//# sourceMappingURL=item_stack.js.map