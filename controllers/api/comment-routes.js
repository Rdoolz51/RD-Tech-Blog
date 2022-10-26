const router = require("express").Router();
const { Comment, Post, User } = require("../../models");
const withAuth = require('../../utils/auth');

//get all comments
router.get("/", (req, res) => {
    Comment.findAll({
        attributes: ["id", "comment_text"],
        include: [
            {
                model: Post,
                attributes: ["id"],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
            {
                model: User,
                attributes: ["username"],
            },
        ],
    })
        .then((dbCommentData) => res.json(dbCommentData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});



//get single comment by id
router.get("/:id", (req, res) => {
    Comment.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ["id", "comment_text"],
        ibclude: [
            {
                model: Post,
                attributes: ["id"],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
            {
                model: User,
                attributes: ["username"],
            },
        ],
    })
        .then((dbCommentData) => res.json(dbCommentData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});




//create new post
router.post("/", withAuth, (req, res) => {
    Comment.create({
        comment_text: req.body.comment_text,
        user_id: req.session.user_id,
        post_id: req.body.post_id,
    })
        .then((dbCommentData) => res.json(dbCommentData))
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});




//update a comment
router.put("/:id", (req, res) => {
    Comment.update(
        {
            comment_text: req.body.comment_text,
        },
        {
            where: {
                id: req.params.id,
            },
        }
    )
        .then((dbCommentData) => {
            if (!dbCommentData) {
                res
                    .status(404)
                    .json({ message: "No comment found by this id!" });
                return;
            }
            res.json(dbCommentData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});




//delete comment by id
router.delete("/:id", withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then((dbCommentData) => {
            if (!dbCommentData) {
                res
                    .status(404)
                    .json({ message: "No comment found by this id!" });
                return;
            }
            res.json(dbCommentData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});


module.exports = router;
