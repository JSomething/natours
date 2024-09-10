const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) get tour data from collection
  const tours = await Tour.find();
  //2) build template
  //3) render template using tour data

  res.status(200).render('overview', {
    title: 'All Tours',
    tours: tours,
    // es6 just need 'tours'
  });
});

exports.getTour = catchAsync(async (req, res) => {
  //1 get data for requested tour (reviews, tour guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  //2 build template
  //3 render template using data from 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
