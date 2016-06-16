"use strict";

import * as elasticsearch from "elasticsearch";

const client = new elasticsearch.Client({
  host: process.env.ES_HOST,
  log: "trace",
});

const items = {
  Lodging(slug) {
    return new Promise((resolve, reject) => {
      client.search({
        index: "items",
        type: "lodgings",
        body: {
          query: {
            match: {
              slug,
            },
          },
        },
      }).then((response) => {
        if (response.hits.total > 0) {
          resolve(response.hits.hits[0]._source);
        } else {
          reject();
        }
      });
    });
  },
  ThingToDo(slug) {
    return new Promise((resolve, reject) => {
      client.search({
        index: "items",
        type: "thing_to_do",
        body: {
          query: {
            match: {
              slug,
            },
          },
        },
      }).then((response) => {
        if (response.hits.total > 0) {
          resolve(response.hits.hits[0]._source);
        } else {
          reject();
        }
      });
    });
  },
  Place(slug) {
    return new Promise((resolve, reject) => {
      client.search({
        index: "places",
        type: "place",
        body: {
          query: {
            match: {
              slug,
            },
          },
        },
      }).then((response) => {
        if (response.hits.total > 0) {
          resolve(response.hits.hits[0]._source);
        } else {
          reject();
        }
      });
    });
  },
};


module.exports = (type, slug) => new Promise((resolve, reject) => {
  if (!items[type]) {
    return reject(new Error(`No slug to id for type: + ${type}`));
  }

  return items[type](slug).then(resolve).catch(reject);
});
