require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * GET /
 * Homepage
 */
exports.homepage = async(req,res) =>{
    try {
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
        const thai = await Recipe.find({'category':'Thai'}).limit(limitNumber);
        const american = await Recipe.find({'category':'American'}).limit(limitNumber);
        const chinese = await Recipe.find({'category':'Chinese'}).limit(limitNumber);
        const food = {latest,thai,american,chinese};

        res.render('index', { title: 'Gourmet Chronicles', categories,food });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });
    }
}



        
/**
 * GET /Categories
 * Categories
 */
exports.exploreCategories = async(req,res) =>{
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Gourmet Chronicles - Categories', categories });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });    
    }
}




/**
 * GET /Categories/:id
 * Categories
 */
exports.exploreCategoriesById = async(req,res) =>{
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryById = await Recipe   .find({'category':categoryId}).limit(limitNumber);
        res.render('categories', { title: 'Gourmet Chronicles - Categories', categoryById });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });    
    }
}





/**
 * GET /explore-latest
 * Explore Latest
 */

exports.exploreLatest = async(req,res) =>{
    try {
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber)
        res.render('explore-latest', { title: 'Gourmet Chronicles - Explore Latest', recipe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });    
    }
}

/**
 * GET /explore-random
 * Explore Random as JSON
 */

exports.exploreRandom = async(req,res) =>{
    try {
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random()*count);
        let recipe = await Recipe.findOne().skip(random).exec();
        // res.json(recipe);
        res.render('explore-random', { title: 'Gourmet Chronicles - Explore Random', recipe });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });    
    }
}




/**
 * GET /submit-recipe
 * Submit Recipe
 */


exports.submitRecipe= async(req,res) =>{
    
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render('submit-recipe', { title: 'Gourment Chronicles - Submit Recipe',infoErrorsObj,infoSubmitObj} );
}


/**
 * POST /SubmitRecipe
 * submit recipe
 */
exports.submitRecipeOnPost = async(req,res) =>{
    
    try {
        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
        } else {

        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;

        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

        imageUploadFile.mv(uploadPath, function(err){
            if(err) return res.status(500).send(err);
        })

    }
        const newRecipe = new Recipe({
            name: req.body.name,
            description:req.body.description,
            email: req.body.email,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });

        await newRecipe.save();
        req.flash('infoSubmit','Recipe has been added')
        res.redirect('/submit-recipe');
    } 

    
    catch (error) {
        // res.json(error)
        req.flash('infoError',error)
        res.redirect('/submit-recipe');   
    }
}











/**
 *  POST/search
 * Search
 */

exports.searchRecipe = async(req, res) => {
   try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({$text:{ $search: searchTerm, $diacriticSensitive: true}});
    res.render('search', { title: 'Gourmet Chronicles - Recipe', recipe });
   } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });    
   }
  }
  








/**
 * GET /Recipe 
 * Recipe
 */
exports.exploreRecipe = async(req,res) =>{
    try {
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);
        res.render('recipe', { title: 'Gourmet Chronicles - Recipe',recipe  });
    } catch (error) {
        res.status(500).send({ message: error.message || "Error Occured" });    
    }    
}    






















// async function insertDummyRecipeData() {
//     try {
//         await Recipe.insertMany([
//     //American Category
//     {
//         "name": "Classic Cheeseburger",
//         "description": "Juicy grilled cheeseburger with lettuce, tomato, and a secret sauce.",
//         "email": "burgermaster@example.com",
//         "ingredients": [
//             "200g ground beef patty",
//             "2 slices cheddar cheese",
//             "1 hamburger bun",
//             "Lettuce leaves",
//             "1 tomato, sliced",
//             "2 tbsp secret sauce"
//         ],
//         "category": "American",
//         "image": "classic-cheeseburger.jpg"
//     },

//     // Thai Category
//     {
//         "name": "Green Curry Chicken",
//         "description": "Spicy and aromatic Thai green curry with chicken and coconut milk.",
//         "email": "thaichef@example.com",
//         "ingredients": [
//             "500g chicken breast, cubed",
//             "400ml coconut milk",
//             "2 tbsp green curry paste",
//             "1 eggplant, cubed",
//             "Basil leaves",
//             "1 red chili, sliced",
//             "2 kaffir lime leaves"
//         ],
//         "category": "Thai",
//         "image": "green-curry-chicken.jpg"
//     },

//     // Chinese Category
//     {
//         "name": "Kung Pao Chicken",
//         "description": "A classic Sichuan dish combining spicy chicken, peanuts, and vegetables.",
//         "email": "chinesecook@example.com",
//         "ingredients": [
//             "300g diced chicken breast",
//             "1 bell pepper, cubed",
//             "50g unsalted peanuts",
//             "3 dried chili peppers",
//             "2 tbsp soy sauce",
//             "1 tbsp hoisin sauce",
//             "1 tsp cornstarch",
//             "2 cloves garlic, minced"
//         ],
//         "category": "Chinese",
//         "image": "kung-pao-chicken.jpg"
//     }
// ]);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// insertDummyRecipeData();



























//Inserted dummy data
// async function insertDummyCategoryData(){
    
//     try {
//         await Category.insertMany([
//                   {
//                     "name": "Thai",
//                     "image": "thai-food.jpg"
//                   },
//                   {
//                     "name": "American",
//                     "image": "american-food.jpg"
//                   }, 
//                   {
//                     "name": "Chinese",
//                     "image": "chinese-food.jpg"
//                   },
//                   {
//                     "name": "Mexican",
//                     "image": "mexican-food.jpg"
//                   }, 
//                   {
//                     "name": "Indian",
//                     "image": "indian-food.jpg"
//                   },
//                   {
//                     "name": "Spanish",
//                     "image": "spanish-food.jpg"
//                   }
//                 ]);
//     } 
    
//     catch (error) {
//         console.log(error);
//     }

// }

// insertDummyCategoryData();