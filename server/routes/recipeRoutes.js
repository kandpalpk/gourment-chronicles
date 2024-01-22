const express = require('express');
const router = express.Router();
const recipeController = require('../controller/recipeController');

router.get('/',recipeController.homepage)
router.get('/categories',recipeController.exploreCategories)
router.get('/recipe/:id',recipeController.exploreRecipe)
router.get('/categories/:id',recipeController.exploreCategoriesById)
router.post('/search',recipeController.searchRecipe)
router.get('/explore-latest',recipeController.exploreLatest)
router.get('/explore-random',recipeController.exploreRandom)
router.get('/submit-recipe',recipeController.submitRecipe)
router.get('/about', recipeController.aboutPage);
router.get('/contact',recipeController.contactPage)
router.post('/submit-recipe',recipeController.submitRecipeOnPost)
router.delete('/recipe/:id', recipeController.deleteRecipe);

module.exports = router;