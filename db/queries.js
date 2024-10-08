const pauladb = require("./paula-pool");

async function getAllCategories() {
    const { rows } = await pauladb.query(
        // Get all categories, sorted by outmost first
        `WITH RECURSIVE search_categories(id, name, parent) AS (
            SELECT c.id, c.name, c.parent
            FROM categories c
          UNION ALL
            SELECT c.id, c.name, c.parent
            FROM categories c, search_categories sc
            WHERE c.id = sc.parent
        ) CYCLE id SET is_cycle USING path
        SELECT id, name, parent, is_cycle
        FROM search_categories
        GROUP BY id, name, parent, is_cycle
        ORDER BY MAX(array_length(path, 1)) DESC;`
    );
    return rows;
}

async function getProductById(pid) {
    const { rows } = await pauladb.query(
        `SELECT * FROM products WHERE id = ${pid}`
    );
    return rows;
}

async function getProductSuggestions(query) {
    const { rows } = await pauladb.query(
        `SELECT name FROM products WHERE starts_with(name, '${query}') OR name ILIKE '%${query}%'`
    );
    return rows;
}

module.exports = {
    getAllCategories,

    getProductById,
    getProductSuggestions
};
