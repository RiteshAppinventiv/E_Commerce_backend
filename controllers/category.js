const Category = require("../models/categorySchema");
const slugify = require("slugify");

function createCategories(categories, parentId = null) {
  const categoryList = [];

  let category;
  if (parentId == null) {
    category = categories.filter((cat) => cat.parentId == undefined);
  } else {
    category = categories.filter((cat) => cat.parentId == parentId);
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      slug: cate.slug,
      children: createCategories(categories, cate._id),
    });
  }
  return categoryList;
}

const categoryCtrl = {
  create: (req, res) => {
    const categotyObj = {
      name: req.body.name,
      slug: slugify(req.body.name),
    };

    if (req.body.parentId) {
      categotyObj.parentId = req.body.parentId;
    }

    const cat = new Category(categotyObj);
    cat.save((err, category) => {
      if (err) return res.status(400).json({ err });

      if (category) {
        return res.status(201).json({ category });
      }
    });
  },

  getCategory: (req, res) => {
    Category.find({}).exec((error, categories) => {
      if (error) return res.status(400).json({ error });

      if (categories) {
        const categoryList = createCategories(categories);
        res.status(200).json({ categoryList });
      }
    });
  },

    update: async (req, res) => {
      try {
        const { name } = req.body;
        const categotyObj = {
          name: req.body.name,
          slug: slugify(req.body.name),
        };


        await Category.findByIdAndUpdate({ _id: req.params.id }, categotyObj);

        res.json({ message: "Category updated" });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } ,




    delete : async (req,res) => {
    try{
      await Category.findByIdAndDelete(req.params.id)

      res.json({message: "Deleted Category"});
    }catch(err){
      return res.status(500).json({message: err.message});

    }
  },
};

module.exports = categoryCtrl;
