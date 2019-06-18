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

        Element.prototype.hasClass = function (className) {
            if (typeof className === 'string') {
                return this.classList.contains(className);
            } else if (typeof className === 'object') {
                if (className.length) {
                    for (let i = 0; i < className.length; i++) {
                        if (!this.classList.contains(className[i])) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    console.error('Parameter needs to be a string or a array of strings');
                }
            } else {
                console.error('Parameter needs to be a string or a array of strings');
            }
            return this;
        };

        Element.prototype.doesntHaveClass = function (className) {
            if (typeof className === 'string') {
                return !this.classList.contains(className);
            } else if (typeof className === 'object') {
                if (className.length) {
                    for (let i = 0; i < className.length; i++) {
                        if (this.classList.contains(className[i])) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    console.error('Parameter needs to be a string or a array of strings');
                }
            } else {
                console.error('Parameter needs to be a string or a array of strings');
            }
            return this;
        };

        Element.prototype.removeClass = function (className) {
            if (typeof className === 'string') {
                this.classList.remove(className);
            } else if (typeof className === 'object') {
                if (className.length) {
                    className.map((name) => {
                        this.classList.remove(name);
                    });
                } else {
                    console.error('Parameter needs to be a string or a array of strings');
                }
            } else {
                console.error('Parameter needs to be a string or a array of strings');
            }
            return this;
            return this;
        };
    }

    class(className, array = false) {
        return array ? [...document.getElementsByClassName(className)] : document.getElementsByClassName(className);
    }

    id(idName) {
        return document.getElementById(idName);
    }

    DOM(selector) {
        return document.querySelectorAll(selector);
    }

    joinArrays(array1, array2) {
        for (let i = 0; i < array2.length; i++) {
            if (!array1.includes(array2[i])) array1.push(array2[i]);
        }
        return array1;
    }
}

module.exports = Base;
