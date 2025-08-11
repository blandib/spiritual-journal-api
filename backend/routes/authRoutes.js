const express = require("express");
const passport = require("passport");
const router = express.Router();

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Initiate Google OAuth2.0 login
 *     description: Redirects the user to Google for authentication.
 *     responses:
 *       302:
 *         description: Redirects to Google OAuth login page.
 */

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Google OAuth2.0 callback
 *     description: Handles Google OAuth callback, stores user info in the users collection, and redirects to a success page.
 *     responses:
 *       302:
 *         description: Redirects to /success.html on successful login.
 */

/**
 * @swagger
 * /success.html:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Sign in successful page
 *     description: Displays a message after successful Google sign-in.
 *     responses:
 *       200:
 *         description: Success HTML page.
 */

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // User is already created/found by Passport
    res.redirect("/success.html");
  }
);

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

module.exports = router;
