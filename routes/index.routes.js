const router = require("express").Router();

const { localsUpdate } = require("../middlewares/auth")

router.use(localsUpdate)

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("home");
});

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

const usersRoutes = require("./users.routes")
router.use("/users", usersRoutes)

const bikesRoutes = require("./bikes.routes")
router.use("/bikes", bikesRoutes)

const transactionsRoutes = require("./transaction.routes")
router.use("/transaction", transactionsRoutes)

const commentsRoutes = require('./comments.routes')
router.use("/comments", commentsRoutes )

module.exports = router;
