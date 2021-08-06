db.createUser(
    {
        user: "testuser",
        pwd: "test",
        roles: [
            {
                role: "readWrite",
                db: "c4po"
            }
        ]
    }
);