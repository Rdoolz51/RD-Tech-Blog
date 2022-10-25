const router = require("express").Router();
const { User, Comment, Post } = require("../../models");

//get all users
router.get("/", (req, res) => {
    User.findAll({
        attributes: { exclude: ["password"] },
    })
        .then((dbUserData) => res.json(dbUserData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});


//get a single user by id
router.get("/:id", (req, res) => {
    User.findOne({
        attributes: { exclude: ["password"] },
        where: {
            id: req.params.id,
        },
        include: [
            {
                model: Post,
                attributes: ["id", "title", "post_text", "created_at"],
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "created_at"],
                include: {
                    model: Post,
                    attributes: ["post_id"],
                },
            },
        ],
    })
        .then((dbUserData) => {
            if (!dbUserData) {
                res
                    .status(404)
                    .json({ message: "There is no user found with this id!" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});




//create new user
router.post("/", (req, res) => {
    // expects {username: 'Rdoolz51', email: 'Rdoolz51@aol.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    })
        .then((dbUserData) => {
            req.session.loggedIn = true;
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.save(() => {

                res.json(dbUserData);
            });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});



//Login user
router.post("/login", (req, res) => {
    User.findOne({
        where: {
            email: req.body.email,
        },
    }).then((dbUserData) => {
        if (!dbUserData) {
            res
                .status(404)
                .json({ message: "No user found with that email address!" });
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(404).json({ message: "Password is not correct!" });
            return;
        }

        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;

        req.session.save(() => {
            res.json({ user: dbUserData, message: "You are now logged in!" });
        });
    });
});



//Logout user
router.post("/logout", (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});



//update single user info by id
router.put("/:id", (req, res) => {
    User.update(req.body, {
        indivdualHooks: true,
        where: {
            id: req.params.id,
        },
    })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "There is no user found by this id" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});





//delete single user by id
router.delete("/:id", (req, res) => {
    User.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then((dbUserData) => {
            //checks to see if actual user exsists
            if (!dbUserData) {
                res
                    .status(404)
                    .json({ message: "There was no user found by this id!" });
                return;
            }
            res.json(dbUserData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;