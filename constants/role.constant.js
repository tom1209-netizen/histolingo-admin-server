export const roleStatus = {
    active: 1,
    inactive: 0
}

export const rolePrivileges = {
    topic: {
        read: 1,
        create: 2,
        update: 3,
        delete: 4
    },
    country: {
        read: 5,
        create: 6,
        update: 7,
        delete: 8
    },
    role: {
        read: 9,
        create: 10,
        update: 11,
        delete: 12
    },
    documentation: {
        read: 13,
        create: 14,
        update: 15,
        delete: 16
    },
    test: {
        read: 17,
        create: 18,
        update: 19,
        delete: 20
    },
    question: {
        read: 21,
        create: 22,
        update: 23,
        delete: 24
    },
    feedback: {
        read: 25,
        update: 26
    }
};

export const allPrivileges = Object.values(rolePrivileges).flatMap(privileges => Object.values(privileges));