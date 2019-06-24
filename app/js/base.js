class Base {
    constructor() {
        Element.prototype.addClass = function (className) {
            /* Method adds a class or an array of classes to a specified Element. */

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
            /* Method checks whether Element classList contains given class or an array of classes. */

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
            /* Method checks whether Element classList doesn't contain given class or an array of classes. */

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
            /* Method removes a class or an array of classes from a specified Element. */

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
        /* Selects elements with a given class. If parameter array is true the result is returned as an array.
            Otherwise it is a defult NodeList. */

        return array ? [...document.getElementsByClassName(className)] : document.getElementsByClassName(className);
    }

    id(idName) {
        /* Returns an element with a given id. */

        return document.getElementById(idName);
    }

    DOM(selector) {
        /* Returns a NodeList of elements with given selector. */

        return document.querySelectorAll(selector);
    }

    joinArrays(array1, array2) {
        /* Joins 2 arrays and removes duplicates. */

        for (let i = 0; i < array2.length; i++) {
            if (!array1.includes(array2[i])) array1.push(array2[i]);
        }
        return array1;
    }
}

module.exports = Base;
