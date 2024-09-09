export const roleStatus = {
    active: 1,
    inactive: 0
}

export const rolePrivileges = {
    admin: {
        read: 1,
        create: 2,
        update: 3
    },
    topic: {
        read: 4,
        create: 5,
        update: 6
    },
    country: {
        read: 7,
        create: 8,
        update: 9
    },
    role: {
        read: 10,
        create: 11,
        update: 12
    },
    documentation: {
        read: 13,
        create: 14,
        update: 15
    },
    test: {
        read: 16,
        create: 17,
        update: 18,
        play: 19
    },
    question: {
        read: 20,
        create: 21,
        update: 22
    },
    feedback: {
        read: 23,
        update: 24,
        reply: 25
    },
    player: {
        read: 26,
        delete: 27
    }
};

export const allPrivileges = Object.values(rolePrivileges).flatMap(privileges => Object.values(privileges));