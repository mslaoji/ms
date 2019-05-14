/**
 * 对象扩充
 * @param target {Object}
 * @param source {Boolean}
 * @returns {Object}
 */

function mix(target,source){ //如果最后参数是布尔，判定是否覆盖同名属性
    var args = [].slice.call(arguments), i = 1, key,
        ride = typeof args[args.length - 1] == "boolean" ? args.pop() : true;
    if (args.length === 1){
        target = !this.window ? this : {};
        i = 0;
    }
    while ((source = args[i++])) {
        for (key in source){ //允许对象糅杂，用户保证都是对象
            if (ride || !(key in target)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}
