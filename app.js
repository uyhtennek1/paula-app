require('dotenv').config();
const { CLIENT_URL, PORT } = process.env;

const express = require("express");
const cors = require("cors");
const queries = require("./db/queries");

const app = express();
app.use(cors({
    origin: CLIENT_URL
}));

const searchRouter = require("./routes/searchRouter");

app.use("/search", searchRouter);

app.get("/", (req, res) => res.send('Paula app is running...'));

app.get("/categories", async (req, res) => {
    try {
        const categories = await queries.getAllCategories();

        const category_tree = {};
        const category_dict = {};

        for (const category of categories) {
            if (category.is_cycle) {
                throw new Error("Cycle Detected")
            }

            const node = {};
            category_dict[category.id] = node;

            if (!category.parent) {
                category_tree[category.name] = node;
            }
            else {
                const parent_node = category_dict[category.parent];
                parent_node[category.name] = node;
            }
        }

        res.json(category_tree);
    }
    catch (err) {
        console.error(err);

        if (err === "Cycle Detected") {
            res.status(500).send(`A cycle is detected at ${category} in the categories table`);
        } else {
            res.status(500).send("Internal Server Error");
        }
    }
});

const port = PORT || 3000;
app.listen(port, () => console.log(`Paula app ― listening on port ${port}...`));
