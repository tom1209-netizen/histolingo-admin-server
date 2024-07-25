export const roleStatus = {
    active: 1,
    inactive: 0
}

export const rolePrivileges = {
    topic: {
        view: 1,
        add: 2,
        edit: 3,
        delete: 4
    },
    country: {
        view: 5,
        add: 6,
        edit: 7,
        delete: 8
    },
    role: {
        view: 9,
        add: 10,
        edit: 11,
        delete: 12
    },
    documentation: {
        view: 13,
        add: 14,
        edit: 15,
        delete: 16
    },
    test: {
        view: 17,
        add: 18,
        edit: 19,
        delete: 20
    },
    question: {
        view: 21,
        add: 22,
        edit: 23,
        delete: 24
    },
    feedback: {
        view: 25,
        edit: 26
    }
};

export const allPrivileges = Object.values(rolePrivileges).flatMap(privileges => Object.values(privileges));