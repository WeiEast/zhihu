/**
 * Copyright (c) 2014 Meizu bigertech, All rights reserved.
 * http://www.bigertech.com/
 * @author liuxing
 * @date  14-11-10
 * @description
 *
 */
'use strict';

const Promise = require('bluebird');
const request = Promise.promisify(require('request'));
const cheerio = require('cheerio');
const config = require('../config');
const API = require('../config/api');
const url = require('url');
const _ = require('lodash');

function formatFollowData(str) {
  if (str.indexOf('K') !== -1) {
    return parseInt(str) * 1000;
  }
  // if (str.indexOf('K') !== -1) {
  //   return parseInt(str) * 10000;
  // }
  return parseInt(str);
}

/*
 * @param name  The name of Zhihu user
 * @return      A promise 
 */
var info = function(name) {
  var data = {
    url: API.user.info,
    qs: {
      params: JSON.stringify({
        'url_token': name
      }),
    },
  };

  return request(data).then(function(content) {
    var responseBody = content.body;
    var $ = cheerio.load(responseBody);
    var values = $('span.value');
    var result = {
      answer: formatFollowData(values.eq(0).text()),
      post: formatFollowData(values.eq(1).text()),
      follower: formatFollowData(values.eq(2).text()),
    };
    result.profileUrl = config.zhihu + $('a.avatar-link').attr('href');
    result.name = $('span.name').text();
    var male = $('.icon-profile-female');
    result.sex = male.length === 1 ? 'female' : 'male';
    return result;
  });
};

var questions = function(qID) {};

var answers = function(qID) {};

var zhuanlansFocus = function() {};

var topic = function() {};

module.exports = {

  info: info,

  // TODO
  zhuanlansFocus: zhuanlansFocus,
  question: questions,
  answers: answers,
  topic: topic,

  // Deprecated
  getUserByName: info,
};
