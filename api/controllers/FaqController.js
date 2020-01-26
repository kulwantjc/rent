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
},

    module.exports = {

        saveFaq: function (req, res, next) {

            console.log("in faq", req.param('question'))

            let question = req.param('question');
            let slug_name = req.param('slug_name');
            let description = req.param('description')

            if ((!question) || typeof question == undefined) {
                return { "success": false, "error": { "code": 404, "message": 'QUESTION_REQUIRED' } };
            }
            if ((!description) || typeof description == undefined) {
                return { "success": false, "error": { "code": 404, "message": 'DESCRIPTION_REQUIRED' } };
            }

            let data = {};

            data.question = slugify(question);
            data.description = slugify(description);
            data.slug_name = slugify(slug_name)

            console.log('data', data)


            return Faq.create(data).then(function (faq) {
                console.log('in then')
                return res.jsonx({
                    code: 200,
                    success: true,
                    data: faq,
                });
            }).fail(function (err) {
                console.log('in then 2', err)
                return res.jsonx({
                    code: 400,
                    success: false,
                    error: err,
                });
            });
        },

        'updatefaq/:slug': function (req, res, next) {
            Faq.update({ "slug_name": req.body.slug_name }, { "title": req.body.title, "description": req.body.description }).exec(function (err, data) {
                if (err) {
                    return res.status(400).jsonx({
                        success: false,
                        error: err
                    });
                } else {
                    return res.jsonx({
                        success: true,
                        data: data,
                    });
                }
            })
        },

        'getfaq/:id': function (req, res, next) {
            var pid = req.param('id')
            var query = {};
            query.id = pid;
            Faq.find(query).exec(function (err, data) {
                if (err) {
                    return res.status(400).jsonx({
                        success: false,
                        error: err
                    });
                } else {
                    return res.jsonx({
                        success: true,
                        data: data,
                    });
                }
            })
        },

        getfixTitle: function (req, res, next) {
            var pagename = req.param('slug_name');
            var query = { 'slug_name': pagename };
            Faq.findOne(query).exec(function (err, data) {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        error: err
                    });
                } else {
                    return res.jsonx({
                        success: true,
                        data: data
                    });
                }
            })
        },

        getfaq: function (req, res, next) {
            var search = req.param('search');
            var sortBy = req.param('sortBy');
            var page = req.param('page');
            var count = req.param('count');
            var skipNo = (page - 1) * count;
            var query = {};
            if (sortBy) {
                sortBy = sortBy.toString();
            } else {
                sortBy = 'createdAt desc';
            }
            if (search) {
                query.$or = [{
                    title: {
                        'like': '%' + search + '%'
                    }
                }
                ]
            }
            Faq.count(query).exec(function (err, total) {
                if (err) {
                    return res.status(400).jsonx({
                        success: false,
                        error: err
                    });
                } else {
                    Faq.find(query).sort(sortBy).skip(skipNo).limit(count).exec(function (err, data) {
                        if (err) {
                            return res.status(400).jsonx({
                                success: false,
                                error: err
                            });
                        } else {
                            return res.jsonx({
                                success: true,
                                data: {
                                    data: data,
                                    total: total
                                },
                            });
                        }
                    })
                }
            })
        },

        getFaqNamelist: function (req, res, next) {
            var searchname = req.param('searchterm');
            var query = {}
            query.$or = [{
                title: {
                    'like': '%' + searchname + '%'
                }
            }]
            Faq.find({ 'where': query }, { 'select': ["id", "title"] }).exec(function (err, pages) {
                if (err) {
                    return res.status(400).jsonx({
                        success: false,
                        error: err
                    });
                } else {
                    return res.jsonx({
                        success: true,
                        data: pages
                    });
                }
            })
        }
    };