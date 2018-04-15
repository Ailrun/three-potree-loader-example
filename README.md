# three-potree-loader-example

## Warning
This does not include any server-related codes and pointclouds.
To run this, you need server that serves PointCloud files which are converted by [PotreeConverter](https://github.com/potree/PotreeConverter/).

## Connect with server

You should adjust `serverConfig` variable in `src/main.js`.

`serverConfig` includes two properties.

- `cloudjs`: path of server serving `cloud.js` file of the result of `PotreeConverter`.
  Of course you can send its json contents instead of send the file, since `cloud.js` is just a json file. (I cannot understand its name.)
- `makeURL`: function that takes `path` of each request, and returns full URL for the request. You can surely modify `path`, but result of `PotreeConverter` use same `path` so you should be careful.
