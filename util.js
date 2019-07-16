class Util {
    toCamelCase(source) {
        if (source.indexOf('-') < 0) {
            return source;
        }
        return source.replace(
            /\-./g,
            function (match) {
                return match.charAt(1).toUpperCase();
            }
        );
    }
}
export default new Util();