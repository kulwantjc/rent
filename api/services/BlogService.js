var Promise = require('bluebird'),
	promisify = Promise.promisify;
var constantObj = sails.config.constants;


slugify = function (string) {
	return string
		.toString()
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}


module.exports = {

	saveBlog: function (data, context) {

		if ((!data.title) || typeof data.title == undefined) {
			return { "success": false, "error": { "code": 404, "message": constantObj.blogs.TITLE_REQUIRED, key: 'TITLE_REQUIRED' } };
		}

		if ((!data.description) || typeof data.description == undefined) {
			return { "success": false, "error": { "code": 404, "message": constantObj.blogs.DESCRIPTION_REQUIRED, key: 'DESCRIPTION_REQUIRED' } };
		}

		data.slug = slugify(data.title);
		data.createdBy = context.identity.id;

		let query = {}

		query.title = data.title;
		query.isDeleted = false;

		return Blogs.findOne(query).then(function (blog) {

			if (blog) {
				return {
					success: false,
					error: {
						code: 400,
						message: constantObj.blogs.BLOG_ALREADY_EXIST,
						key: 'BLOG_ALREADY_EXIST',
					},
				};

			} else {
				return Blogs.create(data).then(function (blog) {
					return {
						success: true,
						code: 200,
						data: {
							blog: blog,
							message: constantObj.blogs.SAVED_BLOGS,
							key: 'SAVED_BLOGS',
						},
					};
				})
					.fail(function (err) {
						return {
							success: false,
							error: {
								code: 400,
								message: err
							},
						};
					});
			}
		}).fail(function (err) {
			return {
				success: false,
				error: {
					code: 400,
					message: err
				},
			};
		});
	},


	add: function (data, context) {
		console.log('in comments api')

		if ((!data.blog_id) || typeof data.blog_id == undefined) {
			return { "success": false, "error": { "code": 404, "message": constantObj.blogs.ID_REQUIRED, key: 'ID_REQUIRED' } };
		}
		if ((!data.blog_comment) || typeof data.blog_comment == undefined) {
			return { "success": false, "error": { "code": 404, "message": constantObj.blogs.DESCRIPTION_REQUIRED, key: 'DESCRIPTION_REQUIRED' } };
		}
		// data.slug = slugify(data.title);
		data.createdBy = context.identity.id;

		return Comments.create(data).then(function (blog) {
			return {
				success: true,
				code: 200,
				data: {
					blog: blog,
					message: constantObj.blogs.SAVED_COMMENT,
					key: 'SAVED_COMMENT',
				},
			};
		})
			.fail(function (err) {
				return {
					success: false,
					error: {
						code: 400,
						message: err
					},
				};
			});
	},



	updateBlog: function (data, context) {

		data.slug = slugify(data.title);
		data.createdBy = context.identity.id;
		let _id = data.id;
		return Blogs.update({ id: _id }, data).then(function (blog) {

			return {
				success: true,
				code: 200,
				data: {
					blog: blog,
					message: constantObj.blogs.UPDATED_BLOGS,
					key: 'UPDATED_BLOGS',
				},
			};
		})
			.fail(function (err) {
				return {
					success: false,
					error: {
						code: 400,
						message: err

					},
				};
			});
	},



};