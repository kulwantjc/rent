/**
 * BlogsController
 *
 * @description :: Server-side logic for managing Blog
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */




module.exports = {

	save: function (req, res) {
		API(BlogService.saveBlog, req, res);

	},
	edit: function (req, res) {
		API(BlogService.updateBlog, req, res);

	},

	addComment: function (req, res) {
		API(BlogService.add, req, res);

	},

	getAllBlog: function (req, res, next) {

		var page = req.param('page');
		var count = req.param('count');
		var skipNo = (page - 1) * count;
		var search = req.param('search');
		var query = {};

		var sortBy = req.param('sortBy');

		if (sortBy) {
			sortBy = sortBy.toString();
		} else {
			sortBy = 'createdAt desc';
		}

		query.isDeleted = 'false';

		if (search) {
			query.$or = [{
				title: {
					'like': '%' + search + '%'
				}
			}, {
				description: {
					'like': '%' + search + '%'
				}
			}
			]
		}

		Blogs.count(query).exec(function (err, total) {
			if (err) {
				return res.status(400).jsonx({
					success: false,
					error: err
				});
			} else {
				Blogs.find(query).populate("createdBy").sort(sortBy).skip(skipNo).limit(count).exec(function (err, blog) {
					if (err) {
						return res.status(400).jsonx({
							success: false,
							error: err
						});
					} else {
						return res.jsonx({
							success: true,
							data: {
								blog: blog,
								total: total
							},
						});
					}
				})
			}
		})
	},

	getSingleBlog: function (req, res, next) {

		var id = req.param('id');
		var query = {};
		query.id = id;

		Blogs.findOne(query).populate("createdBy").exec(function (err, blog) {
			if (err) {
				return res.status(400).jsonx({
					success: false,
					error: err
				});
			} else {
				if (blog) {
					return res.jsonx({
						success: true,
						data: {
							blog: blog,
						},
					});

				} else {
					return res.jsonx({
						success: false,
						code: 400,
						message: 'NO_BLOG_FOUND'
					});
				}
			}
		})
	},



	getComment: function (req, res, next) {

		var page = req.param('page');
		var count = req.param('count');
		var skipNo = (page - 1) * count;
		var id = req.params.id;
		// var search = req.param('search');

		var query = {};

		var sortBy = req.param('sortBy');

		if (sortBy) {
			sortBy = sortBy.toString();
		} else {
			sortBy = 'createdAt desc';
		}

		query.isDeleted = 'false';
		query.blog_id = id;


		Comments.find(query).populate("createdBy").sort(sortBy).skip(skipNo).limit(count).exec(function (err, comment) {
			if (err) {
				return res.status(400).jsonx({
					success: false,
					error: err
				});
			} else {
				return res.jsonx({
					success: true,
					data: {
						comments: comment
					},
				});
			}
		})

	},




};