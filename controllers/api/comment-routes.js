const router = require("express").Router();
const { Comment, Post, User } = require("../../models");
const withAuth = require('../../utils/auth');

//get all comments




//get single comment by id





//create new post





//update a comment
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




//delete comment by id
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
