const stripe = require("stripe")("sk_test_TOpqbdVdvNbVum6ybmG99pqe00Y9osd7jb");
var promise = require('bluebird');

/**
 * StripeController
 *
 * @description :: Server-side actions for handling payment requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    // createcustomer: function (req, res) {
    //     console.log('req', req.body)
    //     stripe.customers.list(
    //         function (err, customers) {
    //             if (err) console.log(err)
    //             console.log('customers', customers.data[0].email)
    //             if (!customers.data[0].email) {
    //                 stripe.customers.create(
    //                     {
    //                         email: req.param('email'),
    //                     },
    //                     function (err, customer) {
    //                         if (err) {
    //                             console.log('abc', err, customer)
    //                         }
    //                         // Do something with created customer object
    //                         console.log(customer);
    //                     }
    //                 );
    //             } else {
    //                 stripe.charges.create({
    //                     amount: 2000,
    //                     currency: "usd",
    //                     source: "", // obtained with Stripe.js
    //                     description: "Charge test"
    //                 }, function (err, charge) {
    //                     if (err) {
    //                         console.log('err', err)
    //                     }
    //                     console.log('charge', charge)
    //                     console.log('customer alraedy exist')
    //                 });
    //                 console.log('customer alraedy exist')
    //             }
    //         }
    //     );
    // }
    createcustomer: function (req, res) {
        // console.log("------------------------------------", req, "-----------------------------------------")
        // console.log('req123456', req.param('email'))
        // console.log('req123456', req.param('token'))
        // console.log("identity", req.identity)

        if (req.identity) {
            if (req.identity.paymentMethod != undefined) {
                if (req.identity.paymentMethod.length > 0) {
                    stripe.customers.createSource(req.identity.paymentMethod[0].customer_id, {
                        source: req.param('token')
                    }, function (err, customer) {
                        if (err) {
                            console.log("err", err)
                            return res.jsonx({
                                success: false,
                                code: 400,
                                message: 'err'
                            });
                        }
                        var query = req.identity.paymentMethod;
                        query[req.identity.paymentMethod.length] = { customer_id: req.identity.paymentMethod[0].customer_id, card_id: customer.id, last4: customer.last4, exp_month: customer.exp_month, exp_year: customer.exp_year };
                        Users.update({ username: req.param('email') }, {
                            paymentMethod: query
                        }).then(function (data) {
                            return res.jsonx({
                                success: true,
                                code: 200,
                                data: {
                                    data: customer
                                },
                            });
                        });
                    })
                }
            } else {
                stripe.customers.create({
                    email: req.body('email'),
                    source: req.param('token') // obtained with Stripe.js
                }, function (err, customer) {
                    if (err) {
                        console.log("err", err)
                        return res.jsonx({
                            success: false,
                            code: 400,
                            message: 'err'
                        });
                    }
                    var query = [{ customer_id: customer.id, card_id: customer.default_source, last4: customer.sources.data[0].last4, exp_month: customer.sources.data[0].exp_month, exp_year: customer.sources.data[0].exp_year }];

                    Users.update({ username: req.param('email') }, {
                        paymentMethod: query
                    }).then(function (data) {
                        return res.jsonx({
                            success: true,
                            code: 200,
                            data: {
                                data: customer
                            },
                        });
                    });
                })
            }
        } else {
            stripe.customers.create({
                email: req.param('email'),
                source: req.param('token') // obtained with Stripe.js
            }, function (err, customer) {
                if (err) {
                    console.log("err", err)
                    return res.jsonx({
                        success: false,
                        code: 400,
                        message: 'err'
                    });
                }
                console.log("customer", customer)
                var query = [{ customer_id: customer.id, card_id: customer.default_source, last4: customer.sources.data[0].last4, exp_month: customer.sources.data[0].exp_month, exp_year: customer.sources.data[0].exp_year }];

                Users.update({ username: req.param('email') }, {
                    paymentMethod: query
                })
                    .then(function (data) {
                        return res.jsonx({
                            success: true,
                            code: 200,
                            data: {
                                data: customer
                            },
                        });
                    }).fail(function (err) {
                        return res.jsonx({
                            success: false,
                            code: 400,
                            message: 'err'
                        });
                    });
            })
        }
    },

    chargePayment: function (req, res) {
        console.log("context", req.identity.id)
        var d = new Date();
        var amount = parseInt(req.param('amount'));
        var cust_id = req.param('cust_id');
        var token = req.param('token');
        var rentalId = req.param('rental_id')

        stripe.charges.create({
            amount: amount * 100,
            currency: "usd",
            customer: cust_id,
            source: token,
            description: 'Demo Payment for rental_id: ' + rentalId
        }, function (err, charge) {
            // asynchronously called
            if (err) {
                console.log("err", err)
                return res.jsonx({
                    success: false,
                    code: 400,
                    message: 'err'
                });
            } else {
                console.log("charge", charge)
                var data1 = {};
                data1.transaction_id = charge.balance_transaction;
                data1.addedBy = req.identity.id;
                data1.payment_status = charge.status;
                data1.price = parseInt(req.param('amount'));
                data1.detail = charge;
                data1.rentalId = rentalId;

                return Transaction.create(data1).then(function (txnInfo) {

                    return Rentals.update({ id: rentalId }, { transaction_id: charge.balance_transaction, payment_status: charge.status, detail: charge, price: amount }).then(function (trn) {
                        return res.jsonx({
                            success: true,
                            code: 200,
                            data: txnInfo
                        });
                    }).fail(function (err) {
                        return res.jsonx({
                            success: false,
                            code: 400,
                            message: 'err', err
                        });
                    });
                }).fail(function (err) {
                    return res.jsonx({
                        success: false,
                        code: 400,
                        message: 'err', err
                    });
                });
            }
        });
    },

    getAllPayments: function (req, res) {
        var sortBy = req.param('sortBy');
        var page = req.param('page');
        var count = req.param('count')
        var skipNo = (page - 1) * count;
        var query = {};

        console.log("count", count)
        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }

        return Transaction.find().populate('addedBy', { select: ['fullName'] }).populate('rentalId', { select: ['vehicle_id', 'date_booking', 'date_return'] }).sort(sortBy).skip(skipNo).limit(count).then(function (pymts) {
            // console.log("user",user)
            return res.jsonx({
                success: true,
                code: 200,
                data: pymts
            });
        }).fail(function (err) {
            return res.jsonx({
                success: false,
                code: 400,
                message: 'err'
            });
        })
    },

    viewPayment: function (req, res) {
        let id = req.param('id');
        // console.log('user_id', id)

        return Transaction.findOne({ id }).populate('addedBy', { select: ['fullName'] }).populate('rentalId', { select: ['vehicle_id', 'date_booking', 'date_return'] }).then(function (payment) {
            return res.jsonx({
                success: true,
                code: 200,
                data: payment
            });
        }).fail(function (err) {
            return res.jsonx({
                success: false,
                code: 400,
                message: 'err'
            });
        })
    },

    getFailedPayments: function (req, res) {
        var sortBy = req.param('sortBy');
        var page = req.param('page');
        var count = req.param('count')
        var skipNo = (page - 1) * count;
        var query = {};

        console.log("count", count)
        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }

        return Transaction.find({ 'payment_status': 'succeeded' }).populate('addedBy', { select: ['fullName'] }).populate('rentalId', { select: ['vehicle_id', 'date_booking', 'date_return'] }).sort(sortBy).skip(skipNo).limit(count).then(function (pymts) {
            // console.log("user",user)
            return res.jsonx({
                success: true,
                code: 200,
                data: pymts
            });
        }).fail(function (err) {
            return res.jsonx({
                success: false,
                code: 400,
                message: 'err'
            });
        })
    },

    Refund: function (req, res) {

        var chargeId = req.param('chargeId');
        var transaction_id = req.param('transaction_id');

        stripe.refunds.create({
            charge: chargeId
        }, function (err, refund) {
            // asynchronously called
            if (err) {
                console.log("err", err)
                return res.jsonx({
                    success: false,
                    code: 400,
                    message: 'err'
                });
            } else {
                console.log("refund", refund)

                return Transaction.update({ transaction_id: transaction_id, addedBy: req.identity.id }, { payment_status: 'refunded', refund_detai: refund }).then(function (txnInfo) {

                    return Rentals.update({ transaction_id }, { payment_status: 'refunded', refund_detai: refund }).then(function (trn) {
                        return res.jsonx({
                            success: true,
                            code: 200,
                            data: trn
                        });
                    }).fail(function (err) {
                        return res.jsonx({
                            success: false,
                            code: 400,
                            message: 'err', err
                        });
                    });
                }).fail(function (err) {
                    return res.jsonx({
                        success: false,
                        code: 400,
                        message: 'err', err
                    });
                });
            }
        });
    },

    getRefundPayments: function (req, res) {
        var sortBy = req.param('sortBy');
        var page = req.param('page');
        var count = req.param('count')
        var skipNo = (page - 1) * count;
        var query = {};

        console.log("count", count)
        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }

        return Transaction.find({ 'payment_status': 'refunded' }).populate('addedBy', { select: ['fullName'] }).populate('rentalId', { select: ['vehicle_id', 'date_booking', 'date_return'] }).sort(sortBy).skip(skipNo).limit(count).then(function (pymts) {
            // console.log("user",user)
            return res.jsonx({
                success: true,
                code: 200,
                data: pymts
            });
        }).fail(function (err) {
            return res.jsonx({
                success: false,
                code: 400,
                message: 'err'
            });
        })
    },

    myPayments: function (req, res) {
        var sortBy = req.param('sortBy');
        var page = req.param('page');
        var count = req.param('count')
        var skipNo = (page - 1) * count;
        
        var query = {};
        query.addedBy = req.identity.id;

        if (sortBy) {
            sortBy = sortBy.toString();
        } else {
            sortBy = 'createdAt desc';
        }

        return Transaction.find(query).populate('rentalId', { select: ['vehicle_id', 'date_booking', 'date_return'] }).sort(sortBy).skip(skipNo).limit(count).then(function (pymts) {
            return res.jsonx({
                success: true,
                code: 200,
                data: pymts
            });
        }).fail(function (err) {
            return res.jsonx({
                success: false,
                code: 400,
                message: 'err'
            });
        })
    },

    viewItemPayment: function (req, res) {
        let id = req.param('id');
        // console.log('user_id', id)

        return Transaction.findOne({ id }).populate('rentalId', { select: ['vehicle_id', 'date_booking', 'date_return'] }).then(function (payment) {
            return res.jsonx({
                success: true,
                code: 200,
                data: payment
            });
        }).fail(function (err) {
            return res.jsonx({
                success: false,
                code: 400,
                message: 'err'
            });
        })
    },

};

