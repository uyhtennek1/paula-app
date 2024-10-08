const { getProductById, getProductSuggestions } = require("../db/queries");
const { Router } = require("express");

const searchRouter = Router();

searchRouter.get("/", async (req, res) => {
    const query = req.query;
    // console.log(query);

    const product_id = query.pid;
    const words = query.q;

    if (product_id) {
        try {
            const product = await getProductById(product_id);

            if (product.length < 1) {
                res.status(404).send("Product Not Found");
            }
            else {
                res.json(product);
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    }
    else if (words) {
        try {
            const products = await getProductSuggestions(words);
            res.json(products);
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    }
    else {
        res.status(400).send("No Query Parameter");
    }
});

module.exports = searchRouter;
