class Base {
    constructor() {
        Element.prototype.addClass = function (className) {
            if (typeof className === 'string') {
                this.classList.add(className);
            } else if (typeof className === 'object') {
                if (className.length) {
                    className.map((name) => {
                        this.classList.add(name);
                    });
                } else {
                    console.error('Parameter needs to be a string or a array of strings');
                }
            } else {
                console.error('Parameter needs to be a string or a array of strings');
            }
            return this;
        };

        Element.prototype.removeClass = function (className) {
            this.classList.remove(className);
            return this;
        };
    }

    class(className, array = false) {
        return array ? [...document.getElementsByClassName(className)] : document.getElementsByClassName(className);
    }

    id(idName) {
        return document.getElementById(idName);
    }
}

module.exports = Base;
