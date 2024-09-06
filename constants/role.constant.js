export const roleStatus = {
    active: 1,
    inactive: 0
}

export const rolePrivileges = {
    admin: {
        read: 1,
        create: 2,
        update: 3,
        delete: 4
    },
    topic: {
        read: 5,
        create: 6,
        update: 7,
        delete: 8
    },
    country: {
        read: 9,
        create: 10,
        update: 11,
        delete: 12
    },
    role: {
        read: 13,
        create: 14,
        update: 15,
        delete: 16
    },
    documentation: {
        read: 17,
        create: 18,
        update: 19,
        delete: 20
    },
    test: {
        read: 21,
        create: 22,
        update: 23,
        delete: 24,
        play: 34
    },
    question: {
        read: 25,
        create: 26,
        update: 27,
        delete: 28
    },
    feedback: {
        read: 29,
        update: 30,
        reply: 31
    },
    player: {
        read: 32,
        delete: 33
    }
};

export const allPrivileges = Object.values(rolePrivileges).flatMap(privileges => Object.values(privileges));