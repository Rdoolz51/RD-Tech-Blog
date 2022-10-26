const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", withAuth, (req, res) => {
    console.log(req.session);
    console.log("======================");
    Post.findAll({
        where: {
            user_id: req.session.user_id,
        },
        attributes: ["id", "post_text", "title", "created_at"],
        include: [
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
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
        .then((dbPostData) => {
            const posts = dbPostData.map((post) => post.get({ plain: true }));
            console.log(posts);
            res.render("dashboard", { posts, loggedIn: req.session.loggedIn });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get("/edit/:id", withAuth, (req, res) => {
    Post.findByPk(req.params.id, {
        attributes: ["id", "title", "post_text", "created_at"],
        include: [
            {
                model: User,
                attributes: ["username"],
            },
            {
                model: Comment,
                attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
                include: {
                    model: User,
                    attributes: ["username"],
                },
            },
        ],
    })
        .then((dbPostData) => {
            if (!dbPostData) {
                res
                    .status(404)
                    .json({ message: "There was no post found by this id!" });
                return;
            }

            const post = dbPostData.get({ plain: true });
            res.render("edit-post", { post, loggedIn: req.session.loggedIn });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;